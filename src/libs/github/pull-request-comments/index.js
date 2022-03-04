const { GetRequest } = require('../../../utilities/network')
const {
  getPullRequestCommentsURL,
} = require('../../../utilities/network/config')

/**
 * Retrieves pull request comments.
 * @param {string} repoName - Repository name.
 */
const getPullRequestComments = async (repoName) => {
  if (!repoName) {
    return []
  }
  const response = await GetRequest(getPullRequestCommentsURL(repoName))
  return response
}

module.exports = {
  getPullRequestComments,
}
