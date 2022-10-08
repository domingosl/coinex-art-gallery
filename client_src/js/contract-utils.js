require('dotenv').config();

import Web3 from 'web3';

const bytecode = require('../../contracts/bytecode.json').object;
const abi = require('../../contracts/abi.json');

let web3;
let mainAccount;

module.exports.connectToCoinEx = async () => {

    if (typeof window.ethereum === 'undefined')
        return reject("No Metamask (or other Web3 Provider) installed");

    await window.ethereum.request({method: 'eth_requestAccounts'});

    web3 = new Web3(window.ethereum);

    const accounts = await web3.eth.getAccounts();

    const networkId = parseInt(await web3.eth.net.getId());
    console.log("Current network", networkId);
    if(parseInt(process.env.CSC_NET_ID) !== networkId)
        return Promise.reject({ message: "The current account does not belong to CSC" });

    mainAccount = accounts[0];

};

module.exports.deploy = (galleryId, paintings) => new Promise(async (resolve, reject) => {


    const contract = new web3.eth.Contract(abi);
    console.log("Deploying...", [galleryId, paintings]);

    const estimatedGas = parseInt(1.1 * await contract.deploy(
        {
            data: bytecode,
            arguments: [galleryId, paintings]})
        .estimateGas({from: mainAccount, value: 1000000000000000000}));
    console.log("Estimated Gas", estimatedGas);

    contract
        .deploy({data: bytecode, arguments: [galleryId, paintings]})
        .send({from: mainAccount, value: 1000000000000000000, gas: estimatedGas })
        .on("receipt", receipt => {
            resolve(receipt);
        })
        .catch(reject);

});

//Not in use
module.exports.createNFT = async (contractAddress, name, posX, posY, posZ, rotX, rotY, rotZ, width, aspect, url) => {

    const contract = new web3.eth.Contract(abi, contractAddress);
    window.contract = contract;
    const result = await contract.methods.mint(name, posX, posY, posZ, rotX, rotY, rotZ, width, aspect, url).send({from: mainAccount});

}