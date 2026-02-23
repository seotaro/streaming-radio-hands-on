'use strict';

const moment = require('moment-timezone');
const utils = require('./utils.js');

if (process.argv.length !== 6) {
  console.log('usage: node rec-radiko-time-free.js {TBS|QRR|LFR|INT|FMT|FMJ|JORF|BAYFM78|NACK5|YFM|...} start end filename');
  console.log('');
  console.log('Example usage:');
  console.log('  node rec-radiko-time-free.js FMT 2023-06-23T08:00:00+09:00 2023-06-23T08:30:00+09:00 "山下達郎のサンデー・ソングブック"');
  process.exit(1);
}

const CHANNEL = process.argv[2];
const START = new Date(process.argv[3]);
const END = new Date(process.argv[4]);
const FILENAME = process.argv[5];

if (isNaN(START.getTime())) {
  console.error(`Invalid start date: ${process.argv[3]}`);
  process.exit(1);
}
if (isNaN(END.getTime())) {
  console.error(`Invalid end date: ${process.argv[4]}`);
  process.exit(1);
}

(async () => {
  try {
    const [token, partialKey] = await utils.authorization1();
    const area = await utils.authorization2(token, partialKey);
    console.log(`Authorized. token=${token}, area=${area}`);

    const start = moment(START).tz("Asia/Tokyo").format('YYYYMMDDHHmmss');
    const end = moment(END).tz("Asia/Tokyo").format('YYYYMMDDHHmmss');

    // https://radiko.jp/v3/station/stream/pc_html5/${CHANNEL}.xml の定義から
    const url = `https://tf-f-rpaa-radiko.smartstream.ne.jp/tf/playlist.m3u8?station_id=${CHANNEL}&start_at=${start}&ft=${start}&end_at=${end}&to=${end}&preroll=0&l=15&lsid=${utils.lsid()}&type=b`;

    await utils.downloadFromRadiko(token, url, null, FILENAME);

  } catch (err) {
    console.error(err);
    process.exit(1)
  }
})();





