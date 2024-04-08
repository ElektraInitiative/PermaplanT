# Frontend API Calls

These guidelines outline best practices for making API calls using React-Query within our project.

## What is React-Query?

[React-Query](https://react-query.tanstack.com/) is a library that provides hooks and utilities for managing, caching, and synchronizing asynchronous and remote data in React applications.

## Basic Concepts

When integrating React-Query for API calls, consider the following guidelines:

### Query keys

- Query keys are crucial for React-Query to manage caching and data fetching efficiently.
  They also play a crucial role in how queries get invalidated after a mutation.
- Use meaningful and unique query keys to identify each API call.
- Have a look at following guidelines: <https://tanstack.com/query/v3/docs/framework/react/guides/query-keys> and <https://tkdodo.eu/blog/effective-react-query-keys>

#### Example

```ts
const useUserData = (userId) => {
  return useQuery(["user", userId], fetchUserData);
};
```

### Local Error handling

Errors can be handled locally by using `isError` flag from `useQuery`:

```ts
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
- The error will be handled by the global onError function defined in `@/config/react_query/index.ts`.
- Related blog post: <https://tkdodo.eu/blog/breaking-react-querys-api-on-purpose#a-bad-api>

```ts
const { data, isLoading } = useQuery(["files", path], {
  queryFn: () =>
    (webdav as WebDAVClient).getDirectoryContents("/remote.php/webdav/" + path),
  meta: {
    errorMessage: t("fileSelector:error"),
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

### Scalable Approach

The above examples are useful for understanding how react-query works and for one-off api calls that are just made from a single point in the code.
A scalable approach is to define per feature a query-key factory:

```ts
const USER_KEYS = {
  _helpers: {
    all: [{ entity: "user" }] as const,
    details: () =>
      [{ ...USER_KEYS._helpers.all[0], scope: "details" }] as const,
  },
  detail: (userId: string) =>
    [{ ...USER_KEYS._helpers.details()[0], userId }] as const,
};
```

and to use it like this in queries:

```ts
const useUserData = (userId) => {
  return useQuery({
    queryKey: USER_KEYS.detail(userId), // use the query key for user detail
    queryFn: userDataQueryFn,
  });
};

function userDataQueryFn({
  queryKey,
}: QueryFunctionContext<ReturnType<USER_KEYS["detail"]>>) {
  const { userId } = queryKey; // type safe destructuring, makes sure query key and arguments do not diverge

  return fetchUserData(userId);
}
```

With the above example a user detail query key would have the following structure.

```json
[
  {
    "entity": "user",
    "scope": "detail",
    "userId": 1
  }
]
```

Such a structure allows invalidation on different levels.
For example invalidating all queries that concern the user entity, or all queries that concern the user details or a single user detail query.

A mutation that updates a single user resource on the backend, can then easily invalidate the respective query like so:

```ts
const useUpdateUserData(updateUserDto) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFunction: () => updateUserData(updateUserDto),
    onSuccess: () => queryClient.invalidateQueries(USER_KEYS.detail(updateUserDto.userId)), // invalidates all queries that match the query key
  })
}
```

#### Further reading

- <https://tkdodo.eu/blog/effective-react-query-keys>
- <https://tkdodo.eu/blog/leveraging-the-query-function-context>

#### Deep Dive (whole blog series)

- <https://tkdodo.eu/blog/practical-react-query>
