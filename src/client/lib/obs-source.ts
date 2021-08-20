import config from '../config';
import axios from 'axios';

export async function getSourceByUser(context) {
  try {
    const { req, res } = context;
    const { cookies, query } = req;
    const { access_token, refresh_token } = cookies;

    const response = await axios
      .get(`${config.apiUrl}/source`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);

    const { data, status } = response;

    // Other errors might include not having a token at all
    if (!data || status !== 200) {
      throw new Error('Unable to get source information');
    }

    const source = data;
    return source;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getSource(context) {
  try {
    const { req, res } = context;
    const { query } = req;
    const { alertId } = query;

    const response = await axios
      .get(`${config.apiUrl}/source/${alertId}`, {})
      .then((res) => res)
      .catch((err) => err.response);

    const { data, status } = response;

    // Other errors might include not having a token at all
    if (!data || status !== 200) {
      throw new Error('Unable to get source information');
    }

    const source = data;
    return source;
  } catch (error) {
    console.log(error);
    return null;
  }
}
