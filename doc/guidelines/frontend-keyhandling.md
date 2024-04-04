# Frontend Keybindings

This document gives guidelines on how to implement keybindings in the frontend.

### Keybinding Configuration

The files `config/keybindings/keybindings_windows_linux` and `config/keybindings/keybindings_macos` contains all keybindings that are used in the application and serves the following characteristics:

- for all features add commonly-used and vim-like bindings
- we generally try to provide several keybindings for the same functionality, to make the functionality easier accessible
- there are different sections for keybindings:
  - `global`: keybindings that are globally active
  - Scopes for specific layers:
    Keybindings that are only active if the corresponding layer is active.
    These scopes should be named according to the layer name, postfixed with `_layer`.
  - `_just_for_documentation_`:
    Keybindings that are only used for documentation purposes since the keybinding is hardcoded in the component.
    For example, the search field can be cleared by pressing the Escape key, which is typically a native browser action and should not be configurable in the keybindings file.
- modifier keys are supported:
  - Windows and Linux: Shift, Ctrl, Alt, Meta
  - macOS: Shift, Ctrl, Opt, Cmd
  - they can be used in combination with other keys by using the '+' sign (e.g. 'Alt+P', 'Shift+A')
- multiple keybindings can be assigned to one action

Structure:

```json
{
  "global": {
    "<<action_name>>": ["<<Key-Binding>>", "..."]
  },
  "base_layer": {
    "<<action_name>>": ["<<Key-Binding>>", "..."]
  },
  "plants_layer": {
    "exitPlantingMode": ["Escape"]
  },
  "_just_for_documentation_": {
    "clearSearch": ["Escape"]
  }
}
```

### Keyhandling on Focused Elements

- for components that provide keylisteners and are usually focused on use (e.g. input fields)
- method:
  1. add keybinding to json configuration for the corresponding action
  2. bind a keyhandler to the component that should handle the key event if focused
  3. retrieve the action name configured for the pressed shortcut using helper methods from `config/keybindings/keybindings.ts`
  4. trigger the corresponding action
- if actions of parent components shouldn't be triggered, event propagation must be stopped

Example:

```typescript
    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      const action = getActionNameFromKeyEvent(<scope>, event);
      if(action === "doSomething"){
        doSomething();
        event.stopPropagation();
      }
    };
```

### Keyhandling Independent of Focus

- used if keylistener should be triggered independent of focused HTML element
- method:
  1.  add keybinding to json configuration for the corresponding action
  2.  create action handlers that maps the action name to the corresponding function that should be triggered
  3.  use `createKeyHandlersFromConfig` helper method from `config/keybindings/keybindings.ts` to create map of shortcuts to action handlers according to config
  4.  use custom keybinding hook `hooks/useKeyHandlers` to bind keyhandlers to document or specific node

Example:

```typescript
const keyHandlerActions: Record<string, () => void> = {
  exitPlantingMode: () => {
    exitPlantingMode();
  },
};

//use or custom hook to bind keyhandlers
useKeyHandlers(
  createKeyHandlersFromConfig("planting_layer", keyHandlerActions)
);
```

- listener is active as long as the component where hook is used is rendered

### Important Notes for Konva Key Handling

- since keys cannot be bound directly on konva elements, keybinding have to check if the corresponding layer is active to avoid collisions
- if keys should only be active if map is focused, handlers have to be bound to canvas section of the map component

## Further Readings

- [Keyhandling Decision](../decisions/frontend_keyhandling.md)
