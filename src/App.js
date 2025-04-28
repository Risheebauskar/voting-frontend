// App.js

import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import './App.css'; // optional

const contractAddress = "0xA99aF96DD8AE1A26809e1759093AcfC72F2b005E"; // replace with yours
const abi = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			}
		],
		"name": "CandidateRegistered",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_candidateId",
				"type": "uint256"
			}
		],
		"name": "deleteCandidate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			}
		],
		"name": "registerCandidate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_candidateId",
				"type": "uint256"
			}
		],
		"name": "vote",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "candidateId",
				"type": "uint256"
			}
		],
		"name": "Voted",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "candidates",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "voteCount",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "candidatesCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getCandidates",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			},
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			},
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "voters",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]; // replace with your ABI

function App() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [candidateName, setCandidateName] = useState('');
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    connectWallet();
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await web3Instance.eth.getAccounts();
      const contractInstance = new web3Instance.eth.Contract(abi, contractAddress);

      setWeb3(web3Instance);
      setAccount(accounts[0]);
      setContract(contractInstance);

      loadCandidates(contractInstance);
    } else {
      alert('Please install MetaMask!');
    }
  };

  const registerCandidate = async () => {
    if (!candidateName) {
      alert('Please enter a candidate name!');
      return;
    }
    await contract.methods.registerCandidate(candidateName).send({ from: account });
    alert(`Candidate "${candidateName}" registered successfully!`);
    setCandidateName('');
    loadCandidates(contract);
  };

  const voteCandidate = async (candidateId) => {
    await contract.methods.vote(candidateId).send({ from: account });
    alert(`You voted for candidate ID: ${candidateId}`);
    loadCandidates(contract);
  };

  const deleteCandidate = async (candidateId) => {
    if (window.confirm(`Are you sure you want to delete candidate ID ${candidateId}?`)) {
      await contract.methods.deleteCandidate(candidateId).send({ from: account });
      alert(`Candidate ID ${candidateId} deleted successfully.`);
      loadCandidates(contract);
    }
  };

  const loadCandidates = async (contractInstance) => {
    const result = await contractInstance.methods.getCandidates().call();
    const ids = result[0];
    const names = result[1];
    const voteCounts = result[2];

    const candidateList = ids.map((id, index) => ({
      id: id,
      name: names[index],
      votes: voteCounts[index]
    }));

    // Filter out deleted candidates (where id == 0 or name == "")
    const activeCandidates = candidateList.filter(candidate => candidate.id !== "0" && candidate.name !== "");

    setCandidates(activeCandidates);
  };

  return (
    <div className="App">
      <h1>Voting DApp</h1>

      <div>
        <h2>Register Candidate</h2>
        <input
          type="text"
          value={candidateName}
          onChange={(e) => setCandidateName(e.target.value)}
          placeholder="Enter candidate name"
        />
        <button onClick={registerCandidate}>Register</button>
      </div>

      <div>
        <h2>Candidate List</h2>
        {candidates.length > 0 ? (
          candidates.map((candidate) => (
            <div key={candidate.id} style={{ marginBottom: '10px' }}>
              <strong>ID:</strong> {candidate.id} | <strong>Name:</strong> {candidate.name} | <strong>Votes:</strong> {candidate.votes}
              <button onClick={() => voteCandidate(candidate.id)} style={{ marginLeft: '10px' }}>
                Vote
              </button>
              <button onClick={() => deleteCandidate(candidate.id)} style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white' }}>
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>Loading candidates...</p>
        )}
      </div>
    </div>
  );
}

export default App;
