import config from '../appConfig';

const path = require('path');
const fs = require('fs');

const SCANS_OUTPUT_DIR_PATH = config.SCANS_OUTPUT_DIR_PATH;

export default function (req, res, next) {
  const query = req._parsedUrl.query;
  const dirName = query.split('=')[1];
  const websiteHostname = dirName.split('-')[0];
  const fullDirPath = path.resolve(
    `${SCANS_OUTPUT_DIR_PATH}/${query.split('=')[1]}`
  );
  const portScanResultsPath = `${fullDirPath}/ports-${websiteHostname}.txt`;
  const screenshotsDirPath = `${websiteHostname}-aqua-out/screenshots`;
  const screenshotsResultsPath = `${fullDirPath}/${screenshotsDirPath}`;
  const dirSearchResultsPath = `${fullDirPath}/${websiteHostname}-dirsearchPaths.txt`;

  let outputJSON = { websiteHostname };

  const subHosts = {};

  // // get a list of ports scanned
  try {
    const ports = fs
      .readFileSync(portScanResultsPath, { encoding: 'utf8' })
      .split('\n');

    ports.forEach((hostnameAndPort) => {
      const [hostname, port] = hostnameAndPort.split(':');
      if (!hostname || !port) return;
      if (!subHosts[hostname]) {
        subHosts[hostname] = { ports: [] };
      }
      subHosts[hostname].ports.push(port);
      subHosts[hostname].ports = [...new Set(subHosts[hostname].ports)];
    });
  } catch (e) {}

  outputJSON = { subHosts, ...outputJSON };

  // get a list of js files
  try {
    const js_files = fs
      .readFileSync(`${fullDirPath}/js-${websiteHostname}.txt`, {
        encoding: 'utf8',
      })
      .split('\n');

    js_files.forEach((thisJSFile) => {
      try {
        const thisJSFileURL = new URL(thisJSFile);
        if (!outputJSON.subHosts[thisJSFileURL.host].js_files) {
          outputJSON.subHosts[thisJSFileURL.host].js_files = [];
        }
        outputJSON.subHosts[thisJSFileURL.host].js_files.push(thisJSFile);
      } catch (e) {}
    });
  } catch (e) {}

  // HTTPX Links
  try {
    const other_links = fs.readFileSync(
      `${fullDirPath}/${websiteHostname}-Httpx-output.json`,
      {
        encoding: 'utf8',
      }
    );
    other_links.split('\n').forEach((linkData) => {
      try {
        const linkDataJSON = JSON.parse(linkData);
        const hostname = new URL(linkDataJSON.url).host;
        if (!outputJSON.subHosts[hostname].other_links) {
          outputJSON.subHosts[hostname].other_links = [];
        }
        outputJSON.subHosts[hostname].other_links.push(linkDataJSON);
      } catch (e) {}
    });
  } catch (e) {}

  // get a list of screenshots
  try {
    const screens = fs.readdirSync(screenshotsResultsPath);
    screens.forEach((imageFileName) => {
      try {
        const imagePath = `/static/images/${
          query.split('=')[1]
        }/${screenshotsDirPath}/${imageFileName}`;
        const hostname = imageFileName.split('__')[1].replace(/_/g, '.');
        if (!outputJSON.subHosts[hostname]) {
          outputJSON.subHosts[hostname] = {};
        }
        if (!outputJSON.subHosts[hostname].screenshots) {
          outputJSON.subHosts[hostname].screenshots = [];
        }
        outputJSON.subHosts[hostname].screenshots.push(imagePath);
      } catch (e) {}
    });
  } catch (e) {}

  // get a dir search paths
  try {
    const dirSearchResults = fs
      .readFileSync(dirSearchResultsPath, {
        encoding: 'utf8',
      })
      .split('\n');
    console.log(dirSearchResults);

    dirSearchResults.forEach((thisLine) => {
      try {
        const [, status, contentLength, lineURL] = thisLine.match(
          /(\S*)\s+(\S*)\s+(\S*)/
        );
        const hostname = new URL(lineURL).host;

        if (!outputJSON.subHosts[hostname].dirSearchPaths) {
          outputJSON.subHosts[hostname].dirSearchPaths = [];
        }
        outputJSON.subHosts[hostname].dirSearchPaths.push({
          status,
          contentLength,
          url: lineURL,
        });
      } catch (e) {}
    });
  } catch (e) {}

  // status, scantype and timestamp
  try {
    const SCAN_RESULTS_RUNNING_FILE = `${fullDirPath}/.running`;
    const SCAN_RESULTS_FAILED_FILE = `${fullDirPath}/.failed`;

    let status = 'Successful';
    if (fs.existsSync(SCAN_RESULTS_FAILED_FILE)) {
      status = 'Failed';
    } else if (fs.existsSync(SCAN_RESULTS_RUNNING_FILE)) {
      status = 'Running';
    }

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

    const scanType = getScanType(fullDirPath, websiteHostname);

    outputJSON.timestamp = fs.statSync(fullDirPath).mtimeMs;
    outputJSON.status = status;
    outputJSON.scanType = scanType;
  } catch (e) {}

  // req is the Node.js http request object
  // res is the Node.js http response object
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(outputJSON));

  // next is a function to call to invoke the next middleware
  // Don't forget to call next at the end if your middleware is not an endpoint!
  // next();
}
