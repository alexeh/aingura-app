import dispatcher from "../../Dispatcher";
import actionTypes from "../actions/actionTypes";
import axios from "axios";
import authStore from "../stores/authStore";
import { AINGURA_API } from "../enviromentConf";

const token = authStore.getToken();

const headers = { headers: { Authorization: `Bearer ${token}` } };
const payload = { key: "value" };

export async function loadFeed() {
  console.log(AINGURA_API.API_URL + AINGURA_API.FEED_ENDPOINT);
  return axios
    .post(AINGURA_API.API_URL + AINGURA_API.FEED_ENDPOINT, payload, headers)
    .then((ainguraData) => {
      if (ainguraData) {
        dispatcher.dispatch({
          type: actionTypes.LOAD_FEED,
          data: ainguraData.data,
        });
      }
    })
    .catch((error) => {
      throw error;
    });
}

export async function loadAinguraById(id) {
  return axios
    .get(`http://192.168.1.132:4200/api/${id}`, payload, headers)
    .then((ainguraData) => {
      if (ainguraData) {
        dispatcher.dispatch({
          type: actionTypes.LOAD_ONE_AINGURA,
          data: ainguraData.data,
        });
      }
    })
    .catch((error) => {
      throw error;
    });
}

export async function createAingura(ainguraParams) {
  return axios
    .post(AINGURA_API.API_URL + AINGURA_API.CREATE_ENDPOINT, ainguraParams)
    .catch((err) => {
      throw err;
    });
}

export function validateGeoLocation(geoLocParams) {
  return axios.post(
    AINGURA_API.API_URL + AINGURA_API.GEOVALIDATION_ENDPOINT,
    geoLocParams
  );
}

export function validateReachAingura(ainguraData) {
  console.log(AINGURA_API.API_URL + AINGURA_API.REACH_ENDPOINT);
  return axios
    .post(AINGURA_API.API_URL + AINGURA_API.REACH_ENDPOINT, ainguraData)
    .then((message) => {
      dispatcher.dispatch({
        type: actionTypes.REACH_AINGURA,
        data: message.data,
      });
    })
    .catch((err) => {
      console.log(`Reach Aingura error: ${err}`);
    });
}
