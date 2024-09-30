import { promisify } from 'util';
import { createClient } from 'redis';

/**
 * Represents a Redis client.
 */
class RedisClient {
  /**
   * Creates a new RedisClient instance.
   */
  constructor() {
    // Create a Redis client
    this.client = createClient();
    this.isClientConnected = true;

    // Handle Redis client errors
    this.client.on('error', (err) => {
      console.error('Redis client failed to connect:', err.message || err.toString());
      this.isClientConnected = false;
    });

    // Handle Redis client connection
    this.client.on('connect', () => {
      this.isClientConnected = true;
    });
  }

  /**
   * Checks if this client's connection to the Redis server is active.
   * @returns {boolean} True if the connection is active, otherwise false.
   */
  isAlive() {
    return this.isClientConnected;
  }

  /**
   * Retrieves the value of a given key.
   * @param {String} key - The key of the item to retrieve.
   * @returns {Promise<String | Object>}:
   * The value associated with the key, or null if an error occurs.
   */
  async get(key) {
    return promisify(this.client.GET).bind(this.client)(key);
  }

  /**
   * Stores a key and its value along with an expiration time.
   * @param {String} key - The key of the item to store.
   * @param {String | Number | Boolean} value - The item to store.
   * @param {Number} duration - The expiration time of the item in seconds.
   * @returns {Promise<void>}
   */
  async set(key, value, duration) {
    await promisify(this.client.SETEX).bind(this.client)(key, duration, value);
  }

  /**
   * Removes the value of a given key.
   * @param {String} key - The key of the item to remove.
   * @returns {Promise<void>}
   */
  async del(key) {
    await promisify(this.client.DEL).bind(this.client)(key);
  }
}

// Create and export an instance of RedisClient
const redisClient = new RedisClient();
export default redisClient;
