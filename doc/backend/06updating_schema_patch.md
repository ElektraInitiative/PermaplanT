# Update the `schema.patch` file

This document explains how to update the `schema.patch` file used by diesel.

1. Comment out the following line from `diesel.toml`:

   ```toml
   patch_file = "src/schema.patch"
   ```

2. Get a clean database with all migrations:

   ```bash
   cd backend && diesel database reset
   ```

   You should now have a generated `schema.rs` in the backend src folder.

3. Copy the `schema.rs` file e.g. to `schema_tmp.rs`.

4. Make the necessary changes to `schema_tmp.rs`.

5. Run `diff -U6 src/schema.rs src/schema_tmp.rs > src/schema.patch` in the backend folder.

6. Add `patch_file = "src/schema.patch"` to the `diesel.toml` again.

From now on the newly generated patch file should be used by diesel.
