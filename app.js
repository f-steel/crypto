const Block = require('./block');
const Blockchain = require('./Blockchain');
const Transaction = require('./transaction');

let transaction = new Transaction('John', 'Bob', 100);
let genesisBlock = new Block();

let blockchain = new Blockchain(genesisBlock);
let block = blockchain.generateNextBlock([transaction]);
blockchain.addBlock(block);

let anotherTransaction = new Transaction('Steve', 'Brian', 500);
let block1 = blockchain.generateNextBlock([anotherTransaction]);
blockchain.addBlock(block1);

console.log(blockchain);
