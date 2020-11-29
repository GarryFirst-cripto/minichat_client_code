/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as imageService from 'src/services/imageService';
import ExpandedPost from 'src/containers/ExpandedPost';
import ExpandedEdit from 'src/containers/ExpandedEdit';
import ExpandedInfo from 'src/containers/ExpandedInfo';
import Post from 'src/components/Post';
import AddPost from 'src/components/AddPost';
import SharedPostLink from 'src/components/SharedPostLink';
import { Checkbox, Loader } from 'semantic-ui-react';
import InfiniteScroll from 'react-infinite-scroller';
import {
  loadPosts,
  loadMorePosts,
  likePost,
  dislikePost,
  deletePost,
  likeComment,
  dislikeComment,
  toggleExpandedPost,
  toggleEditPost, toggleInfoPanel, addPost, updatePost } from './actions';
import styles from './styles.module.scss';

const postsFilter = {
  userId: undefined,
  mode: false,
  from: 0,
  count: 10
};

const Thread = ({
  userId,
  username,
  loadPosts: load,
  loadMorePosts: loadMore,
  posts = [],
  expandedPost,
  expandedEdit,
  expandedPostInfo,
  expandedCommentInfo,
  hasMorePosts,
  addPost: createPost,
  updatePost: updPost,
  likePost: like,
  dislikePost: dislike,
  deletePost: delPost,
  likeComment: likeCom,
  dislikeComment: dislikeCom,
  toggleExpandedPost: toggle,
  toggleEditPost: toggleEdit,
  toggleInfoPanel: toggleInfo
}) => {
  const [sharedPost, setSharedPostId] = useState(undefined);
  const [showOwnPosts, setShowOwnPosts] = useState(false);
  const [hideOwnPosts, setHideOwnPosts] = useState(false);
  const [showLikedPosts, setLikedPosts] = useState(false);

  function toggleLikedPosts() {
    setShowOwnPosts(false);
    setHideOwnPosts(false);
    setLikedPosts(!showLikedPosts);
    postsFilter.userId = showLikedPosts ? undefined : userId;
    postsFilter.mode = 3;
    postsFilter.from = 0;
    load(postsFilter);
    postsFilter.from = postsFilter.count; // for the next scroll
  }

  function toggleShowOwnPosts() {
    setHideOwnPosts(false);
    setLikedPosts(false);
    setShowOwnPosts(!showOwnPosts);
    postsFilter.userId = showOwnPosts ? undefined : userId;
    postsFilter.mode = showOwnPosts ? 0 : 1;
    postsFilter.from = 0;
    load(postsFilter);
    postsFilter.from = postsFilter.count; // for the next scroll
  }

  function toggleHideOwnPosts() {
    setShowOwnPosts(false);
    setLikedPosts(false);
    setHideOwnPosts(!hideOwnPosts);
    postsFilter.userId = hideOwnPosts ? undefined : userId;
    postsFilter.mode = 2;
    postsFilter.from = 0;
    load(postsFilter);
    postsFilter.from = postsFilter.count; // for the next scroll
  }

  const getMorePosts = () => {
    loadMore(postsFilter);
    const { from, count } = postsFilter;
    postsFilter.from = from + count;
  };

  const sharePost = id => {
    setSharedPostId(id);
  };

  const uploadImage = file => imageService.uploadImage(file);
  const createImage = image => imageService.createImage(image);

  return (
    <div className={styles.threadContent}>
      <div className={styles.addPostForm}>
        <AddPost addPost={createPost} uploadImage={uploadImage} createImage={createImage} />
      </div>
      <div className={styles.toolbar}>
        <Checkbox
          toggle
          label="Only my posts"
          checked={showOwnPosts}
          onChange={toggleShowOwnPosts}
          style={{ marginLeft: '3px' }}
        />
        <Checkbox
          toggle
          label="Hide my posts"
          checked={hideOwnPosts}
          onChange={toggleHideOwnPosts}
          style={{ marginLeft: '10px' }}
        />
        <Checkbox
          toggle
          label="Liked posts"
          checked={showLikedPosts}
          onChange={toggleLikedPosts}
          style={{ marginLeft: '10px' }}
        />
      </div>
      <InfiniteScroll
        pageStart={0}
        loadMore={getMorePosts}
        hasMore={hasMorePosts}
        loader={<Loader active inline="centered" key={0} />}
      >
        {posts.map(post => (
          <Post
            post={post}
            likePost={like}
            dislikePost={dislike}
            deletePost={delPost}
            toggleExpandedPost={toggle}
            toggleEditPost={toggleEdit}
            toggleInfoPanel={toggleInfo}
            sharePost={sharePost}
            current={userId}
            filter={postsFilter.mode}
          />
        ))}
      </InfiniteScroll>
      {expandedPost && (
        <ExpandedPost
          sharePost={sharePost}
          likeComment={likeCom}
          dislikeComment={dislikeCom}
          current={userId}
          filter={postsFilter}
        />
      )}
      {expandedEdit && (
        <ExpandedEdit
          post={expandedPost}
          uploadImage={uploadImage}
          createImage={createImage}
          toggleEditPost={toggleEdit}
          updatePost={updPost}
        />
      )}
      {expandedPostInfo && (
        <ExpandedInfo
          listInfo={expandedPostInfo}
        />
      )}
      {expandedCommentInfo && (
        <ExpandedInfo
          listInfo={expandedCommentInfo}
          infomode={false}
        />
      )}
      {sharedPost && (
        <SharedPostLink
          post={sharedPost}
          current={userId}
          signature={username}
          close={() => setSharedPostId(undefined)}
        />
      )}
    </div>
  );
};

Thread.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object),
  hasMorePosts: PropTypes.bool,
  expandedPost: PropTypes.objectOf(PropTypes.any),
  expandedEdit: PropTypes.objectOf(PropTypes.any),
  expandedPostInfo: PropTypes.objectOf(PropTypes.any),
  expandedCommentInfo: PropTypes.objectOf(PropTypes.any),
  userId: PropTypes.string,
  username: PropTypes.string,
  loadPosts: PropTypes.func.isRequired,
  loadMorePosts: PropTypes.func.isRequired,
  likePost: PropTypes.func.isRequired,
  dislikePost: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  likeComment: PropTypes.func.isRequired,
  dislikeComment: PropTypes.func.isRequired,
  toggleExpandedPost: PropTypes.func.isRequired,
  toggleEditPost: PropTypes.func.isRequired,
  toggleInfoPanel: PropTypes.func.isRequired,
  addPost: PropTypes.func.isRequired,
  updatePost: PropTypes.func.isRequired
};

Thread.defaultProps = {
  posts: [],
  hasMorePosts: true,
  expandedPost: undefined,
  expandedEdit: undefined,
  expandedPostInfo: undefined,
  expandedCommentInfo: undefined,
  userId: undefined,
  username: undefined
};

const mapStateToProps = rootState => ({
  posts: rootState.posts.posts,
  hasMorePosts: rootState.posts.hasMorePosts,
  expandedPost: rootState.posts.expandedPost,
  expandedEdit: rootState.posts.expandedEdit,
  expandedPostInfo: rootState.posts.expandedPostInfo,
  expandedCommentInfo: rootState.posts.expandedCommentInfo,
  userId: rootState.profile.user.id,
  username: rootState.profile.user.username
});

const actions = {
  loadPosts,
  loadMorePosts,
  likePost,
  dislikePost,
  deletePost,
  likeComment,
  dislikeComment,
  toggleExpandedPost,
  toggleEditPost,
  toggleInfoPanel,
  addPost,
  updatePost
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Thread);
