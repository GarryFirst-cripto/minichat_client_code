import React, { useState } from 'react';
import PropTypes from 'prop-types';
import validator from 'validator';
import { Form, Button, Segment } from 'semantic-ui-react';
import { loadMailAddress, saveMailAddress } from 'src/services/stringservice';
import { showModal } from '../Messages/index';

const LoginForm = ({ login }) => {
  const [email, setEmail] = useState(loadMailAddress());
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);

  const emailChanged = data => {
    setEmail(data);
    setIsEmailValid(true);
    saveMailAddress(data);
  };

  const passwordChanged = data => {
    setPassword(data);
    setIsPasswordValid(true);
  };

  const dataValid = () => {
    setIsEmailValid((email) && validator.isEmail(email));
    setIsPasswordValid(Boolean(password));
  };

  const handleLoginClick = async () => {
    const isValid = isEmailValid && isPasswordValid;
    if (!isValid || isLoading) {
      if (!isValid) showModal('You must enter the correct data !');
      return;
    }
    setIsLoading(true);
    try {
      const usermail = email.toLowerCase();
      const user = await login({ email: usermail, password });
      setIsLoading(false);
      if (!user) {
        showModal('Access denied ! Invalid e-mail address or password.');
      }
    } catch {
      // TODO: show error
      setIsLoading(false);
    }
  };

  return (
    <Form name="loginForm" size="large" onSubmit={handleLoginClick}>
      <Segment>
        <Form.Input
          fluid
          icon="at"
          iconPosition="left"
          placeholder="Email"
          type="email"
          value={email}
          error={!isEmailValid}
          onChange={ev => emailChanged(ev.target.value)}
          onBlur={() => setIsEmailValid((email) && validator.isEmail(email))}
        />
        <Form.Input
          fluid
          icon="lock"
          iconPosition="left"
          placeholder="Password"
          type="password"
          error={!isPasswordValid}
          onChange={ev => passwordChanged(ev.target.value)}
          onBlur={() => setIsPasswordValid(Boolean(password))}
        />
        <Button type="submit" color="teal" fluid size="large" loading={isLoading} primary onClick={dataValid}>
          Login
        </Button>
      </Segment>
    </Form>
  );
};

LoginForm.propTypes = {
  login: PropTypes.func.isRequired
};

export default LoginForm;
