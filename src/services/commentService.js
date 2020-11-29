import callWebApi from 'src/helpers/webApiHelper';

export const getComment = async id => {
  const response = await callWebApi({
    endpoint: `/api/comments/${id}`,
    type: 'GET'
  });
  return response.json();
};

export const getReactList = async commentId => {
  const response = await callWebApi({
    endpoint: '/api/comments/commentlist',
    type: 'GET',
    query: { commentId }
  });
  return response.json();
};

export const addComment = async request => {
  const response = await callWebApi({
    endpoint: '/api/comments/',
    type: 'POST',
    request
  });
  return response.json();
};

export const updateComment = async request => {
  const response = await callWebApi({
    endpoint: '/api/comments/',
    type: 'PUT',
    request
  });
  return response.json();
};

export const deleteComment = async commentId => {
  const response = await callWebApi({
    endpoint: `/api/comments/${commentId}`,
    type: 'DELETE'
  });
  return response.json();
};

export const likeComment = async commentId => {
  const response = await callWebApi({
    endpoint: '/api/comments/react',
    type: 'PUT',
    request: {
      commentId,
      isLike: true
    }
  });
  return response.json();
};

export const dislikeComment = async commentId => {
  const response = await callWebApi({
    endpoint: '/api/comments/react',
    type: 'PUT',
    request: {
      commentId,
      isLike: false
    }
  });
  return response.json();
};
