import { FETCH_MERCHANTS } from "./types";
import dateApp from "../ethereum/dateApp";
import web3 from "../ethereum/web3";

export const fetchMerchants = () => async dispatch => {
  let merchants = await dateApp.methods.getPlaces().call();

  dispatch({
    type: FETCH_MERCHANTS,
    payload: merchants,
  });
};
