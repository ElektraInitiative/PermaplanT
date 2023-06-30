<!--
Check relevant points but **please do not remove entries**.
-->

## Basics

<!--
These points need to be fulfilled for every PR.
-->

- [ ] I added a line to [/doc/CHANGELOG.md](/doc/CHANGELOG.md)
- [ ] The PR is rebased with current master.
- [ ] Details of what you changed are in commit messages.
- [ ] References to issues, e.g. `close #X`, are in the commit messages.
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
      (not in the PR description)
- [ ] I fixed all affected documentation
- [ ] I fixed all affected decisions
- [ ] I added unit tests for my code
- [ ] I added code comments, logging, and assertions as appropriate
- [ ] I translated all strings visible to the user
- [ ] I mentioned [every code or binary](/.reuse/dep5) not directly written or done by me in [reuse syntax](https://reuse.software/)
- [ ] I created left-over issues for things that are still to be done
- [ ] Code is conforming to [our Architecture](/doc/architecture)
- [ ] Code is conforming to [our Guidelines](/doc/guidelines)
      (exceptions are documented)
- [ ] Code is consistent to [our Design Decisions](/doc/decisions)

## Review

<!--
Reviewers can copy&check the following to their review.
Also the checklist above can be used.
But also the PR creator should check these points when getting a PR done:
-->

- [ ] I've tested the code
- [ ] I've read through the whole code
- [ ] Examples are well chosen and understandable
