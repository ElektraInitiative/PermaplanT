# Decision Process

## Problem

Simply discussing in an issue and then implementing a solution is okay for non-substantial changes.
Substantial decisions, however, must be made in a transparent and participative way.

- Discussing fundamental problems in forum-like threads showed to be repetitive and ineffective.
- Decisions by supervisors are undemocratic.
- Decisions in meetings are nontransparent for the outside world.

### Main Purpose

The main purpose of decisions is

- to have clear descriptions of technical problems and solutions.
- to get a common understanding of the problems and the impacts of possible solutions.

## Constraints

- All relevant information about decisions must be within PermaplanT's repository.
- @markus2330 need to approve the decision.

## Assumptions

- People want to be informed about or even participate in what PermaplanT looks like in the future.
- Decision authors have some scientific background and want decisions based on science, and not only on opinions.
- If assumptions, including this ones written here, are broken, decisions will be redone.
- Decision authors focus on getting the best solutions and not to wish for the impossible.
  They have strong motives to also complete the decision.
- The decision process itself isn't a barrier for people to write their first decision.

## Solutions

- Create a decision process tailored to PermaplanT
- Issues (often do not result to a PR that documented the outcome)
- GitHub discussions (-||-)
- PEPs: https://peps.python.org (tailored for programming language specifications, not ideal for architectural decisions)
- Rust RFCs: https://www.ietf.org/standards/rfcs/ (-||-, see also https://forge.rust-lang.org/compiler/mcp.html)
- Change requests: https://en.wikipedia.org/wiki/Change_request

## Decision

We use a decision process tailored to PermaplanT, in which decisions need to:

- be implementable within the project/term
- be according to PermaplanT's goals

We use the template [TEMPLATE.md](TEMPLATE.md).
Explanations of the template are in [EXPLANATIONS.md](EXPLANATIONS.md).

- Decision authors are the main force to improve the text to get a decision forward.

## Rationale

- The process is lightweight and simple.
- The template makes sure important points are not forgotten.
- Every decision is by design in its own file with its own Git history.
- PRs allow to better support the constraint that everything must be within PermaplanT's repository.
- Several "Related Decisions" are very important even if everyone agrees on one solution.
  They allow reviewers and future readers of the decision to understand which options were considered and why they were rejected.
- The decision process is focused around the decision text (and not forum-like discussions), so that:
  - The resulting text is understandable without reading any discussions.
  - There is a common understanding after only reading the decision text.
  - To avoid any gaps of reading discussions and the decision.

## Implications

- Decisions encourage to write documentation before actually writing code.

## Related Decisions

This is the only non-technical decision, so no issues are related.

## Notes

- Even though they use the decision template, following decisions are not decisions:
  - [Template](TEMPLATE.md): copy this to start a new decision
  - [Explanations](EXPLANATIONS.md): read this 
- The first idea often is not the best, don't fixate on it.
  Abraham Luchins called this the “Einstellung effect.”
  Thus we encourage to generate as many ideas as possible for any problem (interrupt effect).
- We have a tendency to add:
  Take courage to also propose solutions that (mostly) remove code.
  See Leidy Klotz et al., e.g. “People systematically overlook subtractive changes“.
- Failures are not a bad thing.
  It is a good thing to have "rejected" decisions for future references and to recheck if assumptions change.
- Decisions are about "Why?" and not about "Who?" or "When?".
  Such discussions should be in the [project](https://github.com/orgs/ElektraInitiative/projects/4) or meetings.
- Discussions in issues/discussions are not prohibited.
  To not waste time, it is recommended, however, to start with the decision as described here asap.

Written by Markus Raab @markus2330
