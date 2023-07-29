# Release Procedure Documentation

This document describes what needs to be done for a release.

- [ ] manually test dev.permaplant.net according to protocols
- [ ] run external link check (book.toml: follow-web-links)
- [ ] npm audit, fix security problems
- [ ] check/improve reformatting
- [ ] check if all release-critical issues are fixed
- [ ] build <https://build.libelektra.org/job/PermaPlanT-Folder/job/PermaplanT-Release/>
- [ ] git tag -s vX.X.X
- [ ] git push --tags
- [ ] create release PR to pump versions and new section in Changelog
- [ ] write announcement

## Yearly tasks

- [ ] increase year in LICENSE
