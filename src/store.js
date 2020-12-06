import {
  createStore,
  applyMiddleware,
  compose,
  combineReducers
} from 'redux';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import thunk from 'redux-thunk';
import { createBrowserHistory } from 'history';
// import { composeWithDevTools } from 'redux-devtools-extension';

import threadReducer from './containers/Thread/reducer';
import arhivReducer from './containers/Arhiv/reducer';
import modalReducer from './containers/Thread/reducerModal';
import profileReducer from './containers/Profile/reducer';

export const history = createBrowserHistory();

const loadStatePath = () => {
  try {
      const appPath = window.localStorage.getItem('app_state');
      if (appPath) history.push(appPath);
  } catch (err) {
      
  }
};

loadStatePath();

const initialState = {};

const middlewares = [
  thunk,
  routerMiddleware(history)
];

const composedEnhancers = compose(
  applyMiddleware(...middlewares)
);

const reducers = {
  posts: threadReducer,
  profile: profileReducer,
  modals: modalReducer,
  arhiv: arhivReducer
};

const rootReducer = combineReducers({
  router: connectRouter(history),
  ...reducers
});

const store = createStore(
  rootReducer,
  initialState,
  composedEnhancers
);

const saveStatePath = (state) => {
  try {
      const appPath = state.router.location.pathname;
      window.localStorage.setItem('app_state', appPath);
  } catch (err) {
      // Log errors here, or ignore
  }
};

store.subscribe(() => {
  saveStatePath(store.getState());
});

export default store;
