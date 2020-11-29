import React from 'react';
import PropTypes from 'prop-types';
import { Comment as CommentUI, Label, Icon } from 'semantic-ui-react';
import moment from 'moment';
import { formatString } from 'src/services/stringservice';
import { getUserImgLink } from 'src/helpers/imageHelper';
import { showModal, oK } from '../Messages/index';
import styles from './styles.module.scss';

const likeMess = 'Your can`t like or dislike own comment ....';
const delMess = 'Do yor want to DELETE this comment ?';

const Comment = (
  {
    comment,
    likeComment,
    dislikeComment,
    editComment,
    deleteComment,
    toggleInfo,
    current
  }
) => {
  const { id, body, createdAt, user, likeCou, dislikeCou } = comment;
  function delComment(idd) {
    const doDelete = message => { if (message === oK) deleteComment(idd); };
    showModal(delMess, true, doDelete);
  }
  function ownLikeLabels() {
    return [
      <Label basic size="small" as="a" className={styles.toolbarBtn} onClick={() => showModal(likeMess)}>
        <Icon name="thumbs up" />
        {likeCou}
      </Label>,
      <Label basic size="small" as="a" className={styles.toolbarBtn} onClick={() => showModal(likeMess)}>
        <Icon name="thumbs down" />
        {dislikeCou}
      </Label>,
      <Label basic size="small" as="a" className={styles.toolbarBtn} onClick={() => editComment({ id, body })}>
        <Icon name="edit" />
        Edit
      </Label>,
      <Label basic size="small" as="a" className={styles.toolbarBtn} onClick={() => delComment(id)}>
        <Icon name="trash" />
        Delete
      </Label>
    ];
  }
  function alienLikeLabels() {
    return [
      <Label basic size="small" as="a" className={styles.toolbarBtn} onClick={() => likeComment(id)}>
        <Icon name="thumbs up" />
        {likeCou}
      </Label>,
      <Label basic size="small" as="a" className={styles.toolbarBtn} onClick={() => dislikeComment(id)}>
        <Icon name="thumbs down" />
        {dislikeCou}
      </Label>
    ];
  }
  return (
    <CommentUI className={styles.comment}>
      <CommentUI.Avatar src={getUserImgLink(user.image)} />
      <CommentUI.Content>
        <CommentUI.Author as="a">
          {user.username}
        </CommentUI.Author>
        <CommentUI.Metadata>
          {moment(createdAt).fromNow()}
        </CommentUI.Metadata>
        <CommentUI.Text>
          {user.status ? ` ( ${user.status} )` : undefined}
        </CommentUI.Text>
        <CommentUI.Text>
          {formatString(body)}
        </CommentUI.Text>
      </CommentUI.Content>
      <CommentUI.Content>
        <CommentUI.Text>
          {user.id === current ? ownLikeLabels() : alienLikeLabels()}
          <Label basic size="small" as="a" className={styles.toolbarBtn} onClick={() => toggleInfo(comment)}>
            <Icon name="help" />
            Info
          </Label>
        </CommentUI.Text>
      </CommentUI.Content>
    </CommentUI>
  );
};

Comment.propTypes = {
  comment: PropTypes.objectOf(PropTypes.any).isRequired,
  current: PropTypes.string.isRequired,
  likeComment: PropTypes.func.isRequired,
  dislikeComment: PropTypes.func.isRequired,
  deleteComment: PropTypes.func.isRequired,
  editComment: PropTypes.func.isRequired,
  toggleInfo: PropTypes.func.isRequired
};

export default Comment;
