import React, { useState } from 'react';
import PropTypes from 'prop-types';
import validator from 'validator';
import { Form, Button, Segment } from 'semantic-ui-react';
import { loadMailAddress, saveMailAddress } from 'src/services/stringservice';
import { showModal } from '../Messages/index';

const RegistrationForm = ({ register: signOn }) => {
  const [email, setEmail] = useState(loadMailAddress());
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [isEmailValid, setEmailValid] = useState(true);
  const [isUsernameValid, setUsernameValid] = useState(true);
  const [isPasswordValid, setPasswordValid] = useState(true);

  const emailChanged = value => {
    setEmail(value);
    setEmailValid(true);
    saveMailAddress(value);
  };

  const usernameChanged = value => {
    setUsername(value);
    setUsernameValid(true);
  };

  const passwordChanged = value => {
    setPassword(value);
    setPasswordValid(true);
  };

  const dataValid = () => {
    setUsernameValid(Boolean(username));
    setEmailValid((email) && validator.isEmail(email));
    setPasswordValid(Boolean(password));
  };

  const register = async () => {
    const isValid = isEmailValid && isUsernameValid && isPasswordValid;
    if (!isValid || isLoading) {
      if (!isValid) showModal('You must enter the correct data !');
      return;
    }
    setLoading(true);
    try {
      const usermail = email.toLowerCase();
      const user = await signOn({ email: usermail, password, username });
      setLoading(false);
      if (!user) {
        showModal('Registration denied ! Try to use another user name or e-mail address.');
      }
    } catch {
      setLoading(false);
    }
  };

  return (
    <Form name="registrationForm" size="large" onSubmit={register}>
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
          onBlur={() => setEmailValid((email) && validator.isEmail(email))}
        />
        <Form.Input
          fluid
          icon="user"
          iconPosition="left"
          placeholder="Username"
          type="text"
          error={!isUsernameValid}
          onChange={ev => usernameChanged(ev.target.value)}
          onBlur={() => setUsernameValid(Boolean(username))}
        />
        <Form.Input
          fluid
          icon="lock"
          iconPosition="left"
          placeholder="Password"
          type="password"
          onChange={ev => passwordChanged(ev.target.value)}
          error={!isPasswordValid}
          onBlur={() => setPasswordValid(validator.isLength(password, { min: 5 }))}
        />
        <Button type="submit" color="teal" fluid size="large" loading={isLoading} primary onClick={dataValid}>
          Register
        </Button>
      </Segment>
    </Form>
  );
};

RegistrationForm.propTypes = {
  register: PropTypes.func.isRequired
};

export default RegistrationForm;
