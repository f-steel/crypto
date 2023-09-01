const Block = require('./block');
const Blockchain = require('./Blockchain');
const Transaction = require('./transaction');
const express = require('express');
const app = express();

app.use(express.json());

let transactions = [];

let genesisBlock = new Block();
let blockchain = new Blockchain(genesisBlock);

app.post('/transactions', (req, res) => {
  const to = req.body.to;
  const from = req.body.from;
  const amount = req.body.amount;

  const transaction = new Transaction(to, from, amount);
  transactions.push(transaction);

  res.json(transactions);
});

app.get('/blockchain', (req, res) => {
  res.json(blockchain);
});

app.get('/mine', (req, res) => {
  let block = blockchain.generateNextBlock(transactions);
  blockchain.addBlock(block);
  res.json(block);
});

app.listen(8080, () => {
  console.log('Server is running');
});

// let transaction = new Transaction('John', 'Bob', 100);
// let genesisBlock = new Block();

// let blockchain = new Blockchain(genesisBlock);
// let block = blockchain.generateNextBlock([transaction]);
// blockchain.addBlock(block);

// let anotherTransaction = new Transaction('Steve', 'Brian', 500);
// let block1 = blockchain.generateNextBlock([anotherTransaction]);
// blockchain.addBlock(block1);

// res.json(blockchain);
