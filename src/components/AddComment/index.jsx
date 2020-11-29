import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'semantic-ui-react';

let commentId;

const AddComment = ({
  postId,
  addComment,
  updateComment,
  editComment
}) => {
  const [body, setBody] = useState('');
  const cancelEdit = () => {
    document.getElementById('submit').content = 'Post comment';
    document.getElementById('label').innerText = '';
    commentId = undefined;
    setBody('');
  };
  const handleAddComment = async () => {
    if (!body) {
      return;
    }
    if (commentId) {
      await updateComment({ commentId, body });
    } else {
      await addComment({ postId, body });
    }
    cancelEdit();
  };
  const setEditComment = comment => {
    commentId = comment.id;
    document.getElementById('textArea').focus();
    document.getElementById('submit').content = 'Save comment';
    document.getElementById('label').innerText = `Edit Comment : ${commentId}`;
    setBody(comment.body);
  };
  editComment(setEditComment);
  return (
    <Form reply onSubmit={handleAddComment}>
      <div id="label" />
      <Form.TextArea
        id="textArea"
        value={body}
        placeholder="Type a comment..."
        onChange={ev => setBody(ev.target.value)}
      />
      <Button id="submit" type="submit" content="Post comment" labelPosition="left" icon="edit" primary />
      <Button
        type="reset"
        content="Cancel"
        labelPosition="left"
        icon="cancel"
        style={{ backgroundColor: 'red' }}
        onClick={cancelEdit}
        primary
      />
    </Form>
  );
};

AddComment.propTypes = {
  editComment: PropTypes.func.isRequired,
  addComment: PropTypes.func.isRequired,
  updateComment: PropTypes.func.isRequired,
  postId: PropTypes.string.isRequired
};

export default AddComment;
