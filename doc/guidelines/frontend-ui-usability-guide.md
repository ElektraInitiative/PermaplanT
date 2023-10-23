# Frontend UI & Usability Guide

## Terminology

### Usability

> Extent to which a system, product or service can be used by specified users to achieve specified goals with effectiveness, efficiency and satisfaction in a specified context of use.

### User Interface (UI)

> Set of all the components of an interactive system that provide information and controls for the user to accomplish specific tasks with the interactive system.

### User Experience (UX)

> Combination of user's perceptions and responses that result from the use and/or anticipated use of a system, product or service.

## Guidelines

This guide should help improve the UI (User Interface) and usability of the PermaplanT web application going forward.  
The following guidelines are:

- on the one hand a mix of general UI and usability best practices and
- on the other hand design suggestions tailored to PermaplanT.

### Text

- **Alignment**

  - Left align when text spans over more than three lines because centered text becomes hard to follow when having to jump to the next line multiple times.
  - Avoid mixing two different alignments in a text section, e.g. a centered headline should be followed by centered text.

- **Spacing / margin**  
  Multiplier strategy to calculate the margins - if in doubt, use a multiplier of 2, e.g.:

  - Text sections:  
    headline-1 <- 16px -> text <- 32px -> headline-2
  - Navigation bar:  
    logo <- 48px -> navigation-link-1 <- 24px -> navigation-link-2 <- 24px -> navigation-link-3

- **Letter spacing**  
  Often times, like in PermaplanT's current case, the default value (in Tailwind: `tracking-normal`) is good enough.
  - Headings: negative values can be used for the bigger headings h1-h3, i.e. `tracking-tighter` or `tracking-tight`
  - Running text: usually can be left as is but, if needed, can be set to `tracking-wide` or `tracking-wider`

### Colors

PermaplanT uses following **three color palettes**:

- **Neutral** ~60% (PermaplanT: gray): **dominant** color of the design, e.g. used for background, text and labels
- **Primary** ~30% (PermaplanT: asparagus green): PermaplanT's **main brand** color, e.g. used for buttons, hovering, highlighting focused input fields
- **Secondary** ~10% (PermaplanT: sea blue): PermaplanT's **second brand** color, e.g. used for highlighting a few UI elements (e.g. in the layers section) and action-texts

Check out Google's [Material Design Guidelines](https://m3.material.io/styles/color/the-color-system/key-colors-tones) for more information on color palettes and their usage.

**Only those** three color palettes **should be used** throughout the whole application.
They can be accessed like any other defined color in Tailwind CSS and can be appended with a number denoting the shade to be used.

Following shade suggestions should be used as a starting point for coloring new UI components:
| **location** | **light mode** | **dark mode** |
| :------------------ | :------------- | :------------ |
| main color | 500 | 300 |
| text on main | 50 | 700 |
| alternative color | 200 | 600 |
| text on alternative | 800 | 200 |

### Forms

#### Design

- Display a **centered heading** if the form is representing a whole page, e.g. PermaplanT's forms to create maps and seeds.
- Add a **capitalized label** above each field.
- **Align** labels to the **left** of their corresponding fields.
- Always use the **_for_** HTML attribute (in React: _htmlFor_) to bind the label to the field.
- Always use PermaplanT's **SearchInput** component to declare **search fields** instead of declaring them with type _search_.
- **Don't use** the **title** attribute for any form fields (see <https://inclusive-components.design/tooltips-toggletips/>)
- All form fields should have the **same styling**:
  - border color: `border-neutral-500 dark:border-neutral-400-dark`
  - border focus: `focus:border-primary-500 dark:focus:border-primary-300`
  - border radius: `rounded-lg`
  - padding: `p-2.5`
  - placeholder: `placeholder-neutral-300`
  - text: `text-sm`

#### Error Prevention

- Use the **corresponding _type_** of the input field, e.g. _date_ for date fields, _number_ for numerical-only inputs etc.
- Mark required fields with an **asterisk**:
  - color: `text-red-500`
  - all other styles are inherited from the parent label
- Use HTML-native **constraint** attributes for input fields where appropriate, e.g. _maxlength_, _required_, _step_, etc.
- Use short **placeholder** texts for input fields to show allowed values or further explain the intent of the input field.
- Users should **never** be **required** to manually enter a **metrical** unit or a **currency** symbol.
  Instead, make the unit part of the input field itself or leave it out if it's clear from the context.
- **Submission** to the backend should not happen until all fields are **verified** by the **frontend** logic.
- In case of submissions **on-the-fly**, e.g. setting dates for plants, the data should always be submitted with **debouncing**.
- **Double submission** should be **prevented** by disabling the submission button until the server has responded.

### Consistency

Things with the **same meaning** should **look and behave** the **same** throughout the whole application.
Users should never be uncertain if different words mean the same thing or different actions trigger the same process.

Examples:

- **Main Heading** of a page is always defined by `<h1>` which must be the only one of its kind per page
- **Headings** of all toolbars are always defined by `<h2>`
- If **textual links**, e.g. the links in PermaplanT's navigation bar, need to be surrounded by space, always set their `margin` instead of `padding`.
- Make **call-to-action buttons** look the same everywhere by using our `SimpleButton` component.
  Use Tailwind's classes to define the button's `margin` and `width`, if necessary due to layout or viewport.
- **Toast errors** are always shown on the top right.
  To achieve this, we are simply using the default setting of our used library (_react-toastify_).
- Use the same **application-specific terms** everywhere when communicating to the user, e.g. always write _PermaplanT_.
- **Forms** and their fields should look and behave the same everywhere according to our guidelines in [Forms](#forms).
- In every **form**, **validation** errors are detected and shown by using the native input validation of HTML5.

### Icons

- In their **passive**, i.e. currently not active/enabled, state they must appear in **neutral** colors/colorless.
- When **active**, i.e. currently activated/enabled, they must get a small **highlighting** through a visually stronger and more colorful appearance by using the design's primary colors.
- When **disabled**, i.e. currently not clickable, they must be **greyed-out**, either via decreasing its opacity or choosing light, faint colors.  
  The mouse cursor must be styled with the `not-allowed` css property.
- A **tooltip** on hovering must be displayed for every icon in PermaplanT's toolbox.
  The tooltip contains the icon's **label** (as concise as possible) and, if existing, the assigned **shortcut**.

### Highlighting

Highlighting techniques:

- Font weight:

  - **Bold** text adds tolerable noise to the design and enables distinct highlighting in both short and long texts.
    In general, it is the preferred highlighting technique to use.
  - _Italic_ text adds minimal noise to the design, but lacks in recognizability.
  - <u>Underlining</u> adds most noise and compromises a text's legibility.
    It should not be used.

- Colors: primary and secondary colors of the design's color palette

- Images: users generally remember images better than words

- Avoid different fonts for highlighting purposes.

### Wording

Messages shown to the user should strive to fulfill following criteria:

- **concise**: the more text the less likely it will be read by the user
- **clear**: straight to the message's essence
- **understandable** for technical laymen: no status codes or technical terms
- **no exclamation** marks: interpreted as commanding
- **no uppercase** words: comes across as shouting
- **detailed** information should be hidden behind a **read more** link or a **collapsed** section
- **Headlines**, **sub-headlines** and **labels** should be **capitalized**
- **Minimize hyphenation** of words
- **American English** spelling
- use **plural** to avoid gendering, i.e. use _we_/_they_, avoid _he_/_she_

### Error Messages

In general, error messages often convey the impression that an application's stability is weak which, in consequence, leads to a **declined user experience**.
Error messages should **only** be used **if** the **user**, without that information, **would be badly surprised** by the result of an action.

Error messages should fulfill following criteria:

- **polite** and **neutral**: do not directly or indirectly blame the user and stay away from jokes
- start the message with **Sorry, ...**
- write **personified**, e.g. _I could not find ..._
- **brief**
- **specific** to the problem
- **no technical terms** and error codes
- mention **reason for the problem** and say _probably_ if not totally sure about the problem
- offer **possible solutions** only, and only if, you are sure about them
- use **colors/formatting** to highlight important passages
- show via **toastify** on the **top right**

E.g.:  
"Sorry, I **cannot communicate** with my server, there is probably some network problem or the server is down. _Please retry later._"
