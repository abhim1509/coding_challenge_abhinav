import { GetRequest } from '../../../utilities/network'
import { getStatsCommentsURL } from '../../../utilities/network/config'

export const getStatsComments = async (repoName) => {
  if (!repoName) return []
  const response = await GetRequest(getStatsCommentsURL(repoName))
  return response
}
