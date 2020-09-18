import config from '../appConfig';

const path = require('path');
const fs = require('fs');

const SCANS_OUTPUT_DIR_PATH = config.SCANS_OUTPUT_DIR_PATH;

function getScanType(thisScanPath, websiteAddress) {
  const screenshotDirPath = path.resolve(
    `${thisScanPath}/${websiteAddress}-aqua-out`
  );
  const portsFilePath = path.resolve(
    `${thisScanPath}/ports-${websiteAddress}.txt`
  );
  let scanType = 'full_scan';
  if (fs.existsSync(screenshotDirPath) && fs.existsSync(portsFilePath)) {
    scanType = 'full_scan';
  } else if (fs.existsSync(screenshotDirPath)) {
    scanType = 'screenshots';
  } else if (fs.existsSync(portsFilePath)) {
    scanType = 'port_scan';
  }
  return scanType;
}

export default function (req, res, next) {
  const dirs = fs.readdirSync(path.resolve(SCANS_OUTPUT_DIR_PATH));
  const jsonData = [];

  dirs.forEach((dir) => {
    const uuid = dir.match(/(.*?)-(.*)/)[2];
    const websiteAddress = dir.match(/(.*?)-(.*)/)[1];
    const thisScanPath = path.resolve(`${SCANS_OUTPUT_DIR_PATH}/${dir}/`);
    const scanType = getScanType(thisScanPath, websiteAddress);

    const SCAN_RESULTS_RUNNING_FILE = `${SCANS_OUTPUT_DIR_PATH}/${websiteAddress}-${uuid}/.running`;
    const SCAN_RESULTS_FAILED_FILE = `${SCANS_OUTPUT_DIR_PATH}/${websiteAddress}-${uuid}/.failed`;

    let status = 'Successful';
    if (fs.existsSync(SCAN_RESULTS_FAILED_FILE)) {
      status = 'Failed';
    } else if (fs.existsSync(SCAN_RESULTS_RUNNING_FILE)) {
      status = 'Running';
    }

    jsonData.push({
      dir,
      uuid,
      websiteAddress,
      scanType,
      status,
      timestamp: fs.statSync(thisScanPath).mtimeMs,
    });
  });

  // req is the Node.js http request object
  // res is the Node.js http response object
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(jsonData));

  // next is a function to call to invoke the next middleware
  // Don't forget to call next at the end if your middleware is not an endpoint!
  // next();
}
