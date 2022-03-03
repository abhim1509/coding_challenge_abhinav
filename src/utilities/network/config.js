export const BASE_URL = 'https://api.github.com'

export const getRepoCommentsURL = (repoName) => {
  return `${BASE_URL}/repos/${repoName}/comments`
}

export const getIssueCommentsURL = (repoName) => {
  return `${BASE_URL}/repos/${repoName}/issues/comments`
}

export const getPullRequestCommentsURL = (repoName) => {
  return `${BASE_URL}/repos/${repoName}/pulls/comments`
}

export const getStatsCommentsURL = (repoName) => {
  return `${BASE_URL}/repos/${repoName}/stats/comments`
}

export const SUCCESS_STATUS = 200
