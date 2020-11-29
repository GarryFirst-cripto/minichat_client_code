import callWebApi from 'src/helpers/webApiHelper';

export const login = async request => {
  try {
    const response = await callWebApi({
      endpoint: '/api/auth/login',
      type: 'POST',
      request
    });
    return response.json();
  } catch (e) {
    return { user: null, token: null };
  }
};

export const registration = async request => {
  try {
    const response = await callWebApi({
      endpoint: '/api/auth/register',
      type: 'POST',
      request
    });
    return response.json();
  } catch (e) {
    return { user: null, token: null };
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await callWebApi({
      endpoint: '/api/auth/user',
      type: 'GET'
    });
    return response.json();
  } catch (e) {
    return null;
  }
};

export const getUserWithNew = async userHash => {
  try {
    const response = await callWebApi({
      endpoint: '/pass/user/newpwd',
      type: 'GET',
      query: { userHash }
    });
    return response.json();
  } catch (e) {
    return null;
  }
};

export const updateCurrentUser = async request => {
  try {
    const response = await callWebApi({
      endpoint: '/api/auth/',
      type: 'PUT',
      request
    });
    return response.json();
  } catch (e) {
    return null;
  }
};

export const getUserByMail = async mail => {
  const response = await callWebApi({
    endpoint: '/pass/user/email/',
    type: 'GET',
    query: { mail }
  });
  return response.json();
};
