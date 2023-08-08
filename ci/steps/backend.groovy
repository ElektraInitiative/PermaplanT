commands = 'cargo build --release'
stashSrc = ['backend/target/release/backend']
stashDir = ['backend']

def runBuildInDocker() {
    return utils.runDockerWithPostgresSidecar(commands, stashSrc, stashDir)
}

return this
