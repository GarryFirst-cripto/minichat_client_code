import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { getUserImgLink } from 'src/helpers/imageHelper';
import { Header as HeaderUI, Image, Grid, Icon, Button } from 'semantic-ui-react';
import { userSocket } from '../Notifications/index';

import styles from './styles.module.scss';

let setEditing = () => {};
const Header = ({ user, logout }) => {
  function doLogout() {
    const socket = userSocket();
    if (socket) socket.close();
    logout();
  }
  return (
    <div className={styles.headerWrp}>
      <Grid centered container columns="3">
        <Grid.Column>
          {user && (
            <NavLink exact to="/arhiv" onClick={event => setEditing(event, '/arhiv')}>
              <HeaderUI>
                <Image src="https://novogrodovka-rada.gov.ua/images/news/2017/8/1.jpg" />
                {' '}
                Arhiv
                {' '}
                {user.username}
              </HeaderUI>
            </NavLink>
          )}
        </Grid.Column>
        <Grid.Column>
          {user && (
            <NavLink exact to="/" onClick={event => setEditing(event, '/')}>
              <HeaderUI>
                <Image circular src={getUserImgLink(user.image)} />
                {' '}
                {user.username}
              </HeaderUI>
            </NavLink>
          )}
        </Grid.Column>
        <Grid.Column textAlign="right">
          <NavLink exact activeClassName="active" to="/profile" className={styles.menuBtn}>
            <Icon name="user circle" size="large" />
            User profile
          </NavLink>
          <Button basic icon type="button" className={`${styles.menuBtn} ${styles.logoutBtn}`} onClick={doLogout}>
            <Icon name="log out" size="large" />
          </Button>
        </Grid.Column>
      </Grid>
    </div>
  );
};

Header.propTypes = {
  logout: PropTypes.func.isRequired,
  user: PropTypes.objectOf(PropTypes.any).isRequired
};

export const setEditingProfile = param => {
  setEditing = param;
};

export default Header;
