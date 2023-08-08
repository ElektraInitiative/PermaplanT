commands = 'cargo build --release'
stashSrc = ['backend/target/release/backend']
stashDir = ['backend']

def runBuildInDocker() {
    return utils.runDockerWithPostgresSidecar(commands, stashSrc, stashDir)
}

def testMigrations() {
    if (env.BRANCH_NAME!="master") {
        return "make migration && make migration-redo && make migration-redo-a"
    } else {
        return "make migration && make migration-redo"
    }
}

return this
