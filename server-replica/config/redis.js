const redis = require('redis');

// setting up the redis client for caching
// using this to cache the catalog so we don't hit postgres every time
const redisClient = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

// basic error logging for redis
redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

redisClient.on('connect', () => {
    console.log('Redis connected successfully.');
});

// auto-connect function
(async () => {
    try {
        // don't connect if we are just running tests
        if (process.env.NODE_ENV !== 'test') {
            await redisClient.connect();
        }
    } catch (err) {
        console.error('Could not connect to Redis:', err);
    }
})();

module.exports = redisClient;