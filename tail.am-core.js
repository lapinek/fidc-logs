#!/usr/bin/env node

// Specify the full base URL of the FIDC service.
const origin = 'https://your-tenant-host.forgeblocks.com'

// Specify the log API key and secret,
// as described in https://backstage.forgerock.com/docs/idcloud/latest/paas/tenant/audit-logs.html#api-key
const api_key_id = 'your-api-key-id'
const api_key_secret = 'your-api-key-secret'

/* Specify the logs' source, as described in https://backstage.forgerock.com/docs/idcloud/latest/paas/tenant/audit-logs.html#getting_sources

Currently available sources are listed below.
Uncomment the source you want to use.
For development and debugging use "am-core" and "idm-core" respectively.
*/

// const source = 'am-access'
// const source = 'am-activity'
// const source = 'am-authentication'
// const source = 'am-config'
const source = 'am-core'
// const source = 'am-everything'
// const source = 'ctsstore'
// const source = 'ctsstore-access'
// const source = 'ctsstore-config-audit'
// const source = 'ctsstore-upgrade'
// const source = 'idm-access'
// const source = 'idm-activity'
// const source = 'idm-authentication'
// const source = 'idm-config'
// const source = 'idm-core'
// const source = 'idm-everything'
// const source = 'idm-sync'
// const source = 'userstore'
// const source = 'userstore-access'
// const source = 'userstore-config-audit'
// const source = 'userstore-ldif-importer'
// const source = 'userstore-upgrade'

/**
 * Function declaration.
 * Processes the logs' content: filters, formats, etc.
 * If undefined, a default one is applied that is defined in `tail.js`:
 * @param {object} logsObject The object containing logs.
 * @param {{payload: string|object}[]} [logsObject.result] An array of logs.
 */
const showLogs = undefined

// End of user input.

const tail = require('./tail.js')

tail({
    origin: origin,
    api_key_id: api_key_id,
    api_key_secret: api_key_secret,
    source: source,
    frequency: 2,
    showLogs: showLogs
})