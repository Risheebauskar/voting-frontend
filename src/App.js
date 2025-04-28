import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import AdminPage from './pages/AdminPage';
import VotingPage from './pages/VotingPage';

const contractAddress = "0xF1aDF8C88777b4c978965607cB0EB6Ca4d9BD2b9";
const abi = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
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
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
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
];

function App() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [candidateName, setCandidateName] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    connectWallet();
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await web3Instance.eth.getAccounts();
      const contractInstance = new web3Instance.eth.Contract(abi, contractAddress);

      const ownerAddress = await contractInstance.methods.owner().call();

      setWeb3(web3Instance);
      setAccount(accounts[0]);
      setContract(contractInstance);
      setIsOwner(accounts[0].toLowerCase() === ownerAddress.toLowerCase());
      loadCandidates(contractInstance);
    } else {
      alert('Please install MetaMask!');
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

    const activeCandidates = candidateList.filter(candidate => candidate.id !== "0" && candidate.name !== "");
    setCandidates(activeCandidates);
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

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center">
        {/* Header */}
        <header className="w-full bg-gray-800 p-6 flex justify-between items-center shadow-md">
          <h1 className="text-3xl font-bold text-blue-400">Voting DApp</h1>

          <nav className="flex items-center gap-6">
            <Link
              to="/vote"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-300"
            >
              Vote
            </Link>
            {isOwner && (
              <Link
                to="/admin"
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition duration-300"
              >
                Admin
              </Link>
            )}
          </nav>
        </header>

        {/* Main Content */}
        <main className="w-full p-6 flex-grow">
          <Routes>
            <Route
              path="/vote"
              element={
                <VotingPage
                  candidates={candidates}
                  voteCandidate={voteCandidate}
                />
              }
            />
            <Route
              path="/admin"
              element={
                isOwner ? (
                  <AdminPage
                    candidates={candidates}
                    deleteCandidate={deleteCandidate}
                    registerCandidate={registerCandidate}
                    candidateName={candidateName}
                    setCandidateName={setCandidateName}
                  />
                ) : (
                  <Navigate to="/vote" replace />
                )
              }
            />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="w-full bg-gray-800 p-4 text-center text-gray-400 text-sm">
          Powered by Blockchain © 2025
        </footer>
      </div>
    </Router>
  );
}

export default App;
