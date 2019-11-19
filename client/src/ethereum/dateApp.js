// we're getting the instance of web3 we just created
import web3 from "./web3";

import { contractAddress } from "./address";

// now get the compiled contract from the build dir
import DateApp from "./build/DateApp.json";

// so what we're doing is creating a new instance of the contract
// w information from this compiled contract
const instance = new web3.eth.Contract(
  JSON.parse(DateApp.interface),
  //"0x409EF2EC9Eea80916cF3531D67274BE3CC8ce970"
  contractAddress
);

export default instance;
