const reg = new RegExp(/("DataTypes.)\w+.*"/g);

const replaceDataTypes = (content) => {
  let result;

  while ((result = reg.exec(content)) !== null) {
    const token = result[0].replace('"', '').slice(0, -1);
    content = content.replace(result[0], token);
  }
  return content;
};

module.exports = replaceDataTypes;
