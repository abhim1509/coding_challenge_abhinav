const { GetRequest } = require('../../../utilities/network')
const { getIssueCommentsURL } = require('../../../utilities/network/config')

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
