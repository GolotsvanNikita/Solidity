export const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const contractAbi =
[
    {
        "anonymous": false,
        "inputs": [
        {
            "indexed": true,
            "internalType": "uint256",
            "name": "pollId",
            "type": "uint256"
        },
        {
            "indexed": false,
            "internalType": "string",
            "name": "question",
            "type": "string"
        }
        ],
        "name": "PollCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
        {
            "indexed": true,
            "internalType": "uint256",
            "name": "pollId",
            "type": "uint256"
        },
        {
            "indexed": false,
            "internalType": "uint256",
            "name": "optionIndex",
            "type": "uint256"
        },
        {
            "indexed": false,
            "internalType": "address",
            "name": "voter",
            "type": "address"
        }
        ],
        "name": "Voted",
        "type": "event"
    },
    {
        "inputs": [
        {
            "internalType": "string",
            "name": "_question",
            "type": "string"
        },
        {
            "internalType": "string[]",
            "name": "_options",
            "type": "string[]"
        }
        ],
        "name": "create_poll",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
        {
            "internalType": "uint256",
            "name": "_pollId",
            "type": "uint256"
        }
        ],
        "name": "getPoll",
        "outputs": [
        {
            "internalType": "string",
            "name": "question",
            "type": "string"
        },
        {
            "internalType": "string[]",
            "name": "options",
            "type": "string[]"
        },
        {
            "internalType": "uint256[]",
            "name": "votes",
            "type": "uint256[]"
        }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "get_poll_count",
        "outputs": [
        {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
        {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        },
        {
            "internalType": "address",
            "name": "",
            "type": "address"
        }
        ],
        "name": "hasVoted",
        "outputs": [
        {
            "internalType": "bool",
            "name": "",
            "type": "bool"
        }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
        {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }
        ],
        "name": "polls",
        "outputs": [
        {
            "internalType": "string",
            "name": "question",
            "type": "string"
        },
        {
            "internalType": "bool",
            "name": "exists",
            "type": "bool"
        }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
        {
            "internalType": "uint256",
            "name": "_pollId",
            "type": "uint256"
        },
        {
            "internalType": "uint256",
            "name": "_optionIndex",
            "type": "uint256"
        }
        ],
        "name": "vote",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]