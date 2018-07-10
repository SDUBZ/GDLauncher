const path = require('path');
const async = require('async');
const mkdirp = require('mkdirp');
const fs = require('fs');
const assert = require('assert');
const Promise = require('bluebird');
const request = require('request-promise-native');


module.exports = {
  downloadArr
};
Promise.promisifyAll(async);

async function downloadArr(arr, process, folderPath, threads = 5) {
  for (const lib of arr) {
    const filePath = `${folderPath}${path.dirname(lib.path)}`;
    if (!fs.existsSync(filePath)) {
      mkdirp.sync(filePath);
    }
    const file = await request(lib.url, { encoding: 'binary' });
    fs.writeFileSync(`${folderPath}${lib.path}`, file, 'binary');

    process.send({ action: 'UPDATE__FILES' });

  };
}

function checkFile(lpath, size, sha1) {
  return fs.stat(lpath).then(stats => assert.equal(stats.size, size, 'wrong size for ' + lpath))
    .then(() => fs.readFile(lpath))
    .then(data => assert.equal(crypto.createHash('sha1').update(data).digest('hex'), sha1, `wrong sha1 for ${lpath}`))
    .then(() => lpath);
}