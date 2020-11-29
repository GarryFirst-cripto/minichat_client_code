import * as authService from 'src/services/authService';
import { SET_USER } from './actionTypes';

const setToken = token => localStorage.setItem('token', token);

const setUser = user => async dispatch => dispatch({
  type: SET_USER,
  user
});

const setAuthData = (user = null, token = '') => (dispatch, getRootState) => {
  setToken(token); // token should be set first before user
  setUser(user)(dispatch, getRootState);
};

const handleAuthResponse = authResponsePromise => async (dispatch, getRootState) => {
  const { user, token } = await authResponsePromise;
  setAuthData(user, token)(dispatch, getRootState);
  return user;
};

export const login = request => handleAuthResponse(authService.login(request));

export const register = request => handleAuthResponse(authService.registration(request));

export const logout = () => {
  localStorage.clear();
  window.location.href = '/';
};

export const loadCurrentUser = () => async (dispatch, getRootState) => {
  if (window.location.pathname === '/newpassword') {
    const { token, user } = await authService.getUserWithNew(window.location.search);
    setToken(token);
    setUser(user)(dispatch, getRootState);
    window.location.href = '/';
  } else {
    const user = await authService.getCurrentUser();
    setUser(user)(dispatch, getRootState);
  }
};

export const updateUser = () => async (dispatch, getRootState) => {
  const upduser = await authService.getCurrentUser();
  setUser(upduser)(dispatch, getRootState);
};

export const getUserByMail = email => authService.getUserByMail(email);
