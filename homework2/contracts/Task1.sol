// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

interface IQuest
{
    function start_quest(uint questId) external;
    function complete_quest(uint questId) external;
    function get_reward(uint questId) external;
}

contract QuestManager is IQuest
{
    struct Quest
    {
        string title;
        uint rewardAmount;
        uint xpReward;
        bool isActive;
    }

    struct Player
    {
        uint level;
        uint xp;
        uint gold;
        mapping(uint => bool) hasStarted;
        mapping(uint => bool) isCompleted;
        mapping(uint => bool) isRewarded;
    }

    mapping(uint => Quest) public quests;
    mapping(address => Player) public players;
    uint public nextQuestId;

    function add_quest(string memory _title, uint _reward, uint _xp) public
    {
        quests[nextQuestId] = Quest(_title, _reward, _xp, true);
        nextQuestId++;
    }

    function start_quest(uint questId) external override
    {
        require(quests[questId].isActive, "Quest not active");
        require(!players[msg.sender].hasStarted[questId], "Quest already started");
        
        players[msg.sender].hasStarted[questId] = true;
    }

    function complete_quest(uint questId) external override
    {
        require(players[msg.sender].hasStarted[questId], "Quest not started");
        require(!players[msg.sender].isCompleted[questId], "Quest already completed");

        players[msg.sender].isCompleted[questId] = true;
    }

    function get_reward(uint questId) external override
    {
        require(players[msg.sender].isCompleted[questId], "Quest not completed");
        require(!players[msg.sender].isRewarded[questId], "Reward already claimed");

        Quest memory q = quests[questId];
        players[msg.sender].isRewarded[questId] = true;
        
        players[msg.sender].gold += q.rewardAmount;
        players[msg.sender].xp += q.xpReward;

        if (players[msg.sender].xp >= players[msg.sender].level * 100)
        {
            players[msg.sender].level++;
            players[msg.sender].xp = 0;
        }
    }
}