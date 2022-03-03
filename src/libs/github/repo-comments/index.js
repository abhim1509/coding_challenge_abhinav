const { GetRequest } = require('../../../utilities/network')
const { getRepoCommentsURL } = require('../../../utilities/network/config')

const getRepoComments = async (repoName) => {
  if (!repoName) {
    return []
  }
  const response = await GetRequest(getRepoCommentsURL(repoName))
  return response
}

module.exports = { getRepoComments }
