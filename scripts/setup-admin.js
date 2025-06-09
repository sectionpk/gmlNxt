const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/';
const client = new MongoClient(uri);

async function setupAdmin() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('testdb');
    const userCollection = db.collection('users');
    
    // Check if admin user already exists
    const existingAdmin = await userCollection.findOne({ username: 'admin' });
    
    if (!existingAdmin) {
      // Create default admin user
      await userCollection.insertOne({
        username: 'admin',
        password: 'admin123', // In production, this should be hashed
        role: 'admin',
        createdAt: new Date()
      });
      console.log('Default admin user created: username=admin, password=admin123');
    } else {
      console.log('Admin user already exists');
    }
    
    // Create indexes
    await userCollection.createIndex({ username: 1 }, { unique: true });
    console.log('User collection indexes created');
    
  } catch (error) {
    console.error('Error setting up admin:', error);
  } finally {
    await client.close();
  }
}

setupAdmin();