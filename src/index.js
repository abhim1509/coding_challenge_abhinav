const cliProgress = require('cli-progress')
const {
  getIssueCommentsURL,
  getPullRequestCommentsURL,
  getRepoCommentsURL,
  getStatsCommentsURL,
} = require('./utilities/network/config')
const { GetRequest } = require('./utilities/network')
const { isSameOrBefore } = require('./utilities/moment')
const loadingSpinner = require('loading-spinner')

const stopLoadingBar = function () {
  loadingSpinner.stop()
  process.stdout.write(`\nProgress completed\n\n`)
}

const startLoadingBar = function () {
  process.stdout.write(
    'Please Wait for it until we are downloading comments info...\n',
  )

  loadingSpinner.start(100, {
    clearChar: true,
  })

  setTimeout(stopLoadingBar, 100000)
}

async function getUserComments(repoName, days) {
  const resulSet = {}

  // Dispatch API to retrive results
  startLoadingBar()
  const [
    issueCommentResponse,
    pullRequestCommentResponse,
    repoCommentResponse,
    statsCommentResponse,
  ] = await Promise.all([
    await GetRequest(getIssueCommentsURL(repoName)),
    await GetRequest(getPullRequestCommentsURL(repoName)),
    await GetRequest(getRepoCommentsURL(repoName)),
    await GetRequest(getStatsCommentsURL(repoName)),
  ])

  // Obtain pending API count
  const limitedAPICount = statsCommentResponse.headers['x-ratelimit-remaining']

  // Obtain data set from API response
  const issueResponseData = issueCommentResponse.data
  const pullRequestResponseData = pullRequestCommentResponse.data
  const repoResponseData = repoCommentResponse.data
  const statsResponseData = statsCommentResponse.data

  // Form a new array
  const _commentArr = [
    issueResponseData,
    pullRequestResponseData,
    repoResponseData,
  ]

  // Prepare array for find max array size
  const commentsArr = [
    _commentArr[0].length,
    _commentArr[1].length,
    _commentArr[2].length,
  ]

  // Get max array index & size
  const maxArrIndex = commentsArr.indexOf(Math.max(...commentsArr))
  const maxSizeArr = _commentArr[maxArrIndex]
  const maxLength = maxSizeArr.length

  for (let i = 0; i < maxLength; i++) {
    // Handle for issue comments response
    if (
      limitedAPICount &&
      issueResponseData[i] &&
      days &&
      isSameOrBefore(issueResponseData[i].created_at, days)
    ) {
      const { user } = issueResponseData[i]

      if (!resulSet[user.login]) {
        resulSet[user.login] = { comments: 0 }
      }
      resulSet[user.login].comments = ++resulSet[user.login].comments
    }

    // Handle for pull request comment response
    if (
      limitedAPICount &&
      pullRequestResponseData[i] &&
      days &&
      isSameOrBefore(pullRequestResponseData[i].created_at, days)
    ) {
      const { user } = pullRequestResponseData[i]
      if (!resulSet[user.login]) {
        resulSet[user.login] = { comments: 0 }
      }
      resulSet[user.login].comments = resulSet[user.login].comments + 1
    }

    // Handle for repo comment response
    if (
      limitedAPICount &&
      repoResponseData[i] &&
      days &&
      isSameOrBefore(repoResponseData[i].created_at, days)
    ) {
      const { user } = repoResponseData[i]
      if (!resulSet[user.login]) {
        resulSet[user.login] = { comments: 0 }
      }
      resulSet[user.login].comments = resulSet[user.login].comments + 1
    }
  }

  // Obtain results from stats response
  if (limitedAPICount) {
    statsResponseData.forEach((element) => {
      if (resulSet[element.author.login]) {
        resulSet[element.author.login].commits = element.total
      }
    })
  }

  processOutput(resulSet, limitedAPICount, days, repoName)
}

function processOutput(resulSet, limitedAPICount, days, repo) {
  const multibar = new cliProgress.MultiBar(
    {
      clearOnComplete: false,
      hideCursor: true,
    },
    cliProgress.Presets.shades_grey,
  )

  const _resultArr = []
  for (let item in resulSet) {
    const payload = {
      name: item,
      ...resulSet[item],
    }
    _resultArr.push(payload)
  }

  const __result = _resultArr.sort((a, b) => {
    return b.comments - a.comments
  })

  stopLoadingBar()
  for (let key of __result) {
    const { name, comments = 0, commits = 0 } = key

    process.stdout.write(`${comments} comments, ${name} (${commits} commits)\n`)
  }

  console.log(`\nRemaining API count:  ${limitedAPICount}`)
  // control bars
  const b2 = multibar.create(5000, 0)

  b2.increment(5000 - limitedAPICount)

  // stop all bars
  multibar.stop()
  process.exit(1)
}

function processInputs() {
  const args = process.argv.slice(2)
  const [repoFlag, repoName, periodFlag, period = Number.POSITIVE_INFINITY] =
    args
  if (
    periodFlag &&
    period &&
    period.endsWith('d') &&
    Number(period.substring(0, period.length - 1)) &&
    repoFlag === '--repo' &&
    repoName
  ) {
    process.stdout.write(
      `Fetching comments for past ${period} days for "${repoName}"...\n\n`,
    )

    getUserComments(repoName, Number(period.substring(0, period.length - 1)))
  } else {
    console.log('Error in arguments passed.')
  }
}

processInputs()
