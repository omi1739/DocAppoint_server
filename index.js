const express = require('express')
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
app.use(cors());

const PORT = process.env.PORT || 5000





const uri = process.env.MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    // Connect the client to the server	(optional starting in v4.7)

    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const db = client.db('docAppoint');
    const doctorsCollection = db.collection('doctors');


    app.get('/doctors' , async(req,res) => {

        const cursor = doctorsCollection.find();
        const result = await cursor.toArray();
        console.log(result);
        res.send(result);

    })

    app.get('/doctors/:doctorId' , async(req,res) => {

        const {doctorId} = req.params;
        

    })




  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('Hello OMIBOSS');
})


app.listen(PORT, () => {
    console.log(`The port is running on localhost:${PORT}`);
    
})