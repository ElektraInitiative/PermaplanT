# Nextcloud research

## Files

Nextcloud implements the webDAV protocol. This means that we can access files in Nextcloud with any webdav client.
There are popular file managers like 'Konqueror' from the KDE team and 'GNOME Files' from the GNOME team which implement the webDAV protocol.
However webDAV is not exclusive to file managers. 
In PermaplanT we use a javascript library named [webdav](https://github.com/perry-mitchell/webdav-client) to access files in Nextcloud. 
For files available on public shares we send the requests directly with axios.

Public shares are directories where a public link is created.
The last part of the link is the share token. E.g. For the URL 'https://cloud.permaplant.net/s/2arzyJZYj2oNnHX' the share token is '2arzyJZYj2oNnHX'.
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
The next part '/public.php/webdav/' is the endpoint used to access files from the public share directory specified by the share token.
The share token is given as username and password in the request.
The last part 'Icons/add.svg' is the path to the requested file starting from the public share directory.

When we want to fetch 'add.svg' following request is used:
```bash
curl -X GET -O -u 2arzyJZYj2oNnHX:2arzyJZYj2oNnHX https://cloud.permapl
ant.net/public.php/webdav/Icons/add.svg
```

In PermaplanT we use the public shares for data which should be accessible by unauthenticated users.
E.g. images on the landing page or icons for plants.

To fetch resources from directories which are not available for the public some form of authentication has to be used.
The easiest way to authenticate with the Nextcloud instance is to use the username and password in the request. This is called basic authentication.
However, this is not secure when the requests are sent from the browser as this information can be easily sniffed.
So we decided to use 'OpenID Connect' for authentication. Details on why we decided to use 'OpenID Connect' can be found in the [decision document]('https://github.com/ElektraInitiative/PermaplanT/blob/master/doc/decisions/auth.md').

All we need to know here is that requests from authenticated users are populated with the access token in the Authorization header.

Now we can make requests against the '/remote.php/webdav' endpoint.
This endpoint enables us to fetch files starting from the root directory of the logged in user.
Given the previously defined directory structure we can now access the file 'secret-doc.txt' with the following URI: 'https://cloud.permaplant.net/remote.php/webdav/Documents/secret-doc.txt'

## webDAV

> "WebDAV (Web Distributed Authoring and Versioning) is a set of extensions to the
> Hypertext Transfer Protocol (HTTP), which allows user agents to collaboratively
> author contents directly in an HTTP web server by providing facilities for concurrency
> control and namespace operations, thus allowing Web to be viewed as a writeable,
> collaborative medium and not just a read-only medium."
> [wikipedia](https://en.wikipedia.org/wiki/WebDAV)

https://docs.nextcloud.com/server/latest/developer_manual/client_apis/WebDAV/comments.html

### resources

- https://docs.oracle.com/cd/E12839_01/portal.1111/e10235/webdav007.htm#POUSR1607
- https://docs.nextcloud.com/server/25/user_manual/en/files/access_webdav.html#
- http://www.webdav.org/specs/rfc4918.html

### testing with cadaver

opening a connection

```bash
cadaver
open https://nextcloud.markus-raab.org/nextcloud/remote.php/dav/files/USERNAME/Documents
```

type help for a list of commands

```bash
help
```

## calendar

Nextcloud Calendar App is a frontend for the Nextcloud CalDAV backend.

### resources

- [CalDavBackend](https://github.com/nextcloud/server/blob/master/apps/dav/lib/CalDAV/CalDavBackend.php) implementation
- [CalDAV](https://www.rfc-editor.org/rfc/rfc4791.html)

## contacts

Contacts are stored in vCards and can be managed with CardDAV.
nextcloud/contacts is based on [sabredav](https://github.com/sabre-io/dav)(most popular WebDAV framework for PHP)
nextcloud/contacts implements CardDAV:

> "vCard Extensions to WebDAV (CardDAV) is an address book client/server
> protocol designed to allow users to access and share contact data on a server.
> CardDAV is based on WebDAV, which is based on HTTP, and it uses vCard for contact data.[2]"
> [wikipedia](https://de.wikipedia.org/wiki/CardDAV)

- https://apps.nextcloud.com/apps/contacts
- [github repository](https://github.com/nextcloud/contacts)
- https://github.com/nextcloud/contacts/blob/main/lib/Dav/PatchPlugin.php
- [CardDAV clients](https://devguide.calconnect.org/CardDAV/Client-Implementations/)
- [CardDAV libraries](https://devguide.calconnect.org/CardDAV/libraries/)

## groups

Groups are part of the of the user management.

## circles

The circle app has a REST API but it is not documented. The routes of the API can be found in
https://github.com/nextcloud/circles/blob/22238597fb9045e748119247fceaac7321f0a31e/appinfo/routes.php

### API

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


### resources

- https://docs.nextcloud.com/server/stable/admin_manual/configuration_server/occ_command.html#http-user-label
- https://github.com/nextcloud/circles
- [Circle routes](https://github.com/nextcloud/circles/blob/22238597fb9045e748119247fceaac7321f0a31e/appinfo/routes.php)


## maps

The maps Nextcloud plugin offers a REST API. The documentation can be found [here](https://github.com/nextcloud/maps/blob/master/openapi.yml).

The GET endpoint /favorite was tested with curl and basic authentication:

```bash
curl -u USERNAME:PSWD -X GET 'https://BASE_URL/nextcloud/index.php/apps/maps/api/1.0/favorites'
```

## Chat

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
