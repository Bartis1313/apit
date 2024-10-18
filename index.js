const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const SERVER_PORT = 4500;
const DATA_URL = 'https://zloemu.net/servers/bf4?json';
const CACHE_INTERVAL = 2 * 60 * 1000;

const app = express();

app.use(express.json());
app.use(bodyParser.json());

app.post('/webhook', async (req, res) => {
    const { webhookUrl, webhookString } = req.body;

    try {
        const webhookData = JSON.parse(webhookString);
        await axios.post(webhookUrl, webhookData);

        res.status(200).send('Webhook relayed successfully');
    } catch (error) {
        console.error('Error relaying webhook:', error.message);

        if (error.response) {
            console.error('Response data:', error.response.data);
            res.status(error.response.status).send('Failed to relay webhook: ' + error.response.data);
        } else if (error.request) {
            console.error('No response received:', error.request);
            res.status(500).send('Failed to relay webhook: No response from Discord');
        } else {
            console.error('Error in setup:', error.message);
            res.status(500).send('Failed to relay webhook: ' + error.message);
        }
    }
});

let serverDataCache = {};

const fetchAndCacheData = async () => {
    try {
        const response = await axios.get(DATA_URL);
        serverDataCache = response.data;
    } catch (error) {
        console.error('Error fetching data:', error.message);
    }
};

setInterval(fetchAndCacheData, CACHE_INTERVAL);
fetchAndCacheData();

app.get('/server/:id', (req, res) => {
    const serverId = req.params.id;
    const server = serverDataCache[serverId];

    console.log(server);

    if (server) {
        res.json({ playerCount: Object.keys(server.players).length });
    } else {
        res.status(404).json({ error: 'Server not found' });
    }
});

app.listen(SERVER_PORT, () => {
    console.log(`Server is running on port ${SERVER_PORT}`);
});