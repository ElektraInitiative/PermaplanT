# Frontend Coding Guidelines

These guidelines will help you write frontend code that enables resilient and user-centric test execution.
Currently these guidelines are strongly oriented according to Playwrights Best Practices.
When following the four points below, you will be on a good way to write good testable code.

## 1. Locators

In order to find elements on the webpage the tests will need to use one of the following [locators](https://playwright.dev/docs/locators):

The most popular of these beeing `getByRole()` for user-centric and `getByTestId()` for more resilient tests.

Nevertheless getByRole() and getByTestId() probably can't solve all cases, so there is also some alternatives.
A quick overview of the different locators.

### [getByRole](https://playwright.dev/docs/locators#locate-by-role)

> To make tests resilient, we recommend prioritizing user-facing attributes and explicit contracts such as page.getByRole()

Allows locating elements by their ARIA role, ARIA attributes and accessible name.

### [getByTestId](https://playwright.dev/docs/locators#locate-by-test-id) (data-testid)

> Testing by test ids is the most resilient way of testing as even if your text or role of the attribute changes the test will still pass.
> QA's and developers should define explicit test ids and query them with [page.getByTestId()](https://playwright.dev/docs/api/class-page#page-get-by-test-id).
> However testing by test ids is not user facing.
> If the role or text value is important to you then consider using user facing locators such as [role](https://playwright.dev/docs/locators#locate-by-role) and [text locators](https://playwright.dev/docs/locators#locate-by-text).

Locate element by `data-testid`.
The most resilient attribute.

### [getByLabel](https://playwright.dev/docs/locators#locate-by-label)

> Most form controls usually have dedicated labels that could be conveniently used to interact with the form.
> In this case, you can locate the control by its associated label using [page.getByLabel()](https://playwright.dev/docs/api/class-page#page-get-by-label).

Allows locating input elements by the text of the associated `<label>` or `aria-labelledby` element, or by the `aria-label` attribute.
This is a reasonable alternative popular for input forms.

### [getByText](https://playwright.dev/docs/locators#locate-by-text)

> We recommend using text locators to find non interactive elements like div, span, p, etc. For interactive elements like button, a, input, etc. use [role locators](https://playwright.dev/docs/locators#locate-by-role).

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
If so, go with `roles`.
If user-centricity is not so important on this element use `data-testid`.
In case of doubt use `data-testid`.

## 3. Naming Conventions

#### Prefix

We will add `test-` as a prefix to every `data-testid` element.

#### Unique identifiers

Well chosen names.

```html
<!-- Good -->
<input type="text" data-testid="test-username-input" />

<!-- Bad -->
<input type="text" data-testid="test-input-1" />
```

#### Human readable

No abbreviations.

```html
<!-- Good -->
<button data-testid="test-login-button">Login</button>

<!-- Bad -->
<button data-testid="test-lgnbtn">Login</button>
```

### Resilient

Chose a name that will remain relevant for longer time and avoid presentation details.

```html
<!-- Good -->
<button data-testid="test-login-button">Login</button>

<!-- Bad -->
<button data-testid="test-tomato-login-button">Login</button>
```

### Be consistent

Have a look at other id's around you.

```html
<!-- Good -->
<input type="text" data-testid="test-username-input" />
<input type="text" data-testid="test-password-input" />

<!-- Bad -->
<input type="text" data-testid="test-username-input" />
<input type="text" data-testid="test-password" />
```

## 4. Incorporate Accessibility Best Practices

Follow accessibility best practices while writing HTML code.
Ensure proper labeling of form elements, provide alternative text for images, and use appropriate ARIA [roles](https://www.w3.org/TR/wai-aria-1.2/#roles) and [attributes](https://www.w3.org/TR/wai-aria-1.2/#aria-attributes) to enhance [accessibility](https://w3c.github.io/accname/#dfn-accessible-name).
