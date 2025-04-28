import React, { useState } from "react";

function CandidateRegistration({ registerCandidate }) {
  const [candidateName, setCandidateName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!candidateName) {
      alert("Please enter a name for the candidate.");
      return;
    }
    registerCandidate(candidateName); // Register candidate on smart contract
    setCandidateName("");  // Clear input field after submission
  };

  return (
    <div>
      <h2>Register New Candidate</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={candidateName}
          onChange={(e) => setCandidateName(e.target.value)}
          placeholder="Candidate Name"
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default CandidateRegistration;
