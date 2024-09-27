const redis = require('redis');
const { promisify } = require('util');

// Create a promise-based wrapper for the Redis client connection
const createRedisClient = () => {
  return new Promise((resolve, reject) => {
    // Create Redis Client
    const client = redis.createClient({
      host: process.env.REDIS_HOST || '127.0.0.1',   // Customize based on production env
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD || null,  // Secure with password in production
    });

    // Handle connection events
    client.on('ready', () => {
      console.log('Redis client connected successfully');
      resolve(client); // Resolve the promise with the client
    });

    client.on('error', (err) => {
      console.error('Redis connection error:', err);
      reject(err); // Reject the promise if there is an error
    });
  });
};

// Usage example with async/await
const initRedisClient = async () => {
  try {
    const client = await createRedisClient();
    
    // Promisify Redis commands for async/await use
    const setAsync = promisify(client.set).bind(client);
    const getAsync = promisify(client.get).bind(client);
    const expireAsync = promisify(client.expire).bind(client);

    // Export client and promisified commands
    return {
      client,
      setAsync,
      getAsync,
      expireAsync
    };
  } catch (error) {
    console.error('Failed to create Redis client:', error);
    throw error; // Handle or propagate the error as needed
  }
};

// Initialize Redis client and export
module.exports = initRedisClient();

