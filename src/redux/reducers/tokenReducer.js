import { GET_TOKEN_FAIL, GET_TOKEN_SUCCESS } from '../actions';

const INITIAL_STATE = '';

const tokenReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case GET_TOKEN_SUCCESS:
    return action.token;
  case GET_TOKEN_FAIL:
    return {
      ...state,
      error: action.error,
    };
  default:
    return state;
  }
};

export default tokenReducer;
