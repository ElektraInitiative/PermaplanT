# SimpleFormInput

## Description
Textfield that can be used for single line or multi-line input.

## Props
| Name                | Type                   | Optional | Description                                                                                                       |
|---------------------|------------------------|----------|-------------------------------------------------------------------------------------------------------------------|
| id                  | Path<T>                | no       | Unique name of this component.                                                                                    |
| labelText           | String                 | no       | Short description that will be displayed above the input field if set.                                            |
| isArea              | boolean                | yes      | If true, multi line text input will be enabled (default false).                                                   | 
| required            | boolean                | yes      | If true, the user will not be able to submit the form when no input was provided (default false).                 |
| type                | HTMLInputTypeAttribute | yes      | The type of input that should be accepted by this input field (number, text, time, etc. default:'text')           |
| min                 | number                 | yes      | Only applies if *type* is "number". The Input must be greater than or equal to this value.                        |
| max                 | number                 | yes      | Only applies if *type* is "number". The Input must be less than or equal to this value.                           | 
| register            | UseFormRegister<T>     | yes      | React hook form register. See https://www.react-hook-form.com/api/useform/register/ for details.                  | 
| onChange            | () => void             | yes      | Callback that is invoked if the user changes the text field (e.g. after adding a new character).                  | 
| valueAsNumber       | boolean                | yes      | Only applies if *type* is "number". Indicates that the value should be returned as a number type. (default false) |
| errorTitle          | string                 | yes      | Will be applied to the html title attribute of the textfield.                                                     |  