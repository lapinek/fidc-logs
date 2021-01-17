# ForgeRock Identity Cloud (Identity Cloud) Logs

Node.js code for automated logs retrieval from the Identity Cloud monitoring endpoint, as described in [Identity Cloud Docs > Your Tenant > View Audit Logs](https://backstage.forgerock.com/docs/idcloud/latest/paas/tenant/audit-logs.html).

## How it works

The [tail.js](tail.js) module exports a function which accepts arguments for your tenant, credentials, log source, and output specifics. When called, the function continuously requests the logs with the specified interval from the Identity Cloud [tailing logs endpoint](https://backstage.forgerock.com/docs/idcloud/latest/paas/tenant/audit-logs.html#tailing_logs).

## How to make it work

Use the module with a custom script, as demonstrated in the included examples: [tail.am-core.js](tail.am-core.js) and [tail.idm-core.js](tail.idm-core.js).

The tenant information can be provided via environmental variables.

You can create a `.env` file (which will be ignored by the repo) and use [dotenv](https://www.npmjs.com/package/dotenv). The included [.env.example](.env.example) can serve as a starting point.

Alternatively, without installing any dependencies, you can use `.env` or other storage location to keep your tenant(s) settings as commands to run in the terminal where your script will be executed:

```bash
export ORIGIN=https://your-tenant-host.forgeblocks.com
export API_KEY_ID=your-api-key-id
export API_KEY_SECRET=your-api-key-secret

export ORIGIN=https://your-tenant2-host.forgeblocks.com
export API_KEY_ID=your-api-key-id2
export API_KEY_SECRET=your-api-key-secret2

. . .
```

This way, you can reuse scripts for more than one tenant.

You can also hard code a single tenant details at the top of the script templates:

```javascript
// Specify the full base URL of the FIDC service.
const origin = process.env.ORIGIN || 'https://your-tenant-host.forgeblocks.com'

// Specify the log API key and secret,
// as described in https://backstage.forgerock.com/docs/idcloud/latest/paas/tenant/audit-logs.html#api-key
const api_key_id = process.env.API_KEY_ID || 'your-api-key-id'
const api_key_secret = process.env.API_KEY_SECRET || 'your-api-key-secret'
```

See inline comments in the provided example scripts and the JSDoc in the module itself for further details on configuring your script for a particular tenant, source, retrieval interval, and output options.

Run a script:

```bash
$ node tail.am-core.js
```

## Customizing output

By default, a logs object received from the endpoint is parsed, and each log's payload is sent to standard output as stringified JSON by a built in the module function:

```javascript
/**
* Process the logs' content: filters, formats, etc.
* if no custom `showLogs` function is passed in arguments.
* In this instance, prepares stringified JSON output for a command-line tool like `jq`.
* @param {object} logsObject The object containing logs.
* @param {{payload: string|object}[]} [logsObject.result] An array of logs.
* @returns {undefined}
*/
showLogs = showLogs || function ({
    logsObject
}) {
    if (Array.isArray(logsObject.result)) {
        logsObject.result.forEach(log => {
            console.log(JSON.stringify(log.payload))
        })
    } else {
        console.log(JSON.stringify(logsObject))
    }
}
```

***

You can pass your own version of this function as the `showLogs` argument when you initialize the module. An example of doing so is provided in [tail.idm-core.js](tail.idm-core.js).

A custom version of the output function will allow you to filter and format the content in any way you like. The logs object to process is expected to look similar to the following:

```json
{
    "result": [
        {
            "payload": "10.40.68.18 - - [06/Nov/2020:23:20:42 +0000] \"GET /am/isAlive.jsp HTTP/1.0\" 200 112 1ms\n",
            "timestamp": "2020-11-06T23:20:44.095224402Z",
            "type": "text/plain"
        },
        {
          "payload": {
            "context": "default",
            "level": "ERROR",
            "logger": "scripts.AUTHENTICATION_TREE_DECISION_NODE.bc0c6654-b10e-44d1-9ea3-712940fbea67",
            "mdc": {
              "transactionId": "372127e5-7d3b-4379-8db8-2213e2a3337a-1010"
            },
            "message": "sharedState: {realm=/alpha, authLevel=0, username=user.0}",
            "thread": "ScriptEvaluator-5",
            "timestamp": "2020-11-06T23:20:49.222Z",
            "transactionId": "372127e5-7d3b-4379-8db8-2213e2a3337a-1010"
          },
          "timestamp": "2020-11-06T23:20:49.222889214Z",
          "type": "application/json"
        },
    ],
    "resultCount": "<integer>",
    "pagedResultsCookie": "<string>",
    "totalPagedResultsPolicy": "<string>",
    "totalPagedResults": "<integer>",
    "remainingPagedResults": "<integer>"
}
```

***

In addition, or as an alternative, you can use a command-line tool for processing the output.

For example, stringified JSON can be processed with [jq](https://stedolan.github.io/jq/tutorial/). The following command will filter the logs content by presence of the "exception" key, or by checking if the nested "logger" property is populated with a script reference; then, it will limit the presentation to "logger", "message", "timestamp", and "exception" keys:

```bash
$ node tail.am-core.js | jq '. | select(objects) | select(has("exception") or (.logger | test("scripts."))) | {logger: .logger, message: .message, timestamp: .timestamp, exception: .exception}'
```