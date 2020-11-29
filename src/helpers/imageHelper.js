export const getUserImgLink = image => (image
  ? image.link
  : 'https://forwardsummit.ca/wp-content/uploads/2019/01/avatar-default.png');

export const getUserImgHash = image => (image
  ? image.deleteHash
  : '');
