import * as postService from 'src/services/postService';
import { LOAD_ALL_ARHIV_POSTS, LOAD_MORE_ARHIV_POSTS } from './actionTypes';
import { SET_ALL_POSTS } from '../Thread/actionTypes';

const updateArhivAction = posts => ({
  type: LOAD_ALL_ARHIV_POSTS,
  posts
});

const addMoreArhivAction = posts => ({
  type: LOAD_MORE_ARHIV_POSTS,
  posts
});

const updatePostList = posts => ({
  type: SET_ALL_POSTS,
  posts
});

export const loadMorePosts = filter => async (dispatch, getRootState) => {
  const { arhiv: { posts } } = getRootState();
  const loadedPosts = await postService.getAllArhivPosts(filter);
  const filteredPosts = loadedPosts
    .filter(post => !(posts && posts.some(loadedPost => post.id === loadedPost.id)));
  dispatch(addMoreArhivAction(filteredPosts));
};

export const restorePost = postId => async (dispatch, getRootState) => {
  const result = await postService.restorePost(postId);
  const { id } = result[1];
  const { arhiv: { posts } } = getRootState();
  const updated = [];
  posts.map(item => {
    if (item.id !== id) updated.push(item);
    return item;
  });
  dispatch(updateArhivAction(updated));
  const { posts: { posts: postList } } = getRootState();
  if (postList) {
    const newPost = await postService.getPost(postId);
    const newList = [newPost, ...postList];
    dispatch(updatePostList(newList));
  }
};
