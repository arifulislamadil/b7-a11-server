const express = require("express");
const app = express();
const port = 5000;
const cors = require("cors");
const products = require("./products.json");
require("dotenv").config();

// app.use(express.json())
app.use(cors());
app.use(express.json());
//products list

// mongodb configuration

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ksrt5.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    client.connect();
    const toysCollection = client.db("toys").collection("toysList");
    const toyCollection = client.db("toy").collection("toyList");

    //get all toys collection
    app.get("/products", async (req, res) => {
      const cursor = toysCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // get single toy from collection
    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toysCollection.findOne(query);
      // const result = await cursor.toArray();
      res.send(result);
    });

    // post a toy in the database
    app.post("/addToy", async (req, res) => {
      const newToy = req.body;
      const result = await toyCollection.insertOne(newToy);
      res.send(result);
    });

    // get single toy by using query search from the database
    app.get("/addToy", async (req, res) => {
      let query = {};
      if (req.query?.sellerEmail) {
        query = { sellerEmail: req.query.sellerEmail};
      }
      const result = await toyCollection.find(query).toArray();
      res.send(result);
    });

    // Get all toy list from the database
    app.get("/addToy", async (req, res) => {
      const cursor = toyCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });


// get single toy details from collection
app.get("/toyDetails/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await toyCollection.findOne(query);
  // const result = await cursor.toArray();
  res.send(result);
});

// delete single toy from collection

app.delete("/addToy/:id", async (req, res) => {
  const id = req.params.id;
  const query = {_id: new ObjectId(id) }
  const result = await toyCollection.deleteOne(query);
  res.send(result)
})

// update get single toy from collection
app.get("/addToy/:id", async (req, res) => {
  const id = req.params.id;
  const query = {_id: new ObjectId(id) }
  const result = await toyCollection.findOne(query);
  res.send(result)
})

// update single toy from collection
app.put("/addToy/:id", async (req,res)=>{
  const id = req.params.id;
  const filter = {_id: new ObjectId(id) }
 const options = {upsert:true}
 const updatedToy = req.body;
 const toy = {
$set:{
  name: updatedToy.name,
  pictureUrl: updatedToy.pictureUrl,
  toyName: updatedToy.toyName,
  sellerName: updatedToy.sellerName,
  subCategory: updatedToy.subCategory,
  quantity: updatedToy.quantity,
  price: updatedToy.price,
  sellerEmail: updatedToy.sellerEmail,
  rating: updatedToy.rating,
  description: updatedToy.description
}
 }
 const result = await toyCollection.updateOne(filter, toy, options);
 res.send(result)
})





 // get toys by using query search by sub category from the database
 app.get("/toyQuery", async (req, res) => {
  console.log(req.query);
  let query = {};
  if (req.query?.subCategory) {
    query = { subCategory: req.query.subCategory};
  }
  const result = await toyCollection.find(query).toArray();
  res.send(result);
});




// view details get single toy from collection
app.get("/viewDetailCategory/:id", async (req, res) => {
  const id = req.params.id;
  const query = {_id: new ObjectId(id) }
  const result = await toyCollection.findOne(query);
  res.send(result)
})









    // Send a ping to confirm a successful connection
 client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
// ........................

app.get("/", (req, res) => {
  res.send("hello world");
});
// app.get('/products', (req, res) => {
//   res.send(products)
// })
// app.get('/product/:productId', (req, res) => {
//   const id = req.params.productId;
//   res.send(products[id])
// })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
