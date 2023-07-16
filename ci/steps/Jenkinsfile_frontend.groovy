def testAndBuildFrontend(boolean skipTest=false) {
    return ['Frontend': {
        node('docker') {
            checkout scm
            utils = load('ci/Jenkinsfile_utils.groovy')
            utils.node_info()
            def node_image = docker.build("permaplant-node", "./ci/container-images/permaplant-node")

            node_image.inside {
                checkout scm
                unstash 'definitions.ts'

                if (!skipTest) {
                    stage('Test'){
                        dir("frontend") {
                            sh "npm ci"
                            sh "npm run format:check"
                            sh "npm run lint"
                            sh "npm run test"
                        }
                    }
                }

                stage('Build'){
                    sh './ci/build-scripts/build-frontend.sh'
                    stash includes: 'frontend/dist/**/*', name: 'frontend'
                }

                stage('Typedoc'){
                    sh 'cd frontend && npm run doc'
                    stash includes: 'frontend/src/generated/docs/', name: 'typedoc'
                }

                stage('Storybook'){
                    sh './ci/build-scripts/build-storybook.sh'
                    stash includes: 'frontend/storybook-static/**/*', name: 'storybook'
                }
            }
        }
    }]
}

return this
