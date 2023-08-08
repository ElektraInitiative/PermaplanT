def testAndBuildBackend(boolean skipTest=false) {
    return ['Backend': {
        node('docker') {
            checkout scm
            utils = load('ci/Jenkinsfile_utils.groovy')
            utils.node_info()
            def rust_image = docker.build("permaplant-rust", "./ci/container-images/permaplant-rust")

            docker.image('postgis/postgis:13-3.1').withRun('-e "POSTGRES_USER=ci" -e "POSTGRES_PASSWORD=ci"') { c ->
                rust_image.inside("--link ${c.id}:db -e 'DATABASE_URL=postgres://ci:ci@db/ci'") {
                    checkout scm

                    utils.wait_for_db()

                    if (!skipTest) {
                        stage('Test'){
                            withEnv(['RUSTFLAGS=-D warnings', 'RUSTDOCFLAGS=-D warnings']) {
                                // Workaround: we can't stop rustfmt from linting the generated schema.rs
                                dir("backend") {
                                    sh "/bin/bash -c 'echo \"\" > src/schema.rs'"
                                    sh "cargo fmt --check"
                                }
                                // End of Workaround

                                // generate schema (overwriting src/schema.rs)
                                sh './ci/build-scripts/build-schema.sh'

                                dir("backend") {
                                    // continue checking
                                    withEnv(
                                        ['BIND_ADDRESS_HOST=127.0.0.1', 'BIND_ADDRESS_PORT=8080',
                                        'AUTH_DISCOVERY_URI=unused', 'AUTH_CLIENT_ID=unused']
                                    ) {
                                    sh "cargo check"
                                    sh "cargo clippy"
                                    sh "cargo doc"
                                    sh "cargo test"
                                    }
                                }
                            }
                        }
                    }

                    stage('Build'){
                        sh './ci/build-scripts/build-backend.sh'

                        stash includes: 'backend/target/release/backend', name: 'backend'
                    }
                }
            }
        }
    }]
}


def buildBackend() {
    return ['Backend': {
        node('docker') {
            node_info()

            checkout scm
            def rustImage = docker.build('permaplant-rust', './ci/container-images/permaplant-rust')

            docker.image('postgis/postgis:13-3.1').withRun('-e "POSTGRES_USER=ci" -e "POSTGRES_PASSWORD=ci"') { c ->
                rustImage.inside("--link ${c.id}:db -e 'DATABASE_URL=postgres://ci:ci@db/ci'") {
                    checkout scm

                    utils.wait_for_db()

                    sh 'cd backend && cargo build --release'

                    stash includes: 'backend/target/release/backend', name: 'backend'
                }
            }
        }
    }
}
return this
