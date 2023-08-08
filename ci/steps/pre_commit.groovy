image = "permaplant-node"
buildArgs = "-f ./ci/container-images/permaplant-node/Dockerfile ."
commands = [
    "git init",
    "pre-commit run check-merge-conflict -a",
    "pre-commit run end-of-file-fixer -a",
    "pre-commit run mixed-line-ending -a",
    "pre-commit run trailing-whitespace -a",
    "pre-commit run prettier -a",
    "pre-commit run black -a",
    "pre-commit run flake8 -a",
    "pre-commit run mypy -a",
    "pre-commit run --hook-stage manual codespell -a"
]

def runPrecommit() {
    return ["pre-commit": utils.runDocker(image, buildArgs, commands)]
}

return this
