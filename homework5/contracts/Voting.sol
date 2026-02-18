// SPDX-License-Identifier: MIT
pragma solidity >= 0.8.2 < 0.9.0;

contract Voting
{
    struct Poll
    {
        string question;
        string[] options;
        uint[] votes;
        bool exists;
    }

    Poll[] public polls;

    mapping (uint => mapping(address => bool)) public hasVoted;

    event PollCreated(uint indexed pollId, string question);
    event Voted(uint indexed pollId, uint optionIndex, address voter);

    function create_poll(string memory _question, string[] memory _options) public
    {
        require(_options.length > 1, "At least 2 options required");
        
        uint[] memory initialVotes = new uint[](_options.length);

        polls.push(Poll
        ({
            question: _question,
            options: _options,
            votes: initialVotes,
            exists: true
        }));

        emit PollCreated(polls.length - 1, _question);
    }

    function vote(uint _pollId, uint _optionIndex) public
    {
        require(_pollId < polls.length, "Poll does not exist");
        require(!hasVoted[_pollId][msg.sender], "You`ve already voted");
        require(_optionIndex < polls[_pollId].options.length, "Invalid option");

        polls[_pollId].votes[_optionIndex]++;
        hasVoted[_pollId][msg.sender] = true;

        emit Voted(_pollId, _optionIndex, msg.sender);
    }

    function getPoll(uint _pollId) public view returns
    (
        string memory question,
        string[] memory options,
        uint[] memory votes
    )
    {
        require(_pollId < polls.length, "Poll does not exist");
        Poll storage p = polls[_pollId];
        return (p.question, p.options, p.votes);
    }

    function get_poll_count() public view returns (uint)
    {
        return polls.length;
    }
}