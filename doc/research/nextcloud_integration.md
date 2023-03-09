# Nextcloud research

## webDAV
> "WebDAV (Web Distributed Authoring and Versioning) is a set of extensions to the 
Hypertext Transfer Protocol (HTTP), which allows user agents to collaboratively 
author contents directly in an HTTP web server by providing facilities for concurrency
control and namespace operations, thus allowing Web to be viewed as a writeable,
collaborative medium and not just a read-only medium."
[wikipedia](https://en.wikipedia.org/wiki/WebDAV)

links:
- https://docs.oracle.com/cd/E12839_01/portal.1111/e10235/webdav007.htm#POUSR1607
- https://docs.nextcloud.com/server/25/user_manual/en/files/access_webdav.html#
- http://www.webdav.org/specs/rfc4918.html

### testing with cadaver
opening a connection
```
cadaver
open https://nextcloud.markus-raab.org/nextcloud/remote.php/dav/files/USERNAME/Documents
```
type help for a list of commands
```
help
```

## calendar
Nextcloud Calendar App is a frontend for the Nextcloud CalDAV backend.

links:
- [CalDavBackend](https://github.com/nextcloud/server/blob/master/apps/dav/lib/CalDAV/CalDavBackend.php) implementation
- [CalDAV](https://www.rfc-editor.org/rfc/rfc4791.html)

## contacts, circles, groups

Contacts and Circles are two different apps in Nextcloud.
Contacts and Groups are stored in vCards and can be managed with CardDAV.

The circle app has a REST API but it is not documented. The routes of the API can be found in
https://github.com/nextcloud/circles/blob/22238597fb9045e748119247fceaac7321f0a31e/appinfo/routes.php

API test with curl (USERNAME, PSWD and BASE_URL have to set):
```
curl -u USERNAME:PSWD -X GET 'https://BASE_URL/nextcloud/ocs/v2.php/apps/circles/circles' -H "OCS-APIRequest: true"
```
This returns a list of circles visible to the authenticated user.

Working API calls (tested with NC version 25.0.4-1~deb11):

* add member
```
curl -u USERNAME:PSWD -X POST 'https://BASE_URL/nextcloud/ocs/v2.php/apps/circles/circles/CIRCLE_ID/members/multi' -H "OCS-APIRequest: true" -H "Content-Type: application/json" -d '{"members":[{"id":"USER_ID","type":1}]}'
```
* create circle
```
curl -u USERNAME:PSWD -X POST 'https://BASE_URL/nextcloud/ocs/v2.php/apps/circles/circles' -H "OCS-APIRequest: true" -H "Content-Type: application/json" -d '{"name":"test_circle_3","personal":false,"local":false}'
```
* delete member from circle
```
curl -u USERNAME:PSWD -X DELETE 'https://BASE_URL/nextcloud/ocs/v2.php/apps/circles/circles/CIRCLE_ID/members/MEMBER_ID' -H "OCS-APIRequest: true"
```
* get circles
```
curl -u USERNAME:PSWD -X GET 'https://BASE_URL/nextcloud/ocs/v2.php/apps/circles/circles' -H "OCS-APIRequest: true"
```
* get members
```
curl -u USERNAME:PSWD -X GET 'https://BASE_URL/nextcloud/ocs/v2.php/apps/circles/circles/CIRCLE_ID/members' -H "OCS-APIRequest: true"
```

nextcloud/contacts implements CardDAV:
> "vCard Extensions to WebDAV (CardDAV) is an address book client/server 
protocol designed to allow users to access and share contact data on a server.
CardDAV is based on WebDAV, which is based on HTTP, and it uses vCard for contact data.[2]"
[wikipedia](https://de.wikipedia.org/wiki/CardDAV)

links:
- https://apps.nextcloud.com/apps/contacts
- https://docs.nextcloud.com/server/stable/admin_manual/configuration_server/occ_command.html#http-user-label
- https://github.com/nextcloud/contacts
- https://github.com/nextcloud/contacts/blob/main/lib/Dav/PatchPlugin.php
- [CardDAV clients](https://devguide.calconnect.org/CardDAV/Client-Implementations/)
- [CardDAV libraries](https://devguide.calconnect.org/CardDAV/libraries/)
- https://github.com/nextcloud/circles
- [Circle routes](https://github.com/nextcloud/circles/blob/22238597fb9045e748119247fceaac7321f0a31e/appinfo/routes.php)


nextcloud/contacts is based on [sabredav](https://github.com/sabre-io/dav)(most popular WebDAV framework for PHP)

## Chat

sending a message:

```rust
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
```
curl -sS -d "{\"token\": \"$CHAT\", \"message\": \"$*\"}" -H "Content-Type: application/json" -H "Accept: application/json" -H "OCS-APIRequest: true" -u "user:password" https://nextcloud.markus-raab.org/nextcloud/ocs/v2.php/apps/spreed/api/v1/chat/$CHAT
```
