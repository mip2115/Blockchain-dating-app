const Web3 = require("web3");
let web3;

if (typeof window !== "undefined" && typeof window.web3 !== "undefined") {
  web3 = new Web3(window.web3.currentProvider);
} else {
  const provider = new Web3.providers.HttpProvider(
    "https://rinkeby.infura.io/v3/1a466a0ef1294da185d916224f628ac6"
  );
  web3 = new Web3(provider);
}

contractAddress = "0x0cd9ADaeBf2BA0576CdEACa19b1C4248DE3d4799";

const DateApp = require("./build/DateApp.json");
const dateApp = new web3.eth.Contract(
  JSON.parse(DateApp.interface),
  contractAddress
);

const accounts = [];
const profiles = [{}];

async function getPlace() {
  const place = await dateApp.methods.getPlaces().call();
  console.log("GOT");
  console.log(place);
}

getPlace();
