import React, { useState } from 'react';
import validator from 'validator';
import { Redirect } from 'react-router-dom';
import { Form, Button, Segment } from 'semantic-ui-react';
import { loadMailAddress, saveMailAddress } from 'src/services/stringservice';
import { getUserByMail } from 'src/containers/Profile/actions';
import { showModal } from 'src/components/Messages/index';
import { sendResetMail } from 'src/containers/Thread/actions';
import { createMailText } from 'src/helpers/mailData';

const { REACT_APP_DATA_SERVER: origin } = process.env;

const noUserMessage = 'We do not have a user with this E-mail ...';
const resetMessage = 'We sent an email to your address to reset password !';
const mailThema = 'Password reset request !';

const PasswordForm = () => {
  const [email, setEmail] = useState(loadMailAddress());
  const [isEmailValid, setEmailValid] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const emailChanged = value => {
    setEmail(value);
    setEmailValid(true);
    saveMailAddress(value);
  };

  const dataValid = () => {
    setEmailValid((email) && validator.isEmail(email));
  };

  const resetPassword = async () => {
    if (!isEmailValid || isLoading) {
      if (!isEmailValid) showModal('You must enter the correct e-mail !');
      return;
    }
    setLoading(true);
    try {
      const user = await getUserByMail(email);
      if (user.isUser !== '') {
        const htmlText = createMailText(origin, email, user.isUser);
        const { rejected, response } = await sendResetMail({ email, mailThema, htmlText, origin });
        if (response.indexOf('OK') > 0) {
          showModal(resetMessage);
          setRedirect(true);
        } else {
          showModal(`Error : ${rejected} ${response}`);
        }
      } else {
        showModal(noUserMessage);
      }
      setLoading(false);
    } catch {
      showModal('Error !');
      setLoading(false);
    }
  };

  return (
    <Form name="registrationForm" size="large" onSubmit={resetPassword}>
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
        <Button type="submit" color="teal" fluid size="large" loading={isLoading} primary onClick={dataValid}>
          Reset Password
        </Button>
      </Segment>
      {redirect && <Redirect to="/login" />}
    </Form>
  );
};

export default PasswordForm;
