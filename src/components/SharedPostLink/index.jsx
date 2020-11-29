import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Dropdown, Label, Input, Icon, Button, Card, Image, Divider } from 'semantic-ui-react';
import { formatString, lF } from 'src/services/stringservice';
import { toggleSendMail } from 'src/containers/Thread/actions';
import { showModal, oK } from 'src/components/Messages/index';
import * as cons from 'src/helpers/mailData';
import styles from './styles.module.scss';

const { REACT_APP_DATA_SERVER: url } = process.env;

function formatMailString(value) {
  let result = '';
  value.split(lF).forEach(item => {
    result += `${item} <br />`;
  });
  return result;
}
function formatPostImage(image) {
  const result = image
    ? `${cons.docRowA} ${cons.docImgA} ${image.link} ${cons.docImgB} ${cons.docRowB} <br />`
    : '';
  return result;
}
function formatPost(post) {
  const result = `${cons.docBodyA} ${formatPostImage(post.image)}`
  + `${cons.docRowA} ${formatMailString(post.body)} ${cons.docRowB} ${cons.docBodyEnd}`;
  return result;
}
function createMailText(text, post) {
  const result = `${cons.docHeader} <h3> ${formatMailString(text)} </h3> ${formatPost(post)}`
  + `<h3><a href="${url}/share:${post.id}">`
  + `This message available via link</a></h3> ${cons.docFooter}`;
  return result;
}

const defaultThema = 'Would you look through new post ?';
const sendMessage = 'Send Mail ?';

const SharedPostLink = ({
  post,
  current,
  signature,
  close
}) => {
  const { body, image, user, createdAt } = post;
  const { curAdress, curThema = defaultThema, curList = [] } = cons.loadState(current);
  const [email, setAdress] = useState(curAdress);
  const [mailThema, setMailThema] = useState(curThema);
  const [mailList, setMailList] = useState(curList);
  const [mailText, setMailText] = useState(
    ` Hello !${lF} User ${user.username} posted interesting message ${cons.dateToLocale(createdAt)}.`
    + `${lF} Have a nice day ! ${lF} ${signature}`
  );
  const addAdress = (event, { value }) => {
    setAdress(value);
  };
  const addNewAdress = (e, data) => {
    const newList = [
      ...mailList,
      { key: data.value, value: data.value, text: data.value }
    ];
    setMailList(newList);
  };
  const caseSensitiveSearch = (options, query) => (
    options.filter(opt => (opt.text.toLowerCase().startsWith(query.toLowerCase())))
  );
  const handleSendMail = async message => {
    if (message === oK) {
      cons.saveState(current, { curAdress: email, curThema: mailThema, curList: mailList });
      const htmlText = createMailText(mailText, post);
      const { rejected, response } = await toggleSendMail({ email, mailThema, htmlText });
      if (response.indexOf('OK') > 0) {
        close();
      } else {
        showModal(`Error : ${rejected} ${response}`);
      }
    }
  };

  return (
    <Modal className={styles.modalForm} open onClose={close}>
      <Modal.Header className={styles.header}>
        <span>Share Post</span>
      </Modal.Header>
      <Modal.Content>
        <Form onSubmit={() => showModal(sendMessage, true, handleSendMail)}>
          <Label className={styles.modalLabel}>
            <Icon name="user" />
            Adress :
          </Label>
          <Dropdown
            style={{ float: 'left', width: '77%' }}
            fluid
            multiple
            search={caseSensitiveSearch}
            selection
            placeholder="Select Friend"
            value={email}
            allowAdditions
            onChange={addAdress}
            onAddItem={addNewAdress}
            options={mailList}
          />
          <div className={styles.modalClear} />
          <br />
          <Label className={styles.modalLabel}>
            <Icon name="write" />
            Subject :
          </Label>
          <Input
            fluid
            className="modalInput"
            value={mailThema}
            onChange={ev => setMailThema(ev.target.value)}
          />
          <div className={styles.modalClear} />
          <br />
          <Form.TextArea
            rows="5"
            id="postbody"
            name="body"
            value={mailText}
            placeholder="What is the news?"
            onChange={ev => setMailText(ev.target.value)}
          />
          <Card className={styles.modalCard}>
            {image?.link && (
              <div className={styles.imageWrapper}>
                <Image className={styles.image} src={image ? image.link : ''} alt="post" />
              </div>
            )}
            <Divider />
            <Card.Description>
              {formatString(body)}
            </Card.Description>
          </Card>
          <Button floated="right" color="blue" type="submit">
            <Icon name="external" />
            Send Mail
          </Button>
          <br />
          <br />
        </Form>
      </Modal.Content>
    </Modal>
  );
};

SharedPostLink.propTypes = {
  post: PropTypes.objectOf(PropTypes.any).isRequired,
  current: PropTypes.string.isRequired,
  signature: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired
};

export default SharedPostLink;
