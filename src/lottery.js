import Web3 from './web3';
import web3 from './web';

const address =;
const abi =;

export default new web3.eth.Contract(abi, address);