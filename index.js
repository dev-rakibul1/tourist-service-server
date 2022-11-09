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

// user rating
const userRating = client.db("tourist-service-server").collection("raging");

// blog information
const newServices = client
  .db("tourist-service-server")
  .collection("newServices");

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
    // console.log(result);
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

// new service data query
app.get("/newServices", async (req, res) => {
  try {
    const cursor = newServices.find({});
    const result = await cursor.toArray();
    res.send(result);
  } finally {
  }
});

// rating query
app.get("/userRating", async (req, res) => {
  try {
    const cursor = userRating.find({});
    const result = await cursor.toArray();
    res.send(result);
  } finally {
  }
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

app.post("/userRating", async (req, res) => {
  try {
    const result = await userRating.insertOne(req.body);

    if (result.acknowledged) {
      res.send({
        success: true,
        message: "Thanks for reviews",
      });
    } else {
      res.send({
        success: false,
        error: "Fail! your reviews",
      });
    }
  } finally {
  }
});

// added a new service
app.post("/newServices", async (req, res) => {
  try {
    const result = await newServices.insertOne(req.body);
    console.log(result);

    if (result.acknowledged) {
      res.send({
        success: true,
        message: "Service added successfully",
      });
    } else {
      res.send({
        success: false,
        error: "Service added fail!",
      });
    }
  } finally {
  }
});

// delete data
app.delete("/newServices/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await newServices.deleteOne(query);

    if (result.deletedCount) {
      res.send({
        success: true,
        message: "Delete successfully",
      });
    } else {
      res.send({
        success: false,
        error: "Delete fail!",
      });
    }
  } finally {
  }
});

// raging delete
app.delete("/userRating/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await userRating.deleteOne(query);

    if (result.deletedCount) {
      res.send({
        success: true,
        message: "Delete successfully",
      });
    } else {
      res.send({
        success: false,
        error: "Delete fail!",
      });
    }
  } finally {
  }
});

app.get("/", (req, res) => {
  res.send("Hello world! Tourist server is running.");
});

app.listen(port, () => {
  console.log(`Tourist server running port is ${port}`);
});
