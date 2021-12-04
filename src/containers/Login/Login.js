import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../../store/actions/index';
import Loader from "react-loader-spinner";
import axios from '../../axios';


class Login extends Component {
    
    state = {
        loader:false,
        username: "",
        password:""
    }

    componentDidMount(){
    }

    handleUsernameChange = event => {
        this.setState({ username: event.target.value });
    };

    handlePasswordChange = event => {
        this.setState({ password: event.target.value });
    };

    submit =  () => { 
        let credentials = {
            username: this.state.username,
            password: this.state.password,
        }
        if(this.state.username === "" || this.state.password===""){
            if(this.state.username === "" ){
                alert('Please enter a username')
            }
            else if(this.state.password === "" ){
                alert('Please enter a password')
            }
        }
        else{
            this.setState({loader:true})
            axios.post('/api/authenticate/login',credentials).then(
                res => {
                    if(res.status === 200){
                        this.props.loginSuccess(res.data)
                        this.setState({loader:false})
                        this.props.history.push(`/saleCustomer`);
                    }
                }
            ).catch( err => {
                    this.setState({loader:false})
                    if(err.response.data.title === "Unauthorized"){
                        alert('No account is associated with these credentials')
                    }
                }
            )
        }
    }

    render(){
        return(
            <>
                <section className="content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-2">
                            </div>
                            <div className="col-md-8">
                                <div className="card card-primary">
                                    <div className="card-body">
                                        <div className="form-group">
                                            <label htmlFor="exampleInputEmail1">User Name</label>
                                            <input  type="text" name="text" value={this.state.username} onChange={this.handleUsernameChange} className="form-control" id="exampleInputEmail1" placeholder="Enter a user name"/>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="exampleInputPassword1">Password</label>
                                            <input type="password" name="password" value={this.state.password} onChange={this.handlePasswordChange} className="form-control" id="exampleInputPassword1" placeholder="Password"/>
                                        </div>
                                        
                                    </div>
                                    <div className="card-footer">
                                        {this.state.loader === true && (
                                            <div className="">
                                                <Loader type="Puff" color="#00BFFF" height={50} width={50}/>
                                            </div>
                                        )}
                                        {this.state.loader === false && (
                                            <button type="submit" onClick={this.submit} className="btn btn-primary">Login</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-2">
                            </div>
                        </div>
                    </div>
                </section>
            </> 
        )
    }
}

const mapDispatchToProps = dispatch =>  {
    return {
        loginSuccess: (data) => dispatch(actionCreators.loginSuccess(data)),
    }
};

export default connect(null, mapDispatchToProps)(Login);
