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
        // groovylint-disable-next-line
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
 * Run a Docker image and perform various shell commands inside the container.
 *
 * @param dockerImage The name of the Docker image to build and run.
 * @param dockerBuildArgs The arguments to pass to the Docker build command, in a string format.
 *                        This can include options like the Dockerfile path and the build context.
 *                        Example: "-f ./ci/container-images/permaplant-node/Dockerfile ."
 * @param commands A list of shell commands to execute inside the Docker container.
 * @param stashsrcList The list of file paths to be stashed (optional).
 * @param stashdirList The list of stash directory names for stashing files (optional).
 * @return A closure representing the defined Jenkins pipeline steps.
 */
def runDocker(
    String dockerImage,
    String dockerBuildArgs,
    List<String> commands,
    List<String> stashsrc = [],
    List<String> stashdir = []
) {
    return {
        node('docker') {
            node_info()
            checkout scm
            docker.build(dockerImage, dockerBuildArgs).inside() {
                commands.each { cmd ->
                    sh cmd
                }
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

class UnequalStashException extends Exception {
    UnequalStashException() {
        super("The stashed files count in stashsrc and stashdir lists must be equal.")
    }
}

// Allow to pass an array of steps that will be executed in parallel in a stage
def parallel_stage(stageName, steps) {
    new_map = [:]

    for (def step in steps) {
        new_map = new_map << step
    }

    stage(stageName) {
      parallel new_map
    }
}

// Main Jenkinsfile pipeline wrapper handler that allows to wrap core logic into a format
// args:
// main: main that is getting wrapped
def main_wrapper(main) {
    err = null
    try {
        timeout(time: 2, unit: 'HOURS'){
		    main()
        }
        currentBuild.result = "SUCCESS"
    }
    catch (caughtError) {
        node('docker') {
            echo "caught ${caughtError}"
            err = caughtError
            currentBuild.result = "FAILURE"
            // Rethrow so we fail fast and its marked as failing.
            throw err
        }
    }
    finally {
        node('docker') {
            deleteDir()
            if (err) {
                // Rethrow so we fail fast and its marked as failing.
                // groovylint-disable-next-line
                throw err
            }
        }
    }
}

return this
