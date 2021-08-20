import config from '../config';
import axios from 'axios';

export async function getChatbot(context) {
  try {
    const { req, res } = context;
    const { cookies, query } = req;
    const { access_token, refresh_token } = cookies;
    const { action } = query;

    if (!!action) {
      if (action === 'part') await partChannel(access_token);
      if (action === 'join') await joinChannel(access_token);
    }

    const response = await axios
      .get(`${config.apiUrl}/chatbot`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);

    const { data, status } = response;

    // Other errors might include not having a token at all
    if (!data || status !== 200) {
      throw new Error('Unable to get chatbot information');
    }

    const chatbot = data;
    return chatbot;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function partChannel(access_token) {
  try {
    const response = await axios
      .post(
        `${config.apiUrl}/chatbot/part`,
        {},
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      )
      .then((res) => res)
      .catch((err) => err.response);

    const { data, status } = response;

    // Other errors might include not having a token at all
    if (!data || status !== 201) {
      throw new Error('Unable to get chatbot information');
    }

    const chatbot = data;
    return chatbot;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function joinChannel(access_token) {
  try {
    const response = await axios
      .post(
        `${config.apiUrl}/chatbot/join`,
        {},
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      )
      .then((res) => res)
      .catch((err) => err.response);

    const { data, status } = response;

    // Other errors might include not having a token at all
    if (!data || status !== 201) {
      throw new Error('Unable to get chatbot information');
    }

    const chatbot = data;
    return chatbot;
  } catch (error) {
    console.log(error);
    return null;
  }
}
