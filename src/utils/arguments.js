const checkArgument = (args) => {
  const MODE = [
    { INIT: false },
    { LOOKUP: false },
    { TEST: false },
  ];

  for (arg of args) {
    if (arg === '--init') {
      MODE.INIT = true;
    }
    if (arg === '--test') {
      MODE.TEST = true;
    }
  }
  return MODE;
};

module.exports = checkArgument;
