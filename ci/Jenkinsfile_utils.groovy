def node_info() {
    echo "Running stage on ${env.NODE_NAME}"
}

def wait_for_db() {
    retry(6) {
        sleep(time: 5, unit: 'SECONDS')
        sh '/usr/bin/pg_isready --host=db --username=ci --dbname=ci --timeout=60'
    }
}

//When called, aborts the previous run.
def abortPreviousRun() {
  def exec = currentBuild
             ?.rawBuild
             ?.getPreviousBuildInProgress()
             ?.getExecutor()
  if(exec) {
    exec.interrupt(
      Result.ABORTED,
      new CauseOfInterruption.UserInterruption(
        "Aborted by Build#${currentBuild.number}"
      )
    )
  }
}

// Allow to pass an array of steps that will be executed in parallel in a stage
def parallel_stage(stage_name, steps) {
    new_map = [:]

    for (def step in steps) {
        new_map = new_map << step
    }

    stage(stage_name) {
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
  } catch (caughtError) {
	node('docker') {
        echo "caught ${caughtError}"
        err = caughtError
        currentBuild.result = "FAILURE"
        // Rethrow so we fail fast and its marked as failing.
        throw err
    }
  } finally {
    	node('docker') {

			deleteDir()

			if (err) {
				// Rethrow so we fail fast and its marked as failing.
				throw err
			}
		}
	}
}

return this
