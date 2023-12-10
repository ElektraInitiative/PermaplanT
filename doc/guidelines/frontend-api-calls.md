# Frontend API Calls

These guidelines outline best practices for making API calls using React-Query within our project.

## What is React-Query?

[React-Query](https://react-query.tanstack.com/) is a library that provides hooks and utilities for managing, caching, and synchronizing asynchronous and remote data in React applications.

## Basic Usage

When integrating React-Query for API calls, consider the following guidelines:

### Query keys

- Use meaningful and unique query keys to identify each API call. The query key is crucial for React-Query to manage caching and data fetching efficiently.
- Have a look at following guidelines: <https://react-query.tanstack.com/docs/guides/query-keys> and <https://tkdodo.eu/blog/effective-react-query-keys>

#### Example

```javascript
const useUserData = (userId) => {
  return useQuery(["user", userId], fetchUserData);
};
```

### Local Error handling

Errors can be handled locally by using `isError` flag from `useQuery`:

```javascript
const UserProfile = () => {
  const { data, isError } = useQuery("userData", fetchUserData);

  if (isError) {
    // Render UI for error state
    return <div>Error fetching data</div>;
  }

  // Render UI for successful data fetch
  return <div>{data}</div>;
};
```

### Global Error Callbacks

- If a toast message should be shown use meta information for passing error message.
- The error will be handeled by QueryCache defined in `Providers.tsx`.
- Related blog post: <https://tkdodo.eu/blog/breaking-react-querys-api-on-purpose#a-bad-api>

```javascript
const { data, isLoading } = useQuery(['files', path], {
    queryFn: () => (webdav as WebDAVClient).getDirectoryContents('/remote.php/webdav/' + path),
    meta: {
      errorMessage: t('fileSelector:error'),
    },
  });
```

#### Further reading

- <https://tkdodo.eu/blog/react-query-error-handling>

### Mutation

- Use mutations for data modification operations (POST, PUT, DELETE).
- Mutations automatically handle the asynchronous process, providing a clean and consistent way to update data.

#### Example

```javascript
const addFile = useMutation({
    mutationFn: (file: FileOptions) => {
      return (webdav as WebDAVClient).putFileContents(
        WEBDAV_PATH + file.path + '/' + file.name,
        file.buffer,
      );
    },
    onError: () => {
      errorToastGrouped(t('uploadFile:upload_error'));
    },
    onSuccess: (data, variables, context) => {
      toast.success(variables.name + ' successfully uploaded!');
      if (onSuccess) {
        onSuccess(data, variables, context);
      }
    },
  });
```
