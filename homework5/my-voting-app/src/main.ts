import { ethers } from "ethers";
import { contractAddress, contractAbi } from "../../voting-abi";
import "./style.css";

declare global
{
  interface Window
  {
    ethereum?: any;
  }
}

let provider: any;
let signer: any;
let contract: any;

const connectBtn = document.getElementById("connectBtn") as HTMLButtonElement;
const createPollBtn = document.getElementById("createPollBtn") as HTMLButtonElement;
const statusText = document.getElementById("status") as HTMLParagraphElement;
const pollsContainer = document.getElementById("pollsContainer") as HTMLDivElement;

connectBtn.addEventListener("click", connect_wallet);
createPollBtn.addEventListener("click", create_poll);

async function connect_wallet()
{
    if (window.ethereum)
    {
      try
      {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        
        provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
        
        contract = new ethers.Contract(contractAddress, contractAbi, signer);

        const address = await signer.getAddress();
        statusText.innerText = "Connected: " + address;
        connectBtn.style.display = "none";
        
        load_polls();
      }
      catch (error)
      {
        console.error("Connection Error:", error);
        alert("Failed to connect wallet.");
      }
    }
    else
    {
      alert("Please install wallet.");
    }
}

async function create_poll()
{
  if (!contract) return alert("Connect wallet first.");
  
  const questionInput = document.getElementById("questionInput") as HTMLInputElement;
  const optionsInput = document.getElementById("optionsInput") as HTMLInputElement;

  const question = questionInput.value;
  const optionsString = optionsInput.value;
  
  if (!question || !optionsString) return alert("Fill all fields");

  const options = optionsString.split(",").map(opt => opt.trim());

  try
  {
    const tx = await contract.create_poll(question, options);
    statusText.innerText = "Transaction sent... waiting...";
    
    await tx.wait();
    
    statusText.innerText = "Poll Created.";
    alert("Poll created successfully.");
    load_polls();
  }
  catch (error)
  {
    console.error(error);
    alert("Error creating poll. Check console.");
  }
}

async function load_polls()
{
  if (!contract) return;
  pollsContainer.innerHTML = "Loading...";

  try
  {
    const count = await contract.get_poll_count();
    pollsContainer.innerHTML = ""; 

    for (let i = 0; i < count; i++)
    {
      const poll = await contract.getPoll(i);
      const question = poll[0];
      const options = poll[1];
      const voteCounts = poll[2];

      let optionsHtml = "";
      options.forEach((opt: string, idx: number) =>
      {
        optionsHtml +=
        `
          <div style="margin: 5px 0;">
            ${opt}: ${voteCounts[idx].toString()} votes
            <button class="vote-btn" data-poll="${i}" data-option="${idx}">Vote</button>
          </div>
        `;
      });

      const pollCard = document.createElement("div");
      pollCard.className = "card";
      pollCard.innerHTML = `<h3>Poll #${i}: ${question}</h3>${optionsHtml}`;
      
      pollsContainer.appendChild(pollCard);
    }

    document.querySelectorAll(".vote-btn").forEach(btn =>
    {
      btn.addEventListener("click", (e) =>
      {
        const target = e.target as HTMLButtonElement;
        const pollId = target.getAttribute("data-poll");
        const optionIdx = target.getAttribute("data-option");
        if (pollId !== null && optionIdx !== null)
        {
          vote(Number(pollId), Number(optionIdx));
        }
      });
    });

  }
  catch (error)
  {
    console.error("Error loading polls: ", error);
    pollsContainer.innerHTML = "Error loading polls.";
  }
}

async function vote(pollId: number, optionIndex: number)
{
  if (!contract) return alert("Connect wallet first.");

  try
  {
    const tx = await contract.vote(pollId, optionIndex);
    statusText.innerText = "Voting... waiting...";
    
    await tx.wait();
    
    alert("Voted successfully.");
    load_polls();
  }
  catch (error)
  {
    console.error(error);
    alert("Error voting.");
  }
}