def testBuild() {
    image = "permplant-mdbook"
    buildArgs = "./ci/container-images/permaplant-mdbook"
    commands = ["make test-mdbook", "make build-mdbook"]
    stashSrc = "book/"
    stashDir = "mdbook"
    return ["mdbook": utils.runDocker(image, buildArgs, commands, stashSrc, stashDir)]
}


return this
