const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const SERVER_PORT = 4500;

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

app.listen(SERVER_PORT, () => {
    console.log(`Server is running on port ${SERVER_PORT}`);
});