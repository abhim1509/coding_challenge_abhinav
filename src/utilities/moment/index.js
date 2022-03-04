const moment = require('moment')

/**
 * Compares date if it is same or before.
 * @param {Date} timestamp - Date to be compared with.
 * @param {String} days - Number of days.
 */
const isSameOrBefore = (timestamp, days) => {
  return moment().utc().subtract(days, 'day').isSameOrBefore(timestamp)
}

module.exports = {
  isSameOrBefore,
}
