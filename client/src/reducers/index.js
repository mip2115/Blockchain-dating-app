import { combineReducers } from "redux";
import alert from "./alert";
import profiles from "./profiles";
import merchants from "./merchants";

export default combineReducers({
  alert: alert,
  profiles: profiles,
  merchants: merchants,
});
