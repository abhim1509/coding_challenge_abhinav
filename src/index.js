const apiBase = 'https://api.github.com'
const commentUrlGen = 'https://api.github.com/repos/{repoName}/comments'
const issueCommentsUrl =
  'https://api.github.com/repos/{repoName}/issues/comments'
const pullCommentsUrl = 'https://api.github.com/repos/{repoName}/pulls/comments'
const statsUrl = 'https://api.github.com/repos/{repoName}/stats/contributors'
//    "issue_comment_url": "https://api.github.com/repos/Netflix/astyanax/issues/comments{/number}",
//https://api.github.com/orgs/Netflix/repos

const axios = require('axios')
const chalk = require('chalk')
const config = require('./config')
const moment = require('moment')
const fs = require('fs')

//var argv = require('minimist')(process.argv.slice(2));
//console.dir("DDDDDDDDDD", argv);

let repoName

const http = axios.create({
  baseURL: apiBase,
  headers: {
    Authorization: `token ${config.GITHUB_PERSONAL_ACCESS_TOKEN}`,
  },
})

async function getUserComments(repoName) {
  const url = commentUrlGen.replace('{repoName}', repoName)
  console.log(url)
  const url2 = issueCommentsUrl.replace('{repoName}', repoName)
  console.log(url2)
  const url3 = pullCommentsUrl.replace('{repoName}', repoName)
  console.log(url3)
  const url4 = statsUrl.replace('{repoName}', repoName)
  console.log(url4)

  let resulSet = {}
  let days = 2190

  //console.log(moment("2022-02-06T16:27:39Z").format("LL"))
  //console.log(moment().subtract(25, 'day'))
  //console.log(moment("2022-02-06T16:27:39Z"))
  //console.log(moment().subtract(25, 'day'))
  //console.log('__',moment())
  //console.log(moment().utc().subtract(days, 'day').isSameOrBefore("2022-02-08T17:59:38Z"))
  //invalid.isBefore(invalid)

  //'2022-02-06T16:27:39Z'
  const [url1response, url2response, url3response, url4response] =
    await Promise.all([
      await http.get(url),
      await http.get(url2),
      await http.get(url3),
      await http.get(url4),
    ])
  console.log(url4response.headers['x-ratelimit-remaining']) //Updated "remaining Requests"
  //let APILimiting
  const url1respData = url1response.data
  const url2respData = url2response.data
  const url3respData = url3response.data
  const url4respData = url4response.data

  //console.log(url4respData)

  let lengthArr = []
  lengthArr.push(url1respData.length)
  lengthArr.push(url2respData.length)
  lengthArr.push(url3respData.length)
  //lengthArr.push(url4respData.length)

  let maxLength = lengthArr.reduce((acc, elem) => {
    //console.log(acc, elem);
    return acc < elem ? (acc = elem) : (acc = acc)
  }, 0)
  console.log({ maxLength: maxLength })
  /* 
    console.log(url1respData.length)
    console.log(url2respData.length)
    console.log(url3respData.length)
    console.log(url4respData.length)
 */

  for (let i = 0; i < maxLength; i++) {
    if (url1respData[i]) {
      if (
        days &&
        moment()
          .utc()
          .subtract(days, 'day')
          .isSameOrBefore(url1respData[i].created_at)
      ) {
        if (!resulSet[url1respData[i].user.login]) {
          resulSet[url1respData[i].user.login] = { comments: 0 }
        }
        resulSet[url1respData[i].user.login].comments = ++resulSet[
          url1respData[i].user.login
        ].comments
      }
    }

    if (url2respData[i]) {
      if (
        days &&
        moment()
          .utc()
          .subtract(days, 'day')
          .isSameOrBefore(url2respData[i].created_at)
      ) {
        //console.log(element.user.login)
        if (!resulSet[url2respData[i].user.login]) {
          resulSet[url2respData[i].user.login] = { comments: 0 }
        }
        resulSet[url2respData[i].user.login].comments =
          resulSet[url2respData[i].user.login].comments + 1
      }
    }

    if (url3respData[i]) {
      if (
        days &&
        moment()
          .utc()
          .subtract(days, 'day')
          .isSameOrBefore(url3respData[i].created_at)
      ) {
        //console.log(element.user.login)
        if (!resulSet[url3respData[i].user.login]) {
          resulSet[url3respData[i].user.login] = { comments: 0 }
        }
        resulSet[url3respData[i].user.login].comments =
          resulSet[url3respData[i].user.login].comments + 1
      }
    }

    /* 
        for(let item of url4respData){
            const {login} = item.author;
            if(login === 'rmarinho'){

                //console.log("Elem: ",item.author.login, item.total)
            }
        }
        const currentUser = url4respData[i].author.login;


        
        
        console.log("resulSet",resulSet)
        if (resulSet[currentUser]) {
            const currentUserData = resulSet[currentUser];
            console.log({currentUserData})


            console.log("url4respData[i].author.login",url4respData[i].author.login)
            console.log("resulSet[url4respData[i].author.login]",resulSet[url4respData[i].author.login])
            resulSet[url4respData[i].author.login].commits = url4respData[i].total;
        }
 */
  }
  /* 
    url1respData.forEach(element => {
        //console.log(element.created_at)
        if(days && moment().utc().subtract(days, 'day').isSameOrBefore(element.created_at)){
            //console.log(element.user.login)
            if (!resulSet[element.user.login]) {
                resulSet[element.user.login] = { comments: 0 }
            } 
            resulSet[element.user.login].comments = resulSet[element.user.login].comments + 1;
            
        }
        if(!days){
            if (!resulSet[element.user.login]) {
                resulSet[element.user.login] = { comments: 0   }
            } 
            resulSet[element.user.login].comments = resulSet[element.user.login].comments + 1;
            
        }
    });
 */
  /*     url2respData.forEach(element => {
        if(days && moment().utc().subtract(days, 'day').isSameOrBefore(element.created_at)){
            //console.log(element.user.login)
            if (!resulSet[element.user.login]) {
                resulSet[element.user.login] = { comments: 0 }
            } 
            resulSet[element.user.login].comments = resulSet[element.user.login].comments + 1;
            
        }
        if(!days){
            if (!resulSet[element.user.login]) {
                resulSet[element.user.login] = { comments: 0   }
            } 
            resulSet[element.user.login].comments = resulSet[element.user.login].comments + 1;
            
        }

    })

    url3respData.forEach(element => {
        if(days && moment().utc().subtract(days, 'day').isSameOrBefore(element.created_at)){
            //console.log(element.user.login)
            if (!resulSet[element.user.login]) {
                resulSet[element.user.login] = { comments: 0 }
            } 
            resulSet[element.user.login].comments = resulSet[element.user.login].comments + 1;
            
        }
        if(!days){
            if (!resulSet[element.user.login]) {
                resulSet[element.user.login] = { comments: 0   }
            } 
            resulSet[element.user.login].comments = resulSet[element.user.login].comments + 1;
            
        }

    })
 */ /*
   */

  url4respData.forEach((element) => {
    //console.log({[element.author.login]: element.total})
    if (resulSet[element.author.login]) {
      resulSet[element.author.login].commits = element.total
    }
  })
  console.log(resulSet)
  //processOutputs(resulSet, )
}

function processInputs() {
  const args = process.argv.slice(2)
  const [repoFlag, repoName, periodFlag, period = Number.POSITIVE_INFINITY] =
    args
  console.log(repoFlag, repoName, periodFlag, period)
  if (
    periodFlag &&
    period &&
    period.endsWith('d') &&
    Number(
      period.substring(0, period.length - 1) &&
        repoFlag === '--repo' &&
        repoName,
    )
  ) {
    console.log('validated')
    getUserComments(repoName, period)
  }
  if (repoFlag === '--repo' && repoName) {
    getUserComments(repoName)
  }
}

processInputs()
