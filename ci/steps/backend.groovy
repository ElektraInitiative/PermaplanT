commands = 'cargo build --release'
stashSrc = ['backend/target/release/backend']
stashDir = ['backend']

def cargoBuild() {
    return ["cargo-build": utils.runDockerSidecar(commands, stashSrc, stashDir)]
}

def cargoFmt() {
    // Workaround: we can't stop rustfmt from linting the generated schema.rs
    // so we empty the file before.
    return ["cargo-fmt":
    utils.runDockerSidecar("/bin/bash -c 'echo \"\" > src/schema.rs' && cargo fmt --check"),
    ]
}

def schemas() {
    image = "permaplant-rust"
    buildArgs = "./ci/container-images/permaplant-rust"
    commands = ["./ci/build-scripts/build-schema.sh"]
    stashSrc = ["backend/src/schema.rs", "frontend/src/bindings/definitions.ts"]
    stashDir = ["schema.rs", "definitions.ts"]
    return ["schema": utils.runInDocker(image, buildArgs, commands, stashSrc, stashDir)]
}

def dieselMigrations() {
    return ["migrations": utils.runDockerSidecar(testMigrations())]
}

def testMigrations() {
    if (env.BRANCH_NAME!="master") {
        return "make migration && make migration-redo && make migration-redo-a"
    } else {
        return "make migration && make migration-redo"
    }
}

return this
