import React from "react";

function VotingPage({ candidates, vote }) {
  // Ensure candidates is an array and display accordingly
  if (!Array.isArray(candidates)) {
    return <p>Error: Candidates data is not available.</p>;
  }

  return (
    <div>
      <h2>Vote for a Candidate</h2>
      {candidates.length === 0 ? (
        <p>No candidates registered yet.</p>
      ) : (
        <ul>
          {candidates.map((candidate) => (
            <li key={candidate.id}>
              <p>{candidate.name}</p>
              <p>Votes: {candidate.voteCount}</p>
              <button onClick={() => vote(candidate.id)}>Vote</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default VotingPage;
