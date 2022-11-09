const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
// all service
const touristAllServices = client
  .db("tourist-service-server")
  .collection("tourist-all-services");
console.log("Database connected");

// booking info
const bookingInfo = client
  .db("tourist-service-server")
  .collection("BookingInfo");

// blog information
const blogInfo = client.db("tourist-service-server").collection("blog");

// service query
app.get("/services", async (req, res) => {
  try {
    const cursor = serviceCollection.find({});
    const result = await cursor.limit(3).toArray();
    res.send(result);
  } finally {
  }
});

// tourist all services
app.get("/tourist-all-services", async (req, res) => {
  try {
    const cursor = touristAllServices.find({});
    const result = await cursor.toArray();
    res.send(result);
  } finally {
  }
});

// tourist single services
app.get("/tourist-all-services/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await touristAllServices.findOne(query);
    console.log(result);
    res.send(result);
  } finally {
  }
});

// blog data query
app.get("/blog", async (req, res) => {
  const cursor = blogInfo.find({});
  const result = await cursor.toArray();
  res.send(result);
});

// post method
app.post("/booking", async (req, res) => {
  const result = await bookingInfo.insertOne(req.body);
  console.log(result);

  if (result.acknowledged) {
    res.send({
      success: true,
      message: "Your form submit is successfully",
    });
  } else {
    res.send({
      success: false,
      error: "Your form send is fail!",
    });
  }
});

app.get("/", (req, res) => {
  res.send("Hello world! Tourist server is running.");
});

app.listen(port, () => {
  console.log(`Tourist server running port is ${port}`);
});
