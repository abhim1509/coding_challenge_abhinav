const { GetRequest } = require('../../../utilities/network')
const {
  getPullRequestCommentsURL,
} = require('../../../utilities/network/config')

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
