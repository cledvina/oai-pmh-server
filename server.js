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
};
const badArgument = {
  _attributes: { code: 'badArgument' },
  _text: 'The request is missing required arguments.'
};

app.get('/oai/:connector', function (req, res) {

  const verb = req.query.verb;

  let jsonRes = xmlRoot;
  jsonRes.OAI_PMH = {
    _attributes: {
      xmlns: 'http://www.openarchives.org/OAI/2.0/',
      'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      'xsi:schemaLocation': 'http://www.openarchives.org/OAI/2.0/ http://www.openarchives.org/OAI/2.0/OAI-PMH.xsd'
    }
  };
  jsonRes.OAI_PMH.responseDate = new Date().toISOString();
  jsonRes.OAI_PMH.request = {
    _attributes: { verb: verb },
    _text: req.protocol + '://' + req.get('host') + req.originalUrl
  };
  if (req.query.metadataPrefix) {
    jsonRes.OAI_PMH.request._attributes.metadataPrefix = req.query.metadataPrefix;
  };
  if (req.query.identifier) {
    jsonRes.OAI_PMH.request._attributes.identifier = req.query.identifier;
  };
  if (req.query.set) {
    jsonRes.OAI_PMH.request._attributes.set = req.query.set;
  };
  
  if (verb == 'ListRecords') {
    if (req.query.metadataPrefix) {
      jsonRes.OAI_PMH.ListRecords = {
        record: {
          header: {},
          metadata: {}
        }
      };
    }
    else {
      jsonRes.OAI_PMH.error = badArgument;
    }
  }
  else if (verb == 'ListIdentifiers') {
    if (req.query.metadataPrefix) {
      jsonRes.OAI_PMH.ListIdentifiers = {
        header: {}
      };
    }
    else {
      jsonRes.OAI_PMH.error = badArgument;
    }
  } 
  else if (verb == 'ListMetadataFormats') {
    jsonRes.OAI_PMH.ListMetadataFormats = {
      metadataFormat: {
        metadataPrefix: 'oai_dc',
        schema: 'http://www.openarchives.org/OAI/2.0/oai_dc.xsd',
        metadataNamespace: 'http://www.openarchives.org/OAI/2.0/oai_dc/'
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
  else if (verb == 'ListSets') {
    jsonRes.OAI_PMH.ListSets = {
      set: {
        setSpec: 'default',
        setName: 'Default'
      }
    };
  }
  else if (verb == 'GetRecord') {
    if (req.query.identifier && req.query.metadataPrefix) {
      jsonRes.OAI_PMH.GetRecord = {
        record: {
          header: {},
          metadata: {}
        }
      };
    }
    else {
      jsonRes.OAI_PMH.error = badArgument;
    };
  } 
  else {
    jsonRes.OAI_PMH.error = {
      _attributes: { code: 'badVerb'},
      _text: 'Verb not supported'
    };
  };
 
  const xml = convert.js2xml(jsonRes, resOpts);
  res.contentType('text/xml');
  res.send(xml);

});
 
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
