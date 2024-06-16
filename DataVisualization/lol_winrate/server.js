const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();

app.use(cors());

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// mongodb atlas connect
const uri = "mongodb+srv://killian0812:KfEXux78H4e5F5FG@killiancluster.1sfdevm.mongodb.net/?retryWrites=true&w=majority";
const mongo = new MongoClient(uri);

mongo.connect().then(() => console.log("Connected")).catch(error => console.error(error))

const database = mongo.db('LOL_data');
const collection = database.collection('win_rate');

app.get('/api/winrate', async (req, res) => {
    const lane = req.query.lane;
    if (lane) {
        const data = await collection.find({ lane: lane }).toArray();
        return res.status(200).json(data);
    }
    else {
        const data = await collection.find({}).toArray();
        return res.status(200).json(data);
    }
});

// server host
const port = 8080;
const ip = "localhost"

app.listen(port, ip, () => {
    console.log(`Server running at ${ip}:${port}`);
});