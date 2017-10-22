const express = require('express');
const contractInstance = require('./deployContract.js');
const web3 = require('./web3Client.js');
const app = express();
const bodyParser = require('body-parser');
const candidates = require('./candidates.js');
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname + 'public/index.html'));
});

app.post('/vote', function (req, res) {
  try {
    const candidateName = req.body.candidateName.trim();

    contractInstance.voteForCandidate(candidateName, { from: web3.eth.accounts[0] }, function(result) {
      const totalVotes = contractInstance.totalVotesFor.call(candidateName, { from: web3.eth.accounts[0] }).toString();
      res.send({ votes: totalVotes, name: candidateName });
    });
  } catch (e) {
    res.status('400').send(`Failed! ${e}`);
  }
});

app.get('/candidates', function(req, res) {
  try {
    const candidateVotes = candidates.map(function(candidate) {
      const votes = contractInstance.totalVotesFor.call(candidate, { from: web3.eth.accounts[0] }).toString();
      return {
        name: candidate,
        votes: votes,
      };
    });

    res.send({ candidates: candidateVotes });
  } catch (e) {
    res.status('400').send(`Failed! ${e}`);
  }
});

app.listen(3000, function () {
  console.log('App ready and listening on port 3000!')
});
