import Redis from 'ioredis';

async function getEnsName(eoa: string): Promise<string | null> {
    // Create a new Redis client
    const redis = new Redis.Cluster([
        {
            host: 'clustercfg.ens-indexer-dev-0001-001.t484ys.usw1.cache.amazonaws.com', // Replace with your Redis cluster endpoint
            port: 6379 // Replace with your Redis cluster port
        }
    ]);

    try {
        // If the client is connecting or already connected, close the connection
        if (redis.status === 'connecting' || redis.status === 'connect') {
            await redis.disconnect();
        }

        // Connect to the Redis cluster
        await redis.connect();

        // Fetch the ENS name for the given EOA address
        const ensName = await redis.get(eoa);

        // Always remember to close the connection when done
        await redis.quit();

        return ensName;
    } catch (error : any) {
        console.error(`Error: ${error.message}`);
        // If an error occurred, make sure the connection gets closed
        await redis.quit();
        throw error;
    }
}


// Run the function with an EOA address as argument
getEnsName('0xCF1E6Ab1949D0573362f5278FAbCa4Ec74BE913C')
    .then((ensName) => {
        console.log(`ENS Name: ${ensName}`);
    })
    .catch((error) => {
        console.error(`Error: ${error.message}`);
    });
