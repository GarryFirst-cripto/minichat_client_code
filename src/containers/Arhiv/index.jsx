/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Loader, Card } from 'semantic-ui-react';
import ArhivPost from 'src/components/ArhivPost';
import InfiniteScroll from 'react-infinite-scroller';
import {
  loadMorePosts,
  restorePost
} from './actions';
import styles from './styles.module.scss';

const postsFilter = {
  userId: undefined,
  mode: false,
  from: 0,
  count: 10
};

const Arhiv = ({
  userId,
  loadMorePosts: loadMore,
  restorePost: restore,
  posts = [],
  hasMorePosts
}) => {
  const getMorePosts = () => {
    postsFilter.userId = userId;
    loadMore(postsFilter);
    const { from, count } = postsFilter;
    postsFilter.from = from + count;
  };
  return (
    <div className={styles.threadContent}>
      <Card className={styles.arhivCard}>
        Post Arhivs (deleted posts)
      </Card>
      <InfiniteScroll
        pageStart={0}
        loadMore={getMorePosts}
        hasMore={hasMorePosts}
        loader={<Loader active inline="centered" key={0} />}
      >
        {posts.map(post => (
          <ArhivPost
            post={post}
            current={userId}
            restorePost={restore}
          />
        ))}
      </InfiniteScroll>
    </div>
  );
};

Arhiv.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object),
  hasMorePosts: PropTypes.bool,
  userId: PropTypes.string,
  loadMorePosts: PropTypes.func.isRequired,
  restorePost: PropTypes.func.isRequired
};

Arhiv.defaultProps = {
  posts: [],
  hasMorePosts: true,
  userId: undefined
};

const mapStateToProps = rootState => ({
  posts: rootState.arhiv.posts,
  hasMorePosts: rootState.arhiv.hasMorePosts,
  userId: rootState.profile.user.id
});

const actions = {
  loadMorePosts,
  restorePost
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Arhiv);
