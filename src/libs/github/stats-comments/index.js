const { GetRequest } = require('../../../utilities/network')
const { getStatsCommentsURL } = require('../../../utilities/network/config')

const getStatsComments = async (repoName) => {
  if (!repoName) {
    return []
  }
  const response = await GetRequest(getStatsCommentsURL(repoName))
  return response
}

module.exports = {
  getStatsComments,
}
