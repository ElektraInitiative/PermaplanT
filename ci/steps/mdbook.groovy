image = "permplant-mdbook"
buildArgs = "./ci/container-images/permaplant-mdbook"
commands = ["mdbook test", "mdbook build"]
stashSrc = "book/"
stashDir = "mdbook"

def runBuildInDocker() {
    return utils.runInDocker(image, buildArgs, commands, stashSrc, stashDir)
}

return this
