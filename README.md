NodeJS Mirror API Quick Start
==========================

This is a quick start example for using the Google Glass Mirror API from node.js.

The [helper library](https://github.com/emil10001/node-mirror-utils) uses environment variables to configure oauth client. That way, you never need to ship
these values, or worry about accidentally committing them to version control. If you're using AWS,
Elastic Beanstalk lets you define environment variables easily, There might be an easy way for EC2
also. If you're doing local development, you can dd the following to your `~/.bashrc` file:

    export MIRROR_CLIENT_ID="<your client id>"
    export MIRROR_CLIENT_SECRET="<your client secret>"
    export MIRROR_REDIRECT_URL="http://localhost:8080/oauth2callback"

From there, you should be all set.