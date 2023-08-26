# Frontend

## Development Setup

- Use a Tailwind CSS linter (code plugin) if you write CSS
- Use Storybook to develop components

## Source Code Best Practices

We use [Bulletproof React](https://github.com/alan2207/bulletproof-react) with following specialisations/exceptions:

- We use `camelCase` in file names and identifiers.
- We use absolute imports.
- We use minimal number of packages: need to be noted in solutions or in a decision
- Be thoughtful of memory consumption and runtime
- Use debounce hook as in `PlantingAttributeEditForm.tsx`
- Use react-query correctly with constant strings, see <https://tkdodo.eu/blog/thinking-in-react-query>
- Always validate form, use `zod` for more complicated validations
- Wrap APIs using `create*API` in `api` folder
- Be careful in writing hooks, especially when using `useEffect`
- Error Handling <https://tkdodo.eu/blog/breaking-react-querys-api-on-purpose#a-bad-api>
- Lists are called `*List` and items of such a list are called `*ListItem`, e.g., `LayerList` and `LayerListItem` for a list of layers
- We reuse a global http client like this: `let server = HttpServer::new(move || { App::new() /*other initialization code*/ .app_data(http_client.clone()) })`

## Incorporate Accessibility Best Practices

Writing code that is highly accessible and easily testable should be a priority whenever possible.
While it may not always be the primary focus, if you can achieve both goals simultaneously, it's worth pursuing that path.
Additionally, many accessibility best practices are inherent in standard coding practices, such as using appropriate HTML elements like h1s, button tags, providing alt attributes for images and using appropriate ARIA [roles](https://www.w3.org/TR/wai-aria-1.2/#roles) and [attributes](https://www.w3.org/TR/wai-aria-1.2/#aria-attributes).
