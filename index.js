import express from 'express';
import mongodb from 'mongodb';
import dotenv from 'dotenv';
import { parseString } from 'xml2js';
import cors from 'cors';
 
const { MongoClient } = mongodb;
dotenv.config();


const username = encodeURIComponent("lebara");
const password = encodeURIComponent("Lebara@123");

const app = express();
const port = 3000;

app.use(cors());

// const url = 'mongodb://localhost:27017';
const uri = `mongodb+srv://${username}:${password}@apidemo.0znua.mongodb.net/?retryWrites=true&w=majority&appName=apidemo`;

const client = new MongoClient(uri);

const dbName = 'lebaraDB';


async function connectDB() {
    try {
      await client.connect();
      const db = client.db(dbName);
      console.log('Connected to MongoDB Atlas');
      const users = db.collection('users');
      app.get('/api/users', async (req, res) => {
        const { email, msisdn } = req.query; 
        let query = {};
        if (email) 
          query.email = new RegExp(`^${email}$`, 'i'); 
        if (msisdn) 
          query.msisdn = new RegExp(`^${msisdn}$`, 'i'); 
        const queriedUsers = await users?.find(query).toArray();
        res.json(queriedUsers);
      });
      const personalizationCollection = db.collection('personalizationRules');
      app.get('/api/personalizationRules', async (req, res) => {
        const { pageurl, condition_value } = req.query; 
        let query = {};
        let queriedPersonalizationRules;
        if (pageurl && condition_value) {
          query.pageurl = new RegExp(`^${pageurl}$`, 'i'); 
          query.condition_value = new RegExp(`^${condition_value}$`, 'i'); 
          queriedPersonalizationRules = await personalizationCollection?.find(query).toArray();
        } else {
          queriedPersonalizationRules = [];
        }
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