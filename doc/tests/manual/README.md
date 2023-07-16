# Manual Test Protocols

This directory contains all manual test protocol and reports.
While developing the protocol gets extended with new testcases.
Shortly before a major release the protocol gets executed and becomes a report.

## Protocol

The blueprint of all manual test cases.
The protocol should not contain any information about the results of a test.
The protocol depicts the unperformed manual test.

## Report

A report is the execution of one protocol.
It contains additional information on top.
A report can chose to perform a subset of the test cases from the protocol.

### Naming convention

The report should have the current day as suffix.

### Report header

```md
## General

- Tester:
- Date/Time:
- Duration:
- Commit/Tag:
- Planned tests: -1
- Executed tests: -**1**
- Passed tests: -1
- Failed tests: -1

## Error Analysis

1. Identifying the error: Is it indeed a genuine software defect, or is it a faulty test case, incorrect test execution, etc.?
2. Has the error already been identified in previous tests?
3. Error specifictation

- Class 1: Faulty specification
- Class 2: System crash
- Class 3: Essential functionality is faulty
- Class 4: Functional deviation or limitation
- Class 5: Minor deviation
- Class 6: Cosmetic issue

4. Priority

- Level 1: Immediate resolution
- Level 2: Fix in next version
- Level 3: Correction will be done opportunistically
- Level 4: Correction planning is still open

## Closing remarks

- How is the current state of the software?
- Have the quality objectives been achieved?
- What are the consequences drawn from the current state, including: how can future errors be avoided, how can the development process be improved?
```
