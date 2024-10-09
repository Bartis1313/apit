const express = require('express');
const axios = require('axios');

const SERVER_PORT = 4500;

const app = express();
app.use(express.json());

app.post('/webhook', async (req, res) => {
    const { webhookUrl, webhookString } = req.body;

    try {
        await axios.post(webhookUrl, JSON.parse(webhookString));
        res.status(200).send('Webhook relayed successfully');
    } catch (error) {
        console.error('Error relaying webhook', error);
        res.status(500).send('Failed to relay webhook');
    }
});

app.listen(SERVER_PORT, () => {
    console.log(`Server is running on port ${SERVER_PORT}`);
});