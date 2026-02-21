'use strict';

const utils = require('./utils.js');

(async () => {
  try {
    const [token, partialKey] = await utils.authorization1();
    const area = await utils.authorization2(token, partialKey);
    console.log(`Authorized. token=${token}, area=${area}`);

  } catch (err) {
    console.error(err);
    process.exit(-1)
  }
})();





