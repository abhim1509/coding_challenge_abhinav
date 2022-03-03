const moment = require('moment')

const isSameOrBefore = (timestamp, days) => {
  return moment().utc().subtract(days, 'day').isSameOrBefore(timestamp)
}

module.exports = {
  isSameOrBefore,
}
