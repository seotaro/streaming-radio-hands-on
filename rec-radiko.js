'use strict';

const utils = require('./utils.js');

if (process.argv.length !== 5) {
  console.log('usage: node rec-radiko.js {TBS|QRR|LFR|INT|FMT|FMJ|JORF|BAYFM78|NACK5|YFM|...} duration filename');
  console.log('');
  console.log('Example usage:');
  console.log('  node rec-radiko.js FMT 55 "山下達郎のサンデー・ソングブック"');
  process.exit(-1);
}

const CHANNEL = process.argv[2];
const DURATION = Number(process.argv[3]) * 60;  // [sec]
const FILENAME = process.argv[4];

(async () => {
  try {
    const [token, partialKey] = await utils.authorization1();
    await utils.authorization2(token, partialKey);

    // https://radiko.jp/v3/station/stream/pc_html5/${CHANNEL}.xml の定義から
    const url = `https://si-f-radiko.smartstream.ne.jp/so/playlist.m3u8?station_id=${CHANNEL}&l=15&lsid=${utils.lsid()}&type=b`;
    await utils.downloadFromRadiko(token, url, DURATION, FILENAME);

  } catch (err) {
    console.error(err);
    process.exit(-1)
  }
})();





