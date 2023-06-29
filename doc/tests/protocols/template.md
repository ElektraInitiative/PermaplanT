# Test Protocol Template

This is the raw template for executing a manual test.

Information:

- Tester: [Name]
- Date/Time: [Date] [Time]
- Duration: [Duration]
- Commit/Tag: [bfe07b7](https://github.com/ElektraInitiative/PermaplanT/tree/bfe07b78b81fa062a1861cc144c230652d4d24a8)
- Planned tests: -1
- Executed tests: -**1**
- Passed tests: -1
- Failed tests: -1

| Test Case | Description   | Preconditions   | Test Steps              | Expected Result | Actual Result | Test Result | Notes  |
| --------- | ------------- | --------------- | ----------------------- | --------------- | ------------- | ----------- | ------ |
| TC-001    | [Description] | [Preconditions] | 1. [Step 1 description] | [Expected]      | [Actual]      | ✔️          | [Note] |
|           |               |                 | 2. [Step 2 description] |                 |               |             |        |
|           |               |                 | ...                     |                 |               |             |        |
|           |               |                 |                         |                 |               |             |        |
| TC-002    | [Description] | [Preconditions] | 1. [Step 1 description] | [Expected]      | [Actual]      | ❌          | [Note] |
|           |               |                 | 2. [Step 2 description] |                 |               |             |        |
|           |               |                 | ...                     |                 |               |             |        |
|           |               |                 |                         |                 |               |             |        |
| TC-003    | [Description] | [Preconditions] | 1. [Step 1 description] | [Expected]      | [Actual]      | ⚠️          | [Note] |
|           |               |                 | 2. [Step 2 description] |                 |               |             |        |
|           |               |                 | ...                     |                 |               |             |        |

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
