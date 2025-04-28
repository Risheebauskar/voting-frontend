// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    mapping(uint => Candidate) public candidates;
    uint public candidatesCount;
    mapping(address => bool) public voters;

    address public owner; // <-- new line

    event CandidateRegistered(uint id, string name);
    event Voted(uint candidateId);

    constructor() {
        owner = msg.sender; // <-- Set the deployer as owner
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action.");
        _;
    }

    // Register a new candidate
    function registerCandidate(string memory _name) public {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
        emit CandidateRegistered(candidatesCount, _name);
    }

    // Vote for a candidate
    function vote(uint _candidateId) public {
        require(!voters[msg.sender], "You have already voted.");
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate.");

        voters[msg.sender] = true;
        candidates[_candidateId].voteCount++;
        emit Voted(_candidateId);
    }

    // Delete candidate (only admin)
    function deleteCandidate(uint _candidateId) public onlyOwner {
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate ID.");
        delete candidates[_candidateId];
    }

    // Get all candidates
    function getCandidates() public view returns (uint[] memory, string[] memory, uint[] memory) {
        uint[] memory ids = new uint[](candidatesCount);
        string[] memory names = new string[](candidatesCount);
        uint[] memory voteCounts = new uint[](candidatesCount);

        for (uint i = 1; i <= candidatesCount; i++) {
            ids[i - 1] = candidates[i].id;
            names[i - 1] = candidates[i].name;
            voteCounts[i - 1] = candidates[i].voteCount;
        }

        return (ids, names, voteCounts);
    }
}
