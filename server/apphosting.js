const path = require('path');
const express = require('express');
const { app } = require('./index');

const port = Number(process.env.PORT) || 8080;
const buildDir = path.resolve(__dirname, '..', 'build');
const indexFile = path.join(buildDir, 'index.html');

app.use(express.static(buildDir));

app.get(/^(?!\/api(?:\/|$)|\/auth(?:\/|$)|\/health$).*/, (req, res) => {
  res.sendFile(indexFile);
});

app.listen(port, () => {
  console.log(`RedPillReader App Hosting server listening on ${port}`);
});