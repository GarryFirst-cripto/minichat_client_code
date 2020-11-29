import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Icon, Image, Segment } from 'semantic-ui-react';
import * as imageService from 'src/services/imageService';
import styles from './styles.module.scss';

const AddPost = ({
  addPost,
  uploadImage,
  createImage
}) => {
  const [body, setBody] = useState('');
  const [image, setImage] = useState(undefined);
  const [tmptHash, setTmptHash] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleAddPost = async () => {
    if (!body) {
      return;
    }
    setTmptHash('');
    const { id: imageId } = image ? await createImage(image) : {};
    await addPost({ imageId, body });
    setBody('');
    setImage(undefined);
  };

  const handleUploadFile = async ({ target }) => {
    setIsUploading(true);
    try {
      if (tmptHash) imageService.deleteTmptImage({ tmptHash });
      const { link, deleteHash } = await uploadImage(target.files[0]);
      setImage({ link, deleteHash });
      setTmptHash(deleteHash);
    } finally {
      // TODO: show error
      setIsUploading(false);
    }
  };

  return (
    <Segment>
      <Form onSubmit={handleAddPost}>
        <Form.TextArea
          name="body"
          value={body}
          placeholder="What is the news?"
          onChange={ev => setBody(ev.target.value)}
        />
        {image && (
          <div className={styles.imageWrapper}>
            <Image className={styles.image} src={image.link} alt="post" />
          </div>
        )}
        <Button color="teal" icon labelPosition="left" as="label" loading={isUploading} disabled={isUploading}>
          <Icon name="image" />
          Attach image
          <input name="image" type="file" onChange={handleUploadFile} hidden />
        </Button>
        <Button floated="right" color="blue" type="submit">
          <Icon name="edit" />
          Add Post
        </Button>
      </Form>
    </Segment>
  );
};

AddPost.propTypes = {
  addPost: PropTypes.func.isRequired,
  uploadImage: PropTypes.func.isRequired,
  createImage: PropTypes.func.isRequired
};

export default AddPost;
