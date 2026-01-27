'use strict';

const xml2js = require('xml2js');
const { Buffer } = require('buffer');
const { exec } = require('child_process');
const moment = require('moment-timezone');
const crypto = require('crypto')

const now = () => {
  return (new Date()).toISOString();
};

const format = (date) => {
  return moment(date).tz("Asia/Tokyo").format("YYYY-MM-DD HH:mm:ss");
}

// AuthToken と PartialKey を返す。
const authorization1 = () => {
  const AUTHKEY = 'bcd151073c03b352e1ef2fd66c32209da9ca0afa';
  const URL = `https://radiko.jp/v2/api/auth1`;

  return fetch(URL, {
    method: 'GET',
    headers: {
      'X-Radiko-App': 'pc_html5',
      'X-Radiko-App-Version': '0.0.1',
      'X-Radiko-User': 'dummy_user',
      'X-Radiko-Device': 'pc',
    },
  })
    .then(response => {
      if (response.status !== 200) throw new Error(`status=${response.status}`);
      if (!response.headers.has('x-radiko-authtoken')
        || !response.headers.has('x-radiko-keyoffset')
        || !response.headers.has('x-radiko-keylength'))
        throw new Error('header is missing');

      const authtoken = response.headers.get('x-radiko-authtoken');
      const partialKey = toPartialKey(AUTHKEY
        , Number(response.headers.get('x-radiko-keyoffset'))
        , Number(response.headers.get('x-radiko-keylength')));
      return [authtoken, partialKey];
    })
    .catch((err) => {
      throw new Error(`authorization1 failed ${err}`);
    });
};

const authorization2 = (token, partialKey) => {
  const URL = `https://radiko.jp/v2/api/auth2`;
  return fetch(URL, {
    method: 'GET',
    headers: {
      'X-Radiko-User': 'dummy_user',
      'X-Radiko-Device': 'pc',
      'X-Radiko-AuthToken': token,
      'X-Radiko-PartialKey': partialKey,
    },
  })
    .then(response => {
      if (response.status !== 200) throw new Error(`status=${response.status}`);


    })
    .catch((err) => {
      throw new Error(`authorization2 failed ${err}`);
    });
}


const getStreamUrl = (station) => {
  const URL = `http://radiko.jp/v2/station/stream_smh_multi/${station}.xml`
  return fetch(URL)
    .then(response => {
      return response.text();
    })
    .then(text => {
      return xml2js.parseStringPromise(text, { mergeAttrs: true });
    })
    .then(xml => {
      return xml.urls?.url?.[0].playlist_create_url?.[0]
    })
}

const toPartialKey = (key, offset, length) => {
  const partialKey = key.slice(offset, offset + length);
  return Buffer.from(partialKey).toString('base64');
}

const downloadFromRadiko = (authToken, url, duration, filename) => {
  const command = [`ffmpeg`, `-loglevel error`];
  if (duration) {
    command.push(`-t ${duration}`)
  }
  command.push(`-fflags +discardcorrupt`);
  command.push(`-headers "X-Radiko-Authtoken: ${authToken}"`);
  command.push(`-y -i "${url}"`);
  command.push(`-bsf:a aac_adtstoasc`);
  command.push(`-c copy "${filename}.m4a"`);

  return new Promise((resolve, reject) => {
    exec(command.join(' '), (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        console.log(now(), 'downloaded', filename);
        resolve();
      }
    });
  })
}

const downloadFromNhkOnDemand = (url, duration, filename) => {
  const command = [
    `ffmpeg`,
    `-loglevel error`,
    `-t ${duration}`,
    `-fflags +discardcorrupt`,
    `-y -i ${url}`,
    `-bsf:a aac_adtstoasc`,
    `-c copy "${filename}.m4a"`
  ];

  return new Promise((resolve, reject) => {
    exec(command.join(' '), (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        console.log(now(), 'downloaded', filename);
        resolve();
      }
    });
  })
}

// lsid はランダムな文字列で良いっぽい
const lsid = () => {
  const now = new Date();
  const md5 = crypto.createHash('md5')
  return md5.update(`${now.getTime()}`, 'binary').digest('hex')
}

module.exports = {
  now,
  format,
  authorization1,
  authorization2,
  getStreamUrl,
  toPartialKey,
  downloadFromRadiko,
  downloadFromNhkOnDemand,
  lsid,
};
