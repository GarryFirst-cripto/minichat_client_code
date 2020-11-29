import React from 'react';
import Logo from 'src/components/Logo';
import { Grid, Header, Message } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import PasswordForm from 'src/components/PasswordForm';

const PasswordPage = () => (
  <Grid textAlign="center" verticalAlign="middle" className="fill">
    <Grid.Column style={{ maxWidth: 450 }}>
      <Logo />
      <Header as="h2" color="teal" textAlign="center">
        Reset Your Password
      </Header>
      <PasswordForm />
      <Message>
        Recall password ?
        {' '}
        <NavLink exact to="/login">Sign In</NavLink>
      </Message>
    </Grid.Column>
  </Grid>
);

export default PasswordPage;
