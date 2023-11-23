# Frontend UI & Usability

This guide should help improve the UI (User Interface) and usability of the PermaplanT web application going forward.  
Its focus is:

- on the one hand a mix of general UI and usability best practices and
- on the other hand design suggestions tailored to PermaplanT.

## Text

- **Size**

  - `<h1>` Headings : `text-2xl`
  - `<h2>` Subheadings: `text-xl`
  - `<h3>` Subheadings (currently not used/needed): `text-lg`
  - Navigation items: `text-lg`
  - Running text: `text-sm`
  - Form fields and labels: `text-sm`

- **Family**

  - PermaplanT is using Tailwind's default cross-browser sans-serif stack everywhere.
    (If a different family is to be used in the future, extend the theme with a new `theme.fontFamily` section in our Tailwind config file `tailwind.config.js`.)

- **Alignment**

  - Always left align everything.
  - Exceptions:
    - Modals: center headings
    - Guided tour: center highlighted actions

- **Spacing / margin**

  - `<h1>` Headings: `mb-8`
  - `<h2>` Subheadings (and below): `mb-2`
  - Cards (like on our Map overview): `mb-4`
  - Form fields (like on the Seeds page): `mb-8`
  - Labels of form fields: `mb-2`

- **Letter spacing**

  - Always go with the default value, i.e. `tracking-normal`.
    (In case letter spacing changes are considered in the future:
    - Headings: use negative values for the bigger headings h1-h3, i.e. `tracking-tighter` or `tracking-tight`
    - Running text: `tracking-wide` or `tracking-wider`)

## Colors

PermaplanT uses following **color palettes**:

- **Neutral** (PermaplanT: gray): **dominant** color of the design, e.g., used for background, text and labels.
- **Primary** (PermaplanT: asparagus green): PermaplanT's **main brand** color, e.g. used for call-to-action buttons, checkmarks, highlighting focused form input fields, hovering over icons, highlighting active/enabled icons in the toolbox.
- **Secondary** (PermaplanT: sea blue): PermaplanT's **second brand** color, e.g. used for highlighting selected plants on the map, currently focused icons, spinners, action-texts in the guided tour and bigger UI elements like the transparency bars to have some contrast to the primary color.
- Tailwind's default color palette for **red** is e.g. used to render validation errors in forms, form field asterisks (`text-red-500`), buttons for destructive actions.

**Only those** color palettes **should be used** throughout the whole application.
The colors are stored within the Tailwind CSS color definitions `primary`, `secondary` and `neutral`.
They can be accessed like any other defined color in Tailwind CSS and can be appended with a number denoting the shade to be used.

Following shade suggestions should be used as a starting point for coloring new UI components:
| **location** | **light mode** | **dark mode** |
| :------------------ | :------------- | :------------ |
| main color | 500 | 300 |
| text on main | 50 | 700 |
| alternative color | 200 | 600 |
| text on alternative | 800 | 200 |

(Google's [Material Design Guidelines](https://m3.material.io/styles/color/the-color-system/key-colors-tones) contains more information on color palettes and their usage.)

## Forms

### Design

- Cancel should be blue and on the left bottom.
- Display a left aligned heading if the form is representing a whole page, e.g. PermaplanT's forms to create maps and seeds.
- Add a capitalized label above each field.
- Align labels to the left of their corresponding fields.
- Always use the _for_ HTML attribute (in React: _htmlFor_) to bind the label to the field.
- Always use PermaplanT's _SearchInput_ component to declare search fields instead of declaring them with type _search_.
- Don't use the title attribute for any form fields (see <https://inclusive-components.design/tooltips-toggletips/>)
- All form fields should have the **same styling**:
  - border color: `border-neutral-500 dark:border-neutral-400-dark`
  - border focus: `focus:border-primary-500 dark:focus:border-primary-300`
  - border radius: `rounded-lg`
  - padding: `p-2.5`
  - placeholder: `placeholder-neutral-300`
  - text: `text-sm`

### Error Prevention

- **Validation** errors are detected and shown by using the native input validation of HTML5.
- Use the corresponding _type_ of the input field, e.g. _date_ for date fields, _number_ for numerical-only inputs etc.
- Mark required fields with an asterisk (see above for coloring)
- Use HTML-native _constraint_ attributes for input fields where appropriate, e.g. _maxlength_, _required_, _step_, etc.
- Use short placeholder texts for input fields to show allowed values or further explain the intent of the input field.
- Users should never be required to manually enter a metrical unit or a currency symbol.
  Instead, make the unit part of the input field itself or leave it out if it's clear from the context.
- Submission to the backend should not happen until all fields are verified by the **frontend** logic.
- In case of submissions **on-the-fly** (always except of pages that only consist of a form), the data should always be submitted with **debouncing**.
- **Double submissions** should be correctly **prevented** (not via disabling buttons, as submission via enter or shortcuts still might be possible).

## Consistency

Things with the **same meaning** should **look and behave** the **same** throughout the whole application.
Users should never be uncertain if different words mean the same thing or different actions trigger the same process.

Examples:

- **Main Heading** of a page is always defined by `<h1>` which must be the only one of its kind per page
- **Headings** of all toolbars are always defined by `<h2>`
- If **textual links**, e.g., the links in PermaplanT's navigation bar, need to be surrounded by space, always set their `margin` instead of `padding`.
- Make **call-to-action buttons** look the same everywhere by using our `SimpleButton` component.
  Use Tailwind's classes to define the button's `margin` and `width`, if necessary due to layout or viewport.
- We use `*ToastGrouped` with auto-close and default position (top-right) for information that should be shown as toast.
  Prefer to indicate errors more locally, if possible (like in forms).
- Use the same [**application-specific terms** as shown in the glossary](../architecture/12glossary.md) everywhere when communicating to the user, e.g., always write _PermaplanT_.

## Icons

- A **tooltip** on hovering must be displayed for every icon in PermaplanT's toolbox.
  The tooltip contains the icon's **label** (as concise as possible) and, if existing, the assigned **shortcut** in italics.
- When **active**, i.e. currently activated/enabled, they must get a small **highlighting** through a visually stronger and more colorful appearance by using the design's primary colors.
- When **passive**, i.e. currently not active/enabled, they must must appear in **neutral** colors/colorless.
- When **disabled**, i.e. currently not clickable, they must be **greyed-out**, via decreasing their opacity.  
  The mouse cursor must be styled with the `not-allowed` CSS property.

## Highlighting

Highlighting techniques:

- Font weight:

  - **Bold** text adds tolerable noise to the design and enables distinct highlighting in both short and long texts.
    It is the preferred highlighting technique to use.
    Nevertheless, use it sparingly.
  - _Italic_ text adds minimal noise to the design, but lacks in recognizability.
  - <u>Underlining</u> adds most noise and compromises a text's legibility.
    It should not be used except for links.

- Colors: primary and secondary colors of the design's color palette
  Use the secondary colour only for links.

- Images: users generally remember images better than words

## Wording

Messages shown to the user should strive to fulfill following criteria:

- **concise**: the more text the less likely it will be read by the user
- **clear**: straight to the message's essence
- **understandable** for technical laymen: no status codes or technical terms
- **no exclamation marks**: might come across as commanding
- **no uppercase** words: might come across as shouting
- **detailed** information should be hidden behind a **read more** link or a **collapsed** section
- Headlines, Sub-headlines and Labels should be capitalized
- **Minimize hyphenation** of words
- English: **American English**
- German: **Neue Rechtschreibung**
- use **plural** to avoid gendering, i.e. use _we_/_they_, avoid _he_/_she_

## Error Messages

In general, error messages often convey the impression that an application's stability is weak which, in consequence, leads to a declined user experience.
Error messages should **only** be used if the user, without that information, would be badly surprised by the result of an action.
Always prefer locally given visual indications to error messages.

Error messages should fulfill following criteria:

- **polite** and **neutral**: do not directly or indirectly blame the user and stay away from jokes
- start the message with **Sorry, ...**
- write **personified**, e.g., _I could not find ..._
- **brief**
- **specific** to the problem
- **no technical terms** and error codes
- mention a **reason for the problem** and say _probably_ if not totally sure about the problem
- offer **possible solutions** only, and only if, you are sure about them
- use **colors/formatting** to highlight important passages (see above)
- show via `errorToastGrouped`, for details see above in Consistency

E.g.:  
"Sorry, I **cannot communicate** with my server, there is probably some network problem or the server is down. _Please retry later._"
