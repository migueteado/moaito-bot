import config from "../config";
import axios from 'axios';

export async function getUser(context) {
  try { 
    const { req, res } = context;
    const { cookies } = req;
    const { access_token, refresh_token } = cookies;

    // Get user information
    const response = await axios.get(`${config.apiUrl}/user`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
    .then(res => res)
    .catch(err => err.response);

    const { data, status } = response;

    // Other errors might include not having a token at all
    if(!data || status !== 200) {
      throw new Error('Unable to get user information')
    }

    const user = data;
    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function refreshToken(context) {
  try {
    const { req, res } = context;
    const { cookies } = req;
    const { access_token, refresh_token } = cookies;

    const response = await axios.post(`${config.apiUrl}/auth/refresh`, {
      "refreshToken": refresh_token,
    })
    .then(res => res)
    .catch(err => err.response);

    const { data, status } = response;

    if(!data || status !== 200) {
      throw new Error('Unable to refresh token');
    }

    return data;
  } catch(error) {
    console.log(error);
    return null;
  }  
}

export async function getProfile(context) {
  try { 
    const { req, res } = context;
    const { cookies } = req;
    const { access_token, refresh_token } = cookies;
    // Get user information
    const response = await axios.get(`${config.apiUrl}/user/profile`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
    .then(res => res)
    .catch(err => err.response);

    const { data, status } = response;

    // Other errors might include not having a token at all
    if(!data || status !== 200) {
      throw new Error('Unable to get profile information')
    }

    const user = data;
    return user;
  } catch (error) {
    return null;
  }
}