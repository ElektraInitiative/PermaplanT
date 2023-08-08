def testAndBuildFrontend() {
    return {
        node('docker') {
            node_info()
            checkout scm
            def nodeImage = docker.build('permaplant-node', '-f ./ci/container-images/permaplant-node/Dockerfile .')
            nodeImage.inside {
                unstash 'definitions.ts'
                stage('test') {
                    // groovylint-disable-next-line
                    dir('frontend') {
                        def checksumBefore = checksum('package-lock.json')
                        sh 'npm i'
                        def checksumAfter = checksum('package-lock.json')
                        echo 'Checking if package-lock.json is modified by npm install'
                        // groovylint-disable-next-line
                        if (checksumBefore != checksumAfter) { throw new PackageLockJsonModifiedException() }
                        sh 'npm ci'
                        sh 'npm run format:check'
                        sh 'npm run lint'
                        sh 'npm run test'
                    }
                }

                stage('build') {
                    sh './ci/build-scripts/build-frontend.sh'
                    stash includes: 'frontend/dist/**/*', name: 'frontend'
                }

                stage('typedoc') {
                    sh 'cd frontend && npm run doc'
                    stash includes: 'frontend/src/generated/docs/', name: 'typedoc'
                }

                stage('storybook') {
                    sh './ci/build-scripts/build-storybook.sh'
                    stash includes: 'frontend/storybook-static/**/*', name: 'storybook'
                }
            }
        }
    }
}

def cargoBuild() {
    image = "permplant-node"
    buildArgs = "-f ./ci/container-images/permaplant-node/Dockerfile ."
    commands = 'cargo build --release'
    stashSrc = ['backend/target/release/backend']
    stashDir = ['backend']
    return ["cargo-build": utils.runDocker(commands, stashSrc, stashDir)]
}

class PackageLockJsonModifiedException extends Exception {
    PackageLockJsonModifiedException() {
        super('package-lock.json was modified by npm install. Did you maybe use a wrong node version?')
    }
}

return this
