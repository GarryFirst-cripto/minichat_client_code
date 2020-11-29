import React, { useState } from 'react';
import { bindActionCreators } from 'redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import validator from 'validator';
import { getUserImgLink, getUserImgHash } from 'src/helpers/imageHelper';
import { Grid, Image, Input, Button, Icon } from 'semantic-ui-react';
import * as imageService from 'src/services/imageService';
import { updateCurrentUser } from 'src/services/authService';
import { setEditingProfile } from 'src/components/Header';
import { showModal, oK } from 'src/components/Messages/index';
import { updateUser } from './actions';
import styles from './styles.module.scss';

const editNotSave = 'Profile changes not saved! Exit anyway ?';
let direction = '/';

const Profile = ({ user, updateUser: updUser }) => {
  const oldLink = getUserImgLink(user.image);
  const oldHash = getUserImgHash(user.image);
  const [image, setImage] = useState({ link: oldLink, deleteHash: oldHash });
  const [tmptHash, setTmptHash] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [username, setUserName] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState(user.status);
  const [viewType, setViewType] = useState({ viewMode: 'password', iconName: 'unhide' });
  const [edited, setEdited] = useState({ dataedit: false, imgedit: false });
  const [redirect, setRedirect] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isEmailValid, setEmailValid] = useState(true);
  const [isUsernameValid, setUsernameValid] = useState(true);
  const [isPasswordValid, setPasswordValid] = useState(true);

  const changeView = () => {
    if (viewType.viewMode === 'password') {
      setViewType({ viewMode: 'text', iconName: 'hide' });
    } else {
      setViewType({ viewMode: 'password', iconName: 'unhide' });
    }
  };
  const handleUploadFile = async ({ target }) => {
    setIsUploading(true);
    try {
      if (tmptHash) imageService.deleteTmptImage({ tmptHash });
      const { link, deleteHash } = await imageService.uploadImage(target.files[0]);
      setImage({ link, deleteHash });
      setEdited({ imgedit: true });
      setTmptHash(deleteHash);
    } finally {
      // TODO: show error
      setIsUploading(false);
    }
  };
  function ascSavePost(message) {
    if (message === oK) {
      if (tmptHash) imageService.deleteTmptImage({ tmptHash });
      setEdited(false, false);
      setRedirect(true);
    }
  }
  const handleClose = (event, path) => {
    direction = path;
    if ((edited.dataedit === true) || (edited.imgedit === true)) {
      showModal(editNotSave, true, ascSavePost);
      event.preventDefault();
    }
  };
  async function handleUpdateProfile() {
    const isValid = isEmailValid && isUsernameValid && isPasswordValid;
    if (!isValid || isLoading) {
      if (!isValid) showModal('You must enter the correct data !');
      return;
    }
    setLoading(true);
    direction = '/';
    let imageId;
    try {
      if (edited.imgedit === true) {
        setTmptHash('');
        if (user.imageId) {
          await imageService.deleteImage(user.imageId);
        }
        const newImage = image ? await imageService.createImage(image) : undefined;
        imageId = newImage.id;
      }
      const result = await updateCurrentUser({ username, email, password, status, imageId });
      const {
        error,
        text,
        status: stat
      } = result;
      setLoading(false);
      if (error === true) {
        showModal(`Error ${stat} : ${text}`);
      } else {
        updUser();
        setEdited(false, false);
        setRedirect(true);
      }
    } catch {
      setLoading(false);
    }
  }
  function testValue(value, valueName) {
    const result = (value !== '');
    if (!result) {
      showModal(`ERROR ! Field ${valueName} will not by empty !`);
    }
    return result;
  }
  function writeWithPassword(message) {
    if (message === oK) handleUpdateProfile();
  }
  function testPassword(value) {
    const result = (!value);
    if (!result) {
      showModal('ATTENTION ! Your password will be changed !', true, writeWithPassword);
    }
    return result;
  }
  function saveProfile() {
    const validate = (testValue(username, 'username') && testValue(email, 'E-mail') && testPassword(password));
    if (validate === true) handleUpdateProfile();
  }
  setEditingProfile(handleClose);

  return (
    <Grid container textAlign="center" style={{ paddingTop: 30 }}>
      <Grid.Column>
        <Image centered src={image.link} size="medium" circular />
        <br />
        <br />
        <Button color="violet" icon labelPosition="left" as="label" loading={isUploading} disabled={isUploading}>
          <Icon name="image" />
          Select Avatar
          <input name="image" type="file" onChange={handleUploadFile} hidden />
        </Button>
        <br />
        <br />
        <br />
        <Input
          className={styles.profInput}
          icon="user"
          iconPosition="left"
          placeholder="Username"
          type="text"
          value={username}
          error={!isUsernameValid}
          onChange={event => {
            setEdited({ dataedit: true });
            setUserName(event.target.value);
          }}
          onBlur={() => setUsernameValid(Boolean(username))}
        />
        <br />
        <br />
        <Input
          className={styles.profInput}
          icon="envelope outline"
          iconPosition="left"
          placeholder="Email"
          type="email"
          value={email}
          error={!isEmailValid}
          onChange={event => {
            setEdited({ dataedit: true });
            setEmail(event.target.value);
          }}
          onBlur={() => setEmailValid((email) && validator.isEmail(email))}
        />
        <br />
        <br />
        <Input
          className={styles.profPass}
          icon="privacy"
          iconPosition="left"
          placeholder="Set new password"
          type={viewType.viewMode}
          value={password}
          error={!isPasswordValid}
          onChange={event => {
            setEdited({ dataedit: true });
            setPassword(event.target.value);
          }}
          onBlur={() => setPasswordValid((!password) || validator.isLength(password, { min: 5 }))}
        />
        <Button className={styles.profButton} onClick={changeView}>
          <Icon name={viewType.iconName} />
        </Button>
        <br />
        <br />
        <Input
          className={styles.profInput}
          icon="flag checkered"
          iconPosition="left"
          placeholder="Status"
          type="text"
          value={status}
          onChange={event => {
            setEdited({ dataedit: true });
            setStatus(event.target.value);
          }}
        />
        <br />
        <br />
        <Button color="green" onClick={saveProfile} loading={isLoading}>
          <Icon name="edit" />
          Save user profile
        </Button>
        <br />
        <br />
      </Grid.Column>
      {redirect && <Redirect to={direction} />}
    </Grid>
  );
};

Profile.propTypes = {
  user: PropTypes.objectOf(PropTypes.any),
  updateUser: PropTypes.func.isRequired
};

Profile.defaultProps = {
  user: {}
};

const actions = { updateUser };

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

const mapStateToProps = rootState => ({
  user: rootState.profile.user
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
