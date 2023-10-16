# Release Procedure Documentation

This document describes what needs to be done for a release.

- [ ] check if all issues labelled `release critical` are fixed
- [ ] check if jenkins master pipeline succeeds
- [ ] run external link check (change follow-web-links in book.toml and do `mdbook build`)
- [ ] fix _real_ security problems
      unfortunately `npm audit --omit=dev fix` does [too much and too little](https://overreacted.io/npm-audit-broken-by-design/),
      `cargo deny check` seems to be more helpful
- [ ] check/improve reformatting
- [ ] update mergedDatasets.csv
- [ ] manually test dev.permaplant.net according to protocol
- [ ] build <https://build.libelektra.org/job/PermaplanT-Release/>
- [ ] git tag -s vX.X.X
- [ ] git push --tags
- [ ] create release PR to pump versions and new section in Changelog
- [ ] write announcement

## Yearly tasks

- [ ] increase year in LICENSE
