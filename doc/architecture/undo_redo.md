# Undo-Redo functionality of the map

The canvas library i.e. `Konva` provides a suggestion on how to implement undo-redo functionality.

## Short Summary

The suggestion is to implement the undo-redo functionality on the frontend side only and sync changes/send the state of the map to the backend on some custom schedule.
On the backend side, we will store a single state of the map in the database and rebuild the map from the scratch on every refresh on the frontend side.
On the frontend side, we will use the `history` array to store the states of the map along with the timestamp of the change, which will allow the user to undo/redo the changes.

https://konvajs.org/docs/react/Undo-Redo.html
https://konvajs.org/docs/data_and_serialization/Best_Practices.html#page-title

## Long Summary

> If you want to save/load simple canvas content you can use the built-in Konva methods: node.toJSON() and Node.create(json). But those methods are useful only in very small apps. In bigger apps it is VERY hard to use those methods. Why? Because the tree structure is usually very complex in larger apps, you may have a lot of event listeners, images, filters, etc. That data is not serializable into JSON (or it is very hard to do that).

In other words, the `Konva` nodes contain too much information than is needed to rebuild the map from the scratch. Instead, we need to store single parameters of the nodes, such as position, size, color, etc.

> You just need to save a history of all the state changes within your app. There are many ways to do this.

The statement above should look the following way in our app:

1. we have a simple rectangle of a default size and color at position (20,20) saved in the database from the user's previous session
2. we rebuild the canvas based on the information from (1)
3. canvas is ready to be used
4. the user moves it to a new position (40,20)
5. we save the new state of the rectangle to the `state` array
6. the user moves it to a new position (60,20)
7. same as (5)
8. the user moves it to a new position (80,20)
9. same as (5)
10. the user undoes the last change
11. we remove the last state from the `state` array
12. now the state of the rectangle is the same as in (6) i.e. rectangle is at position (60,20)
13. the user "saves" the map
14. we send the state of the map to the backend and store it in the database
15. the user refreshes the app
16. we rebuild the canvas based on the information from (14)
17. canvas is ready to be used again

Note: the "saves" action is not necessarily a real action, it is just a way to show that the state of the map is sent to the backend and stored in the database.

## Example of the state of the map on the frontend side

```JSON
{
  "state": [
    {
      "timestamp": 1,
      "stage": {
        "backgroundColor": "0x000000",
        "children": [
          {
            "name": "myRectangle",
            "x": 0,
            "y": 0,
            "children": [
              {
                "name": "myText",
                "x": 0,
                "y": 0,
                "children": []
              }
            ]
          },
          {
            "name": "myCircle",
            "x": 100,
            "y": 100,
            "children": []
          }
        ]
      },
      "layers": {
        "baseLayer": {
          "isEnabled": true,
          "backgroundImage": "http://www.example.com/image.png"
        }
      }
    },
    {
      "timestamp": 2,
      "stage": {
        "backgroundColor": "0x000000",
        "children": [
          {
            "name": "myRectangle",
            "x": 0,
            "y": 0,
            "children": [
              {
                "name": "myText",
                "x": 0,
                "y": 0,
                "children": []
              }
            ]
          },
          {
            "name": "myCircle",
            "x": 100,
            "y": 100,
            "children": []
          }
        ]
      },
      "layers": {
        "baseLayer": {
          "isEnabled": false,
          "backgroundImage": "http://www.example.com/image.png"
        }
      }
    }
  ]
}
```
