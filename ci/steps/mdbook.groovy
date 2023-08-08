image = "permplant-mdbook"
buildArgs = "./ci/container-images/permaplant-mdbook"
commands = ["mdbook test", "mdbook build"]
stashSrc = "book/"
stashDir = "mdbook"

def runInDocker() {
    return utils.runInDocker(image, buildArgs, cmds, stashSrc, stashDir)
}

return this
