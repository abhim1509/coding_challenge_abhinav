const BASE_URL = 'https://api.github.com'

const getRepoCommentsURL = (repoName) => {
  return `${BASE_URL}/repos/${repoName}/comments`
}

const getIssueCommentsURL = (repoName) => {
  return `${BASE_URL}/repos/${repoName}/issues/comments`
}

const getPullRequestCommentsURL = (repoName) => {
  return `${BASE_URL}/repos/${repoName}/pulls/comments`
}

const getStatsCommentsURL = (repoName) => {
  return `${BASE_URL}/repos/${repoName}/stats/contributors`
}

const SUCCESS_STATUS = 200

module.exports = {
  BASE_URL,
  getRepoCommentsURL,
  getIssueCommentsURL,
  getPullRequestCommentsURL,
  getStatsCommentsURL,
  SUCCESS_STATUS,
}
