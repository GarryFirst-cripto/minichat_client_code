export const docHeader = '<!DOCTYPE HTML> <html lang="ru"> <head> <meta charset="utf-8"/>'
  + ' <title> Message from Chat </title> </head> <body>';
export const docBodyA = '<table cellpadding="0" cellspacing="0" left="100" width="600">'
  + '<tr> <td width="100"> </td> <td> <h3> Message : <br /></h3></td> </tr>';
export const docRowA = '<tr> <td width="100"> </td> <td bgcolor="d2d1c6" style="font-size: 16px; padding: 5px">';
export const docRowB = '</td> </tr>';
export const docImgA = '<img width="500" style="display: block;" alt="СМС и Email маркетинг" src="';
export const docImgB = '"></img>';
export const docBodyEnd = '</table>';
export const docFooter = '</body> </html>';

export const resetMessage = 'This letter was sent to you because a password change request was received'
  + ' on the server.<br /> If you did not send such a request, just ignore this letter.<br /><br />'
  + 'To change your password insert new password in the field below and click button "Send"';

export const resetForm = (address, mail, hash) => (
  `<form method="post" action="${address}/pass/user/reset" style="width: 450px; margin-left: 50px;`
  + ' padding: 15px; font-size: 18px; background-color: #94dcc0; border: 1px #002aff solid"> Input your new '
  + 'password :<br> <input type="password" name ="pass" style="background-color: #e7e7f6"> <input type="text"'
  + ` name ="mail" value="${mail}" style="display: none"> <input type="text" name ="hash" value="${hash}" `
  + 'style="display: none"> <input type="submit" value="S e n d" style="width: 120px; background-color: '
  + 'chartreuse; margin-left: 10px"> </form>'
);

export const createMailText = (address, email, pwdhash) => (
  `${docHeader} <h3> ${resetMessage} </h3> <br /> ${resetForm(address, email, pwdhash)}`
);

export const loadState = userId => {
  try {
    const localState = localStorage.getItem(`mstate_${userId}`);
    if (localState === null) {
      return { curAdress: undefined, curThema: undefined, curList: undefined };
    }
    return JSON.parse(localState);
  } catch (err) {
    return { curAdress: undefined, curThema: undefined, curList: undefined };
  }
};

export const saveState = (userId, localState) => {
  try {
    const state = JSON.stringify(localState);
    localStorage.setItem(`mstate_${userId}`, state);
  } catch {
    // ignore write errors
  }
};

export const dateToLocale = data => {
  const dataText = new Date(data).toLocaleDateString();
  const timeText = new Date(data).toLocaleTimeString();
  return `${dataText} at ${timeText}`;
};
