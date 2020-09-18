import config from '../appConfig';

const path = require('path');
const fs = require('fs');
const querystring = require('querystring');

const SCANS_OUTPUT_DIR_PATH = config.SCANS_OUTPUT_DIR_PATH;

export default function (req, res, next) {
  let data = '';

  const imagePath = req._parsedUrl.path.match(`/static/images/(.*)`)[1];

  const absoluteImagePath = `${SCANS_OUTPUT_DIR_PATH}/${imagePath}`;

  if (fs.existsSync(absoluteImagePath)) {
    const blob = fs.readFileSync(absoluteImagePath);
    res.setHeader('Content-Type', 'image/png');
    res.write(blob);
    res.end();
  }

  // req is the Node.js http request object
  // res is the Node.js http response object
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/plain');
  res.end('File Not Found');

  // next is a function to call to invoke the next middleware
  // Don't forget to call next at the end if your middleware is not an endpoint!
  // next();
}
