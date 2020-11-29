import * as postService from 'src/services/postService';
import * as mailService from 'src/services/mailService';
import * as commentService from 'src/services/commentService';
import { LOAD_ALL_ARHIV_POSTS } from '../Arhiv/actionTypes';
import {
  ADD_POST,
  LOAD_MORE_POSTS,
  SET_ALL_POSTS,
  SET_EXPANDED_POST,
  SET_EDIT_EDIT,
  SET_INFO_POST_PANEL,
  SET_INFO_COMMENT_PANEL,
  SHOW_MODAL_MESS
} from './actionTypes';

const setPostsAction = posts => ({
  type: SET_ALL_POSTS,
  posts
});

const addMorePostsAction = posts => ({
  type: LOAD_MORE_POSTS,
  posts
});

const addPostAction = post => ({
  type: ADD_POST,
  post
});

const updateArhivAction = posts => ({
  type: LOAD_ALL_ARHIV_POSTS,
  posts
});

const setExpandedPostAction = post => ({
  type: SET_EXPANDED_POST,
  post
});

const setExpandedEditAction = editpost => ({
  type: SET_EDIT_EDIT,
  editpost
});

const setExpandedPostInfo = infolist => ({
  type: SET_INFO_POST_PANEL,
  infolist
});

const setExpandedCommentInfo = infolist => ({
  type: SET_INFO_COMMENT_PANEL,
  infolist
});

export const loadPosts = filter => async dispatch => {
  const posts = await postService.getAllPosts(filter);
  dispatch(setPostsAction(posts));
};

export const loadMorePosts = filter => async (dispatch, getRootState) => {
  const { posts: { posts } } = getRootState();
  const loadedPosts = await postService.getAllPosts(filter);
  const filteredPosts = loadedPosts
    .filter(post => !(posts && posts.some(loadedPost => post.id === loadedPost.id)));
  dispatch(addMorePostsAction(filteredPosts));
};

export const applyNewPost = postId => async (dispatch, getRootState) => {
  const { posts: { posts: postList } } = getRootState();
  if (postList) {
    const newPost = await postService.getPost(postId);
    dispatch(addPostAction(newPost));
  }
};
export const applyUpdatePost = postId => async (dispatch, getRootState) => {
  const updPost = await postService.getPost(postId);
  const mapUpdate = () => ({
    ...updPost
  });
  const { posts: { posts, expandedPost } } = getRootState();
  const updated = posts.map(item => (item.id !== postId ? item : mapUpdate()));
  dispatch(setPostsAction(updated));
  if (expandedPost && expandedPost.id === postId) {
    dispatch(setExpandedPostAction(mapUpdate()));
  }
};
export const applyDeletePost = postId => async (dispatch, getRootState) => {
  const { posts: { posts } } = getRootState();
  const updated = [];
  posts.map(item => {
    if (item.id !== postId) updated.push(item);
    return item;
  });
  dispatch(setPostsAction(updated));
};

export const addPost = post => async dispatch => {
  const { id } = await postService.addPost(post);
  const newPost = await postService.getPost(id);
  dispatch(addPostAction(newPost));
};

export const updatePost = post => async (dispatch, getRootState) => {
  const result = await postService.updatePost(post);
  const { id } = result[1];
  const updPost = await postService.getPost(id);
  const mapUpdate = () => ({
    ...updPost
  });
  const { posts: { posts, expandedPost } } = getRootState();
  const updated = posts.map(item => (item.id !== id ? item : mapUpdate()));
  dispatch(setPostsAction(updated));
  if (expandedPost && expandedPost.id === id) {
    dispatch(setExpandedPostAction(mapUpdate()));
  }
};

export const deletePost = postId => async (dispatch, getRootState) => {
  const result = await postService.deletePost(postId);
  const { id } = result[1];
  const { posts: { posts } } = getRootState();
  const updated = [];
  posts.map(item => {
    if (item.id !== id) updated.push(item);
    return item;
  });
  dispatch(setPostsAction(updated));
  const { arhiv: { posts: arhivList } } = getRootState();
  if (arhivList) {
    const delPost = await postService.getPost(postId); // await postService.getPost(postId);
    const newList = [delPost, ...arhivList];
    dispatch(updateArhivAction(newList));
  }
};

export const toggleExpandedPost = postId => async dispatch => {
  const post = postId ? await postService.getPost(postId) : undefined;
  dispatch(setExpandedPostAction(post));
};

export const toggleEditPost = postId => async dispatch => {
  const editpost = postId ? await postService.getPost(postId) : undefined;
  dispatch(setExpandedEditAction(editpost));
};

export const toggleInfoPanel = post => async dispatch => {
  const taglist = post ? await postService.getReactList(post.id) : undefined;
  const infolist = post ? { obj: post, taglist } : undefined;
  dispatch(setExpandedPostInfo(infolist));
};

export const toggleCommentPanel = comment => async dispatch => {
  const taglist = comment ? await commentService.getReactList(comment.id) : undefined;
  const infolist = comment ? { obj: comment, taglist } : undefined;
  dispatch(setExpandedCommentInfo(infolist));
};

export const likePost = postId => async (dispatch, getRootState) => {
  const { id, dopp } = await postService.likePost(postId);
  const diff = id ? 1 : -1; // if ID exists then the post was liked, otherwise - like was removed
  const { posts: { posts, expandedPost }, profile } = getRootState();
  const mapLikes = post => {
    mailService.sendPostReaction(post, profile.user);
    return {
      ...post,
      likeCount: Number(post.likeCount) + diff, // diff is taken from the current closure
      dislikeCount: Number(post.dislikeCount) - dopp // diff is taken from the current closure
    };
  };
  const updated = posts.map(post => (post.id !== postId ? post : mapLikes(post)));
  dispatch(setPostsAction(updated));
  if (expandedPost && expandedPost.id === postId) {
    dispatch(setExpandedPostAction(mapLikes(expandedPost)));
  }
};

export const dislikePost = postId => async (dispatch, getRootState) => {
  const { id, dopp } = await postService.dislikePost(postId);
  const diff = id ? 1 : -1; // if ID exists then the post was liked, otherwise - like was removed
  const mapLikes = post => ({
    ...post,
    dislikeCount: Number(post.dislikeCount) + diff, // diff is taken from the current closure
    likeCount: Number(post.likeCount) - dopp
  });
  const { posts: { posts, expandedPost } } = getRootState();
  const updated = posts.map(post => (post.id !== postId ? post : mapLikes(post)));
  dispatch(setPostsAction(updated));
  if (expandedPost && expandedPost.id === postId) {
    dispatch(setExpandedPostAction(mapLikes(expandedPost)));
  }
};

export const toggleSendMail = async mail => {
  const result = await mailService.sendMail(mail);
  return result;
};
export const sendResetMail = async mail => {
  const result = await mailService.sendResetMail(mail);
  return result;
};

export const addComment = request => async (dispatch, getRootState) => {
  const { id } = await commentService.addComment({ body: request.body, postId: request.postId });
  const comment = await commentService.getComment(id);
  const mapExpandedPost = post => ({
    ...post,
    commentCount: Number(post.commentCount) + 1,
    comments: [...(post.comments), comment]
  });
  const mapPosts = post => ({
    ...post,
    commentCount: Number(post.commentCount) + 1
  });

  const { posts: { posts, expandedPost } } = getRootState();
  const updatedPosts = posts.map(post => (post.id !== comment.postId ? post : mapPosts(post)));
  dispatch(setPostsAction(updatedPosts));
  const updated = mapExpandedPost(expandedPost);
  dispatch(setExpandedPostAction(updated));
};

export const updateComment = request => async (dispatch, getRootState) => {
  const result = await commentService.updateComment(request);
  const { id: comId, body: newBody } = result[1];
  const mapComment = item => ({
    ...item,
    body: newBody
  });
  const mapExpandedPost = post => ({
    ...post,
    commentCount: Number(post.commentCount) + 1,
    comments: post.comments.map(comment => (comment.id !== comId ? comment : mapComment(comment)))
  });
  const { posts: { expandedPost } } = getRootState();
  const updated = mapExpandedPost(expandedPost);
  dispatch(setExpandedPostAction(updated));
};

export const deleteComment = commentId => async (dispatch, getRootState) => {
  const result = await commentService.deleteComment(commentId);
  const { id, postId } = result[1];
  const mapComment = item => ({
    ...item,
    deleted: true
  });
  const mapExpandedPost = post => ({
    ...post,
    commentCount: Number(post.commentCount) - 1,
    comments: post.comments.map(comment => (comment.id !== id ? comment : mapComment(comment)))
  });
  const mapPosts = post => ({
    ...post,
    commentCount: Number(post.commentCount) - 1
  });
  const { posts: { posts, expandedPost } } = getRootState();
  const updatedPosts = posts.map(post => (post.id !== postId ? post : mapPosts(post)));
  dispatch(setPostsAction(updatedPosts));
  const updated = mapExpandedPost(expandedPost);
  dispatch(setExpandedPostAction(updated));
};

export const likeComment = commentId => async (dispatch, getRootState) => {
  const { id, dopp } = await commentService.likeComment(commentId);
  const diff = id ? 1 : -1;
  const mapComment = item => ({
    ...item,
    likeCou: Number(item.likeCou) + diff,
    dislikeCou: Number(item.dislikeCou) - dopp
  });
  const mapExpandedPost = post => ({
    ...post,
    comments: post.comments.map(comment => (comment.id !== commentId ? comment : mapComment(comment)))
  });
  const { posts: { expandedPost } } = getRootState();
  const updated = mapExpandedPost(expandedPost);
  dispatch(setExpandedPostAction(updated));
};

export const dislikeComment = commentId => async (dispatch, getRootState) => {
  const { id, dopp } = await commentService.dislikeComment(commentId);
  const diff = id ? 1 : -1;
  const mapComment = item => ({
    ...item,
    dislikeCou: Number(item.dislikeCou) + diff,
    likeCou: Number(item.likeCou) - dopp
  });
  const mapExpandedPost = post => ({
    ...post,
    comments: post.comments.map(comment => (comment.id !== commentId ? comment : mapComment(comment)))
  });
  const { posts: { expandedPost } } = getRootState();
  const updated = mapExpandedPost(expandedPost);
  dispatch(setExpandedPostAction(updated));
};

export function showModalWnd(value) {
  return {
    type: SHOW_MODAL_MESS,
    showing: value
  };
}
