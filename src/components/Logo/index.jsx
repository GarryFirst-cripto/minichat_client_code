import React from 'react';
import { Image, Header } from 'semantic-ui-react';

import styles from './styles.module.scss';

export const Logo = () => (
  <Header as="h2" color="grey" className={styles.logoWrapper}>
    <Image circular src="https://raw.githubusercontent.com/GarryFirst-cripto/resurses/master/pictures/mini_chat_logo.png" />
    {' '}
    Mini Chat
  </Header>
);

export default Logo;
