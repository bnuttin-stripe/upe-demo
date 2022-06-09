const express = require('express');
const app = express();
app.use(express.json());

const path = require('path');
app.use(express.static(path.join(__dirname, 'build')));

const cors = require('cors');
app.use(cors());
require('dotenv').config();

const STRIPE_KEY = process.env.REACT_APP_SK;
const STRIPE_ADMIN = process.env.REACT_APP_ADMIN;
const PORT = process.env.REACT_APP_PORT;
const BASE_URL = process.env.REACT_APP_BASE_URL;
const stripe = require('stripe')(STRIPE_KEY);

app.post("/create-payment-intent", async (req, res) => {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: 1000,  // integer 
        currency: "usd",
        application_fee_amount: 200,
        payment_method_types: ['card', 'us_bank_account'],
        transfer_data: {
            destination: 'acct_1L5qvX2a404P8jTI'
        }
    });

    res.send({
        pi: paymentIntent.id,
        clientSecret: paymentIntent.client_secret
    });
});

app.post("/update-payment-intent", async (req, res) => {
    const pi = req.body.pi;
    const type = req.body.type;
    if (type == 'card') return;
    const paymentIntent = await stripe.paymentIntents.update(
        pi,
        {
            application_fee_amount: 250,
        }
    );

    res.sendStatus(200);
});

/*
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
*/

app.use(express.static('public'));

app.listen(PORT);
