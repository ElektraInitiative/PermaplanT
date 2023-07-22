# Update the `schema.patch` file

This document explains how to update the `schema.patch` file used by diesel.

1. Remove the following line from `diesel.toml`:

   ```toml
   patch_file = "src/schema.patch"
   ```

2. Get a clean database with all migrations:

   ```bash
   cd backend && diesel database reset
   ```

   You should now have a generated `schema.rs` in the backend src folder.

3. Copy the `schema.rs` file e.g. to `schema_tmp.rs`.
4. Update the `schema_tmp.rs` to fit your needs.
5. Run `` diff src/schema.rs `src/schema_tmp.rs` -U6 `` in the backend folder and save the result to the `src/schema.patch` file.
6. Add `patch_file = "src/schema.patch"` to the `diesel.toml` again.

From now on the newly generated patch file should be used by diesel.
