/**
 * @module ./tail.js
 */

/**
 * Obtain logs from ForgeRock Identity Cloud (FIDC) '/monitoring/logs/tail' endpoint,
 * as described in https://backstage.forgerock.com/docs/idcloud/latest/paas/tenant/audit-logs.html
 * Send the logs data to standard output by default or to a passed in callback function.
 * @param {object} param0 Object wrapping all arguments.
 * @param {string} param0.origin Base URL to an FIDC instance.
 * @param {string} param0.api_key_id For details, see: https://backstage.forgerock.com/docs/idcloud/latest/paas/tenant/audit-logs.html#api-key
 * @param {string} param.api_key_secret For details, see: https://backstage.forgerock.com/docs/idcloud/latest/paas/tenant/audit-logs.html#api-key
 * @param {string} param0.source The logs' source, as described in https://backstage.forgerock.com/docs/idcloud/latest/paas/tenant/audit-logs.html#getting_sources
 * @param {number} [param0.frequency=10] The frequency (in seconds) with which the logs should be requested from the REST endpoint.
 * @param {function} [param0.showLogs=showLogs] Output logs.
 * @returns {undefined}
 */
module.exports = function ({
  origin,
  api_key_id,
  api_key_secret,
  source,
  frequency,
  showLogs
}) {
  frequency = frequency || 10

  /**
   * Process the logs' content: filters, formats, etc.
   * if no custom `showLogs` function is passed in arguments.
   * In this instance, prepares stringified JSON output for a command line tool like `jq`.
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

  /**
   * @returns {string} Concatenated query string parameters.
   */
  function getParams() {
    return Object.keys(params).map((key) => {
      if (params[key]) {
        return (key + '=' + encodeURIComponent(params[key]))
      }
    }).join('&')
  }

  /**
   * Obtain logs from the '/monitoring/logs/tail' endpoint.
   * Keep track of the last request's `pagedResultsCookie` to avoid overlaps in the delivered content.
   * @returns {undefined}
   */
  function getLogs() {
    // Authorization options.
    const options = {
      headers: {
        'x-api-key': api_key_id,
        'x-api-secret': api_key_secret
      }
    }

    // The API call.
    http.get(
      origin + '/monitoring/logs/tail?' + getParams(),
      options,
      (res) => {
        var data = ''

        // To avoid dependencies, use the native module and receive data in chunks.
        res.on('data', (chunk) => {
          data += chunk
        })

        // Process the data when the entire response has been received.
        res.on('end', () => {
          var logsObject

          try {
            logsObject = JSON.parse(data)
          } catch (e) {
            logsObject = {
              scriptError: String(e)
            }
          }

          showLogs({
            logsObject
          })

          // Set the _pagedResultsCookie query parameter for the next request
          // to retrieve all records stored since the last one.
          params._pagedResultsCookie = logsObject.pagedResultsCookie
        })
      }
    )

    setTimeout(getLogs, frequency * 1000)
  }

  /**
   * Derive a native module name from the origin; 'http' or 'https' is expected.
   */
  const moduleName = (new URL(origin)).protocol.split(':')[0]
  const http = require(moduleName)

  /**
   * Define URL query string params.
   */
  var params = {
    source: source
  }

  getLogs()
}
