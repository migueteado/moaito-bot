import config from '../config';
import axios from 'axios';

export async function getReward(context) {
  try {
    const { req, res } = context;
    const { cookies, query } = req;
    const { access_token, refresh_token } = cookies;

    const response = await axios
      .get(`${config.apiUrl}/reward`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);

    const { data, status } = response;

    // Other errors might include not having a token at all
    if (!data || status !== 200) {
      throw new Error('Unable to get reward information');
    }

    const rewards = data;
    return rewards;
  } catch (error) {
    console.log(error);
    return [];
  }
}
