import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  console.log(process.env.API_URL);
  return {
    apiUrl: process.env.API_URL,
    postgres: {
      name: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT),
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      pass: process.env.DB_PASS,
    },
    apiKey: process.env.API_KEY,
    jwtSecret: process.env.JWT_SECRET,
    twitch: {
      clientId: process.env.TWITCH_CLIENT_ID,
      clientSecret: process.env.TWITCH_CLIENT_SECRET,
      redirectUri: process.env.TWITCH_REDIRECT_URI,
      authUri: process.env.TWITCH_ENDPOINT_AUTH,
      tokenUri: process.env.TWITCH_ENDPOINT_TOKEN,
      apiUri: process.env.TWITCH_ENDPOINT_API,
      apiUriOld: process.env.TWITCH_ENDPOINT_API_OLD,
    },
    chatbot: {
      token: process.env.CHATBOT_TOKEN,
      username: process.env.CHATBOT_USERNAME,
    },
  };
});
