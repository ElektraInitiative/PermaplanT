# Frontend Keybindings

This document gives guidelines on how to implement keybindings in the frontend.

### Keybinding Configuration

The file 'keybindings.json' contains all keybindings that are used in the application and serves the following characteristics:

- keybindings can easily be changed by editing the file
- developers have an overview of all keybindings
- there are different sections for keybindings:
  - global: keybindings that are globally active
  - Scopes for specific layers:
    Keybindings that are only active if the corresponding layer is active.
    These scopes should be named according to the layer name, postfixed with `_layer`.
  - _just_for_documentation_:
    Keybindings that are only used for documentation purposes since the keybinding is hardcoded in the component.
    For example, the search field can be cleared by pressing the Escape key, which is typically a native browser action and should not be configurable in the keybindings file.
- modifier keys are supported (Shift, Alt, Ctrl, Meta)
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
- method: add scope to JSON, bind a keyhandler and execute action according to configuration
- if actions of parent components shouldn't be triggered, event propagation must be stopped

Example:

```
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
- method: use custom keybinding hook and pass handlers according to config

Example:

```
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

- key listener can either be bound on document or on specific node that is passed to hook
- listener is active as long as the component where hook is used is rendered

### Important Notes for Konva Key Handling

- since keys cannot be bound directly on konva elements, keybinding have to check if the corresponding layer is active to avoid collisions
- if keys should only be active if map is focused, handlers have to be bound to canvas section of the map component

## Further Readings

- [Keyhandling Decision](../decisions/frontend_keyhandling.md)
