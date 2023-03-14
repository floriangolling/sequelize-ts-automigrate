const checkArgument = (args) => {
  const MODE = [
    { INIT: false },
    { LOOKUP: false },
    { TEST: false },
  ];
  for (let i = 0; i < args.length; i += 1) {
    switch (args[i]) {
      case '--init':
        MODE.INIT = true;
        break;
      case '--test':
        MODE.TEST = true;
        break;
      default:
        break;
    }
  }
  return MODE;
};

module.exports = checkArgument;
