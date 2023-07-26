export const validateLoginForm = ({ mail, password }) => {
  const isMailValid = validateMail(mail);
  return isMailValid;
};

export const validateMail = (mail) => {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailPattern.test(mail);
};

const validateUsername = (username) => {
  return username.length > 2 && username.length < 13;
};
