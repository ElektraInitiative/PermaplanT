# Timeline: Custom Date Picker Implementation Decision

## Problem

To implement the timeline feature, we require a custom date picker capable of displaying indicators for plant additions and removals.

## Constraints

- Timeline should be user-friendly and intuitive
- event indicators can be shown on the timeline

## Solutions

Initially, the team considered using [ReactCharts](https://react-charts.tanstack.com/), a powerful charting library. However, it is not designed for date selection because of following reasons:

- React-Charts is a robust library for rendering various charts and graphs, but it lacks the precise date selection functionality required for this project.
  Customizing the library for date selection may prove complex and may not deliver the desired user experience.
- React-Charts, designed for data visualization, might introduce unnecessary complexities for date selection.

As a result, we have decided to create custom components for building the timeslider.

## Decision

The custom timeline will consist of following components:

- **Picker Slider:**
  A draggable and scrollable slider where the middle element is the selected one.
  The elements displayed on the slider can also be customized to accommodate event indicators for each date.

- **Date Picker Component:** This component will consist of three sliders for year, month, and day selection.
  It will be responsible for synchronizing the sliders and calculating data for event indicators. Event indicators will be simple bars or divs – a green one for plant additions and a red one for removal – resembling a mini bar chart.

## Rationale

- A dedicated date picker offers a simplified user interface, ensuring intuitive date selection.

- Customization enables us to design a date picker that precisely matches the project's visual style and UI/UX requirements.
  It can seamlessly integrate into the application's design language.

- The custom date picker will employ basic HTML elements for representing event indicators. This approach simplifies event rendering on the date picker, allowing for easy placement and styling of event markers without the need for a comprehensive charting library.
