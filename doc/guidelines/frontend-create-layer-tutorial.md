# Creating a New Layer in Frontend

This document gives guidelines on how to implement a new layer in the frontend.

## Folder Structure

- Navigate to the `layers` directory in your project (`features/map_planning/layers`).
- Create a new folder named after the type of layer you want to add (e.g., "NewLayer").

## Add Necessary Files and Folders

- Inside the "NewLayer" folder:
  - If your layer requires API interactions, create an `api` folder and place your .ts files in there or place them into the map_planning api folder depending on wheter its a special api that is part of the layer or its just for initiating the layer in general.
  - For React components or custom hooks specific to this layer, add a `components` or `hooks` folder.
  - Create a main TypeScript file for the layer (e.g., `NewLayer.tsx`).

## Define the Layer Component

- In `NewLayer.tsx`:
  - Import Konva and other dependencies.
  - Define a functional component that returns a Konva `Layer`.
- In `mapEditorHookApi.ts`:
  - Define a hook for your layer (e.g., `useNewLayer.tsx`).
  - Add states that need be saved across components.
  - Add init function (e.g., `initNewLayer`) which is then defined inside the `TrackedMapStore.ts`.

## Implement Layer Logic

- Use hooks (starting with `use` in the name) and the global MapStore (tracked & untracked) to manage state and interactions.
  - **Tracked** is used for storing changes that can be rolled back with undo/redo.
  - **Untracked** containes all other states that are not affected by this.
- Ensure proper interaction with other layers and elements.

## Test Your Layer

- Write tests for hooks if feasable/useful (see plant/hooks) to verify functionality.
  - Especially if side effects or wrong behaviour can not be easily seen in manual tests!
