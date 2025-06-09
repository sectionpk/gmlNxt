import { MongoClient, Db, Collection } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/';
const client = new MongoClient(uri);

let dbInstance: Db;
let mainCollection: Collection;
let userCollection: Collection;

export async function connectToMongoDB() {
  try {
    if (!dbInstance) {
      await client.connect();
      console.log('Connected to MongoDB');
      
      dbInstance = client.db('testdb');
      mainCollection = dbInstance.collection('maintable');
      userCollection = dbInstance.collection('users');
      
      // Create indexes for the collections if needed
      await mainCollection.createIndex({ date: 1 });
      await userCollection.createIndex({ username: 1 });
      
      console.log('MongoDB collections ready');
    }
    
    return {
      db: dbInstance,
      client,
      mainCollection,
      userCollection,
    };
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    throw err;
  }
}

export async function getMainCollection() {
  const connection = await connectToMongoDB();
  return connection.mainCollection;
}

export async function getUserCollection() {
  const connection = await connectToMongoDB();
  return connection.userCollection;
}

export default connectToMongoDB;