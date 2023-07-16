def testAndBuildMdbook() {
    return ['Mdbook': {
        node('docker') {
            checkout scm
            utils = load('ci/Jenkinsfile_utils.groovy')
            utils.node_info()
            def mdbook_image = docker.build("permaplant-mdbook", "./ci/container-images/permaplant-mdbook")

            mdbook_image.inside {
                checkout scm

                stage('test-and-build-mdbook'){
                    sh "mdbook test"
                    sh 'mdbook build'
                    stash includes: 'book/', name: 'mdbook'
                }
            }
        }
    }]
}

return this
