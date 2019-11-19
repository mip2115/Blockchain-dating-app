const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");

const dateApp = require("./build/DateApp.json");

// gets me my wallet in rinkbey
const provider = new HDWalletProvider(
  "alone goat assist sea body spend feed legend cost clinic regret sport",
  "https://rinkeby.infura.io/v3/1a466a0ef1294da185d916224f628ac6"
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log("Attempting to deploy from ", accounts[0]);

  const results = await new web3.eth.Contract(JSON.parse(dateApp.interface))
    .deploy({ data: dateApp.bytecode })
    .send({ gas: "5000000", from: accounts[0] });
  console.log("Contract deployed from ", results.options.address);
};
deploy();
