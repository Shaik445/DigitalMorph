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
        const { email } = req.query; 
        let query = {};
        if (email) 
          query.email = new RegExp(`^${email}$`, 'i'); 
        const queriedUsers = await users?.find(query).toArray();
        res.json(queriedUsers);
      });
      const personalizationCollection = db.collection('personalizationRules');
      app.get('/api/personalizationRules', async (req, res) => {
        const { email, condition_base, condition_value, pageurl } = req.query; 
        let queriedPersonalizationRules = [];
        let userQuery = {};
        userQuery.email = new RegExp(`^${email}$`, 'i'); 
        const userDetails = await users?.find(userQuery).toArray();
        queriedPersonalizationRules = await checkOffers(userDetails, personalizationCollection, condition_base, condition_value, pageurl);
        res.json(queriedPersonalizationRules);
      });
    } catch (err) {
      console.error('Error connecting to MongoDB:', err);
    }
  }


  const checkOffers = async (userDetails, personalizationCollection, condition_base, condition_value, pageurl) => {
    let query = {};
    let queriedPersonalizationRules = [];
    if(condition_base && condition_value) {
      query.condition_base = new RegExp(`^${condition_base}$`, 'i'); 
      query.condition_value = new RegExp(`^${condition_value}$`, 'i'); 
      if (pageurl) {
        query.pageurl = new RegExp(`^${pageurl}$`, 'i'); 
      }
      queriedPersonalizationRules = await personalizationCollection?.find(query).toArray();
    } else {
      const personalizedPlans = await personalizationCollection?.find({}).toArray();
      queriedPersonalizationRules = personalizedPlans?.filter((item) => {
        return item.condition_value === userDetails?.[0].plan;
      });
    }
    return queriedPersonalizationRules;
  }

  const geolocation = async (personalizationCollection, req) => {
    let query = {};
    let queriedPersonalizationRules = [];
    const { pageurl, condition_value } = req.query; 
    if (pageurl && condition_value) {
      query.pageurl = new RegExp(`^${pageurl}$`, 'i'); 
      query.condition_value = new RegExp(`^${condition_value}$`, 'i'); 
      queriedPersonalizationRules = await personalizationCollection?.find(query).toArray();
    }
    return queriedPersonalizationRules;
  }

  const dateOfJoining = async (userDetails, personalizationCollection) => {
    let queriedPersonalizationRules = [];
    const dateOfJoining = userDetails[0]?.dateOfJoining;
    if (isMoreThanOneYearOld(dateOfJoining)) {
      let query = { condition_value: 'more_than_1_year' };
      queriedPersonalizationRules= await personalizationCollection?.find(query).toArray();
    }
    return queriedPersonalizationRules;
  }

  const balance = async (userDetails, personalizationCollection) => {
    let queriedPersonalizationRules = [];
    const balance = userDetails[0]?.balance;
    if (balance < 100) {
      let query = { condition_value: 'balance' };
      queriedPersonalizationRules= await personalizationCollection?.find(query).toArray();
    }
    return queriedPersonalizationRules;
  }

  function isMoreThanOneYearOld(givenDate) {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    return new Date(givenDate) < oneYearAgo;
  }
  

  
  // Start the server and connect to the database
  app.listen(port, async () => {
    await connectDB();
    console.log(`Server is running on http://localhost:${port}`);
  });