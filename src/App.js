import React, { Component } from 'react';
import './App.css';
import GlobalSearchComponent from "./GlobalSearchComponent";
import logo from './gear.png';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import Loader from 'react-loader-spinner'
const axios = require('axios');

class App extends Component{
    componentDidMount() {
        var state = this;
        this.fetchFile('./sample.csv', function(data){
            console.log(data);
            var res = data.split("\n");
            res.splice(0, 1);
            res.splice(res.length-1, 1);
            console.log(res);
            state.setState({
                filteredData: res,
                data:res,
                flag:true
            })
        });
    }
    constructor(props) {
        super(props);
        this.state={
            flag: false,
            toggle:false,
            data: [],
            filteredData: [],
            load:false,
            output:false
        }
        this.fetchFile = this.fetchFile.bind(this);
    }
    fetchFile(path, callback) {
        var httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function() {
            if (httpRequest.readyState === 4) {
                if (httpRequest.status === 200) {
                    var data = (httpRequest.responseText);
                    if (callback) callback(data);

                }

            }

        };
        httpRequest.open('GET', path);
        httpRequest.send();

    }
    getDetails(e, value) {
        this.setState({
            toggle : true,
            name : value[0],
            desc : value[1],
            suite : value[2],
            output:false,
            load:true
        })
        setTimeout(() => {
            this.setState({
                load:false
            })
        }, 1000);
    }
    executeCommand(e, value, suites) {
        var state = this;
        e.preventDefault();
        this.setState({
            load:true
        })

        alert("Executing test case :"+ value);

        axios
        .post("/execCommand", {suites})
        .then(response => {
            console.log(response.data);
            if(response.data.body == "success") {
                alert("Testcase Executed Succesfully !!")
                state.setState({
                    load:false,
                    output:true
                })
            }
        }).
        catch(err => {
            console.log(err.code);
            console.log(err.message);
            alert("something failed !!")
            state.setState({
                load:false,
                //output:true
            })
        })

      /*fetch("/execCommand", {
          method: 'POST',
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({
            suites
          })
      }).then(function(response) {
          if (response.status >= 400) {
            throw new Error("Bad response from server");
          }
          return response.json();
      }).then(function(data) {
          if(data.body == "success") {
              alert("Testcase Executed Succesfully !!")
              state.setState({
                  load:false,
                  output:true
              })
          }
          else {
              alert("Something Failed !!")
              state.setState({
                  load:false,
                  output:true
              })
          }
      }).catch(function(err) {
          console.log(err)
          alert("Please wait..")
          setTimeout(() =>  {
              state.setState({
                  load:false,
                  output:true
              })
              alert("Testcase Executed!!")

          }, 60000)
      });*/

    }

    renderDetails() {
        const { toggle, name, desc, suite } = this.state;
        if(!toggle) {
            return (
                    <div className="FormCenter">
                        Please Select Any Test Case
                    </div>
            );
        }
        else {
            return(
                    <div className="FormCenter">
                        <form className="FormFields">
                            <div className="FormField">
                                <div className="row">
                                    <div style={{width:"60%"}}>
                                        <p><strong>Test Case Selected:</strong> {name}</p>
                                        <p><strong>Description:</strong> {desc}</p>
                                    </div>
                                    <div>
                                        <button className="FormField__Button mr-20" onClick={(e) => this.executeCommand(e, name, suite)}>Run</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                  )

        }
    }
    handleSetData = data => {
        console.log(data);
        this.setState({ filteredData: data  });

    };

    render () {
            return (
                <div>
                    <header className="App-header">
                        <div style={{display:"flex"}}>
                        <img src={logo} className="App-logo" alt="logo" />
                        <h1 className="App-title">AutoTest</h1>
                        </div>
                    </header>
                    <div id={this.state.load ? 'overlay' : ''}></div>
                    <div className="App">
                    <div className="App_Align">
                        {this.state.load && <Loader
                            type="Oval"
                            color="#52C4B9"
                            height={100}
                            width={100}
                        />}
                    </div>
                        <div className="App__Aside">
                            <GlobalSearchComponent
                                data={this.state.data}
                                handleSetData={this.handleSetData}
                            />
                            <table>
                            <tbody>
                            { this.state.flag &&
                                this.state.filteredData.map((numList,i, val) =>(
                                    val = numList.split(","),
                                    <tr id={i} onClick={(e) => this.getDetails(e, val)}>
                                    <td disabled={this.state.load}>{val[0]}</td></tr>

                                ))
                            }
                            </tbody>
                            </table>
                        </div>
                        <div className="App__Form">
                            <div className="App__Data">
                                <h1>Details</h1>
                                {this.renderDetails()}
                            </div>
                            { this.state.output && <div className="App__Data">
                                <h1>Output</h1>
                                <div className="FormCenter">
                                    <iframe src="./test-output/index.html" width="800" height="400"></iframe>
                                </div>
                            </div>}
                            {/*<div className="App__Data">
                                <h1>Previous Runs</h1>
                                <div className="FormCenter">
                                    Previous runs of testcases will be displayed here.
                                </div>
                            </div>*/}
                            <br/>
                            <button className="FormField__Button mr-20" onClick={(e) => this.executeCommand(e, " All", "All.xml")}>Run All</button>
                        </div>
                    </div>
                </div>
            );
    }
}

export default App;
