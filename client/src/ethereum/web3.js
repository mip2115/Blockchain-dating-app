import Web3 from "web3";
let web3;

// metamask is available (we are running in the browser)
// so you're checking if window is defined
if (typeof window !== "undefined" && typeof window.web3 !== "undefined") {
  web3 = new Web3(window.web3.currentProvider);
} else {
  // not in browser or no metamask (server)
  // pass in url to remote node of infura
  // so we make our own provider
  const provider = new Web3.providers.HttpProvider(
    "https://rinkeby.infura.io/v3/1a466a0ef1294da185d916224f628ac6"
  );
  web3 = new Web3(provider);
}

export default web3;
