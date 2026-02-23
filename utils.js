'use strict';

const { Buffer } = require('buffer');
const { spawn } = require('child_process');
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
    return areaId;
}

const toPartialKey = (key, offset, length) => {
  const partialKey = key.slice(offset, offset + length);
  return Buffer.from(partialKey).toString('base64');
}

const downloadFromRadiko = (authToken, url, duration, filename) => {
  const args = ['-loglevel', 'error'];
  if (duration) {
    args.push('-t', String(duration));
  }
  args.push('-fflags', '+discardcorrupt');
  args.push('-headers', `X-Radiko-AuthToken: ${authToken}\r\n`);
  args.push('-http_seekable', '0');
  args.push('-y', '-i', url);
  args.push('-bsf:a', 'aac_adtstoasc');
  args.push('-c', 'copy', `${filename}.m4a`);

  return new Promise((resolve, reject) => {
    const ffmpeg = spawn('ffmpeg', args);
    let stderr = '';
    ffmpeg.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    ffmpeg.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`ffmpeg exited with code ${code}: ${stderr}`));
      } else {
        console.log(now(), 'downloaded', filename);
        resolve();
      }
    });
    ffmpeg.on('error', (err) => {
      reject(err);
    });
  })
}

const downloadFromNhkOnDemand = (url, duration, filename) => {
  const args = [
    '-loglevel', 'error',
    '-t', String(duration),
    '-fflags', '+discardcorrupt',
    '-y', '-i', url,
    '-bsf:a', 'aac_adtstoasc',
    '-c', 'copy', `${filename}.m4a`,
  ];

  return new Promise((resolve, reject) => {
    const ffmpeg = spawn('ffmpeg', args);
    let stderr = '';
    ffmpeg.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    ffmpeg.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`ffmpeg exited with code ${code}: ${stderr}`));
      } else {
        console.log(now(), 'downloaded', filename);
        resolve();
      }
    });
    ffmpeg.on('error', (err) => {
      reject(err);
    });
  })
}

// lsid はランダムな文字列で良いっぽい
const lsid = () => {
  const date = new Date();
  const md5 = crypto.createHash('md5')
  return md5.update(`${date.getTime()}`, 'binary').digest('hex')
}

module.exports = {
  now,
  format,
  authorization1,
  authorization2,
  toPartialKey,
  downloadFromRadiko,
  downloadFromNhkOnDemand,
  lsid,
};
