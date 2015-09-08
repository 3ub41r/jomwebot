## Installation

* `git clone https://github.com/r0lodex/jomwebot.git jomwebot`
* `cd jomwebot/bot`
* `npm install`
* `/api` is a submodule forked from [Jomweb Members Api](https://github.com/jomwebjohor/members-api)
* You need to have your Telegram Bot's API Key. You can acquire this via [@botfather](http://telegram.me/botfather).
* Put your Telegram Bot's API key into env.js.

## Initialize Server
* `npm install -g nodemon`
* `nodemon server.js`

## Development
Point Members API url to your local in `env.js`:

    process.env['JWJ_API_URL'] = 'http://localhost:4000';    
