import config from '../config';
import axios from 'axios';

export async function getTimers(context) {
  try {
    const { req, res } = context;
    const { cookies } = req;
    const { access_token, refresh_token } = cookies;

    // Get user information
    const response = await axios
      .get(`${config.apiUrl}/timer`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);

    const { data, status } = response;

    // Other errors might include not having a token at all
    if (!data || status !== 200) {
      throw new Error('Unable to get timer information');
    }

    const timer = data;
    return timer;
  } catch (error) {
    console.log(error);
    return [];
  }
}
