import React from 'react';

const VotingPage = ({ candidates, voteCandidate }) => {
  return (
    <div>
      <h2>Voting Page</h2>

      {candidates.length > 0 ? (
        candidates.map((candidate) => (
          <div key={candidate.id} style={{ marginBottom: '10px' }}>
            <strong>ID:</strong> {candidate.id} | <strong>Name:</strong> {candidate.name} | <strong>Votes:</strong> {candidate.votes}
            <button
              onClick={() => voteCandidate(candidate.id)}
              style={{ marginLeft: '10px' }}
            >
              Vote
            </button>
          </div>
        ))
      ) : (
        <p>Loading candidates...</p>
      )}
    </div>
  );
};

export default VotingPage;
