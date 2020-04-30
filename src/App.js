import React, { Component } from 'react';
import './App.css';
import GlobalSearchComponent from "./GlobalSearchComponent";
import logo from './gear.png';

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
            filteredData: []
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
            desc : value[1]
        })
    }
    executeCommand(e, value) {
        e.preventDefault();
        alert("Executing test Case :"+ value);
    }
    renderDetails() {
        const { toggle, name, desc } = this.state;
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
                                        <button className="FormField__Button mr-20" onClick={(e) => this.executeCommand(e, name)}>Run</button>
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

                    <div className="App">
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
                                    <td>{val[0]}</td></tr>

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
                            <div className="App__Data">
                                <h1>Previous Runs</h1>
                                <div className="FormCenter">
                                    Previous runs of testcases will be displayed here.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
    }
}

export default App;
