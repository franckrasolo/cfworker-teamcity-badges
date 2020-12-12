## cfworker-teamcity-badges

A pretty basic [Cloudflare Worker](https://workers.cloudflare.com/) that produces status badges for any TeamCity build.

### Rationale

At the time of writing, TeamCity build status widgets [cannot be customised](https://youtrack.jetbrains.com/issue/TW-42594)
and have a hardcoded label:

![TC build status](https://ardalis.com/img/BuildStatusIcon.jpg)

While [Shields.io](http://shields.io/) is already able to produce customisable badges, it requires TeamCity servers
to be [publicly  accessible](http://www.mikeobrien.net/blog/setting-up-teamcity-status-badges-with-shields-io).

This worker is more flexible by using token-based authentication in addition to taking the label as a parameter.

Using a valid access token, it retrieves the status of a given build from a TeamCity instance
and delegates to Shields.io to produce the desired badge.

It is invoked with a URI path as `/label/buildTypeId` where:
- `label` is a string matching the `[\w\s-_]{2,}` regex
- `buildTypeId` is the ID of a TeamCity build, matching the `[\w-_]{5,}` regex

### Manual Installation

1. [create](https://dash.cloudflare.com/sign-up/workers) a Cloudflare Workers account if necessary
2. create a worker
3. in the worker's settings, bind and encrypt the following environment variables:
   - `ACCESS_TOKEN`: an access token created for a TeamCity user with the **Project Viewer** role
   - `TEAMCITY_BASE_URL`: the base URL of your TeamCity instance
4. edit the worker and paste the contents of [index.js](index.js)
5. save and deploy your changes, and profit!
