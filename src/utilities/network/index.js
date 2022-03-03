const axios = require('axios')
const { SUCCESS_STATUS, BASE_URL } = require('./config')
const { GITHUB_PERSONAL_ACCESS_TOKEN } = require('../../config')

const HTTP = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `token ${GITHUB_PERSONAL_ACCESS_TOKEN}`,
  },
})

const GetRequest = async (url) => {
  try {
    const response = await HTTP.get(url)
    if (response.status !== SUCCESS_STATUS) {
      return {
        headers: response.headers,
        data: [],
      }
    }
    return {
      headers: response.headers,
      data: response.data,
    }
  } catch (err) {
    console.log(err)
    return null
  }
}

module.exports = {
  GetRequest,
}
