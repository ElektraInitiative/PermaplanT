image = "permaplant-node"
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
buildArgs = "-f ./ci/container-images/permaplant-node/Dockerfile ."

def runInDocker() {
    return util.runDocker(pre_commit.image, pre_commit.buildArgs, pre_commit.commands)
}

return this
