# Frontend Usability

These guidelines should help improving the usability of the PermaplanT web application going forward.  
A better usability can be achieved by simplifying existing processes and sometimes also by improving the design of the application's user interface.  
This often results in an overall better user experience too.  
The discussed usability improvement ideas and proposed solutions stem from analyzing a PermaplanT user study on one hand, and general usability best practices on the other.

## What is Usability

Usability describes the ease for a user to perform a certain task in an application.
Improving upon usability can be achieved by creating processes and adding features, which simplify and reduce the steps it takes a user to accomplish what he intended to.

## What is a User Interface (UI)

A UI is the touchpoint between a user and the application and is represented by all the visual elements.
Improving the UI makes an application user-friendlier so that its users can more easily and intuitively find their way through it.

## What is User Experience (UX)

UX describes the emotions a user goes through while using an application.
Both usability and the UI are crucial aspects to consider when trying to increase the UX.

### Usability

The user study participants' biggest pain points as well as general problems regarding usability will be described and handled here.

#### Copy & Paste

#### Multi-Select

#### Restore View and Settings from Last Visit

#### Draw Areas of Plants

#### Navigating the Map By Mouse

#### Required Actions in Guided Tour

### UI

Here, general UI problems, as well as design elements which caused the biggest confusion for the user study participants, will be discussed and solved.

#### Search Input

##### Problem

Using an **input field** of type **search** results in browsers automatically showing a cross icon inside that input field which, upon clicking or, alternatively, by using the _ESC_ key, resets the entered search term.  
That cross icon's visibility is toggled depending on the current search term's length, i.e. the icon gets hidden if the input field is empty, otherwise it will be shown.  
Out of the three major browsers _**Safari**_, _**Chrome**_ and Firefox, it is only _**Firefox**_ which is still **missing** this out-of-the-box feature.  
In general, its all the browsers based on either the _WebKit_ or the _Chromium_ engine (that includes _Microsoft Edge_), which are offering this search feature.

##### Solution

The solution is to **not declare** input fields with **type _search_**, to prevent browsers from adding their own cross icon into search input fields.  
Instead, we should **use** our **SearchInput** component which renders its own cross icon, together with a search icon and the input field itself.  
It has following **behavior** and **functionality**:

- The cross icon will be shown if there is any search term entered into the input field, and hidden otherwise.
- Clicking on the cross icon will reset the current search term and keep the focus on the input field, so the user can continue typing.
- Pressing the _ESC_ key likewise resets the current search term and keeps the focus on the input field.
- The _SearchInput_ component exposes a method which enables parent components to set the focus on it, besides that it is fully encapsulated, i.e. it hides all its DOM nodes from the outside.

#### Plants Size Difference
