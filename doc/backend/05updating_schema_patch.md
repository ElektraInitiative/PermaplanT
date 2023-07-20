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

Now manually make changes in `schema.rs`, use the current `schema.patch` to apply important changes

4. Run `` diff src/schema.rs `src/schema_tmp.rs` -U6 > src/schema.patch `` in the backend folder to save the result as `src/schema.patch`.

5. Add `patch_file = "src/schema.patch"` to the `diesel.toml` again.

From now on the newly generated patch file should be used by diesel.
