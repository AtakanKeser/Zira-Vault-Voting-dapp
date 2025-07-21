// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IZiraVault {
    function balances(address user) external view returns (uint256);
}

contract ZiraGovernance is Ownable {
    enum ProposalState { ACTIVE, ACCEPTED, REJECTED }

    struct Proposal {
        uint256 id;
        address proposer;
        string description;
        uint256 yesVotes;
        uint256 noVotes;
        uint256 deadline;
        ProposalState state;
    }

    uint256 public proposalCount;
    mapping(uint256 => Proposal) private _proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    IZiraVault public vault;
    uint256 public votingDuration = 3 days;

    event ProposalCreated(uint256 indexed id, address indexed proposer, string description);
    event Voted(uint256 indexed id, address indexed voter, bool support, uint256 weight);
    event ProposalFinalized(uint256 indexed id, ProposalState result);

    constructor(address _vault) Ownable(msg.sender) {
        require(_vault != address(0), "Zero vault address");
        vault = IZiraVault(_vault);
    }

    function createProposal(string calldata description) external {
        require(vault.balances(msg.sender) > 0, "Must stake to propose");
        require(bytes(description).length > 0, "Empty description");

        proposalCount++;
        Proposal storage p = _proposals[proposalCount];
        p.id = proposalCount;
        p.proposer = msg.sender;
        p.description = description;
        p.deadline = block.timestamp + votingDuration;
        p.state = ProposalState.ACTIVE;

        emit ProposalCreated(p.id, msg.sender, description);
    }

    function vote(uint256 proposalId, bool support) external {
        Proposal storage p = _proposals[proposalId];
        require(p.id != 0, "Invalid proposal");
        require(block.timestamp <= p.deadline, "Voting ended");
        require(!hasVoted[proposalId][msg.sender], "Already voted");
        require(p.state == ProposalState.ACTIVE, "Inactive");

        uint256 votingPower = vault.balances(msg.sender);
        require(votingPower > 0, "No stake");

        hasVoted[proposalId][msg.sender] = true;

        if (support) {
            p.yesVotes += votingPower;
        } else {
            p.noVotes += votingPower;
        }

        emit Voted(proposalId, msg.sender, support, votingPower);
    }

    function finalizeProposal(uint256 proposalId) external {
        Proposal storage p = _proposals[proposalId];
        require(p.id != 0, "Invalid proposal");
        require(block.timestamp > p.deadline, "Too early");
        require(p.state == ProposalState.ACTIVE, "Already finalized");

        if (p.yesVotes > p.noVotes) {
            p.state = ProposalState.ACCEPTED;
        } else {
            p.state = ProposalState.REJECTED;
        }

        emit ProposalFinalized(proposalId, p.state);
    }

    function getProposal(uint256 proposalId)
        external
        view
        returns (
            uint256 id,
            address proposer,
            string memory description,
            uint256 yesVotes,
            uint256 noVotes,
            uint256 deadline,
            ProposalState state
        )
    {
        Proposal storage p = _proposals[proposalId];
        require(p.id != 0, "Invalid proposal");
        return (
            p.id,
            p.proposer,
            p.description,
            p.yesVotes,
            p.noVotes,
            p.deadline,
            p.state
        );
    }

    function hasUserVoted(uint256 proposalId, address user) external view returns (bool) {
        return hasVoted[proposalId][user];
    }

    function setVotingDuration(uint256 _duration) external onlyOwner {
        require(_duration >= 1 hours, "Too short");
        votingDuration = _duration;
    }
}
