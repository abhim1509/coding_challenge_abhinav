//Base URL of the application.
const BASE_URL = 'https://api.github.com'

//Retrieves the repository comments URL.
const getRepoCommentsURL = (repoName) => {
  return `${BASE_URL}/repos/${repoName}/comments`
}

//Retrieves the issue comments URL.
const getIssueCommentsURL = (repoName) => {
  return `${BASE_URL}/repos/${repoName}/issues/comments`
}

//Retrieves the pull request comments URL.
const getPullRequestCommentsURL = (repoName) => {
  return `${BASE_URL}/repos/${repoName}/pulls/comments`
}

//Retrieves stat commits URL.
const getStatsCommitsURL = (repoName) => {
  return `${BASE_URL}/repos/${repoName}/stats/contributors`
}

const SUCCESS_STATUS = 200

module.exports = {
  BASE_URL,
  getRepoCommentsURL,
  getIssueCommentsURL,
  getPullRequestCommentsURL,
  getStatsCommitsURL,
  SUCCESS_STATUS,
}
