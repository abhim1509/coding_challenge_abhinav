import { GetRequest } from '../../../utilities/network'
import { getRepoCommentsURL } from '../../../utilities/network/config'

export const getRepoComments = async (repoName) => {
  if (!repoName) return []
  const response = await GetRequest(getRepoCommentsURL(repoName))
  return response
}
