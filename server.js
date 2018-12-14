const express = require('express');
const app = express();
const port = 3000;

const convert = require('xml-js');

const resOpts = {compact: true, ignoreComment: true, spaces: 4};
const xmlRoot = {
  _declaration: {
    _attributes: {
      version: '1.0',
      encoding: 'utf-8'
    }
  },
}

app.get('/oai/:connector', function (req, res) {
  
  let jsonRes = xmlRoot;
  jsonRes.OAI_PMH = {
    _attributes: {
      xmlns: 'http://www.openarchives.org/OAI/2.0/',
      'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      'xsi:schemaLocation': 'http://www.openarchives.org/OAI/2.0/ http://www.openarchives.org/OAI/2.0/OAI-PMH.xsd'
    }
  };

  jsonRes.OAI_PMH.responseDate = new Date().toISOString();
  jsonRes.OAI_PMH.request = req.protocol + '://' + req.get('host') + req.originalUrl;
  const verb = req.query.verb;
  res.contentType('text/xml');

  if (verb == 'ListRecords') {
    jsonRes.OAI_PMH.ListRecords = {
      record: {
        header: {},
        metadata: {}
      }
    };
  } 
  else if (verb == 'Identify') {
    jsonRes.OAI_PMH.Identify = {
      repositoryName: 'Malaga adaptor service',
      baseURL: req.protocol + '://' + req.get('host') + req.path,
      protocolVersion: '2.0',
      adminEmail: '',
      earliestDatestamp: '',
      deletedRecord: 'transient',
      granularity: 'YYYY-MM-DD'
    };
  }
  else {
    jsonRes.OAI_PMH.error = {
      _attributes: { code: 'badVerb'},
      _text: 'Verb not supported'
    };
  }
 
  const xml = convert.js2xml(jsonRes, resOpts);
  res.send(xml);

});
 
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
