export async function connectToDatabases() {
  try {
    for (const collectionKey in dbConfig) {
      const collectionConfig = dbConfig[collectionKey];
      const client = await MongoClient.connect(collectionConfig.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      const database = client.db(collectionConfig.dbName);
      const collection = database.collection(collectionConfig.collectionName);

      databases[collectionKey] = {
        client: client,
        database: database,
        collection: collection,
      };

      console.log(`Connected to MongoDB for collection: ${collectionKey}`);
    }
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    throw err;
  }
}

export async function closeDatabaseConnections() {
  try {
    for (const collectionKey in databases) {
      const db = databases[collectionKey];
      await db.client.close();
      console.log(`Closed connection to MongoDB for collection: ${collectionKey}`);
    }
  } catch (err) {
    console.error("Error closing MongoDB connections:", err);
    throw err;
  }
}
