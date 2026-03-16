const crypto = require('crypto');

class HashChain {
  constructor() {
    this.chain = [];
    this.createGenesisBlock();
  }

  createGenesisBlock() {
    this.chain.push({
      index: 0,
      timestamp: new Date().toISOString(),
      data: 'Genesis Block',
      previousHash: '0',
      hash: this.calculateHash(0, 'Genesis Block', '0')
    });
  }

  calculateHash(index, data, previousHash, timestamp) {
    return crypto.createHash('sha256').update(index + previousHash + timestamp + JSON.stringify(data)).digest('hex');
  }

  addBlock(data) {
    const previousBlock = this.chain[this.chain.length - 1];
    const index = previousBlock.index + 1;
    const timestamp = new Date().toISOString();
    const previousHash = previousBlock.hash;
    const hash = this.calculateHash(index, data, previousHash, timestamp);
    
    const newBlock = { index, timestamp, data, previousHash, hash };
    this.chain.push(newBlock);
    return newBlock;
  }

  verifyChain() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
      if (currentBlock.hash !== this.calculateHash(currentBlock.index, currentBlock.data, currentBlock.previousHash, currentBlock.timestamp)) {
        return false;
      }
    }
    return true;
  }

  verifyRecord(recordId) {
    const block = this.chain.find(b => b.data && b.data.recordId === recordId);
    if (!block) return { valid: false, message: "Record not found" };
    
    // Check if chain is structurally sound up to this block (simple validation check)
    return { valid: this.verifyChain(), block };
  }
}

const govChain = new HashChain();
module.exports = govChain;
