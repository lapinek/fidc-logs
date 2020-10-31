# ForgeRock Identity Cloud (FIDC) Logs

JavaScript code for automated logs retrieval from the FIDC monitoring endpoint, as described in [Identity Cloud Docs > Your Tenant > View Audit Logs](https://backstage.forgerock.com/docs/idcloud/latest/paas/tenant/audit-logs.html).

[tail.js](tail.js) is a module to be loaded in a separate script. The module exports a function which accepts arguments where you specify your tenant, credentials, log source, and output specifics. The module itself continuously requests the logs and uses `pagedResultsCookie` to avoid overlaps in the delivered content.

The output customization is done via passing in a `showLogs(Object logsObject)` function as an optional argument. If this argument is not provided, a default standard output implementation is used that is defined in the module itself.

This is illustrated in the examples included in this repo:
* [tail.am-core.js](tail.am-core.js)

    Does not define `showLogs` and relies on the default output implementation. \
    Specifies frequency of logs retrieval.

* [tail.idm-core.js](tail.idm-core.js).

    Defines `showLogs` for outputting the logs data.

    > In this case, the function is identical to the default one defined in the main module and only serves as an example of providing this argument.

See the comments inside the two script templates and in the module for further details.

You will need to provide your own tenant details at the top of the script templates:

```javascript
// Specify the full base URL of the FIDC service.
const origin = 'https://your-tenant-host.forgeblocks.com'

// Specify the log API key and secret,
// as described in https://backstage.forgerock.com/docs/idcloud/latest/paas/tenant/audit-logs.html#api-key
const api_key_id = 'your-api-key-id'
const api_key_secret = 'your-api-key-secret'
```

With [Node.js](https://nodejs.org/en/download/) installed, and with the `tail.js` module in the same directory, you can run a custom script as follows:

```bash
$ node tail.am-core.js
```
