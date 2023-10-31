# Frontend Keybindings

This document gives guidelines on how to implement keybindings in the frontend.
Our key handling solution is designed to address the following key constraints:

- **Developer-friendly**: Developers should get an overview where which key binding is assigned.
- **UX**: Collisions between shortcuts which trigger multiple actions at once should be avoided.

### Important notes for Konva Key handling

- since keys cannot be bound directly on konva elements, keyhandlers have to check if the corresponding layer is active to avoid collisions
- if keys should only be active if map is focused, handlers have to be bound to canvas section of the map component

### Keybinding Configuration

The file 'keybindings.json' contains all keybindings that are used in the application and serves the following purpose

- keybindings can easily be changed by editing the file
- Developers have an overview of all keybindings.
- there are different sections for keybindings:
  - global: keybindings that are globally active
  - scopes for specific layers: keybindings that are only active if the corresponding layer is active. this scopes should be named according to the layer name
- Modifier keys are supported. (e.g. Ctrl+k)

Structure:

```
{
  "global": {
    "<<action_name>>": "<<Key-Binding>>"
  }
  "plants_layer": {
    "exitPlantingMode": "Escape"
  }
  ...
}
```

### Keyhandling on Focused Elements

- for components that provide keylisteners and are usually focused on use (e.g. input fields)
- method: add scope to JSON, bind a keyhandler and execute action according to configuration
- if actions of parent components shouldn't be triggered, event propagation must be stopped

Example

```
    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      const action = getActionNameFromKeyEvent(<scope>, event)
      if(action === "doSomething"){
        doSomething();
        event.stopPropagation();
      }
    };
```

### Keyhandling independent of focus

- used if keylistener should be triggered independent of focused HTML element
- method: use custom keybinding hook and pass handlers according to config

Example:

```
const keyHandlerActions: Record<string, () => void> = {
  exitPlantingMode: () => {
    exitPlantingMode();
  },
};

useKeyHandlers(createKeyHandlersFromConfig("planting_layer", keyHandlerActions));
```

- key listener can either be bound on document or on specific node that is passed to hook
- listener is active as long as the component where hook is used is rendered
