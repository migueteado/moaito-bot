import config from '../config';
import axios from 'axios';

export async function getCustomCommands(context) {
  try {
    const { req, res } = context;
    const { cookies } = req;
    const { access_token, refresh_token } = cookies;

    // Get user information
    const response = await axios
      .get(`${config.apiUrl}/custom-command`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);

    const { data, status } = response;

    // Other errors might include not having a token at all
    if (!data || status !== 200) {
      throw new Error('Unable to get command information');
    }

    const command = data;
    return command;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getBuiltInCommands(context) {
  try {
    const { req, res } = context;
    const { cookies } = req;
    const { access_token, refresh_token } = cookies;

    // Get user information
    const response = await axios
      .get(`${config.apiUrl}/built-in-command`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);

    const { data, status } = response;

    // Other errors might include not having a token at all
    if (!data || status !== 200) {
      throw new Error('Unable to get command information');
    }

    const command = data;
    return command;
  } catch (error) {
    console.log(error);
    return [];
  }
}
