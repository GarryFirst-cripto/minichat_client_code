import callWebApi from 'src/helpers/webApiHelper';
import * as cons from 'src/helpers/mailData';

export const sendMail = async mail => {
  const response = await callWebApi({
    endpoint: '/api/posts/mail',
    type: 'POST',
    request: mail
  });
  return response.json();
};

export const sendResetMail = async mail => {
  const response = await callWebApi({
    endpoint: '/pass/mail/mail',
    type: 'POST',
    request: mail
  });
  return response.json();
};

export const sendPostReaction = (post, user) => {
  const text = `${cons.docHeader}<h2> User ${user.username} tags your post with "Like" ${cons.dateToLocale(Date())}`
    + `<br /><br /><a href="${window.location.origin}/share/${post.id}">`
    + `You would see it via link</a></h2>${cons.docFooter}`;
  const message = { email: post.user.email, mailThema: 'Your post liked', htmlText: text };
  sendMail(message);
};
