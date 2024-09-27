const { setAsync, expireAsync } = require('../config/redisConfig');

/**
 * Store transaction details in Redis.
 * @param {string} transactionID - Unique transaction identifier.
 * @param {string} accessToken - Secure access token.
 * @param {string} sessionKey - Session key for the transaction.
 * @param {number} amount - Transaction amount.
 * @param {number} ttl - Time-to-live in seconds for the transaction data.
 * @returns {Promise<void>}
 */

/**
 * Retrieve transaction details from Redis.
 * @param {string} transactionID - Unique transaction identifier.
 * @returns {Promise<Object|null>} - The transaction data, or null if not found.
 */



const storeTransaction = async (transactionID, accessToken, sessionKey, amount, ttl = 900) => {
  try {
    const data = JSON.stringify({ accessToken, sessionKey, amount });
    // Store transaction data in Redis under the transactionID key
    await setAsync(transactionID, data);
    // Set expiration for this key (ttl in seconds, e.g., 900 sec = 15 mins)
    await expireAsync(transactionID, ttl);
    console.log(`Transaction ${transactionID} stored in Redis.`);
  } catch (error) {
    console.error(`Error storing transaction ${transactionID} in Redis:`, error);
    throw new Error('Redis store operation failed');
  }
};

const retrieveTransaction = async (transactionID) => {
  try {
    const data = await getAsync(transactionID);
    if (!data) {
      console.log(`Transaction ${transactionID} not found in Redis.`);
      return null;
    }
    // Parse and return the stored transaction data
    const transactionData = JSON.parse(data);
    console.log(`Transaction ${transactionID} retrieved from Redis.`);
    return transactionData;
  } catch (error) {
    console.error(`Error retrieving transaction ${transactionID} from Redis:`, error);
    throw new Error('Redis retrieve operation failed');
  }
};

module.exports = { retrieveTransaction, storeTransaction };


