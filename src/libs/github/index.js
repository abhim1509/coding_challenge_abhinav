import { getIssueComments } from './issue-comments'
import { getPullRequestComments } from './pull-request-comments'
import { getRepoComments } from './repo-comments'
import { getStatsComments } from './stats-comments'

export const loadAllComments = async (repoName) => {
  if (!repoName) return []

  const [
    issueCommentResponse,
    pullRequestCommentResponse,
    repoCommentsResponse,
    statsCommentsResponse,
  ] = await Promise.all([
    await getIssueComments(repoName),
    await getPullRequestComments(repoName),
    await getRepoComments(repoName),
    await getStatsComments(repoName),
  ])

  const remainingAPILimit =
    statsCommentsResponse.headers['x-ratelimit-remaining']
}
