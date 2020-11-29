import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

const { REACT_APP_DATA_SERVER: address } = process.env;

let usSocket;
const Notifications = ({ user, applyPost, updatePost, deletePost }) => {
  const socket = io(address);
  usSocket = socket;
  useEffect(() => {
    if (!user) {
      return undefined;
    }
    socket.on('newRoom', () => {
      const { id, username } = user;
      socket.emit('createRoom', { id, username });
    });
    socket.on('like', postId => {
      NotificationManager.info('Your post was liked!');
      updatePost(postId);
    });
    socket.on('join', username => {
      NotificationManager.info(`User ${username} joined to us !`);
    });
    socket.on('leave', username => {
      NotificationManager.info(`User ${username} leaved us !`);
    });
    socket.on('add_post', postId => {
      applyPost(postId);
    });
    socket.on('upd_post', postId => {
      updatePost(postId);
    });
    socket.on('dell_post', postId => {
      deletePost(postId);
    });
    return () => {
      socket.close();
    };
  });
  return <NotificationContainer />;
};

Notifications.defaultProps = {
  user: undefined
};

Notifications.propTypes = {
  user: PropTypes.objectOf(PropTypes.any),
  applyPost: PropTypes.func.isRequired,
  updatePost: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired
};

export default Notifications;

export const userSocket = () => (usSocket);
