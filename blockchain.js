const sha256 = require('js-sha256');
const Block = require('./block');

class Blockchain {
  constructor(genesisBlock) {
    this.blocks = [];
    this.addBlock(genesisBlock);
  }

  addBlock(block) {
    if (!this.blocks.length) {
      block.previousHash = '0000000000000000';
      block.hash = this.generateHash(block);
    }

    this.blocks.push(block);
  }

  generateNextBlock(transactions) {
    let block = new Block();
    transactions.forEach((transaction) => {
      block.addTransaction(transaction);
    });

    let previousBlock = this.getPreviousBlock();
    block.index = this.blocks.length;
    block.previousHash = previousBlock.hash;
    block.hash = this.generateHash(block);

    return block;
  }

  getPreviousBlock() {
    return this.blocks[this.blocks.length - 1];
  }

  generateHash(block) {
    let hash = sha256(block.key);

    while (!hash.startsWith('0000')) {
      block.nonce++;
      hash = sha256(block.key);
      console.log(hash);
    }

    return hash;
  }
}

module.exports = Blockchain;
