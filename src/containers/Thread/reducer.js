import {
  SET_ALL_POSTS,
  LOAD_MORE_POSTS,
  ADD_POST,
  SET_EXPANDED_POST,
  SET_EDIT_EDIT,
  SET_INFO_POST_PANEL,
  SET_INFO_COMMENT_PANEL
} from './actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case SET_ALL_POSTS:
      return {
        ...state,
        posts: action.posts,
        hasMorePosts: Boolean(action.posts.length)
      };
    case LOAD_MORE_POSTS:
      return {
        ...state,
        posts: [...(state.posts || []), ...action.posts],
        hasMorePosts: Boolean(action.posts.length)
      };
    case ADD_POST:
      return {
        ...state,
        posts: [action.post, ...state.posts]
      };
    case SET_EXPANDED_POST:
      return {
        ...state,
        expandedPost: action.post
      };
    case SET_EDIT_EDIT:
      return {
        ...state,
        expandedEdit: action.editpost
      };
    case SET_INFO_POST_PANEL:
      return {
        ...state,
        expandedPostInfo: action.infolist
      };
    case SET_INFO_COMMENT_PANEL:
      return {
        ...state,
        expandedCommentInfo: action.infolist
      };
    default:
      return state;
  }
};
