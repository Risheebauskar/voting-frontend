import React from 'react';

const AdminPage = ({ candidates, deleteCandidate, registerCandidate, candidateName, setCandidateName }) => {
  return (
    <div>
      <h2>Admin Panel</h2>

      <div style={{ marginBottom: '20px' }}>
        <h3>Register New Candidate</h3>
        <input
          type="text"
          value={candidateName}
          onChange={(e) => setCandidateName(e.target.value)}
          placeholder="Candidate Name"
        />
        <button onClick={registerCandidate} style={{ marginLeft: '10px' }}>
          Register
        </button>
      </div>

      <div>
        <h3>Candidate List</h3>
        {candidates.length > 0 ? (
          candidates.map((candidate) => (
            <div key={candidate.id} style={{ marginBottom: '10px' }}>
              <strong>ID:</strong> {candidate.id} | <strong>Name:</strong> {candidate.name} | <strong>Votes:</strong> {candidate.votes}
              <button
                onClick={() => deleteCandidate(candidate.id)}
                style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white' }}
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>No candidates found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
