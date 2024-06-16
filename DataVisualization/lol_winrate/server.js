const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();

app.use(cors());

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// mongodb atlas connect
const uri = "mongodb+srv://ngcuong0812:FZSTDudoxnwIh38A@atlassearch.dryw8rf.mongodb.net/?retryWrites=true&w=majority&appName=AtlasSearch";
const mongo = new MongoClient(uri);

mongo.connect().then(() => console.log("Connected")).catch(error => console.error(error))

const database = mongo.db('LOL_data');
const winrate_pos = database.collection('winrate_pos');
const best_matchups = database.collection('best_matchups');
const worst_matchups = database.collection('worst_matchups');
const match_detail = database.collection('match_detail');

const bestMatchupsCache = {};
const worstMatchupsCache = {};

app.get('/api/winrate', async (req, res) => {
    const lane = req.query.lane;
    if (lane) {
        const data = await winrate_pos.find({ lane: lane }).toArray();
        return res.status(200).json(data);
    }
    else {
        const data = await winrate_pos.find({}).toArray();
        for (const champion of data) {
            if (bestMatchupsCache[champion.championName]) {
                champion.bestMatchups = bestMatchupsCache[champion.championName];
            } else {
                const bestMatchups = await best_matchups.find({ champion1: champion.championName }).toArray();
                const bestOpponent = bestMatchups.map(x => x.champion2);
                champion.bestMatchups = bestOpponent;
                bestMatchupsCache[champion.championName] = bestOpponent;
            }

            if (worstMatchupsCache[champion.championName]) {
                champion.worstMatchups = worstMatchupsCache[champion.championName];
            } else {
                const worstMatchups = await worst_matchups.find({ champion1: champion.championName }).toArray();
                const worstOpponent = worstMatchups.map(x => x.champion2);
                champion.worstMatchups = worstOpponent;
                worstMatchupsCache[champion.championName] = worstOpponent;
            }
        }
        // console.log(data)
        return res.status(200).json(data);
    }
});

app.post('/api/search', async (req, res) => {
    const { query } = req.body;

    try {
        const results = await match_detail.aggregate([
            {
                $search: {
                    index: 'text_search', // index name
                    text: {
                        query: query,
                        path: {
                            wildcard: "*"
                        }
                    }
                }
            }
        ]).toArray();

        res.status(200).json(results);
    } catch (error) {
        console.error('Error performing search', error);
        res.status(500).send('Error performing search');
    }
});

// server host
const port = 8080;
const ip = "localhost"

app.listen(port, ip, () => {
    console.log(`Server running at ${ip}:${port}`);
});