const cleanObject = (obj) => {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] || obj[key] === false || obj[key] === 0) {
      newObj[key] = obj[key];
    }
  });
  return newObj;
};

export default cleanObject;
