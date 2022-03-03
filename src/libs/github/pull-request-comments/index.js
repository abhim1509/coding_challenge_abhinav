import { GetRequest } from '../../../utilities/network'
import { getPullRequestCommentsURL } from '../../../utilities/network/config'

export const getPullRequestComments = async (repoName) => {
  if (!repoName) return []
  const response = await GetRequest(getPullRequestCommentsURL(repoName))
  return response
}
