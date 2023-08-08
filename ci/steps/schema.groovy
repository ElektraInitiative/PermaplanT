image = "permaplant-rust"
buildArgs = "./ci/container-images/permaplant-rust"
commands = ["echo schema test"] // No command needed, default runInDocker builds always schema.
stashSrc = ["backend/src/schema.rs", "frontend/src/bindings/definitions.ts"]
stashDir = ["schema.rs", "definitions.ts"]

def runInDocker() {
    return utils.runInDocker(image, buildArgs, commands, stashSrc, stashDir)
}

return this
