#!/usr/bin/env node

// Specify the full base URL of the FIDC service.
const origin = process.env.ORIGIN || 'https://your-tenant-host.forgeblocks.com'

// Specify the log API key and secret,
// as described in https://backstage.forgerock.com/docs/idcloud/latest/paas/tenant/audit-logs.html#api-key
const api_key_id = process.env.API_KEY_ID || 'your-api-key-id'
const api_key_secret = process.env.API_KEY_SECRET || 'your-api-key-secret'

/* Specify the logs' source, as described in https://backstage.forgerock.com/docs/idcloud/latest/paas/tenant/audit-logs.html#getting_sources

Currently available sources are listed below.
Uncomment the source you want to use.
For development and debugging use "am-core" and "idm-core" respectively. */

// const source = 'am-access'
// const source = 'am-activity'
// const source = 'am-authentication'
// const source = 'am-config'
// const source = 'am-core'
// const source = 'am-everything'
// const source = 'ctsstore'
// const source = 'ctsstore-access'
// const source = 'ctsstore-config-audit'
// const source = 'ctsstore-upgrade'
// const source = 'idm-access'
// const source = 'idm-activity'
// const source = 'idm-authentication'
// const source = 'idm-config'
const source = 'idm-core'
// const source = 'idm-everything'
// const source = 'idm-sync'
// const source = 'userstore'
// const source = 'userstore-access'
// const source = 'userstore-config-audit'
// const source = 'userstore-ldif-importer'
// const source = 'userstore-upgrade'

/**
 * Process the logs' content: filters, formats, etc.
 * In this instance, prepare stringified JSON output for a command-line tool like `jq`.
 * If undefined, a default function is applied, which is defined in the main module, ./tail.js:
 * @param {object} logsObject The object containing logs.
 * @param {{payload: string|object}[]} [logsObject.result] An array of logs.
 * @returns {undefined}
 */
const showLogs = function ({
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

// End of user input.

const tail = require('./tail.js')

tail({
  origin: origin,
  api_key_id: api_key_id,
  api_key_secret: api_key_secret,
  source: source,
  frequency: undefined,
  showLogs: showLogs
})
