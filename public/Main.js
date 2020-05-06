const {app, BrowserWindow} = require('electron')
const express = require('express');
const exp = express();
const PORT = 4000;
const bodyParser = require('body-parser');
//const nrc = require('node-run-cmd');
var child = require('child_process').exec;

function createWindow () {
    // Create the browser window.
    win = new BrowserWindow({width: 800, height: 600})

    // and load the index.html of the app.
    //win.loadFile('index.html')
    win.loadURL('http://localhost:3000/')

}

exp.use(bodyParser.json());
exp.use(bodyParser.urlencoded({
    extended: true
}));
exp.post('/execCommand', function(req, res) {
    var name = req.body.suites;
    var executablePath = "java -jar testcase/TMSTestNG-0.0.1-SNAPSHOT.jar "+name;
    child(executablePath, [], function(err, data) {
        console.log(err)
        console.log(data.toString());

    });
    res.send({"body": "success"});

    /*console.log(req.body);
    //res.send(req.body);
    name = req.body.suites;

    nrc.run(['java -jar testcase/TMSTestNG-0.0.1-SNAPSHOT.jar '+name, 'rm -rf public/test-output', 'mv test-output public/']).then(function(exitCodes) {
         res.send({"body": "success"});
    }, function(err) {
          console.log('Command failed to run with error: ', err);

    });*/
});

const server = exp.listen(4000);
app.on('ready', createWindow)
