# Frontend UI & Usability Guide

This guide should help improve the UI (User Interface) and usability of the PermaplanT web application going forward.  
The following guidelines are a mix of general UI and usability best practices on one hand and design suggestions tailored to PermaplanT on the other.

## Terminology

### Usability

> Extent to which a system, product or service can be used by specified users to achieve specified goals with effectiveness, efficiency and satisfaction in a specified context of use.

### User Interface (UI)

> Set of all the components of an interactive system that provide information and controls for the user to accomplish specific tasks with the interactive system.

### User Experience (UX)

> Combination of user's perceptions and responses that result from the use and/or anticipated use of a system, product or service.

## Guidelines

### Text

- **Alignment**

  - Left align when text spans over more than three lines because centered text becomes hard to follow when having to jump to the next line multiple times.
  - Avoid mixing two different alignments in a text section, e.g. a centered headline should be followed by centered text.

- **Hierarchies / lists**

  - Avoid using more than two different font sizes.
  - Use bold text and colours for deeper nested hierarchies.

- **Spacing / margin**  
  Multiplier strategy to calculate the margins - if in doubt, use a multiplier of 2, e.g.:

  - Text sections:  
    headline-1 <- 16px -> text <- 32px -> headline-2
  - Navigation bar:  
    logo <- 48px -> navigation-link-1 <- 24px -> navigation-link-2 <- 24px -> navigation-link-3

- **Line height**  
  The bigger the text the smaller the line height's value should be.

  - Headings: 1.1 - 1.3
  - Running text: 1.3 - 1.5

- **Letter spacing**  
  Often times, like in PermaplanT's current case, the default value (in Tailwind: _tracking-normal_) is good enough.
  - Headings: negative values can be used for the bigger headings h1-h3, i.e. _tracking-tighter_ or _tracking-tight_
  - Running text: usually can be left as is but, if needed, can be set to _tracking-wide_ or _tracking-wider_

### Colors

PermaplanT uses following **three colour palettes**:

- **Neutral** ~60% (PermaplanT: gray): **dominant** colour of the design, e.g. used for background, text and labels
- **Primary** ~30% (PermaplanT: asparagus green): PermaplanT's **main brand** colour, e.g. used for buttons, hovering, highlighting focused input fields
- **Secondary** ~10% (PermaplanT: sea blue): PermaplanT's **second brand** colour, e.g. used for highlighting a few UI elements (e.g. in the layers section) and action-texts

**Only those** three colour palettes **should be used** throughout the whole application. The ratio of their current usage in PermaplanT is conforming nicely to the popular **60-30-10** design rule.

### Forms

#### Design

- Display a **centered heading** if the form is representing a whole page, e.g. PermaplanT's forms to create maps and seeds.
- Add a **capitalized label** above each field.
- **Align** labels to the **left** of their corresponding fields.
- Always explicitly **associate** the **label with** the belonging **element** by using the label's _for_ attribute (in React: _htmlFor_).
  This enables focusing the input field by clicking/tapping on the label.
  It also adds screen reader support.
- All input fields should have the **same styling**, i.e. border, colour, text size, padding, etc.
- Use **opacity** for an input field's **placeholder** text.

#### Error Prevention

- Use the **corresponding _type_** of the input field, e.g. _date_ for date fields, _number_ for numerical-only inputs etc.
- Mark required fields with an **asterisk**.
- Use HTML-native **constraint** attributes for input fields where appropriate, e.g. _maxlength_, _required_, _step_, etc.
- Use short **placeholder** texts for input fields to show allowed values or further explain the intent of the input field.
- Users should **never** be **required** to manually enter a **metrical** unit or a **currency** symbol.
  Instead, make the unit part of the input field itself or leave it out if it's clear from the context.
- **Submission** to the backend should not happen until all fields are **verified** by the **frontend** logic.
- **Double submission** should be **prevented**, e.g. by disabling the submission button until the server has responded.

### Consistency

Things with the **same meaning** should **look and behave** the **same** throughout the whole application.
Users should never be uncertain if different words mean the same thing or different actions trigger the same process.

Examples:

- Call-to-action buttons should look the same everywhere.
- The layout of forms and the styling of their input fields should be the same in every form.
- Validation errors in forms should be rendered the same way in any form.
- Toast errors should always be shown in the same location.
- Headings of different pages should be positioned in the same location and have the same styling.
- The same application-specific terms should be used everywhere to communicate to the user.

### Icons

- In their **passive**, i.e. currently not active/enabled, state they should appear in **neutral** colours/colourless.
- When **active**, i.e. currently activated/enabled, they should get a small **highlighting** through a visually stronger and more colourful appearance by using the design's primary/secondary colours.
- When **disabled**, i.e. currently not clickable, they should be **greyed-out**, either via decreasing its opacity or choosing light, faint colours.  
  The mouse **cursor** should be styled with the **_not-allowed_** css property.
- A **tooltip** on hovering should be displayed for every icon in PermaplanT's toolbox.
  The tooltip should contain the icon's **label** (as concise as possible) and, if existing, the assigned **shortcut**.

### Highlighting

Highlighting techniques:

- Font weight:

  - **Bold** text adds tolerable noise to the design and enables distinct highlighting in both short and long texts.
    In general, it is the preferred highlighting technique to use.
  - _Italic_ text adds minimal noise to the design, but lacks in recognizability.
  - <u>Underlining</u> adds most noise and compromises a text's legibility.
    It should hardly ever be used.

- Colours: primary and secondary colours of the design's colour palette

- Images: users generally remember images better than words

- Avoid different fonts for highlighting purposes.

### Wording

Messages shown to the user should strive to fulfill following criteria:

- **concise**: the more text the less likely it will be read by the user
- **clear**: straight to the message's essence
- **understandable** for technical laymen: no error codes or technical terms
- **no exclamation** marks: interpreted as commanding
- **no uppercase** words: comes across as shouting
- **detailed** information should be hidden behind a **read more** link or a **collapsed** section
- **Headlines**, **sub-headlines** and **labels** should be **capitalized**
- **Minimize hyphenation** of words

### Error Messages

In general, error messages often convey the impression that an application's stability is weak which, in consequence, leads to a **declined user experience**.
Error messages should **only** be used **if** the **user**, without that information, **would be badly surprised** by the result of an action.

Error messages should fulfill following criteria:

- **polite** and **neutral**: do not directly or indirectly blame the user and stay away from jokes
- **brief**
- **specific** to the problem
- contain **reason for the problem**
- **solution-oriented**: ideally, a solution to the occured problem is offered
- no **privacy-violating** information: e.g. informing the user upon a failed login that the entered email does not exist in the system - this could additionally also encourage people to scan our database for emails

### Search Fields

To prevent _Chromium_ and _WebKit_ based browsers from adding their own cross icon and functionality into search input fields, **do not declare** input fields with **type _search_**.  
Instead, **use** PermaplanT's **SearchInput** component which renders its own cross icon, together with a search icon and the input field itself.  
That way we provide the same search input functionality for every browser.

The **SearchInput** component has following **behavior** and **functionality**:

- The cross icon will be shown if there is any search term entered into the input field, and hidden otherwise.
- Clicking on the cross icon will reset the current search term and keep the focus on the input field, so the user can continue typing.
- Pressing the _ESC_ key likewise resets the current search term and keeps the focus on the input field.
- The _SearchInput_ component exposes a method which enables parent components to set the focus on it, besides that it is fully encapsulated, i.e. it hides all its DOM nodes from the outside.
