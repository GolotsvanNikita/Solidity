import web3 from "../web3";
import mediaStoreAbi from "./abi/mediaStoreAbi.json"

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const mediaStoreContract = new web3.eth.Contract(mediaStoreAbi, contractAddress);

export default mediaStoreContract;