const axios = require('axios');

const { NIUBIZ_SECURITY_ENDPOINT, NIUBIZ_SESSION_ENDPOINT, NIUBIZ_MERCHANT_ID, MERCHANT_NAME, MERCHANT_PASSWORD } = require('../config/envConfig');


const fetchAccessToken = async () => {
    // Construct credentials for Basic Auth
    const CREDENTIALS = `${MERCHANT_NAME}:${MERCHANT_PASSWORD}`;
    const CREDENTIALSBASE64 = Buffer.from(CREDENTIALS).toString('base64');
  
  const accessTokenResponse = await axios.get(
    NIUBIZ_SECURITY_ENDPOINT,
    {
    headers: {
      'Content-Type': 'text/plain',
      Authorization: `Basic ${CREDENTIALSBASE64}`,
    },
  });

  return accessTokenResponse.data;
};

const fetchSessionKey = async (accessToken, payload) => {
  const sessionKeyResponse = await axios.post(
    `${NIUBIZ_SESSION_ENDPOINT}/${NIUBIZ_MERCHANT_ID}`,
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${accessToken}`,
      },
    }
  );

  if (!sessionKeyResponse || !sessionKeyResponse.data || !sessionKeyResponse.data.sessionKey) {
    throw new Error('Invalid session key response');
  }

  return sessionKeyResponse.data.sessionKey;
};

module.exports = {
  fetchAccessToken,
  fetchSessionKey,
};
