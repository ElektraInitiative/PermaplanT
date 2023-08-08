image = "permplant-mdbook"
buildArgs = "./ci/container-images/permaplant-mdbook"
commands = ["mdbook test", "mdbook build"]
stashSrc = "book/"
stashDir = "mdbook"

def runInDocker() {
    return util.runInDocker(mdbook.image, mdbook.buildArgs, mdbook.cmds, mdbook.stashSrc, mdbook.stashDir)
}

return this
