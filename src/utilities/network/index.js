import axios from 'axios'
import { SUCCESS_STATUS, BASE_URL } from './config'
import { GITHUB_PERSONAL_ACCESS_TOKEN } from '../../config'

const HTTP = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `token ${GITHUB_PERSONAL_ACCESS_TOKEN}`,
  },
})

export const GetRequest = async (url) => {
  const response = await HTTP.get(url)
  return response.status === SUCCESS_STATUS ? response.data : null
}
