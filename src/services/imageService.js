import callWebApi from 'src/helpers/webApiHelper';

export const uploadImage = async image => {
  const response = await callWebApi({
    endpoint: '/api/images/attachment',
    type: 'POST',
    attachment: image
  });
  return response.json();
};

export const createImage = async request => {
  const response = await callWebApi({
    endpoint: '/api/images/',
    type: 'POST',
    request
  });
  return response.json();
};

export const deleteImage = async imageId => {
  const response = await callWebApi({
    endpoint: `/api/images/${imageId}`,
    type: 'DELETE'
  });
  return response.json();
};

export const deleteTmptImage = async request => {
  const response = await callWebApi({
    endpoint: '/api/images/deletetmpt',
    type: 'DELETE',
    request
  });
  return response.json();
};
