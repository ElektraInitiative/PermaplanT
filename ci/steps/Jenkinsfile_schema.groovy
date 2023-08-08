schemaStashSrc = ['backend/src/schema.rs','frontend/src/bindings/definitions.ts']
schemaStashDir = ['schema.rs', 'definitions.ts']


def buildSchema() {
    return ['Build Schema': {
        node('docker') {
            checkout scm
            utils = load('ci/Jenkinsfile_utils.groovy')
            utils.node_info()
            def rust_image = docker.build("permaplant-rust", "./ci/container-images/permaplant-rust")

            docker.image('postgis/postgis:13-3.1').withRun('-e "POSTGRES_USER=ci" -e "POSTGRES_PASSWORD=ci"') { c ->
                rust_image.inside("--link ${c.id}:db -e 'DATABASE_URL=postgres://ci:ci@db/ci'") {
                    checkout scm

                    utils.wait_for_db()

                    sh './ci/build-scripts/build-schema.sh'

                    stash includes: 'backend/src/schema.rs', name: 'schema.rs'
                    stash includes: 'frontend/src/bindings/definitions.ts', name: 'definitions.ts'
                }
            }
        }
    }]
}

return this
