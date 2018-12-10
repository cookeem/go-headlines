import { combineReducers } from 'redux';

const stateInitUI = {
  showSideBar: false,
  showComment: false,
  showDelete: false,
};

const stateInitLogin = {
  uid: 0,
  username: "unknown",
  userToken: "N/A",
};

const stateInitData = {
  error: 0,
  msg: "",
  gitrepos: [],
  languages: [],
  gitrepo: {},
  reviews: [],
};

export const ui = (state = stateInitUI, action) => {
  switch (action.type) {
    case 'SHOW_SIDEBAR':
      return Object.assign({}, state, {
        showSideBar: action.showSideBar,
      });
    case 'SHOW_COMMENT':
      return Object.assign({}, state, {
        showComment: action.showComment,
      });
    case 'SHOW_DELETE':
      return Object.assign({}, state, {
        showDelete: action.showDelete,
      });
    default:
      return state;
  }
}

export const login = (state = stateInitLogin, action) => {
  switch (action.type) {
    case 'LOGIN':
      state.uid = action.uid;
      state.username = action.username;
      state.userToken = action.userToken;
      console.log("state:", state);
      return Object.assign({}, state, {
        uid: action.showSideBar,
        username: action.username,
        userToken: action.userToken,
      });
    default:
      return state;
  }
}

export const reducerRoot = combineReducers({
  ui, login
});
