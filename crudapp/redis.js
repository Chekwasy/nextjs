import { createClient } from 'redis';
const client = createClient({
  socket: {
    port: 6379,
    host: 'localhost',
  },
});

class RedisClient {
        constructor() {
                this.client = this.connects();
        }

        isAlive() {
                return this.clientConnected;
        }

        async connects() {
                try {
                        await client.connect();
                        await client.ping();
                        this.clientConnected = true;
                        return client;
                } catch (err) {
                        this.clientConnected =false;
                        return cli;
                }
        }

        async get(key) {
		return await client.get(key);
	}

        async set(key, value, duration) {
		await client.set(key, value, {
  			EX: duration,
  			NX: true
		});
	}

        async del(key) {
		await client.del(key);
	}
}

const redisClient = new RedisClient();

export default redisClient;