import { FETCH_PROFILES } from "../actions/types";
const initialState = [];

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case FETCH_PROFILES:
      return [...payload];
    default:
      return state;
  }
}
