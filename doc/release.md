# Release Procedure Documentation

This document describes what needs to be done for a release.

- [ ] run external link check (change follow-web-links in book.toml and do `mdbook build`)
- [ ] fix _real_ security problems: `npm audit --omit=dev fix` (probably does too much)
- [ ] check/improve reformatting
- [ ] check if all release-critical issues are fixed
- [ ] update mergedDatasets.csv
- [ ] manually test dev.permaplant.net according to protocol
- [ ] build <https://build.libelektra.org/job/PermaplanT-Release/>
- [ ] git tag -s vX.X.X
- [ ] git push --tags
- [ ] create release PR to pump versions and new section in Changelog
- [ ] write announcement

## Yearly tasks

- [ ] increase year in LICENSE
