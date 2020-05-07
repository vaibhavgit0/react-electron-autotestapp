const {app, BrowserWindow} = require('electron')
const express = require('express');
const exp = express();
const PORT = 4000;
const bodyParser = require('body-parser');
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
    console.log(req.body);
    var name = req.body.suites;
    if(req.body.param) {
        var param = req.body.param;
        var executablePath = "rm -rf public/test-output && java -jar testcase/TMSTestNG-0.0.1-SNAPSHOT.jar "+name+" "+param+" && mv test-output public/";
    }
    else {
        var executablePath = "rm -rf public/test-output && java -jar testcase/TMSTestNG-0.0.1-SNAPSHOT.jar "+name+" && mv test-output public/";
    }
    console.log(executablePath);
    child(executablePath, [], function(err, data) {
        console.log(err)
        console.log(data.toString());

    });
    res.send({"body": "success"});
});

const server = exp.listen(4000);
app.on('ready', createWindow)
