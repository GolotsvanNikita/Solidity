// SPDX-License-Identifier: MIT

pragma solidity >=0.8.2 <0.9.0;

import "hardhat/console.sol";

contract TaskOne
{
    uint public counter = 0;

    function set_plus() public
    {
        counter++;
    }

    function set_minus() public
    {
        if (counter > 0)
        {
            counter--;
        }
        else
        {
            console.log("Error: counter can`t be less than 0.");
        }
    }

    function view_counter() view public
    {
        console.log("Counter: ", counter);
    }
}

contract TaskTwo
{
    string[] public task_arr;

    function add_task(string memory task) public
    {
        task_arr.push(task);
    }

    function remove_task(uint index) public
    {
        delete task_arr[index];
    }

    function check_tasks() view public
    {
        for (uint i = 0; i < task_arr.length; i++)
        {
            console.log("Task index: ", i);
            console.log(task_arr[i]);
        }
    }
}

contract TaskThree
{
    struct Product
    {
        string name;
        uint price;
    }

    Product[] public products;

    function add_product(string memory _name, uint _price) public
    {
        Product memory newProduct = Product(
        {
            name: _name,
            price: _price
        });

        products.push(newProduct);
    }

    function buy_product(uint index) public payable
    {
        require(index < products.length, "Product does not exist.");
        
        Product storage productToBuy = products[index];

        require(msg.value >= productToBuy.price, "Not enough funds sent");

        console.log("Product successfully bought by:", msg.sender);

        if (msg.value > productToBuy.price)
        {
            uint change = msg.value - productToBuy.price;
            payable(msg.sender).transfer(change); 
        }
    }

    function view_products() view public
    {
        for (uint i = 0; i < products.length; i++)
        {
            Product memory getProduct = products[i];

            console.log("Product ", i);
            console.log("Name: ", getProduct.name);
            console.log("Price: ", getProduct.price);
        }
    } 
}

contract TaskFour {
    struct User
    {
        string name;
        uint vote;
    }

    User[] public users;

    constructor()
    {
        users.push(User("Alex", 0));
        users.push(User("Bob", 0));
    }

    function to_vote(uint user_index) public
    {
        require(user_index < users.length);
        User storage voteUser = users[user_index];
        voteUser.vote += 1; 
    }

    function vote_check() public view
    {
        for (uint i = 0; i < users.length; i++)
        {
            console.log("User", i);
            console.log("Vote: ", users[i].vote);
        }
    }
}

contract TaskFive
{
    address public owner;
    uint public subscriptionCostPerDay;
    mapping(address => uint) public subscriptionExpiry;

    constructor(uint _costPerDay)
    {
        owner = msg.sender;
        subscriptionCostPerDay = _costPerDay;
    }

    function subscribe(uint daysCount) public payable
    {
        require(msg.value == daysCount * subscriptionCostPerDay);
        
        if (subscriptionExpiry[msg.sender] < block.timestamp)
        {
            subscriptionExpiry[msg.sender] = block.timestamp + (daysCount * 1 days);
        }
        else
        {
            subscriptionExpiry[msg.sender] += (daysCount * 1 days);
        }
    }

    function check_subscription(address user) public view returns (bool)
    {
        return subscriptionExpiry[user] > block.timestamp;
    }

    function set_subscription_cost(uint newCost) public
    {
        require(msg.sender == owner);
        subscriptionCostPerDay = newCost;
    }

    function withdraw() public
    {
        require(msg.sender == owner);
        payable(owner).transfer(address(this).balance);
    }
}

contract TaskSix
{
    struct Project
    {
        address payable author;
        string description;
        uint requiredAmount;
        uint votes;
        bool isFunded;
    }

    Project[] public projects;
    mapping(uint => mapping(address => bool)) public hasVoted;

    function donate_to_fund() public payable {}

    function propose_project(string memory _description, uint _amount) public
    {
        projects.push(Project(payable(msg.sender), _description, _amount, 0, false));
    }

    function vote(uint projectId) public
    {
        require(projectId < projects.length);
        require(!hasVoted[projectId][msg.sender]);

        hasVoted[projectId][msg.sender] = true;
        projects[projectId].votes += 1;
    }

    function distribute_funds(uint projectId) public
    {
        Project storage proj = projects[projectId];
        
        require(!proj.isFunded);
        require(proj.votes >= 5);
        require(address(this).balance >= proj.requiredAmount);

        proj.isFunded = true;
        proj.author.transfer(proj.requiredAmount);
    }

    function get_projects() public view returns (Project[] memory)
    {
        return projects;
    }
}