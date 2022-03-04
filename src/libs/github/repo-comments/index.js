const { GetRequest } = require('../../../utilities/network')
const { getRepoCommentsURL } = require('../../../utilities/network/config')

/**
 * Retrieves repository comments.
 * @param {string} repoName - Repository name.
 */
const getRepoComments = async (repoName) => {
  if (!repoName) {
    return []
  }
  const response = await GetRequest(getRepoCommentsURL(repoName))
  return response
}

module.exports = { getRepoComments }
