import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Modal, Comment as CommentUI, Header } from 'semantic-ui-react';
import moment from 'moment';
import {
  likePost,
  dislikePost,
  toggleExpandedPost,
  addComment,
  updateComment,
  deleteComment,
  toggleEditPost,
  toggleInfoPanel,
  toggleCommentPanel
} from 'src/containers/Thread/actions';
import Post from 'src/components/Post';
import Comment from 'src/components/Comment';
import AddComment from 'src/components/AddComment';
import Spinner from 'src/components/Spinner';
import styles from './styles.module.scss';

const ExpandedPost = ({
  post,
  sharePost,
  likePost: like,
  dislikePost: dislike,
  likeComment: likeCom,
  dislikeComment: dislikeCom,
  toggleExpandedPost: toggle,
  toggleEditPost: toggleEdit,
  toggleInfoPanel: toggleInfo,
  toggleCommentPanel: toggleComment,
  addComment: addComm,
  updateComment: updComm,
  deleteComment: deleteCom,
  current,
  filter
}) => {
  let editComFunction;
  const editCom = param => editComFunction(param);
  const setEditCom = param => { editComFunction = param; };
  return (
    <Modal className={styles.comentsForm} open onClose={() => toggle()}>
      { post
        ? (
          <Modal.Content>
            <Post
              post={post}
              likePost={like}
              dislikePost={dislike}
              toggleExpandedPost={toggle}
              toggleEditPost={toggleEdit}
              toggleInfoPanel={toggleInfo}
              sharePost={sharePost}
              current={current}
              filter={filter}
            />
            <CommentUI.Group style={{ maxWidth: '100%' }}>
              <Header as="h3" dividing>
                Comments
              </Header>
              {post.comments && post.comments
                .sort((c1, c2) => moment(c1.createdAt).diff(c2.createdAt))
                .map(comment => {
                  if (!comment.deleted) {
                    return (
                      <Comment
                        key={comment.id}
                        comment={comment}
                        likeComment={likeCom}
                        dislikeComment={dislikeCom}
                        deleteComment={deleteCom}
                        editComment={editCom}
                        toggleInfo={toggleComment}
                        current={current}
                      />
                    );
                  }
                  return null;
                })}
              <AddComment
                postId={post.id}
                addComment={addComm}
                updateComment={updComm}
                editComment={setEditCom}
              />
            </CommentUI.Group>
          </Modal.Content>
        )
        : <Spinner />}
    </Modal>
  );
};

ExpandedPost.propTypes = {
  post: PropTypes.objectOf(PropTypes.any).isRequired,
  toggleExpandedPost: PropTypes.func.isRequired,
  toggleEditPost: PropTypes.func.isRequired,
  toggleInfoPanel: PropTypes.func.isRequired,
  toggleCommentPanel: PropTypes.func.isRequired,
  likePost: PropTypes.func.isRequired,
  dislikePost: PropTypes.func.isRequired,
  likeComment: PropTypes.func.isRequired,
  dislikeComment: PropTypes.func.isRequired,
  addComment: PropTypes.func.isRequired,
  updateComment: PropTypes.func.isRequired,
  deleteComment: PropTypes.func.isRequired,
  sharePost: PropTypes.func.isRequired,
  current: PropTypes.string.isRequired,
  filter: PropTypes.string.isRequired
};

const mapStateToProps = rootState => ({
  post: rootState.posts.expandedPost
});

const actions = {
  likePost,
  dislikePost,
  toggleExpandedPost,
  toggleEditPost,
  toggleInfoPanel,
  toggleCommentPanel,
  addComment,
  updateComment,
  deleteComment
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExpandedPost);
