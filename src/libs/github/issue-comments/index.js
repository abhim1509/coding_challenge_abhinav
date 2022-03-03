import { GetRequest } from '../../../utilities/network'
import { getIssueCommentsURL } from '../../../utilities/network/config'

export const getIssueComments = async (repoName) => {
  if (!repoName) return []
  const response = await GetRequest(getIssueCommentsURL(repoName))
  return response
}
