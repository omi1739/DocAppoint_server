const express = require('express')
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const { createRemoteJWKSet } = require('jose-cjs');
app.use(cors());

const PORT = process.env.PORT || 5000

const uri = process.env.MONGODB_URI;


const JWKS =  createRemoteJWKSet(
      new URL(`${process.env.CLIENT_URL}/api/auth/jwks`)
    )
    console.log(JWKS);


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


const logger = (req,res,next) => {
      console.log(req.params);
      next();
    } 


 const verifyToken = async (req,res , next)=> {

  const {authorization} = req.headers;
  const token = authorization?.split(' ')[1];

  if(!token){
    return res.status(401).json({message: 'Unauthorized'});
  }


   try {
    const JWKS = createRemoteJWKSet(
      new URL('http://localhost:3000/api/auth/jwks')
    )
    const { payload } = await jwtVerify(token, JWKS);

    req.user = payload;

    // console.log(payload);
  } catch (error) {
    console.error('Token validation failed:', error)
    return res.status(401).json({message: 'Unauthorized'});
  }


  // console.log(token)
// console.log(req.headers)
  next();
 }   



async function run() {
  try {

    // Connect the client to the server	(optional starting in v4.7)

    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const db = client.db('docAppoint');
    const doctorsCollection = db.collection('appointments');


    app.get('/appointments' , async(req,res) => {

        const cursor = doctorsCollection.find();
        const result = await cursor.toArray();
        console.log(result);
        res.send(result);

    })

    app.get('/appointments/:appointmentId', logger , verifyToken ,async(req,res) => {

        const {appointmentId} = req.params;
        
        const query = {_id: new ObjectId(appointmentId)}
        const result = await doctorsCollection.findOne(query);
        res.send(result)

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