const express = require('express');
const app = express();
const port = 3000;

const convert = require('xml-js');
resDate = new Date().toISOString();
let jsonRes = {
  _declaration: {
    _attributes: {
      version: '1.0',
      encoding: 'utf-8'
    }
  },
  OAI_PMH: {
    _attributes: {
      xmlns: 'http://www.openarchives.org/OAI/2.0/',
      'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      'xsi:schemaLocation': 'http://www.openarchives.org/OAI/2.0/ http://www.openarchives.org/OAI/2.0/OAI-PMH.xsd'
    },
    responseDate: resDate
  }
}
let resOpts = {compact: true, ignoreComment: true, spaces: 4};

app.get('/oai/:connector', function (req, res) {
  const verb = req.query.verb;
  res.contentType('text/xml');
  jsonRes.OAI_PMH.request = req.protocol + '://' + req.get('host') + req.originalUrl;

  switch(verb) {
    case 'ListRecords':
      jsonRes.OAI_PMH.ListRecords = {
        record: {
          header: {}
        }
      };
      break;
    case 'Identify':
      jsonRes.OAI_PMH.Identify = {
        repositoryName: 'Malaga adaptor service',
        baseURL: req.protocol + '://' + req.get('host') + req.path,
        protocolVersion: '2.0',
        adminEmail: '',
        earliestDatestamp: '',
        deletedRecord: 'transient',
        granularity: 'YYYY-MM-DD'
      };
      break;
    default:
      jsonRes.OAI_PMH.error = {
        _attributes: { code: 'badVerb'},
        _text: 'Verb not supported'
      };
  }

  const xml = convert.js2xml(jsonRes, resOpts);
  res.send(xml);

  /* if (verb == 'listRecords') {
    let recs = fs.readFileSync('./euclid.xml', 'utf-8');
    res.send(recs);
  } */
});
 
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
