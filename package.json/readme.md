# Receipt Processor Challenge

This repository holds my source code for a take-home exam for Fetch Rewards, this assignment runs a server using javascript and adds to endpoints to this server to:

-Used node.js and VSCODE editor to develop the project. you have to install following commands.
-npm install express 
-npm install express-validator
-npm install joi
-npm install uuid


**Note:**
-This project has two main files app.js and index.html
-App.js has both end points /receipt/process and /receipt/id/process which has generating id and calculating points.
-Index.html has front end part in which both post and get request are operated. Give the whole json data as input mentioned in the example.
{
  "retailer": "Target",
  "purchaseDate": "2022-01-01",
  "purchaseTime": "13:01",
  "items": [{"shortDescription": "Mountain Dew 12PK",
      "price": "6.49"},{"shortDescription": "Emils Cheese Pizza",
      "price": "12.25"},{"shortDescription": "Knorr Creamy Chicken",
      "price": "1.26"},{"shortDescription": "Doritos Nacho Cheese",
      "price": "3.35"},{"shortDescription": "Klarbrunn 12-PK 12 FL OZ  ",
      "price": "12.00"}],
  "total": "35.35"
}
-Ouput is displayed on html page when you operate the get request.


# Helpful Links/Rules

- [This link includes the rules around how points are accrued for a given _Receipt_ object](https://github.com/fetch-rewards/receipt-processor-challenge#rules)
