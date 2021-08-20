import config from '../config';
import axios from 'axios';

export async function getWordProtection(context) {
  try {
    const { req, res } = context;
    const { cookies } = req;
    const { access_token, refresh_token } = cookies;

    // Get user information
    const response = await axios
      .get(`${config.apiUrl}/mod-tools/word-protection`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);

    const { data, status } = response;

    // Other errors might include not having a token at all
    if (!data || status !== 200) {
      throw new Error('Unable to get word protection');
    }

    const wordProtection = data;
    return wordProtection;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getLinkProtection(context) {
  try {
    const { req, res } = context;
    const { cookies } = req;
    const { access_token, refresh_token } = cookies;

    // Get user information
    const response = await axios
      .get(`${config.apiUrl}/mod-tools/link-protection`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);

    const { data, status } = response;

    // Other errors might include not having a token at all
    if (!data || status !== 200) {
      throw new Error('Unable to get link protection');
    }

    const linkProtection = data;
    return linkProtection;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getCapsProtection(context) {
  try {
    const { req, res } = context;
    const { cookies } = req;
    const { access_token, refresh_token } = cookies;

    // Get user information
    const response = await axios
      .get(`${config.apiUrl}/mod-tools/caps-protection`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);

    const { data, status } = response;

    // Other errors might include not having a token at all
    if (!data || status !== 200) {
      throw new Error('Unable to get caps protection');
    }

    const capsProtection = data;
    return capsProtection;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getSymbolProtection(context) {
  try {
    const { req, res } = context;
    const { cookies } = req;
    const { access_token, refresh_token } = cookies;

    // Get user information
    const response = await axios
      .get(`${config.apiUrl}/mod-tools/symbol-protection`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);

    const { data, status } = response;

    // Other errors might include not having a token at all
    if (!data || status !== 200) {
      throw new Error('Unable to get symbol protection');
    }

    const symbolProtection = data;
    return symbolProtection;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getParagraphProtection(context) {
  try {
    const { req, res } = context;
    const { cookies } = req;
    const { access_token, refresh_token } = cookies;

    // Get user information
    const response = await axios
      .get(`${config.apiUrl}/mod-tools/paragraph-protection`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then((res) => res)
      .catch((err) => err.response);

    const { data, status } = response;

    // Other errors might include not having a token at all
    if (!data || status !== 200) {
      throw new Error('Unable to get paragraph protection');
    }

    const paragraphProtection = data;
    return paragraphProtection;
  } catch (error) {
    console.log(error);
    return [];
  }
}
