const Block = require('./block');
const Blockchain = require('./Blockchain');
const Transaction = require('./transaction');
const BlockchainNode = require('./blockchainNode');
const express = require('express');
const fetch = require('node-fetch');
const app = express();

const arguments = process.argv;
let PORT = 8080;

if (arguments.length > 2) {
  PORT = arguments[2];
}

app.use(express.json());

let transactions = [];
let nodes = [];
let allTransactions = [];

let genesisBlock = new Block();
let blockchain = new Blockchain(genesisBlock);

app.get('/resolve', (req, res) => {
  nodes.forEach((node) => {
    fetch(`http://${node.url}/blockchain`)
      .then((response) => response.json())
      .then((otherBlockchain) => {
        if (blockchain.blocks.length < otherBlockchain.blocks.length) {
          allTransactions.forEach((transaction) => {
            fetch(`http://${node.url}/transactions`, {
              method: 'POST',
              headers: {
                'Content-Type': 'applications/json',
                body: JSON.stringify(transaction),
              },
            })
              .then((response) => response.json())
              .then((_) => {
                fetch(`http://${node.url}/mine`)
                  .then((response) => response.json())
                  .then((_) => {
                    fetch(`http://${node.url}/blockchain`)
                      .then((response) => response.json())
                      .then((updatedBlockchain) => {
                        blockchain = updatedBlockchain;
                        res.json(blockchain);
                      });
                  });
              });
          });
        } else {
          res.json(blockchain);
        }
      });
  });
});

app.post('/nodes/register', (req, res) => {
  const urls = req.body;

  urls.forEach((url) => {
    const node = new BlockchainNode(url);
    nodes.push(node);
  });

  res.json(nodes);
});

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
  transactions.forEach((transaction) => allTransactions.push(transaction));
  transactions = [];
  res.json(block);
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
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
