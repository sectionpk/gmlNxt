const { MongoClient } = require('mongodb');
require('dotenv').config();

// MongoDB connection URI
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

// Database and collection variables
let dbInstance;
let mainCollection;
let userCollection;

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    // Get database reference with specific name
    dbInstance = client.db('testdb');
    
    // Get or create collections
    mainCollection = dbInstance.collection('maintable');
    userCollection = dbInstance.collection('users');
    
    // Create indexes for the collections if needed
    await mainCollection.createIndex({ date: 1 });
    await userCollection.createIndex({ username: 1 });
    
    console.log('MongoDB collections ready');
    
    return {
      db: dbInstance,
      client,
      mainCollection,
      userCollection,
      // Adding methods to mimic MySQL interface for compatibility
      query: async (query, values, callback) => {
        try {
          // This is a simplified adapter for MySQL queries
          // In a real application, you would need to parse the query and convert it to MongoDB operations
          
          // Basic SQL query parsing for common operations
          if (query.toLowerCase().includes('select * from maintable')) {
            const results = await mainCollection.find({}).toArray();
            if (typeof callback === 'function') {
              callback(null, results);
            }
            return results;
          } 
          else if (query.toLowerCase().includes('select * from users where username = ? and password = ?')) {
            const results = await userCollection.find({ 
              username: values[0], 
              password: values[1] 
            }).toArray();
            if (typeof callback === 'function') {
              callback(null, results);
            }
            return results;
          }
          else if (query.toLowerCase().includes('create table if not exists maintable')) {
            // No need to create tables in MongoDB, collections are created automatically
            if (typeof callback === 'function') {
              callback(null, { message: 'Collection ready' });
            }
            return { message: 'Collection ready' };
          }
          else if (query.toLowerCase().includes('drop table')) {
            // Drop collection instead of table
            const tableName = query.split('drop table ')[1].trim();
            await dbInstance.collection(tableName).drop();
            if (typeof callback === 'function') {
              callback(null, { message: 'Collection dropped' });
            }
            return { message: 'Collection dropped' };
          }
          else {
            // Default response for unhandled queries
            if (typeof callback === 'function') {
              callback(null, { message: 'Operation completed' });
            }
            return { message: 'Operation completed' };
          }
        } catch (error) {
          if (typeof callback === 'function') {
            callback(error, null);
          }
          throw error;
        }
      }
    };
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    throw err;
  }
}

// Initialize connection
const dbPromise = connectToMongoDB();

// Export a proxy object that resolves methods when the connection is established
const database = new Proxy({}, {
  get: (target, prop) => {
    return async (...args) => {
      const connection = await dbPromise;
      if (prop === 'mainCollection') {
        return connection.mainCollection;
      }
      if (prop === 'userCollection') {
        return connection.userCollection;
      }
      if (typeof connection[prop] === 'function') {
        return connection[prop](...args);
      }
      return connection[prop];
    };
  }
});

module.exports = database;