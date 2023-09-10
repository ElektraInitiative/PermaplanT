<!--
Check relevant points but **please do not remove entries**.
-->

## Basics

<!--
These points need to be fulfilled for every PR.
-->

- [ ] I added a line to [changelog.md](/doc/changelog.md)
- [ ] The PR is rebased with current master.
- [ ] Details of what you changed are in commit messages.
- [ ] References to issues, e.g. `close #X`, are in the commit messages and changelog.
- [ ] The buildserver is happy.

<!--
If you have any troubles fulfilling these criteria, please write about the trouble as comment in the PR.
We will help you, but we cannot accept PRs that do not fulfill the basics.
-->

## Checklist

<!--
For documentation fixes, spell checking, and similar none of these points below need to be checked.
Otherwise please check these points when getting a PR done:
-->

- [ ] I have installed and I am using [pre-commit hooks](../doc/contrib/README.md#Hooks)
- [ ] I fully described what my PR does in the documentation
- [ ] I fixed all affected documentation
- [ ] I fixed the introduction tour
- [ ] I wrote migrations in a way that they are compatible with already present data
- [ ] I fixed all affected decisions
- [ ] I added automated tests or a [manual test protocol](../doc/tests/manual/protocol.md)
- [ ] I added code comments, logging, and assertions as appropriate
- [ ] I translated all strings visible to the user
- [ ] I mentioned [every code or binary](https://github.com/ElektraInitiative/PermaplanT/blob/master/.reuse/dep5) not directly written or done by me in [reuse syntax](https://reuse.software/)
- [ ] I created left-over issues for things that are still to be done
- [ ] Code is conforming to [our Architecture](/doc/architecture)
- [ ] Code is conforming to [our Guidelines](/doc/guidelines)
- [ ] Code is consistent to [our Design Decisions](/doc/decisions)
- [ ] Exceptions to any guidelines are documented

## Review

<!--
Reviewers can copy&check the following to their review.
Also the checklist above can be used.
But also the PR creator should check these points when getting a PR done:
-->

- [ ] I've tested the code
- [ ] I've read through the whole code
- [ ] I've read through the whole documentation
- [ ] I've checked conformity to guidelines
