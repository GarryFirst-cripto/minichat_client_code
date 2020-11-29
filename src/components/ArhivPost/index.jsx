import React from 'react';
import PropTypes from 'prop-types';
import { Card, Image, Label, Icon } from 'semantic-ui-react';
import moment from 'moment';
import { formatString } from 'src/services/stringservice';
import styles from './styles.module.scss';

const ArhivPost = ({
  post,
  restorePost: restore
}) => {
  const {
    id,
    image,
    body,
    createdAt
  } = post;
  const date = moment(createdAt).fromNow();
  return (
    <Card className={styles.arhivCard}>
      {image && <Image src={image.link} wrapped ui={false} />}
      <Card.Content>
        <Card.Meta>
          <span className="date">
            {date}
          </span>
        </Card.Meta>
        <Card.Description>
          {formatString(body)}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Label basic size="small" as="a" className={styles.toolbarBtn} onClick={() => restore(id)}>
          <Icon name="undo" />
          Restore
        </Label>
      </Card.Content>
    </Card>
  );
};

ArhivPost.propTypes = {
  post: PropTypes.objectOf(PropTypes.any).isRequired,
  restorePost: PropTypes.func.isRequired
};

export default ArhivPost;
