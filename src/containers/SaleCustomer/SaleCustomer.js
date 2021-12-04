import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from '../../axios';
import * as actionCreators from '../../store/actions/index';
import Loader from "react-loader-spinner";

const config = {
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
};

class SaleCustomer extends Component {
    
    state = {
        customerList:[],
        customerName:"",
        email:"",
        address:"",
        loader:false,
        update:false,
        customerID:null
    }

    componentDidMount(){
        this.getsalecustomerlist()
    }

    getsalecustomerlist= () => {
        axios.get('/api/SaleCustomer/getsalecustomerlist',config).then(
            res => {
                if(res.status === 200){
                   this.setState({customerList:res.data.list})
                }
            }
        ).catch( err => {
                if(err.response.statusText === "Unauthorized"){
                    this.props.logout()
                }
            }
        )
    }

    saveupdatedeletesalecustomer =  (action) => { 
        let payload = action === 'Save' ? {
            customerName: this.state.customerName,
            email: this.state.email,
            address: this.state.address,
            userID: localStorage.getItem('userID'),
            insertUpdateDelete: action
        }:{
            customerID:this.state.customerID,
            customerName: this.state.customerName,
            email: this.state.email,
            address: this.state.address,
            userID: localStorage.getItem('userID'),
            insertUpdateDelete: action

        }
        if(this.state.customerName === "" || this.state.email==="" || this.state.address==="" ){
            if(this.state.customerName === "" ){
                alert('Please enter a customerName')
            }
            else if(this.state.email === "" ){
                alert('Please enter a email')
            }
            else if(this.state.address === "" ){
                alert('Please enter a address')
            }
        }
        else{
            this.setState({loader:true})
            axios.post('/api/SaleCustomer/saveupdatedeletesalecustomer',payload,config).then(
                res => {
                    if(res.status === 200){
                        this.setState({loader:false,customerName:"",email:"",address:"" , update:false,customerID:null})
                        this.getsalecustomerlist()
                    }
                    
                }
            ).catch( err => {
                    this.setState({loader:false,customerName:"",email:"",address:"" , update:false,customerID:null})
                    if(err.response.statusText === "Unauthorized"){
                        this.props.logout()
                    }
                }
            )
        }
    }

    deleteCustomer = (id) => {
        let payload = {
            customerID:id,
            customerName: "",
            email: "",
            address: "",
            userID: localStorage.getItem('userID'),
            insertUpdateDelete: "Delete"
        }
        axios.post('/api/SaleCustomer/saveupdatedeletesalecustomer',payload,config).then(
            res => {
                this.setState({loader:false})
                if(res.data.returnMessage === 'Fail'){
                    alert('This user can not be deleted')
                }
                if(res.data.returnMessage === 'Success'){
                    this.getsalecustomerlist()
                }
                
            }
        ).catch( err => {
                this.setState({loader:false})
                if(err.response.statusText === "Unauthorized"){
                    this.props.logout()
                }
            }
        )

    }
   
    render(){
        return(
            <div className="container-fluid">
                <div className="row mb-2">
                    <div className="col-md-12">
                        <div className="card card-primary">
                            <div className="card-body">
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">Customer Name</label>
                                    <input  type="text" name="text" value={this.state.customerName} onChange={(e) =>  this.setState({customerName:e.target.value})} className="form-control" id="exampleInputEmail1" placeholder="Enter a customer name"/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputPassword1">Email</label>
                                    <input type="text" name="text" value={this.state.email} onChange={(e) =>  this.setState({email:e.target.value})} className="form-control" placeholder="Enter a email"/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputPassword2">Address</label>
                                    <input type="text" name="text" value={this.state.address} onChange={(e) =>  this.setState({address:e.target.value})} className="form-control" placeholder="Enter a address"/>
                                </div>
                                    
                            </div>
                            <div className="card-footer">
                                {this.state.loader === true && (
                                    <div className="">
                                        <Loader type="Puff" color="#00BFFF" height={50} width={50}/>
                                    </div>
                                )}
                                {this.state.loader === false && (
                                    <>
                                        {this.state.update === false && (
                                            <button type="submit" onClick={() => this.saveupdatedeletesalecustomer('Save')} className="btn btn-primary">Add</button>
                                        )}
                                        {this.state.update === true && (
                                            <button type="submit" onClick={() => this.saveupdatedeletesalecustomer('Update')} className="btn btn-primary">Update</button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>                        
                </div>
                
                <div className="row mt-4">
                    <div className="col-md-12">
                        <table className="table">
                            <thead className="thead-dark">
                                <tr>
                                    <th scope="col">Customer ID</th>
                                    <th scope="col">Customer Name</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Address</th>
                                    <th scope="col">Action</th>

                                </tr>
                            </thead>
                            <tbody>
                                {this.state.customerList.map((customer,index) => {
                                    return(
                                        <tr key={index}>
                                            <th scope="row">{customer.customerID}</th>
                                            <td>{customer.customerName}</td>
                                            <td>{customer.email}</td>
                                            <td>{customer.address}</td>
                                            <td>                                                                        
                                                <button type="submit" onClick={() => this.deleteCustomer(customer.customerID)}  className="btn btn-danger" style={{marginRight:'15px'}}>
                                                    Delete
                                                </button>
                                                <button type="submit" onClick={() => this.setState({update:true,customerName:customer.customerName,address:customer.address,email:customer.email,customerID:customer.customerID})} className="btn btn-success">
                                                    Update
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch =>  {
    return {
        logout: () => dispatch(actionCreators.logout()),
    }
  };
  

export default connect(null, mapDispatchToProps)(SaleCustomer);

