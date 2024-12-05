import fetch from 'node-fetch';
import axios from 'axios';
import express from 'express';
import mongodb from 'mongodb';
import dotenv from 'dotenv';

// URL of the API
const apiUrl = 'https://jsonplaceholder.typicode.com/posts/1';

const apiUrlPost = 'https://jsonplaceholder.typicode.com/posts';

const { MongoClient } = mongodb;

const username = encodeURIComponent("lebara");
const password = encodeURIComponent("Lebara@123");

// const url = 'mongodb://localhost:27017';
const uri = `mongodb+srv://${username}:${password}@apidemo.0znua.mongodb.net/?retryWrites=true&w=majority&appName=apidemo`;

const client = new MongoClient(uri);

const dbName = 'lebaraDB';


async function connectDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

async function updateUser(email, newData) {
  try {
    const db = client.db(dbName);
    const collection = db.collection('users');
    // Connect to the MongoDB server
    await client.connect();
    // Update a specific user based on their email
    const result = await collection.updateOne(
      { email: email }, // Filter criteria
      { $set: newData } // Fields to update
    );

    if (result.matchedCount > 0) {
      console.log('User updated successfully:', result);
    } else {
      console.log('No user found with the specified email.');
    }
  } catch (error) {
    console.error('Error updating user:', error);
  } finally {
    await client.close();
  }
}

// updateUser("87c578a-dbc1-43-wso@gb.com", { age: 30, name: 'Esack Nazir' });

const getAPICall = () => {
  // Make the API call
  axios.get(apiUrl)
  .then((response) => {
    // Print the response data
    console.log('API Get Response:', response.data);
  })
  .catch((error) => {
    // Print any error that occurs
    console.error('Error:', error.message);
  });
};

getAPICall();

const postAPICall = () => {
  // Data to send
  const postData = {
    title: 'My First Post',
    body: 'This is the content of my post.',
    userId: 1,
  };

  axios.post(apiUrlPost, postData)
  .then((response) => {
    console.log('API Post Response:', response.data);
  })
  .catch((error) => {
    console.error('Error:', error.message);
  });
}


async function fetchUsers() {
  try {
    const response = await fetch('http://localhost:3000/api/users');
    
    // Check for successful response
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const users = await response.json();
    console.log('Fetched Users:', users);

    // Display each user
    users.forEach(user => {
      console.log(`Name: ${user.name}, Age: ${user.age}, Email: ${user.email}`);
    });

  } catch (error) {
    console.error('Error fetching data:', error);
  }
}


fetchUsers();
// fetchUsersData();
// updateUser("87c578a-dbc1-43-wso@gb.com", { age: 30, name: 'Esack Nazir' });
