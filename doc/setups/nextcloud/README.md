# Nextcloud Setup

You can use the `docker-compose.yml` in this folder to start a local Nextcloud instance.

## Required Plugins

The PermaplanT app requires to have following plugins installed in Nextcloud:

1. [user_oidc](https://github.com/nextcloud/user_oidc)
  This plugin allows to configure OpenID Connect providers for authentication
2. [WebAppPassword](https://apps.nextcloud.com/apps/webapppassword)
  This plugin is needed to set allowed origins for webdav

## Notes

As of now the password policy app has to be disabled
