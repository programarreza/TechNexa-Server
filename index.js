const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000


// middleware
app.use(cors())
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.t29apb8.mongodb.net/?retryWrites=true&w=majority`;


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

    const categoryCollections = client.db('productDB').collection('category')
    const newsCollections = client.db('productDB').collection('news');
    const productCollections = client.db('productDB').collection('products');


    // category
    app.post('/category', async (req, res) => {
      const category = req.body;
      console.log(category);
      const result = await categoryCollections.insertOne(category)
      res.send(result);

    })

    // reade category
    app.get('/category', async (req, res) => {
      const cursor = categoryCollections.find()
      const result = await cursor.toArray();
      res.send(result)
    })

    // news
    app.post('/news', async (req, res) => {
      const news = req.body;
      console.log(news);
      const result = await newsCollections.insertOne(news);
      res.send(result)
    })

    // reade news
    app.get('/news', async (req, res) => {
      const cursor = newsCollections.find()
      const result = await cursor.toArray();
      res.send(result)
    })


    // product
    app.post('/products', async (req, res) => {
      const product = req.body;
      // console.log(product);
      const result = await productCollections.insertOne(product);
      res.send(result);
    })

    // reade product
    app.get('/products', async (req, res) => {
      const cursor = productCollections.find()
      const result = await cursor.toArray();
      res.send(result)
    })

    // brand product
    app.get('/products/:brand', async (req, res) => {
      const name = req.params.brand;
      // console.log(name);
      const query = { brand_name: name }
      // console.log(query);
      const cursor = productCollections.find(query)
      const result = await cursor.toArray()
      res.send(result)

    })

    // // single data
    // app.get('/products/:id', async(req, res) =>{
    //   const id = req.params.id;
    //   const query = {_id: new ObjectId(id)}
    //   const result = await productCollections.findOne(query)
    //   res.send(result)
    // })


    // update read
    app.get('/product-update/:id', async (req, res) => {
      const id = req.params.id;
      console.log(108, id);
      const query = { _id: new ObjectId(id) }
      const result = await productCollections.findOne(query)
      res.send(result)
    })

    app.put('/product-update/:id', async (req, res) => {
      const id = req.params.id;
      const updatedProduct = req.body;
      const filter = { _id: new ObjectId(id) }
      const options = {upsert: true};
      const product = {
        $set: {
          image: updatedProduct.image, 
          name: updatedProduct.name, 
          brand_name: updatedProduct.brand_name, 
          type: updatedProduct.type, 
          price: updatedProduct.price, 
          rating: updatedProduct.rating, 
          description: updatedProduct.description,
        }
      }

      const result = await productCollections.updateOne(filter, product, options);
      res.send(result);

    })




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send("TechNexa server is running!!")
})

app.listen(port, () => {
  console.log(`server is running on ${port}`);
})