const candidates = require('./candidates.js');
const fs = require('fs');
const web3 = require('./web3Client.js');
console.log(web3.eth.accounts);
const code = fs.readFileSync('Voting.sol').toString();
const solc = require('solc');
const compiledCode = solc.compile(code);
const abiDefinition = JSON.parse(compiledCode.contracts[':Voting'].interface);
const VotingContract = web3.eth.contract(abiDefinition);
const byteCode = compiledCode.contracts[':Voting'].bytecode;
const deployedContract = VotingContract.new(candidates, { data: byteCode, from: web3.eth.accounts[0], gas: 4700000 });
//This was the problematic line
//const contractInstance = VotingContract.at(deployedContract.address)

module.exports = deployedContract;

