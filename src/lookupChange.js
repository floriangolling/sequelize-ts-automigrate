const fs = require('fs');
const path = require('path');
const write = require('./writeMessage');

const readFile = (filePath) => {
  try {
    if (!fs.existsSync(filePath)) { return { content: {}, error: 'File does not exists.' }; }
    const content = fs.readFileSync(filePath, 'utf-8');
    write(`[${filePath}] model found.`, 'green');
    return { content, error: null };
  } catch (error) {
    return { content: {}, error };
  }
};

const openDirectory = (directoryPath) => {
  if (!fs.existsSync(directoryPath)) { return { content: {}, error: 'File does not exists.' }; }
  try {
    const directory = fs.readdirSync(directoryPath);
    write('Opening Model directory..', 'green');
    return { content: directory, error: null };
  } catch (error) {
    return { content: {}, error };
  }
};

const manageTokens = (content) => {
  let endToken = 0;
  const object = {
    name: content.split(':')[0],
    keys: {},
  };
  const keyContent = content.substring(content.indexOf('{') + 1, content.indexOf('}'));
  const keys = keyContent.split(',');
  for (let i = 0; i < keys.length; i += 1) {
    if (keys[i]) {
      const values = keys[i].split(':');
      object.keys[values.at(0)] = values.at(1);
      endToken = content.indexOf(values[1]) + values[1].length + 3;
    }
  }
  return {
    object,
    endToken,
  };
};

const manageModelFileContent = (content) => {
  const infos = {
    found: false,
    index: 0,
  };

  const finalObject = [];

  const parseContent = content.trim().replace(' ', '').replace('\t', '').replace('\n', '')
    .replace(/(\r\n|\n|\r)/gm, '')
    .replace(/\s/g, '');
  const index = parseContent.indexOf('.init({');
  let cut = parseContent.slice(index + 6);
  for (let i = 0; i < cut.length; i += 1) {
    if (cut[i] === '{' && i !== 0) infos.found = true;
    if (cut[i] === '}') {
      if (infos.found === false) {
        infos.index = i;
        break;
      } else infos.found = false;
    }
  }
  cut = cut.slice(0, infos.index).slice(1);
  while (1) {
    const obj = manageTokens(cut);
    if (obj.endToken === 0 && !obj.keys && !obj.name) break;
    finalObject.push(obj.object);
    cut = cut.slice(obj.endToken);
  }
  return finalObject;
};

const lookupChange = (paths) => {
  const directoryContent = openDirectory(paths.models);
  if (directoryContent.error) { return write(`Couldnt open directory:\n${directoryContent.error}`, 'red'); }
  for (let i = 0; i < directoryContent.content.length; i += 1) {
    const fileContent = readFile(path.join(paths.models, directoryContent.content[i]));
    const keys = manageModelFileContent(fileContent.content);
    console.log(keys);
    if (fileContent.error) { return write(`Couldnt open file ${directoryContent.content[i]}:\n ${fileContent.error}`, 'red'); }
  }
  return null;
};

module.exports = {
  lookupChange,
};
