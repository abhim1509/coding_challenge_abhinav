const apiBase = "https://api.github.com";
const commentUrlGen = "https://api.github.com/repos/{repoName}/comments";
const issueCommentsUrl =
  "https://api.github.com/repos/{repoName}/issues/comments";
const pullCommentsUrl =
  "https://api.github.com/repos/{repoName}/pulls/comments";
const statsUrl = "https://api.github.com/repos/{repoName}/stats/contributors";

const axios = require("axios");
const chalk = require("chalk");
const config = require("./config");
const moment = require("moment");
const cliProgress = require("cli-progress");

const http = axios.create({
  baseURL: apiBase,
  headers: {
    Authorization: `token ${config.GITHUB_PERSONAL_ACCESS_TOKEN}`,
  },
});

async function getUserComments(repoName, days) {
  console.log(typeof days, days);
  const url = commentUrlGen.replace("{repoName}", repoName);
  console.log(url);
  const url2 = issueCommentsUrl.replace("{repoName}", repoName);
  console.log(url2);
  const url3 = pullCommentsUrl.replace("{repoName}", repoName);
  console.log(url3);
  const url4 = statsUrl.replace("{repoName}", repoName);
  console.log(url4);

  let resulSet = {};

  const [url1response, url2response, url3response, url4response] =
    await Promise.all([
      await http.get(url),
      await http.get(url2),
      await http.get(url3),
      await http.get(url4),
    ]);
  //console.log(url4response.headers["x-ratelimit-remaining"]); //Updated "remaining Requests"
  let limitedAPICount = url4response.headers["x-ratelimit-remaining"];
  //let APILimiting
  const url1respData = url1response.data;
  const url2respData = url2response.data;
  const url3respData = url3response.data;
  const url4respData = url4response.data;

  //console.log(url4respData)

  let lengthArr = [];
  lengthArr.push(url1respData.length);
  lengthArr.push(url2respData.length);
  lengthArr.push(url3respData.length);
  //lengthArr.push(url4respData.length)

  let maxLength = lengthArr.reduce((acc, elem) => {
    //console.log(acc, elem);
    return acc < elem ? (acc = elem) : (acc = acc);
  }, 0);

  //  console.log({ maxLength: maxLength });

  for (let i = 0; i < maxLength; i++) {
    if (limitedAPICount && url1respData[i]) {
      if (
        days &&
        moment()
          .utc()
          .subtract(days, "day")
          .isSameOrBefore(url1respData[i].created_at)
      ) {
        if (!resulSet[url1respData[i].user.login]) {
          resulSet[url1respData[i].user.login] = { comments: 0 };
        }
        resulSet[url1respData[i].user.login].comments = ++resulSet[
          url1respData[i].user.login
        ].comments;
      }
    }

    if (limitedAPICount && url2respData[i]) {
      if (
        days &&
        moment()
          .utc()
          .subtract(days, "day")
          .isSameOrBefore(url2respData[i].created_at)
      ) {
        //console.log(element.user.login)
        if (!resulSet[url2respData[i].user.login]) {
          resulSet[url2respData[i].user.login] = { comments: 0 };
        }
        resulSet[url2respData[i].user.login].comments =
          resulSet[url2respData[i].user.login].comments + 1;
      }
    }

    if (limitedAPICount && url3respData[i]) {
      if (
        days &&
        moment()
          .utc()
          .subtract(days, "day")
          .isSameOrBefore(url3respData[i].created_at)
      ) {
        //console.log(element.user.login)
        if (!resulSet[url3respData[i].user.login]) {
          resulSet[url3respData[i].user.login] = { comments: 0 };
        }
        resulSet[url3respData[i].user.login].comments =
          resulSet[url3respData[i].user.login].comments + 1;
      }
    }
  }

  limitedAPICount &&
    url4respData.forEach((element) => {
      //console.log({[element.author.login]: element.total})
      if (resulSet[element.author.login]) {
        resulSet[element.author.login].commits = element.total;
      }
    });
  //console.log("in main", resulSet);
  processOutput(resulSet, limitedAPICount, days, repoName);
}

function processOutput(resulSet, limitedAPICount, days, repo) {
  console.log(`Fetching comments for past ${days} days for ${repo}...`);
  /*   const bar1 = new cliProgress.SingleBar(
    {},
    cliProgress.Presets.shades_classic
  );
 */ const multibar = new cliProgress.MultiBar(
    {
      clearOnComplete: false,
      hideCursor: true,
    },
    cliProgress.Presets.shades_grey
  );

  // add bars
  //const b1 = multibar.create(, 0);

  /*let i = 1;
  console.log(Object.keys(resulSet).length);
  bar1.start(Object.keys(resulSet).length, i);
  console.log("");
 */
  let i = 1;
  const b1 = multibar.create(Object.keys(resulSet).length, i);

  const _resultArr = [];
  for (let item in resulSet) {
    const payload = {
      name: item,
      ...resulSet[item],
    };
    _resultArr.push(payload);
  }

  let __result = _resultArr.sort((a, b) => {
    return b.comments - a.comments;
  });

  console.log("____", __result);
  b1.increment(i);
  for (let key of __result) {
    const { name, comments, commits } = key;
    //i++;

    console.log(
      comments || 0,
      " comments ",
      name,
      "( ",
      commits || 0,
      "commits )"
    );
  }
  // control bars
  const b2 = multibar.create(5000, 0);

  b2.increment(5000 - limitedAPICount);
  //b2.update(20, {filename: "helloworld.txt"});

  // stop all bars
  multibar.stop();

  //    bar1.start(5000, 0);
  //  bar1.increment(5000 - limitedAPICount);
  //bar1.update(5000 - limitedAPICount);
  // bar1.stop();
}

function processInputs() {
  const args = process.argv.slice(2);
  const [repoFlag, repoName, periodFlag, period = Number.POSITIVE_INFINITY] =
    args;
  console.log(repoFlag, repoName, periodFlag, period);
  if (
    periodFlag &&
    period &&
    period.endsWith("d") &&
    Number(period.substring(0, period.length - 1)) &&
    repoFlag === "--repo" &&
    repoName
  ) {
    console.log("validated");
    getUserComments(repoName, Number(period.substring(0, period.length - 1)));
  } else {
    console.log("Error in arguments passed.");
  }
}

processInputs();
