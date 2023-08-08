def node_info() {
    echo "Running stage on ${env.NODE_NAME}"
}

def wait_for_db() {
    retry(6) {
        sleep(time: 5, unit: 'SECONDS')
        sh '/usr/bin/pg_isready --host=db --username=ci --dbname=ci --timeout=60'
    }
}

def wait_for_pr_db() {
    retry(6) {
        sleep(time: 5, unit: 'SECONDS')
        sh 'curl --fail https://pr.permaplant.net/api/config'
    }
}

/**
 * Aborts the previous build in progress if it exists and the current build is not on the "master" branch.
 * This method is used to prevent multiple concurrent builds for non-master branches.
 */
def abortPreviousRunUnlessMaster() {
    if (env.BRANCH_NAME == 'master') { return }
    def exec = currentBuild
             ?.rawBuild
             ?.getPreviousBuildInProgress()
             ?.getExecutor()
    if (exec) {
        exec.interrupt(
      Result.ABORTED,
      new CauseOfInterruption.UserInterruption(
        "Aborted by Build#${currentBuild.number}"
      )
    )
    }
}

/**
 * This method runs a Docker container with a Postgres sidecar and executes the specified command inside the container.
 *
 * @param commands The list of commands to be executed inside the Docker container.
 * @param stashsrcList The list of file paths to be stashed (optional).
 * @param stashdirList The list of stash directory names for stashing files (optional).
 * @return A closure representing the defined Jenkins pipeline steps.
 * @throws UnequalStashException If the stashed files are not equal in count between stashsrcList and
 * stashdirList.
 */
def runDockerSidecar(String command,  List<String> stashsrc = [], List<String> stashdir = []) {
    return {
        node('docker') {
            node_info()
            checkout scm
            def rustImage = docker.build('permaplant-rust', './ci/container-images/permaplant-rust')
            docker.image('postgis/postgis:13-3.1').withRun('-e "POSTGRES_USER=ci" -e "POSTGRES_PASSWORD=ci"') { c ->
                rustImage.inside("--link ${c.id}:db \
                -e 'DATABASE_URL=postgres://ci:ci@db/ci' \
                -e 'BIND_ADDRESS_HOST=127.0.0.1' \
                -e 'BIND_ADDRESS_PORT=8080' \
                -e 'AUTH_DISCOVERY_URI=unused' \
                -e 'AUTH_CLIENT_ID=unused' \
                -e 'RUSTFLAGS=-D warnings' \
                -e 'RUSTDOCFLAGS=-D warnings'"
                ) {
                    checkout scm
                    wait_for_db()
                    sh './ci/build-scripts/build-schema.sh'
                    // Because in Deploy the path for /target is a
                    //env in permaplant-deploy.sh, we can only solve it with prepending cd backend
                    sh "cd backend && ${command}"
                    if (stashsrc.size() != stashdir.size()) {
                        throw new UnequalStashException();
                    }
                    for (int i = 0; i < stashsrc.size(); i++) {
                        stash includes: stashsrc[i], name: stashdir[i];
                    }
                }
            }
        }
    }
}

/**
 * Run make pre-commit-a inside permaplant-rust image.
 *
 * @return A closure representing the defined Jenkins pipeline steps.
 */
def runDockerPreCommit() {
    return {
        node('docker') {
            node_info()
            checkout scm
            docker.build('permaplant-node', '-f ./ci/container-images/permaplant-node/Dockerfile .').inside() {
                sh "git init"
                sh "pre-commit run check-merge-conflict -a"
                sh "pre-commit run end-of-file-fixer -a"
                sh "pre-commit run mixed-line-ending -a"
                sh "pre-commit run trailing-whitespace -a"
                sh "pre-commit run prettier -a"
                sh "pre-commit run black -a"
                sh "pre-commit run flake8 -a"
                sh "pre-commit run mypy -a"
                sh "pre-commit run --hook-stage manual codespell -a"
            }
        }
    }
}

def testAndBuildMdbook() {
    return {
        node('docker') {
            node_info()
            checkout scm
            docker.build('permaplant-doc:build', './doc').inside {
                stage('test') {
                    sh 'make test-mdbook'
                }

                stage('build') {
                    sh 'make build-mdbook'
                    stash includes: 'book/', name: 'mdbook'
                }
            }
        }
    }
}

/**
 * Calculates the checksum of a given file.
 *
 * @param file The name of the file for which the checksum should be calculated.
 * @return The checksum of the file as a trimmed string.
 */
def checksum(String file) {
    return sh(returnStdout: true, script: "sha256sum $file").trim()
}

def testFrontend() {
    return {
        node('docker') {
            node_info()
            checkout scm
            def nodeImage = docker.build('permaplant-node', '-f ./ci/container-images/permaplant-node/Dockerfile .')
            nodeImage.inside {
                unstash 'definitions.ts'
                stage('test') {
                    dir('frontend') {
                        def checksumBefore = checksum('package-lock.json')
                        sh 'npm i'
                        def checksumAfter = checksum('package-lock.json')
                        echo 'Checking if package-lock.json is modified by npm install'
                        if (checksumBefore != checksumAfter) { throw new PackageLockJsonModifiedException() }
                        sh 'npm ci'
                        sh 'npm run format:check'
                        sh 'npm run lint'
                        sh 'npm run test'
                    }
                }
            }
        }
    }
}

def buildFrontend() {
    return {
        node('docker') {
            node_info()
            checkout scm
            def nodeImage = docker.build('permaplant-node', '-f ./ci/container-images/permaplant-node/Dockerfile .')
            nodeImage.inside {
                unstash 'definitions.ts'
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

def testMigrations() {
    if (env.BRANCH_NAME!="master") {
        return "make migration && make migration-redo && make migration-redo-a"
    } else {
        return "make migration && make migration-redo"
    }
}
