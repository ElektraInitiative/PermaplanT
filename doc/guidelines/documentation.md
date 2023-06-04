# Documentation

This document gives guidelines for contributors concerning PermaplanT's documentation.
This document takes preference to the actual situation.
If you see documentation not according to this document, please create an issue.
Alternatively, you can directly fix it with your next PR.

> **Note:**
> It is always allowed to improve the documentation, in every PR, even if the documentation fix is completely unrelated.
> However, separate PRs are preferred and can potentially get merged sooner.

## Target Groups

We write documentation only for **contributors**, i.e., a person who makes changes within PermaplanT's repository.

> Every document must be clearly addressed to this target group.

## Orientation

Each documentation should clearly be oriented to one of these three directions:

1. **learning-oriented:**
   First introduction is done via README.md and tutorials, they teach the _fundamentals_.
2. **information-oriented:**
   E.g. API docs are the _references_.
3. **understanding-oriented:**
   The [doc/decisions](/doc/decisions) explain the "Why?" something is done as it is done, i.e., the _rationale_.

Literature mentions also goal-oriented concepts, but we prefer _learning-oriented_ approaches.
E.g. of course you might have the goal to write a new plugin.
But why not also learn about plugins while creating a new plugin?

> **Takeaway:**
> Don't try to combine different orientations in one document, instead split your documentation up in e.g. a `README.md` (_information_), tutorial (_learning_) and decisions (_understanding_).

## Criteria

PermaplanT's documentation must fulfill:

- Always write what **is**, not what you would like to have except of decisions.
  Explanations must always refer to the current situation (as changed with your PR).
- It is self-contained.
  It is not enough to link to some paper and an external page as explanation.
  All explanation must be within the repository, e.g., in case the external information goes away.
  This doesn't apply if the authoritative standard lives outside of PermaplanT.
  Then you would write, e.g., "The toml plugin implements [this standard](https://toml.io/en/v1.0.0), with following extensions:".
  The extensions, however, again must be fully listed within our repository. Make sure to link to the correct version of the standard.
- We use standard Markdown where possible, with only a few extensions:
  - styled fenced blocks
  - `- [ ]` option lists
  - `- <word>:<line break>` description lists
- The documentation should be as near to the code as possible.

> **Takeaway:**
> Include full API and Markdown documentation of the current situation directly in your PRs.

## Style

- Sentences are short and written in one line.
  I.e. lines usually end with `.`, `:` or `;`.
  Avoid line breaks in the middle of the sentence.
- Use active and strong verbs early in your sentences.
  "We" refers to the community around the PermaplanT Initiative.
- Use headings and lists to keep a clear structure in the text.
- Use examples and images to emphasize important points, don't overuse emphasis in text (bold, etc.).
- Spelling is American English.
- It is consistent with our [glossary](/doc/architecture/glossary.md).

> **Note:**
> Please extend [glossary](/doc/architecture/glossary.md) as needed.

## Completeness

In general the documentation does not need to be complete.
In particular, we do not want repetition of implementation details as documentation.
[Prefer to write self-documenting code](/doc/CODING.md).
Nevertheless, there are a few must-haves:

- A `README.md` must be available for every module.
- A man page (`help/kdb-`) must be available for every command (including external commands).
- A tutorial must be present for every important concept.
- Everything copied must be properly licensed in [reuse](/.reuse/dep5).

## Links

Generously use links but be very careful to create a coherent documentation (German: "roter Faden"):

- Clearly separate between prerequisites and further readings.
- _Prerequisites:_
  Concepts people need to know before reading the documentation must be linked in the beginning.
- When adding links, check if users cannot easily get lost in circles.
- To link to PermaplanT's files use internal links.
  Use absolute or relative links as appropriate.
  E.g. for files within the same folder use relative links.
- For external links use **https** links, if available.

> **Takeaway:**
> Links are very helpful to readers.
> Make sure documentation can be read one after the other with these links (German: "roter Faden").

## Templates

In general we use [arc42.org](https://arc42.org/) but we use specialized templates for:

- [decisions](/doc/decisions/TEMPLATE.md)
