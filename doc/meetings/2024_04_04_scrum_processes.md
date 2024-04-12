# Meeting 04.04.2024 - Scrum Processes

## Participants

- Markus
- Andrei
- Yvonne

## Questions

The main questions to answer:

- How can we improve the way we do issues?
- How can we improve the way we deal with Reviews of PR

Takeaways:

- Every 3 weeks, include a 30min retro in the meeting by Andrei
- After releases, have small Demo so team is up to date with what's new.
- Explore how GitLab can help us structure issues around Use Cases/Features
- Try to have only isses that have an estimation of one week (can be done in the scope of one "sprint") - If they are too big, they should be broken down into sub-tasks
- Reviews should be more structured - what type of review is it? (what should be checked - code/documentation/testing etc.), what issue is it relating to
- Submissions README.md as source of "expertise" - reviewers that match the expertise needed
- Look into having separate "Master" and "Dev" Branches

## Meeting Notes

General points brought up and short discussion on each:

- Timeboxes from Scrum
  - Don't fully make sense in the scope of the project, sprints can't be longer than 1 week if there are no other regular touchpoints (e.g Daily Scrum)
- Retro/Review
  - Might be interesting to try and integrate those concepts in our current meeting flow
- From Use Cases to Issues to Pull Requests
  - We need a better structure, like the concept of "Epic"s or "Feature"s to categorize the issues. This might be better supported by moving to GitLab
  - What kind of info should an issue contain? From Use Cases to everything needed for implementation - currently, details might be missing that we only become aware of later
- PRs and Reviews
  - Important to have a clear linking between the PR and the task it relates to, clear indication of what the Scope of the PR is, try not to combine multiple issues into one PR
  - Who should review? - we can use information from the submissions readme and have some rules of assigning reviews based on expertise - who can most help you review the part of the application you changed
  - PRs should not stay open for too long, to keep the Branches more stable and avoid conflicts
  - We should clean the older/"orphaned" PRs
- Task Estimation
  - In the past, explicit estimation did not work well for the structure of the project. Try to stick to Issue size that is managable in the "sprint" time of one week
