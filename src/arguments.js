const checkArgument = (args) => {
  const MODE = [
    { INIT: false },
    { LOOKUP: false },
  ];

  for (arg of args) {
    if (arg === '--init') {
      MODE.INIT = true;
    }
  }
  return MODE;
};

module.exports = { checkArgument };
