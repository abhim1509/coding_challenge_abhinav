const { GetRequest } = require('../../../utilities/network')
const { getStatsCommitsURL } = require('../../../utilities/network/config')

/**
 * Retrieves repository stats.
 * @param {string} repoName - Repository name.
 */
const getStatsCommits = async (repoName) => {
  if (!repoName) {
    return []
  }
  const response = await GetRequest(getStatsCommitsURL(repoName))
  return response
}

module.exports = {
  getStatsCommits,
}
