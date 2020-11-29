import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import { formatString } from 'src/services/stringservice';
import { Modal, Card, Header, Feed } from 'semantic-ui-react';
import { toggleInfoPanel, toggleCommentPanel } from 'src/containers/Thread/actions';
import { getUserImgLink } from 'src/helpers/imageHelper';
import styles from './styles.module.scss';

const ExpandedInfo = ({
  listInfo,
  infomode = true,
  toggleInfoPanel: togglePost,
  toggleCommentPanel: toggleComment
}) => {
  function toggleExit() {
    if (infomode === true) {
      togglePost();
    } else {
      toggleComment();
    }
  }
  const {
    obj,
    taglist
  } = listInfo;
  const {
    body,
    user,
    createdAt
  } = obj;
  function appends(array, count) {
    for (let i = 1; i <= count; i += 1) {
      array.push(
        <Feed.Event style={{ height: '48px' }}>
          <Feed.Label style={{ marginLeft: '10px' }} image="" />
          <Feed.Content>
            {'  '}
          </Feed.Content>
        </Feed.Event>
      );
    }
  }
  const date = moment(createdAt).fromNow();
  const likes = [];
  const dislikes = [];
  taglist.forEach(item => {
    if (item.isLike) {
      likes.push(
        <Feed.Event className={styles.infoEvent}>
          <Feed.Label className={styles.infoLabel} image={getUserImgLink(item.user.image)} />
          <Feed.Content>
            {item.user.username}
            {' - '}
            {moment(item.createdAt).fromNow()}
          </Feed.Content>
        </Feed.Event>
      );
    } else {
      dislikes.push(
        <Feed.Event className={styles.infoEvent}>
          <Feed.Label className={styles.infoLabel} image={getUserImgLink(item.user.image)} />
          <Feed.Content>
            {item.user.username}
            {' - '}
            {moment(item.createdAt).fromNow()}
          </Feed.Content>
        </Feed.Event>
      );
    }
  });
  if (likes.length > dislikes.length) {
    appends(dislikes, likes.length - dislikes.length);
  } else {
    appends(likes, dislikes.length - likes.length);
  }
  return (
    <Modal className={styles.infoForm} open onClose={toggleExit}>
      <Modal.Content>
        <Card className={styles.infoTopCard}>
          <Card.Content>
            <Card.Meta>
              <span className="date">
                {infomode ? 'Posted by ' : 'Comment by '}
                {' '}
                {user.username}
                {' - '}
                {date}
              </span>
            </Card.Meta>
            <Card.Description>
              {formatString(body)}
            </Card.Description>
          </Card.Content>
        </Card>
        <Card.Group>
          <Card id={styles.infoCard}>
            <Card.Content>
              <Header dividing>Likes :</Header>
            </Card.Content>
            <Feed>
              {likes}
            </Feed>
          </Card>
          <Card id={styles.infoCard}>
            <Card.Content>
              <Header dividing>DisLikes :</Header>
            </Card.Content>
            <Feed>
              {dislikes}
            </Feed>
          </Card>
        </Card.Group>
      </Modal.Content>
    </Modal>
  );
};

ExpandedInfo.propTypes = {
  listInfo: PropTypes.objectOf(PropTypes.any).isRequired,
  infomode: PropTypes.bool.isRequired,
  toggleInfoPanel: PropTypes.func.isRequired,
  toggleCommentPanel: PropTypes.func.isRequired
};

const mapStateToProps = () => ({
  toggleInfoPanel: PropTypes.func.isRequired,
  toggleCommentPanel: PropTypes.func.isRequired
});

const actions = { toggleInfoPanel, toggleCommentPanel };

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExpandedInfo);
