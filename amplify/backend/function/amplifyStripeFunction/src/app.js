/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/




const express = require('express')
const bodyParser = require('body-parser')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const Stripe = require('stripe')

// declare a new express app
const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});


/**********************
 * List Stripe products *
 **********************/
app.get('/products', async function(req, res) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const products = await stripe.products.list()
  if (!products || !products.data) {
      res.json([]);
      return;
  }
  const response = await Promise.all(
    products.data.map(async product => {
      const prices = await stripe.prices.list({
          product: product.id
      })
      product.prices = prices.data
      return product
    })
  );
  // Add your code here
  res.json(response);
});

/****************************
* Example post method *
****************************/

app.post('/products/:price_id/checkout', async function(req, res) {
  const priceId = req.params.price_id;
  const appUrl = req.headers.origin;
  const mode = req.body.type === 'recurring' ? 'subscription': 'payment'

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const session = await stripe.checkout.sessions.create({
    mode,
    payment_method_types: ['card'],
    line_items: [{
      price: priceId,
      quantity: 1
    }],
    cancel_url: `${appUrl}/cancel`,
    success_url: `${appUrl}/success`,
  })
  // Add your code here
  res.json(session);
});


app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
