<!--
Check relevant points but **please do not remove entries**.
-->

## Basics

<!--
These points need to be fulfilled for every PR.
-->

- [ ] Details of what you changed are in commit messages
      (first line should have `module: short statement` syntax)
- [ ] References to issues, e.g. `close #X`, are in the commit messages.
- [ ] The buildserver is happy.
- [ ] The PR is rebased with current master.

<!--
If you have any troubles fulfilling these criteria, please write about the trouble as comment in the PR.
We will help you, but we cannot accept PRs that do not fulfill the basics.
-->

## Checklist

<!--
For documentation fixes, spell checking, and similar none of these points below need to be checked.
-->

- [ ] I added unit tests for my code
- [ ] I fully described what my PR does in the documentation
      (not in the PR description)
- [ ] I fixed all affected documentation
- [ ] I fixed all affected decisions
- [ ] I added code comments, logging, and assertions as appropriate
- [ ] I mentioned [every code](/.reuse/dep5) not directly written by me in [reuse syntax](https://reuse.software/)


## Review

<!--
Reviewers should check the following.
-->

- [ ] Documentation is conforming to [our Documentation Guidelines](/doc/documentation.md)
- [ ] Examples are well chosen and understandable
- [ ] Code is conforming to our Coding Guidelines
- [ ] Code is consistent to [our Design Decisions](/doc/decisions)
