const cliProgress = require('cli-progress')
const {
  getIssueCommentsURL,
  getPullRequestCommentsURL,
  getRepoCommentsURL,
  getStatsCommentsURL,
} = require('./utilities/network/config')
const { GetRequest } = require('./utilities/network')
const { isSameOrBefore } = require('./utilities/moment')

async function getUserComments(repoName, days) {
  const resulSet = {}

  // Dispatch API to retrive results
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
  console.log(`Fetching comments for past ${days} days for ${repo}...`)
  /*   const bar1 = new cliProgress.SingleBar(
    {},
    cliProgress.Presets.shades_classic
  );
 */ const multibar = new cliProgress.MultiBar(
    {
      clearOnComplete: false,
      hideCursor: true,
    },
    cliProgress.Presets.shades_grey,
  )

  let i = 1
  const b1 = multibar.create(Object.keys(resulSet).length, i)

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

  b1.increment(i)
  for (let key of __result) {
    const { name, comments, commits } = key

    console.log(
      comments || 0,
      ' comments ',
      name,
      '( ',
      commits || 0,
      'commits )',
    )
  }
  // control bars
  const b2 = multibar.create(5000, 0)

  b2.increment(5000 - limitedAPICount)
  //b2.update(20, {filename: "helloworld.txt"});

  // stop all bars
  multibar.stop()

  //    bar1.start(5000, 0);
  //  bar1.increment(5000 - limitedAPICount);
  //bar1.update(5000 - limitedAPICount);
  // bar1.stop();
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
    console.log('Loading repo comments information...')
    getUserComments(repoName, Number(period.substring(0, period.length - 1)))
  } else {
    console.log('Error in arguments passed.')
  }
}

processInputs()
