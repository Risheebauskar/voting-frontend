import React from 'react';

const VotingPage = ({ candidates, voteCandidate }) => {
  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-gray-800 rounded-lg shadow-lg text-white">
      <h2 className="text-3xl font-bold mb-6 text-center text-green-400">Voting Page</h2>

      {candidates.length > 0 ? (
        <div className="space-y-6">
          {candidates.map((candidate) => (
            <div key={candidate.id} className="candidate-card">
              <div className="candidate-details">
                <p><span className="font-bold">ID:</span> {candidate.id}</p>
                <p><span className="font-bold">Name:</span> {candidate.name}</p>
                <p><span className="font-bold">Votes:</span> {candidate.votes}</p>
              </div>
              <button
                onClick={() => voteCandidate(candidate.id)}
                className="vote-button-card"
              >
                Vote
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center">Loading candidates...</p>
      )}
    </div>
  );
};

export default VotingPage;
