const Block = require('./block');
const Blockchain = require('./Blockchain');
const Transaction = require('./transaction');

let transaction = new Transaction('John', 'Bob', 100);
let genesisBlock = new Block();

let blockchain = new Blockchain(genesisBlock);
let block = blockchain.generateNextBlock([transaction]);
blockchain.addBlock(block);

console.log(blockchain);
