
// const express = require('express');
// const app = express();
// const mongoose = require('mongoose');
// const mongodb = require('mongodb'); 
// app.use(express.json());

// const mongoUrl="mongodb+srv://shahiliyas289:admin@cluster0.pltxb.mongodb.net/"

// const connectDB = async()=>{
//     try{
//         const conn = await mongoose.connect(mongoUrl);
//         console.log("mongodb connected");
//     }
//     catch(error){
//         console.error(error.message);
//         process.exit(1);
//     }
// }

// connectDB();

// app.get('/search-product-barcode',async(req,res) => {
//     const barcode = Number(req.query.barcode);
//     console.log("Entered barcode search api")
//     try{
//         console.log(barcode);
//         const product = await mongoose.connection.db.collection('ProductInfo').findOne({ code:barcode });
        
//         if(product){
//             res.status(200).json(product);
//         }else{
//             res.status(404).json({message:"product not found"});
//         }
//     }catch(error){
//         res.status(500).json({message:"server error",error:error.message});
//     }
// });
// const bodyParser = require('body-parser');

// const url = 'mongodb+srv://shahiliyas289:admin@cluster0.pltxb.mongodb.net/';
// const dbName = 'FoodLabel';

// app.use(bodyParser.json());

// app.post('/searchProductBarcode', async (req, res) => {
//     const barcode = Number(req.body.barcode);
//     res.send("welcome to search product barcode api");
//   try {
//     console.log("in search productbarcode api")
//     console.log(barcode);
//     const client = await mongodb.MongoClient.connect(url);
//     const db = client.db(dbName);
//     const collection = db.collection('ProductInfo'); // Replace with your collection name

//     const result = await collection.findOne({ barcode: barcode });

//     if (!result) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     res.status(200).json(result);
//     client.close();
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// app.get('/', (req, res) => {
//     res.send("Welcome to product api");
//     console.log("api called")
// });






const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const port = 3000;

app.use(express.json()); // to parse JSON requests

// MongoDB connection URI
const uri = 'mongodb://localhost:27017'; // Replace with your actual MongoDB URI

// MongoDB client
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Connect to MongoDB
client.connect()
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

// API to search barcode
app.get('/searchProductBarcode', async (req, res) => {
  try {
    // Get barcode from request body and convert to number
    const barcode = req.query.barcode;
    // Check if the barcode is valid
    if (isNaN(barcode)) {
      return res.status(400).json({ error: 'Invalid barcode format' });
    }

    // Get the collection from MongoDB
    const db = client.db('FoodLabel'); // Replace with your database name
    const collection = db.collection('ProductInfo'); // Replace with your collection name

    // Search for the barcode in the collection
    const result = await collection.findOne({ code:Number(barcode) });

    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ error: 'Barcode not found' });
    }
  } catch (err) {
    console.error('Error occurred:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log('Server is running on port 3000');
});