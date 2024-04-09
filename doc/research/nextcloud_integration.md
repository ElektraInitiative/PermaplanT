# Nextcloud Integration

## Authentication Setup

Keycloak and Nextcloud run as separate services.
Users are created in Keycloak instead of in Nextcloud/PermaplanT and users can then log in via Keycloak.
In the PermaplanT frontend the user is redirected to the Keycloak login screen.
They are prompted for their credentials and then they get redirected back to the PermaplanT web application.
From then on all requests are authorized via JWT.
We use the recommended variant which is Authorization Code Flow with PKCE.
This and other variants are described in detail in the OAuth2.0 specification.
The backend then validates the tokens and extract roles/user information.
The same token is used to fetch resources from Nextcloud.

To enable the OIDC functionality on Nextcloud we installed a plugin called [user_oidc](https://github.com/nextcloud/user_oidc) developed by Nextcloud.
With this plugin OIDC providers can be configured in Nextcloud.
After successful configuration the provider appears on the login screen and the user can log in with their credentials from the provider.

## Files

### WebDAV Protocol

> "WebDAV (Web Distributed Authoring and Versioning) is a set of extensions to the
> Hypertext Transfer Protocol (HTTP), which allows user agents to collaboratively
> author contents directly in an HTTP web server by providing facilities for concurrency
> control and namespace operations, thus allowing Web to be viewed as a writeable,
> collaborative medium and not just a read-only medium."
> [wikipedia](https://en.wikipedia.org/wiki/WebDAV)

### Access Files

Nextcloud implements the webDAV protocol. This means that we can access files in Nextcloud with any webdav client.
There are popular file managers like 'Konqueror' from the KDE team and 'GNOME Files' from the GNOME team which implement the webDAV protocol.
However webDAV is not exclusive to file managers.
In PermaplanT we use a Javascript library named [webdav](https://github.com/perry-mitchell/webdav-client) to access files in Nextcloud.
For files available on public shares we send the requests directly with axios.

Public shares are directories where a public link is created.
The last part of the link is the share token.
E.g. for the URL 'https://cloud.permaplant.net/s/2arzyJZYj2oNnHX' the share token is '2arzyJZYj2oNnHX'.
This share token can be used as username and password to access files from the directory.
Files at the top level as well as files in subdirectories can be accessed using the share token.
E.g. when following directory structure is given:

```bash
nextcloud_root_dir
├── Documents
│   └── secret-doc.txt
├── Photos
└── Public
    ├── Icons
    │   ├── add.svg
    │   └── delete.svg
    ├── Maps
    │   └── map.json
    └── Pictures
        └── tree.png
```

and the directory 'Public' is accessed with the share token.
All files ('add.svg', 'delete.svg', 'map.json', 'tree.png') in all subdirectories ('Icons', 'Maps', 'Pictures') of 'Public' can be accessed.
The path for fetching a file starts at the shared directory, in this case 'Public'.
To access the file 'add.svg' following URI is used: 'https://cloud.permaplant.net/public.php/webdav/Icons/add.svg'.
The first part: 'https://cloud.permaplant.net/' is the scheme and host for our Nextcloud instance.
The next part `/public.php/webdav/` is the endpoint used to access files from the public share directory specified by the share token.
The share token is given as username and password in the request.
The last part 'Icons/add.svg' is the path to the requested file starting from the public share directory.

When we want to fetch `add.svg`, we use the following request:

```bash
curl -X GET -O -u 2arzyJZYj2oNnHX:2arzyJZYj2oNnHX https://cloud.permaplant.net/public.php/webdav/Icons/add.svg
```

In PermaplanT we use the public shares for data which should be accessible by unauthenticated users.
E.g. images on the landing page or icons for plants.

To fetch resources from directories which are not available for the public some form of authentication has to be used.
The easiest way to authenticate with the Nextcloud instance is to use the username and password in the request. This is called basic authentication.
However, this is not secure when the requests are sent from the browser as this information can be easily sniffed.
So we decided to use 'OpenID Connect' for authentication.
Details on why we decided to use 'OpenID Connect' can be found in the [decision document](https://github.com/ElektraInitiative/PermaplanT/blob/master/doc/decisions/auth.md).

All we need to know here is that requests from authenticated users are populated with the access token in the Authorization header.

Now we can make requests against the '/remote.php/webdav' endpoint.
This endpoint enables us to fetch files starting from the root directory of the logged in user.
Given the previously defined directory structure we can now access the file 'secret-doc.txt' with the following URI: 'https://cloud.permaplant.net/remote.php/webdav/Documents/secret-doc.txt'

### Directory Structure

In the PermaplanT Nextcloud instance we have following directory structure for each user:

```bash
PermaplanT/
└── Maps
    ├── map_01
    │   ├── BaseLayer
    │   │   └── base_layer_image.png
    │   └── PhotoLayer
    │       ├── photo1.jpg
    │       └── photo2.jpg
    └── map_02
        ├── BaseLayer
        │   └── base_layer_image.png
        └── PhotoLayer
            ├── photo1.jpg
            └── photo2.jpg
```

When a PermaplanT map is shared between different users the corresponding Nextcloud directory has to be shared as well.
When a directory is shared in Nextcloud it gets added to users root directory (if not configured otherwise).
We have to move the newly added directory to the correct place in the hierarchy after it was added.

Each map directory must have a globally unique name to avoid conflicts with shared maps.
The name of each map directory is the same as the name of the map in the PermaplanT database.
This insures that the name is unique because the name in the database is unique.

The location of public directories does not matter as they are identified by the public share token.
They are not visible to all of the users in Nextcloud, so they are not included in the directory hierarchy above.

### Shares and Permissions

When we want to add additional members to our PermaplanT map we also have to share the Nextcloud resources with them.
To share and manage permissions on Nextcloud directories we generally use [Nextcloud Circles](https://github.com/nextcloud/circles).
The major difference to groups is that Circles can be created by normal users while groups need higher privileges to manage.

Unfortunately the Circles API is not well documented.
The implementation of the API can be found on the corresponding [github repository](https://github.com/nextcloud/circles/blob/22238597fb9045e748119247fceaac7321f0a31e/appinfo/routes.php).

First we need to create a Circle.
This can be achieved by following API call:

```json
"method": "POST",
"headers": [
  "OCS-APIRequest": true,
  "Content-Type": "application/json"
],
"body": {
  "name": "map_01",
  "personal": false,
  "local": false
},
"scheme":	"https",
"host": "cloud.permaplant.net",
"filename": "/ocs/v2.php/apps/circles/circles"
```

The name of the Circle is the same as the name of the map.
Now the Circle has to be added to the shares for the map directory.
This can be done with the OCS Share API which is documented [here](https://docs.nextcloud.com/server/latest/developer_manual/client_apis/OCS/ocs-share-api.html).
Following API call can be used:

```json
"method": "POST",
"headers": [
  "OCS-APIRequest": true
],
"body": {
  "path": "PermaplanT/Maps/map_01",
  "shareType": 7,
  "permissions": 31,
  "shareWith": "<circleId>"
},
"scheme":	"https",
"host": "cloud.permaplant.net",
"filename": "/ocs/v2.php/apps/files_sharing/api/v1/shares"
```

The argument `shareType` specifies what kind of share we want to create.
The options are:

- 0 = user
- 1 = group
- 3 = public link
- 4 = email
- 6 = federated cloud share
- 7 = circle
- 10 = Talk conversation

We chose 7 to share the directory with the newly created Circle.

If not specified the permissions for the share are set to 31 which means all.
If we want to have more granular control of the permission we can set the `permissions` parameter to one of these values:

- 1 = read
- 2 = update
- 4 = create
- 8 = delete
- 16 = share
- 31 = all

If we want even more granular permission control we can set the permissions for each layer directory individually.

To remove a share we use following request:

```json
"method": "DELETE",
"headers": [
  "OCS-APIRequest": true
],
"scheme":	"https",
"host": "cloud.permaplant.net",
"filename": "/ocs/v2.php/apps/files_sharing/api/v1/shares/<share_id>"
```

And to update a share we use:

```json
"method": "PUT",
"headers": [
  "OCS-APIRequest": true
],
"body": {
  "permissions": 1
},
"scheme":	"https",
"host": "cloud.permaplant.net",
"filename": "/ocs/v2.php/apps/files_sharing/api/v1/shares/<share_id>"
```

Note that we can only update one value at a time with the PUT request.

### React Components

There are a number of components which help with interacting with Nextcloud files.

#### Image Components

There are four components that handle fetching and displaying images from Nextcloud.

- NextcloudImage: This component fetches an image from the user directory in Nextcloud and renders it.
- PublicNextcloudImage: This component fetches and renders an image from a public share.
- NextcloudKonvaImage: This component fetches an image from the user directory in Nextcloud and creates a shape for Konva (Canvas library used in PermplanT).
- PublicNextcloudKonvaImage: This component fetches an image from the Nextcloud public share and creates a shape for Konva.

#### File Selection

Component which shows the content of a Nextcloud directory and lets the user choose a file.

Will be implemented in #475.

### Further Related Resources

- https://docs.nextcloud.com/server/latest/developer_manual/client_apis/WebDAV/comments.html
- https://docs.oracle.com/cd/E12839_01/portal.1111/e10235/webdav007.htm#POUSR1607
- https://docs.nextcloud.com/server/25/user_manual/en/files/access_webdav.html#
- http://www.webdav.org/specs/rfc4918.html

## Limitations

### CORS (Cross-Origin Resource Sharing)

> "CORS is an HTTP-header based mechanism that allows a server to indicate any origins (domain, scheme, or port) other than its own from which a browser should permit loading resources."
> -- [Mozilla MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

Nextcloud offers no options to change the CORS configuration.
This means that all requests coming from a different origin than the one Nextcloud is hosted on are blocked.

The PermaplanT production environment has following structure:

- Frontend: "https://www.permaplant.net".
- Backend: "https://www.permaplant.net/api"
- Nextcloud: "https://cloud.permaplant.net"
- Keycloak: "https://auth.permaplant.net/realms/PermaplanT"

This means the origin for Nextcloud differs from the origin of the PermaplanT frontend.
Consequently CORS has to be configured to allow requests from the frontend origin otherwise the requests to Nextcloud are blocked by the browser.
To circumvent the restrictions or the lack of configuration options by Nextcloud we implemented a proxy in front of the Nextcloud instance which sets the needed headers for the OPTIONS preflight which is performed by the browser.

## Research about other Nextcloud Features

### calendar

Nextcloud Calendar App is a frontend for the Nextcloud CalDAV backend.

#### resources

- [CalDavBackend](https://github.com/nextcloud/server/blob/master/apps/dav/lib/CalDAV/CalDavBackend.php) implementation
- [CalDAV](https://www.rfc-editor.org/rfc/rfc4791.html)

### Contacts

Contacts are stored in vCards and can be managed with CardDAV.
nextcloud/contacts is based on [sabredav](https://github.com/sabre-io/dav)(most popular WebDAV framework for PHP)
nextcloud/contacts implements CardDAV:

> "vCard Extensions to WebDAV (CardDAV) is an address book client/server
> protocol designed to allow users to access and share contact data on a server.
> CardDAV is based on WebDAV, which is based on HTTP, and it uses vCard for contact data.(2)"
> [wikipedia](https://de.wikipedia.org/wiki/CardDAV)

- https://apps.nextcloud.com/apps/contacts
- [github repository](https://github.com/nextcloud/contacts)
- https://github.com/nextcloud/contacts/blob/main/lib/Dav/PatchPlugin.php
- [CardDAV clients](https://devguide.calconnect.org/CardDAV/Client-Implementations/)
- [CardDAV libraries](https://devguide.calconnect.org/CardDAV/libraries/)

### Groups

Groups are part of the user management and not to be confused with circles.
While circles offer similar functionality, they are more versatile and can be created by all users while groups can only be created by admins.

### Circles API

API test with curl (USERNAME, PSWD and BASE_URL have to be set):

```bash
curl -u USERNAME:PSWD -X GET 'https://BASE_URL/nextcloud/ocs/v2.php/apps/circles/circles' -H "OCS-APIRequest: true"
```

This returns a list of circles visible to the authenticated user.

Working API calls (tested with NC version 25.0.4-1~deb11):

- add member

```bash
curl -u USERNAME:PSWD -X POST 'https://BASE_URL/nextcloud/ocs/v2.php/apps/circles/circles/CIRCLE_ID/members/multi' -H "OCS-APIRequest: true" -H "Content-Type: application/json" -d '{"members":[{"id":"USER_ID","type":1}]}'
```

- create circle

```bash
curl -u USERNAME:PSWD -X POST 'https://BASE_URL/nextcloud/ocs/v2.php/apps/circles/circles' -H "OCS-APIRequest: true" -H "Content-Type: application/json" -d '{"name":"test_circle_3","personal":false,"local":false}'
```

- delete member from circle

```bash
curl -u USERNAME:PSWD -X DELETE 'https://BASE_URL/nextcloud/ocs/v2.php/apps/circles/circles/CIRCLE_ID/members/MEMBER_ID' -H "OCS-APIRequest: true"
```

- get circles

```bash
curl -u USERNAME:PSWD -X GET 'https://BASE_URL/nextcloud/ocs/v2.php/apps/circles/circles' -H "OCS-APIRequest: true"
```

- get members

```bash
curl -u USERNAME:PSWD -X GET 'https://BASE_URL/nextcloud/ocs/v2.php/apps/circles/circles/CIRCLE_ID/members' -H "OCS-APIRequest: true"
```

#### resources

- https://docs.nextcloud.com/server/stable/admin_manual/configuration_server/occ_command.html#http-user-label
- https://github.com/nextcloud/circles
- [Circle routes](https://github.com/nextcloud/circles/blob/22238597fb9045e748119247fceaac7321f0a31e/appinfo/routes.php)

### Maps

The maps Nextcloud plugin offers a REST API. The documentation can be found [here](https://github.com/nextcloud/maps/blob/master/openapi.yml).

The GET endpoint /favorite was tested with curl and basic authentication:

```bash
curl -u USERNAME:PSWD -X GET 'https://BASE_URL/nextcloud/index.php/apps/maps/api/1.0/favorites'
```

### Chat

sending a message:

```rust,ignore
// sends once, Err if it does not work on network or nextcloud level
fn send_message (
	&self,
	message: String,
	chat: String,
) -> Result<reqwest::Response, reqwest::Error> {
	let mut headers = header::HeaderMap::new();
	headers.insert("Content-Type", "application/json".parse().unwrap());
	headers.insert("Accept", "application/json".parse().unwrap());
	headers.insert("OCS-APIRequest", "true".parse().unwrap());

	let result = reqwest::Client::new()
		.post(&format!(
			"{}/ocs/v2.php/apps/spreed/api/v1/chat/{}",
			&self.url, chat
		))
		.basic_auth(&self.user, self.pass.as_ref())
		.headers(headers)
		.body(format!(
			"{{\"token\": \"{}\", \"message\": \"{}\"}}",
			chat, message
		))
		.send();
	match result {
		Ok(response) => match response.error_for_status() {
			Ok(response) => Ok(response),
			Err(error) => Err(error),
		},
		Err(error) => Err(error),
	}
}
```

or via CURL:

```bash
curl -sS -d "{\"token\": \"$CHAT\", \"message\": \"$*\"}" -H "Content-Type: application/json" -H "Accept: application/json" -H "OCS-APIRequest: true" -u "user:password" https://nextcloud.markus-raab.org/nextcloud/ocs/v2.php/apps/spreed/api/v1/chat/$CHAT
```
