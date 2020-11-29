import {
  LOAD_ALL_ARHIV_POSTS,
  LOAD_MORE_ARHIV_POSTS
} from './actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case LOAD_ALL_ARHIV_POSTS:
      return {
        ...state,
        posts: action.posts,
        hasMorePosts: Boolean(action.posts.length)
      };
    case LOAD_MORE_ARHIV_POSTS:
      return {
        ...state,
        posts: [...(state.posts || []), ...action.posts],
        hasMorePosts: Boolean(action.posts.length)
      };
    default:
      return state;
  }
};
