import React from 'react';

export const lF = String.fromCharCode(10);

export const formatString = text => {
  const result = [];
  text.split(lF).forEach((item, index, array) => {
    result.push(item);
    if (index < array.length - 1) result.push(<br />);
  });
  return result;
};

const itemName = 'mailAddress';

export const loadMailAddress = () => {
  try {
    return sessionStorage.getItem(itemName);
  } catch (err) {
    return '';
  }
};

export const saveMailAddress = address => {
  try {
    sessionStorage.setItem(itemName, address);
  } catch {
    // ignore write errors
  }
};
