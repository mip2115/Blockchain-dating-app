import { FETCH_PROFILES } from "./types";
import dateApp from "../ethereum/dateApp";
import web3 from "../ethereum/web3";

export const fetchProfiles = () => async dispatch => {
  // console.log("TRYING TO GET profiles");
  let profiles = await dateApp.methods.getProfiles().call();
  const accounts = await web3.eth.getAccounts();
  let me = accounts[0];

  profiles = profiles.filter(acc => acc !== me);

  dispatch({
    type: FETCH_PROFILES,
    payload: profiles,
  });

  /*
  dispatch({
    type: SET_ALERT,
    payload: {
      msg: msg,
      alertType: alertType,
      id: id,
    },
  });*/
};
