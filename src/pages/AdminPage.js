import React from 'react';

const AdminPage = ({ candidates, deleteCandidate, registerCandidate, candidateName, setCandidateName }) => {
  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-gray-800 rounded-lg shadow-lg text-white">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-400">Admin Panel</h2>

      {/* Register New Candidate */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold mb-4">Register New Candidate</h3>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            placeholder="Candidate Name"
            className="flex-1 p-3 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={registerCandidate}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-md text-white font-semibold transition duration-300"
          >
            Register
          </button>
        </div>
      </div>

      {/* Candidate List */}
      <div>
        <h3 className="text-2xl font-semibold mb-4">Candidate List</h3>

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
                  onClick={() => deleteCandidate(candidate.id)}
                  className="delete-button-card"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No candidates found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
