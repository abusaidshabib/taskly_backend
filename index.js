const express = require('express');
const cors = require('cors');
const { query } = require('express');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

app.use(cors());
app.use(express.json());


const uri = process.env.DB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function dbConnect() {
  try {
    await client.connect();
    console.log("Database Connected");
  } catch (error) {
    console.log(error.name, error.message);
    res.send({
      success: false,
      error: error.message,
    });
  }
}

dbConnect();

const TASKS = client.db("tackly").collection("tasks");
app.get("/tasks/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const result = await TASKS.find({email: `${email}`}).toArray();

    res.send({
      success: true,
      data: result,
    });
  } catch (error) {
    res.send({
      success: false,
      data: error.message,
    });
  }
});


app.get("/task/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: new ObjectId(`${id}`) }
    const result = await TASKS.findOne(query);

    res.send({
      success: true,
      data: result,
    });
  } catch (error) {
    res.send({
      success: false,
      data: error.message,
    });
  }
});

app.post('/tasks', async(req, res) => {
  try {
    const task = req.body;
    const result = await TASKS.insertOne(task);

    res.send({
      success: true,
      data: result,
    });
  }

  catch (error) {
    res.send({
      success: false,
      data: error.message,
    });
  }
})


app.put('/tasks/:id', async(req, res) => {
  try {
    const id = req.params.id;
    const task = req.body;
    console.log(id)
    const result = await TASKS.updateOne({_id: new ObjectId(id)},
    {$set: task}
    );

    res.send({
      success: true,
      data: result,
    });
  }

  catch (error) {
    res.send({
      success: false,
      data: error.message,
    });
  }
})


app.delete('/tasks/:id', async(req, res) => {
  try {
    const id = req.params.id;
    console.log(id)
    const result = await TASKS.deleteOne({ _id: new ObjectId(id) }
    );

    res.send({
      success: true,
      data: result,
    });
  }

  catch (error) {
    res.send({
      success: false,
      data: error.message,
    });
  }
})

app.get('/', async (req, res) => {
  res.send("Taskly bazaar running!")
})

app.listen(port, () => {
  console.log(`Taskly app running on port ${port}`)
})