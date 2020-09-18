import config from '../appConfig';
import appConfig from '../appConfig';

const path = require('path');
const fs = require('fs');
const { exec, execSync } = require('child_process');
const crypto = require('crypto');
const querystring = require('querystring');

const DEKSTER_EXECUTABLE_PATH = `/deksterecon/dekster.sh`;
const SCANS_OUTPUT_DIR_PATH = appConfig.SCANS_OUTPUT_DIR_PATH;

export default function (req, res, next) {
  const query = querystring.parse(req._parsedUrl.query);
  const jsonData = {};
  const cryptoHash = crypto
    .createHash('sha1')
    .update(new Date().toString(), 'utf8')
    .digest('hex');

  jsonData.url = query.url;
  jsonData.scanType = query.scanType;
  jsonData.cryptoHash = cryptoHash;
  jsonData.cmd = `bash dekster.sh ${query.url} ${query.scanType} ${cryptoHash}`;

  const SCAN_RESULTS_STATUS_FILE = `${SCANS_OUTPUT_DIR_PATH}/${query.url}-${cryptoHash}/.running`;
  const PROC_LOG_PATH = `${SCANS_OUTPUT_DIR_PATH}/${query.url}-${cryptoHash}/proc.log`;

  // make folder
  execSync(`mkdir -p ${SCANS_OUTPUT_DIR_PATH}/${query.url}-${cryptoHash}`);

  const proc = exec(jsonData.cmd, { cwd: `/deksterecon` });
  try {
    fs.writeFileSync(PROC_LOG_PATH, `==CMD=== \n${jsonData.cmd}\n\n`);
  
    proc.stdout.on('data', (data) => {
      fs.appendFileSync(PROC_LOG_PATH, data.toString());
    });
    proc.stderr.on('data', (data) => {
      fs.appendFileSync(PROC_LOG_PATH, data.toString());
    });
    proc.on('exit', (code) => {
      fs.unlinkSync(SCAN_RESULTS_STATUS_FILE);
    });
  } catch (err) {}

  setTimeout(() => {
    fs.writeFileSync(SCAN_RESULTS_STATUS_FILE, '');
    // req is the Node.js http request object
    // res is the Node.js http response object
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(jsonData));
  }, 500);

  // next is a function to call to invoke the next middleware
  // Don't forget to call next at the end if your middleware is not an endpoint!
  // next();
}
