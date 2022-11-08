const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
require("dotenv").config();

// middleware
app.use(cors());
app.use(express.json());

// mongoDB connect
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.8rcwewi.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
  } finally {
  }
}
run().catch((err) => console.log(err.message));

// DB Connected
const serviceCollection = client
  .db("tourist-service-server")
  .collection("tourist-data");
console.log("Database connected");

// service query
app.get("/services", async (req, res) => {
  try {
    const cursor = serviceCollection.find({});
    const result = await cursor.toArray();
    res.send(result);
  } finally {
  }
});

app.get("/", (req, res) => {
  res.send("Hello world! Tourist server is running.");
});

app.listen(port, () => {
  console.log(`Tourist server running port is ${port}`);
});
