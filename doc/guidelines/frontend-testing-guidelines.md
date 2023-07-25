# Frontend Testing Guidelines: Writing Resilient E2E Tests

These guidelines will help you write frontend code that enables resilient and user-centric test execution.
They are mostly inspired by Playwrights Best Practices.
When following the points below, you will be on a good way to write good testable code.

## 1. Locators

In order to find elements on the webpage, tests will need to use [locators](https://playwright.dev/docs/locators):

The most popular locators are `getByRole()`, `getByLabel()` for user-centric and `getByTestId()` for more resilient tests.

Nevertheless not all cases can be solved by these 3 locators, so there is also some alternatives.
A quick overview of the most important.

### [getByRole](https://playwright.dev/docs/locators#locate-by-role)

> To make tests resilient, we recommend prioritizing user-facing attributes and explicit contracts such as page.getByRole()

Allows locating elements by their ARIA role, ARIA attributes and accessible name.
This is semi resilient.

### [getByLabel](https://playwright.dev/docs/locators#locate-by-label)

> Most form controls usually have dedicated labels that could be conveniently used to interact with the form.
> In this case, you can locate the control by its associated label using [page.getByLabel()](https://playwright.dev/docs/api/class-page#page-get-by-label).

Allows locating input elements by the text of the associated `<label>` or `aria-labelledby` element, or by the `aria-label` attribute.
This is a reasonable alternative popular for input forms.

### [getByTestId](https://playwright.dev/docs/locators#locate-by-test-id) (data-testid)

> Testing by test ids is the most resilient way of testing as even if your text or role of the attribute changes the test will still pass.
> QA's and developers should define explicit test ids and query them with [page.getByTestId()](https://playwright.dev/docs/api/class-page#page-get-by-test-id).
> However testing by test ids is not user facing.
> If the role or text value is important to you then consider using user facing locators such as [role](https://playwright.dev/docs/locators#locate-by-role) and [text locators](https://playwright.dev/docs/locators#locate-by-text).

Locate element by `data-testid`.
The most resilient attribute.

### [getByText](https://playwright.dev/docs/locators#locate-by-text)

> We recommend using text locators to find non interactive elements like div, span, p, etc.
> For interactive elements like button, a, input, etc. use [role locators](https://playwright.dev/docs/locators#locate-by-role).

Allows locating elements that contain a given text.
This alternative should be picked only if the other three are not possible.
It is not very resilient and can frequently break the tests.

### Others

- getByPlaceholder() to locate an input by placeholder.
- getByAltText() to locate an element, usually image, by its text alternative.
- getByTitle() to locate an element by its title attribute.

### [Playwright suggested locators](https://playwright.dev/docs/input)

- text inputs: **label**
- checkboxes: **label**
- radio buttons: **label**
- select options: **label**
- mouse clicks: **role or text**
- type characters: **locator**
- keys and shortcuts: **text or role** **<- this is the only place where text is fine**
- upload files and focus elements: **label**

## 2. User facing or resilience?

When chosing the right locator it is important to ask yourself one question.
Do we want to test what the user perceives?
If so, we can use `roles` and `labels`.
If user-centricity is not so important on this element use `data-testid`.
In case of doubt use `data-testid`.

## 3. Incorporate Accessibility Best Practices

Writing code that is highly accessible and easily testable should be a priority whenever possible.
While it may not always be the primary focus, if you can achieve both goals simultaneously, it's worth pursuing that path.
Additionally, many accessibility best practices are inherent in standard coding practices, such as using appropriate HTML elements like h1s, button tags, and providing alt attributes for images.

Ensure proper labeling of form elements, provide alternative text for images, and use appropriate ARIA [roles](https://www.w3.org/TR/wai-aria-1.2/#roles) and [attributes](https://www.w3.org/TR/wai-aria-1.2/#aria-attributes) to enhance [accessibility](https://w3c.github.io/accname/#dfn-accessible-name).
