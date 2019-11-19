import { FETCH_MERCHANTS } from "../actions/types";
const initialState = [];

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case FETCH_MERCHANTS:
      return [...payload];
    default:
      return state;
  }
}
