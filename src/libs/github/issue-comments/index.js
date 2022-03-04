const { GetRequest } = require('../../../utilities/network')
const { getIssueCommentsURL } = require('../../../utilities/network/config')

/**
 * Retrieves issue comments.
 * @param {string} repoName - Repository name.
 */
const getIssueComments = async (repoName) => {
  if (!repoName) {
    return []
  }
  const response = await GetRequest(getIssueCommentsURL(repoName))
  return response
}

module.exports = {
  getIssueComments,
}
