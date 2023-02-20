const COLORS = {
  red: '31',
  green: '32',
  yellow: '33',
  blue: '34',
};

const write = (message, color, reset = false) => {
  if (reset) console.clear();
  if (color in COLORS) { console.log(`\x1b[${COLORS[color]}m ${message} \x1b[0m`); } else { console.log(message); }
};

module.exports = write;
