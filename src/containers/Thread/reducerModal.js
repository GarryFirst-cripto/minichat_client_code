import {
  SHOW_MODAL_MESS
} from './actionTypes';

const initialShow = { modalWnd: false };

export default (state = initialShow, action) => {
  switch (action.type) {
    case SHOW_MODAL_MESS:
      return {
        ...state,
        modalWnd: action.showing
      };
    default:
      return state;
  }
};
