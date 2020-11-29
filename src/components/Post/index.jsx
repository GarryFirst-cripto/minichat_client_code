import React from 'react';
import PropTypes from 'prop-types';
import { Card, Image, Label, Icon } from 'semantic-ui-react';
import moment from 'moment';
import { formatString } from 'src/services/stringservice';
import { showModal, oK } from '../Messages/index';
import styles from './styles.module.scss';

const likeMess = 'Your can`t like or dislike own posts ....';
const delMess = 'Do yor want to DELETE this post ?';

const Post = ({
  post,
  likePost,
  dislikePost,
  deletePost,
  toggleExpandedPost,
  toggleEditPost,
  toggleInfoPanel,
  sharePost,
  current,
  filter
}) => {
  const {
    id,
    image,
    body,
    user,
    likeCount,
    dislikeCount,
    commentCount,
    createdAt,
    mycount
  } = post;
  const date = moment(createdAt).fromNow();

  function ascdeletePost(message) {
    if (message === oK) deletePost(post.id);
  }
  function ownLikeLabels() {
    return [
      <Label basic size="small" as="a" className={styles.toolbarBtn} onClick={() => showModal(likeMess)}>
        <Icon name="thumbs up" />
        {likeCount}
      </Label>,
      <Label basic size="small" as="a" className={styles.toolbarBtn} onClick={() => showModal(likeMess)}>
        <Icon name="thumbs down" />
        {dislikeCount}
      </Label>
    ];
  }
  function alienLikeLabels() {
    return [
      <Label basic size="small" as="a" className={styles.toolbarBtn} onClick={() => likePost(id)}>
        <Icon name="thumbs up" />
        {likeCount}
      </Label>,
      <Label basic size="small" as="a" className={styles.toolbarBtn} onClick={() => dislikePost(id)}>
        <Icon name="thumbs down" />
        {dislikeCount}
      </Label>
    ];
  }
  function editlabels() {
    const result = [
      <Label basic size="small" as="a" className={styles.toolbarBtn} onClick={() => toggleEditPost(id)}>
        <Icon name="edit" />
        Edit
      </Label>
    ];
    if (deletePost) {
      result.push(
        <Label
          basic
          size="small"
          as="a"
          className={styles.toolbarBtn}
          onClick={() => showModal(delMess, true, ascdeletePost)}
        >
          <Icon name="trash" />
          Delete
        </Label>
      );
    }
    return result;
  }

  if ((!mycount || mycount === '1') && (filter !== 1 || current === user.id)) {
    return (
      <Card className={styles.postCard}>
        {image && <Image className={styles.postImage} src={image.link} wrapped />}
        <Card.Content>
          <Card.Meta>
            <span className="date">
              posted by
              {' '}
              {user.username}
              {' - '}
              {date}
              {user.status ? [<br />, ` ( ${user.status} )`] : undefined}
            </span>
          </Card.Meta>
          <Card.Description>
            {formatString(body)}
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          {current === user.id ? ownLikeLabels() : alienLikeLabels()}
          <Label basic size="small" as="a" className={styles.toolbarBtn} onClick={() => toggleExpandedPost(id)}>
            <Icon name="comment" />
            {commentCount}
          </Label>
          <Label basic size="small" as="a" className={styles.toolbarBtn} onClick={() => sharePost(post)}>
            <Icon name="mail outline" />
            E-Mail
          </Label>
          {current === user.id ? editlabels() : undefined}
          <Label basic size="small" as="a" className={styles.toolbarBtn} onClick={() => toggleInfoPanel(post)}>
            <Icon name="help" />
            Info
          </Label>
        </Card.Content>
      </Card>
    );
  }
  return null;
};

Post.propTypes = {
  post: PropTypes.objectOf(PropTypes.any).isRequired,
  likePost: PropTypes.func.isRequired,
  dislikePost: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  toggleExpandedPost: PropTypes.func.isRequired,
  toggleEditPost: PropTypes.func.isRequired,
  toggleInfoPanel: PropTypes.func.isRequired,
  sharePost: PropTypes.func.isRequired,
  current: PropTypes.string.isRequired,
  filter: PropTypes.number.isRequired
};

export default Post;
