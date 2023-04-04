# SimpleModal

## Description

A simple text based modal.

## Props

| Name           | Type              | Optional | Description                                                                                                               |
| -------------- | ----------------- | -------- | ------------------------------------------------------------------------------------------------------------------------- |
| title          | string            | no       | Text that will be displayed in the heading of the modal.                                                                  |
| message        | string            | no       | Text that acts as the main component of the modal.                                                                        |
| setShow        | (boolean) => void | no       | Callback that informs the parent when the modal should be hidden/displayed (e.g. when the user pressed the close button). |
| show           | boolean           | no       | Decides whether the modal should be shown.                                                                                |
| cancelBtnTitle | string            | yes      | Label text for the cancel button. The cancel button will only be displayed if this prop is set.                           |
| submitBtnTitle | string            | no       | Label text for the submit button.                                                                                         |
| onCancel       | () => void        | yes      | Click callback for cancel button. Can only be called if cancelBtnTitle is set.                                            |
| onSubmit       | () => void        | no       | Click callback for submit button.                                                                                         |
