# Frontend Locators

These guidelines will help you write resilient and user-centric locators that can be utilized robustly in E2E tests.
They are mostly inspired by [Playwrights Documentation](https://playwright.dev/docs/locators).

## What are Locators

Frontend [locators](https://playwright.dev/docs/locators) are essential elements in web development that enable developers and automated testing tools to identify and interact with specific elements on a web page.

The most popular locators are `getByRole()`, `getByLabel()` for user-centric and `getByTestId()` for more resilient tests.

Nevertheless not all cases can be solved with these 3 locators, so you might use other locators too.
A quick overview of the most important locators.

### [getByRole](https://playwright.dev/docs/locators#locate-by-role)

> To make tests resilient, we recommend prioritizing user-facing attributes and explicit contracts such as page.getByRole()

Allows locating elements by their ARIA role, ARIA attributes and accessible name.
This is semi resilient.

#### Example

```js
const MyButtonComponent = () => {
  return (
    <div>
      <button role="button" id="myButton">
        Click Me
      </button>
    </div>
  );
};
```

### [getByLabel](https://playwright.dev/docs/locators#locate-by-label)

> Most form controls usually have dedicated labels that could be conveniently used to interact with the form.
> In this case, you can locate the control by its associated label using [page.getByLabel()](https://playwright.dev/docs/api/class-page#page-get-by-label).

Allows locating input elements by the text of the associated `<label>` or `aria-labelledby` element, or by the `aria-label` attribute.
This is a reasonable alternative popular for input forms.

#### Example

```js
const MyFormComponent = () => {
  return (
    <div>
      <label htmlFor="inputField">Enter your name:</label>
      <input type="text" id="inputField" />
      <button role="button" id="submitButton">
        Submit
      </button>
    </div>
  );
};
```

### [getByTestId](https://playwright.dev/docs/locators#locate-by-test-id) (data-testid)

> Testing by test ids is the most resilient way of testing as even if your text or role of the attribute changes the test will still pass.
> QA's and developers should define explicit test ids and query them with [page.getByTestId()](https://playwright.dev/docs/api/class-page#page-get-by-test-id).
> However testing by test ids is not user facing.
> If the role or text value is important to you then consider using user facing locators such as [role](https://playwright.dev/docs/locators#locate-by-role) and [text locators](https://playwright.dev/docs/locators#locate-by-text).

Locate elements by `data-testid`.
The most resilient attribute.

#### Example

```js
<SimpleFormInput
  id="file"
  labelText={t("baseLayerForm:image_path_field")}
  onChange={(e) => setPathInput(e.target.value)}
  value={pathInput}
  data-testid="baseBackgroundSelect"
/>
```

#### Data-testid Naming Convention

For naming data-testid's we have adapted the convention from [BEM](https://en.bem.info/methodology/).
We use double underscores to distinguish between Components and Elements e.g. `search-input__search-icon` where search-input is the component and search-icon the element.

### [getByText](https://playwright.dev/docs/locators#locate-by-text)

> We recommend using text locators to find non interactive elements like div, span, p, etc.
> For interactive elements like button, a, input, etc. use [role locators](https://playwright.dev/docs/locators#locate-by-role).

Allows locating elements that contain a given text.
This alternative should only be picked if the other three are not solving the case.
It is not very resilient and can frequently break tests, therefore using a regex might be a good compromise.

There is no real example for this as this is basically the result of not doing anything specific.

### Others

- getByPlaceholder() to locate an input by placeholder.

```js
<CreatableSelectMenu placeholder="Test" />
```

- getByAltText() to locate an element, usually image, by its text alternative.
- getByTitle() to locate an element by its title attribute.

### [Playwright suggested locators](https://playwright.dev/docs/input)

These locators are from the official documentation of playwright.
It shows which locators actionable elements usually should have.

- text inputs: **label**
- checkboxes: **label**
- radio buttons: **label**
- select options: **label**
- mouse clicks: **role or text**
- type characters: **locator**
- keys and shortcuts: **text or role**
- upload files and focus elements: **label**

## User facing or resilient?

When choosing the right locator it is important to ask yourself one question.
Do we want to test what the user perceives?
If so, we can use `roles` and `labels`.
If user-centricity is not so important on this element use `data-testid`.
In case of doubt use `data-testid`.
