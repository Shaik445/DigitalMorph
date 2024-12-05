import express from 'express';
import mongodb from 'mongodb';
import dotenv from 'dotenv';
import { parseString } from 'xml2js';

const { MongoClient } = mongodb;
dotenv.config();


const username = encodeURIComponent("lebara");
const password = encodeURIComponent("Lebara@123");

const app = express();
const port = 3000;

// const url = 'mongodb://localhost:27017';
const uri = `mongodb+srv://${username}:${password}@apidemo.0znua.mongodb.net/?retryWrites=true&w=majority&appName=apidemo`;

const client = new MongoClient(uri);

const dbName = 'lebaraDB';


async function connectDB() {
    try {
      await client.connect();
      const db = client.db(dbName);
      console.log('Connected to MongoDB Atlas');
      const collection = db.collection('users');
      const users = await collection.find({}).toArray();
      app.get('/api/users', (req, res) => {
        res.json(users);
      });
      const personalizationCollection = db.collection('personalizationRules');
      app.get('/api/personalizationRules', async (req, res) => {
        const { pageurl, condition_value } = req.query; 
        let query = {};
        if (pageurl) 
            query.pageurl = { $gte: parseString(pageurl) };
        if (condition_value) 
            query.condition_value = { $gte: parseString(condition_value) };
        const queriedPersonalizationRules = await personalizationCollection?.find(query).toArray();
        res.json(queriedPersonalizationRules);
      });
    } catch (err) {
      console.error('Error connecting to MongoDB:', err);
    }
  }

  
  // Start the server and connect to the database
  app.listen(port, async () => {
    await connectDB();
    console.log(`Server is running on http://localhost:${port}`);
  });