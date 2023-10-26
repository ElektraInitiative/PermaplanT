# Frontend Keybindings

## Problem

In the development of PermaplanT, we have identified the need for a robust keybinding system to enhance the user experience. Keybindings are utilized in various parts of the application, and we need to establish a cohesive approach for their implementation.

## Constraints

Our keybinding solution should adhere to the following constraints:

- **Ease of Integration**: The keybinding system should be straightforward to integrate into different components of the application.
- **Developer-friendly**: Developers should get an overview where which key binding is assigned.
- **UX**: Keybindings should not lead to unwanted sideeffects.

## Solution

Following questions have been tackled during conception:

- **How do we configure keybindings?**

  There should be a single source of truth and it should be easy to understand for developers

- **Where do we add key listeners?**

  While it's easy to add key listeners to focused components like form inputs, it becomes more challenging when dealing with a component like the Konva map.
  This is because we cannot directly bind keys to the map layer.

#### Interesting npm package

During research following npm package was found:

[react-hotkeys-hook](https://github.com/JohannesKlauss/react-hotkeys-hook/tree/main)

- It provides a hook for binding keys in components and also
- offers scoping abilities.

## Decision

### Keybinding Configuration

A json file contains all keybindings that are used in the application and serves the following purpose

- keybindings can easily be changed by editing the file
- developers have overview of all keybindings

Example Structure:

```
{
  "global": {
    "navigateToMap": "Ctrl+m"
  }
  "planting": {
    "exitPlantingMode": "Escape"
    "search":{
      "clearSearch": "Escape"
    }
  }
}
```

- keybindings are scoped.
- there can also be nested scopes
- keys can be combined with '+'

### Keyhandling on focused elements

- for components that provide keylisteners and are usually focused on use (e.g. input fields)
- method: add scope to json, bind a keyhandler and execute action according to configuration
- if actions of parent components shouldn't be triggerd, event propagation must be stopped

Example

```
    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      const action = getActionNameFromKeyEvent("planting.search", event)
      if(action === "clearSearch"){
        resetSearch();
        event.stopPropagation();
      }
    };
```

### keyhandling independent of focus

- if keylistener should be triggered independent of focused html elemnt
- method: use custom keybinding hook and pass handlers according to config

Example:

```
const keyHandlerActions: Record<string, () => void> = {
  exitPlantingMode: () => {
    exitPlantingMode();
  },
};

useKeyHandlers(createKeyHandlersFromConfig(KEYBINDING_SCOPE_PLANTING, keyHandlerActions));
```
