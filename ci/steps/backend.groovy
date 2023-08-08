def cargoBuild() {
    commands = 'cargo build --release'
    stashSrc = ['backend/target/release/backend']
    stashDir = ['backend']
    return ["cargo-build": utils.runDockerSidecar(commands, stashSrc, stashDir)]
}

def cargoFmt() {
    // Workaround: we can't stop rustfmt from linting the generated schema.rs
    // so we empty the file before.
    return ["cargo-fmt":
    utils.runDockerSidecar("/bin/bash -c 'echo \"\" > src/schema.rs' && cargo fmt --check"),
    ]
}

def cargoClippy() {
    commands = 'cargo clippy'
    return ["cargo-clippy": utils.runDockerSidecar(commands)]
}

def cargoDoc() {
    commands = 'cargo doc'
    return ["cargo-doc": utils.runDockerSidecar(commands)]
}

def cargoTest() {
    commands = 'cargo test'
    return ["cargo-test": utils.runDockerSidecar(commands)]
}

def schemas() {
    commands = "echo building schemas" // no command needed, runDockerSidecar always builds schemas.
    stashSrc = ["backend/src/schema.rs", "frontend/src/bindings/definitions.ts"]
    stashDir = ["schema.rs", "definitions.ts"]
    return ["schema": utils.runDockerSidecar(commands, stashSrc, stashDir)]
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
