const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
const oaiRoot = '<OAI-PMH xmlns="http://www.openarchives.org/OAI/2.0/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/ http://www.openarchives.org/OAI/2.0/OAI-PMH.xsd"></OAI-PMH>'

app.get('/oai/:connector', function (req, res) {
  const verb = req.query.verb;
  // res.send(JSON.stringify(req.params) + JSON.stringify(req.query));
  if (verb == 'listRecords') {
    let recs = fs.readFileSync('./euclid.xml', 'utf-8');
    res.contentType('text/xml');
    res.send(recs);
  } 
});
 
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
