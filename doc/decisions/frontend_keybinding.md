# Frontend Keybindings

## Problem

In the development of PermaplanT, we have identified the need for a robust keybinding system to enhance the developer experience.
During research we considered to use some npm packages which may be helpful for our use case.

## Constraints

Our keybinding solution should adhere to the following constraints:

- **Ease of Integration**: The keybinding system should be straightforward to integrate into different components of the application.

## Solution

### React-hotkeys

- Link: [react-hotkeys](https://www.npmjs.com/package/react-hotkeys)
- provides a component that receives a keymap and actionhandlers and listens to events if a child of the component is in focus.
- It seems to be very suitable for encapsulating events
- however, it doesn't really solve the challenge of focus konva layers
- and although the library is widely used the last release was 4 years ago.

### React-hotkeys-hook

- Link: [react-hotkeys-hook](https://github.com/JohannesKlauss/react-hotkeys-hook/tree/main)
- provides a hook for binding keys in components and also
- offers scoping abilities.
- however, integration seems not to be as straightforward as with custom solution and so its doesn't really solve a problem for us.

## Decision

- We don't use any of the packages

## Rational

- We already have a custom keybinding hook and currently don't need any of the features provided by the packages.
- the custom hook gives us more flexibility and is easier to integrate into our components.
