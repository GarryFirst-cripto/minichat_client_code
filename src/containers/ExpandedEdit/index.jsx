import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Modal, Form, Button, Icon, Image, Segment } from 'semantic-ui-react';
import { toggleEditPost, updatePost } from 'src/containers/Thread/actions';
import { showModal, oK } from 'src/components/Messages/index';
import { deleteImage, deleteTmptImage } from 'src/services/imageService';
import styles from './styles.module.scss';

const editNotSave = 'Changes not saved! Exit anyway ?';

const ExpandedEdit = ({
  post,
  uploadImage,
  createImage,
  toggleEditPost: toggleEdit,
  updatePost: updPost
}) => {
  const [body, setBody] = useState(post.body);
  const [edited, setEdited] = useState({ bodyedit: false, linkedit: false });
  const oldLink = post.image ? post.image.link : undefined;
  const oldHash = post.image ? post.image.deleteHash : '';
  const [image, setImage] = useState({ link: oldLink, deleteHash: oldHash });
  const [tmptHash, setTmptHash] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const postId = post.id;

  function ascSavePost(message) {
    if (message === oK) {
      if (tmptHash) deleteTmptImage({ tmptHash });
      toggleEdit();
    }
  }

  const handleUploadFile = async ({ target }) => {
    setIsUploading(true);
    try {
      if (tmptHash) deleteTmptImage({ tmptHash });
      const { link, deleteHash } = await uploadImage(target.files[0]);
      setImage({ link, deleteHash });
      setEdited({ linkedit: true });
      setTmptHash(deleteHash);
    } finally {
      // TODO: show error
      setIsUploading(false);
    }
  };
  const handleRemoveFile = () => {
    if (tmptHash) deleteTmptImage({ tmptHash });
    setImage(undefined);
    setEdited({ linkedit: true });
    setTmptHash('');
  };
  const handleUpdatePost = async () => {
    if (!body) {
      return;
    }
    let imageId;
    if (edited.linkedit === true) {
      if (post.imageId) {
        await deleteImage(post.imageId);
      }
      const newImage = image ? await createImage(image) : {};
      imageId = newImage.id;
    } else {
      imageId = post.image ? post.image.id : undefined;
    }
    await updPost({ postId, body, imageId });
    toggleEdit();
  };
  const handleClose = () => {
    if ((edited.bodyedit === true) || (edited.linkedit === true)) {
      showModal(editNotSave, true, ascSavePost);
    } else {
      toggleEdit();
    }
  };
  const elem = document.getElementById('postbody');
  if (elem) setTimeout(() => elem.focus(), 10);
  return (
    <Modal className={styles.editForm} open onClose={handleClose}>
      <Modal.Content>
        <Segment>
          <Form onSubmit={handleUpdatePost}>
            <Form.TextArea
              id="postbody"
              rows="6"
              name="body"
              value={body}
              placeholder="What is the news?"
              onChange={ev => {
                setEdited({ bodyedit: true });
                setBody(ev.target.value);
              }}
            />
            {image?.link && (
              <div className={styles.imageWrapper}>
                <Image className={styles.image} src={image ? image.link : ''} alt="post" />
              </div>
            )}
            <Button color="teal" icon labelPosition="left" as="label" loading={isUploading} disabled={isUploading}>
              <Icon name="image" />
              Attach image
              <input name="image" type="file" onChange={handleUploadFile} hidden />
            </Button>
            <Button
              color="yellow"
              icon
              labelPosition="left"
              as="label"
              loading={isUploading}
              disabled={isUploading}
              onClick={handleRemoveFile}
            >
              <Icon name="cancel" />
              Remove image
            </Button>
            <Button floated="right" color="blue" type="submit">
              <Icon name="edit" />
              Save Post
            </Button>
          </Form>
        </Segment>
      </Modal.Content>
    </Modal>
  );
};

ExpandedEdit.propTypes = {
  post: PropTypes.objectOf(PropTypes.any).isRequired,
  toggleEditPost: PropTypes.func.isRequired,
  updatePost: PropTypes.func.isRequired,
  uploadImage: PropTypes.func.isRequired,
  createImage: PropTypes.func.isRequired
};

const mapStateToProps = rootState => ({
  post: rootState.posts.expandedEdit
});

const actions = { updatePost, toggleEditPost };

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExpandedEdit);
