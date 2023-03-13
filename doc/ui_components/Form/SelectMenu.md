# SelectMenu

## Description
A dropdown menu that is searchable like a typeahead.

## Props
| Name                | Type                | Optional | Description                                                                                                         |
|---------------------|---------------------|----------|---------------------------------------------------------------------------------------------------------------------|
| isMulti             | boolean             | yes      | When this boolean flag is set to true, the user may select multiple options at once (default false).                |
| id                  | Path<T>             | no       | Unique name of this component.                                                                                      |
| labelText           | string              | yes      | Short description that will be displayed above the input field if set.                                              |
| control             | Control<T, unknown> | yes      | React hook form control (See https://www.react-hook-form.com/api/useform/control/ for further information).         |
| options             | SelectOption[]      | no       | Options that can be selected by the user. I.e. the contents of this component.                                      |
| required            | boolean             | yes      | If set to true, the user has to select an option before the form can be completed (default false).                  |
| placeholder         | string              | yes      | Text that is displayed instead of the input if has been selected yet.                                               |
| handleOptionsChange | (any) => void       | yes      | Callback that is invoked every time the user selects a new option. The only argument repesents the selected option. |
| onChange            | () => void          | yes      | Callback that is invoked if the user performs ANY input. This includes type and click events among others.          |          