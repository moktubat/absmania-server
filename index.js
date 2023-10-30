const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.odqhq4i.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();
    
    const usersCollection = client.db("absManiaDb").collection("users");
    const workOutsCollection = client.db("absManiaDb").collection("workOuts");
    const trainersCollection = client.db("absManiaDb").collection("trainers");
    const blogsCollection = client.db("absManiaDb").collection("blogs");
    const recipesCollection = client.db("absManiaDb").collection("recipes");
    const testimonialsCollection = client
      .db("absManiaDb")
      .collection("testimonials");

    // ==============users db create====================
    app.post("/users", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const existingUser = await usersCollection.findOne(query);
      if (existingUser) {
        return res.send("user already exists");
      }
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    // ========get all users api============
    app.get("/users", async (req, res) => {
      let query = {};
      const result = await usersCollection.find(query).toArray();
      res.send(result);
    });

    // ======== get and post work out api =============
    app.get("/workOuts", async (req, res) => {
      const result = await workOutsCollection.find().toArray();
      res.send(result);
    });
    app.post("/workOuts", async (req, res) => {
      const feedback = req.body;
      const result = await workOutsCollection.insertOne(feedback);
      res.send(result);
    });
    
    // ======== get and post blogs api =============
    app.get("/blogs", async (req, res) => {
      const result = await blogsCollection.find().toArray();
      res.send(result);
    });
    app.get("/blogs", async (req, res) => {
      const result = await blogsCollection.find().toArray();
      res.send(result);
    });
    // ======== get single blog api =============
    app.get("/blog/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await blogsCollection.findOne(query);
      res.send(result);
    });
    // ======== get all recipes api =============
    app.get("/recipes", async (req, res) => {
      const result = await recipesCollection.find().toArray();
      res.send(result);
    });

    // ======== get all trainers api =============
    app.get("/trainers", async (req, res) => {
      const result = await trainersCollection.find().toArray();
      res.send(result);
    });

    // ======== get and post testimonials api =============
    app.get("/testimonials", async (req, res) => {
      const result = await testimonialsCollection.find().toArray();
      res.send(result);
    });
    app.post("/testimonials", async (req, res) => {
      const feedback = req.body;
      const result = await testimonialsCollection.insertOne(feedback);
      res.send(result);
    });

    

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Connected to MongoDB ✅");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server is running");
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
