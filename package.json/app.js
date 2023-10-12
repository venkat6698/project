const express = require('express');
const { body, validationResult } = require('express-validator');
const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

// Store receipt data in memory (for demonstration purposes)
const receipts = {};

// Define a Joi schema for validating the receipt
const receiptSchema = Joi.object({
  retailer: Joi.string().required(),
  purchaseDate: Joi.string().required(),
  purchaseTime: Joi.string().required(),
  items: Joi.array().min(1).items(
    Joi.object({
      shortDescription: Joi.string().pattern(/^[\w\s\-]+$/).required(),
      price: Joi.string().pattern(/^\d+\.\d{2}$/).required(),
    })
  ).required(),
  total: Joi.string().pattern(/^\d+\.\d{2}$/).required(),
});

// Define an endpoint to process a receipt
app.post(
  '/receipts/process',
  [
    body('retailer').notEmpty(),
    body('purchaseDate').notEmpty(),
    body('purchaseTime').notEmpty(),
    body('items').isArray({ min: 1 }),
    body('total').notEmpty(),
    body()
      .custom((value) => {
        const { error } = receiptSchema.validate(value);
        if (error) {
          throw new Error('Invalid receipt data');
        }
        return true;
      })
      .withMessage('Invalid receipt data'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const receiptData = req.body;
    const receiptId = uuidv4();
    receipts[receiptId] = receiptData;
    res.json({ id: receiptId });
  }
);

// Define an endpoint to get points for a receipt by ID
app.get('/receipts/:id/points', (req, res) => {
  const receiptId = req.params.id;

  if (receipts[receiptId]) {
    const p = calculatePoints(receipts,receiptId);
    res.json({ points: p });
  } else {
    res.status(404).json({ message: 'No receipt found for that id' });
  }
});
function calculatePoints(receipts,receiptId) {
    let totalPoints = 0;
    const receipt = receipts[receiptId];
    // Rule 1: One point for every alphanumeric character in the retailer name
    totalPoints += receipt.retailer.replace(/[^a-zA-Z0-9]/g, '').length;

    // Rule 2: 50 points if the total is a round dollar amount with no cents
    const totalWithoutCents = parseFloat(receipt.total);
    if (Number.isInteger(totalWithoutCents)) {
        totalPoints += 50;
    }
    // Rule 3: 25 points if the total is a multiple of 0.25
    if (totalWithoutCents % 0.25 === 0) {
        totalPoints += 25;
    }
    // Rule 4: 5 points for every two items on the receipt
    totalPoints += Math.floor(receipt.items.length / 2) * 5;

    // Rule 5: If the trimmed length of the item description is a multiple of 3,
    // multiply the price by 0.2 and round up to the nearest integer. The result is the number of points earned.
    for (const item of receipt.items) {
        const trimmedDescription = item.shortDescription.trim();
        if (trimmedDescription.length % 3 === 0) {
            const itemPoints = Math.ceil(parseFloat(item.price) * 0.2);
            totalPoints += itemPoints;
        }
    }
  
    // Rule 6: 6 points if the day in the purchase date is odd
    const purchaseDate = new Date(receipt.purchaseDate);
    if (purchaseDate.getDate()%2 !=0) {
        totalPoints += 6;
    }
  
    // Rule 7: 10 points if the time of purchase is after 2:00pm and before 4:00pm
    const purchaseTime = receipt.purchaseTime.split(':');
    const hour = parseInt(purchaseTime[0]);
    if (hour >= 14 && hour <= 16) {
        totalPoints += 10;
    }
    
    return totalPoints;
  }

const port = 3000;
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html'); // Send the HTML file
  });
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
