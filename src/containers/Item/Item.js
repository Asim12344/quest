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

class Item extends Component {
    
    state = {
        itemCategoryList:[],
        itemList:[],
        itemName:"",
        price:0,
        loader:false,
        update:false,
        categoryID:'Select a category id',
        itemID:null
    }

    componentDidMount(){
        this.getitemcategorylist()
        this.getitemList()
    }

    getitemcategorylist= () => {
        axios.get('/api/ItemCategory/getitemcategorylist',config).then(
            res => {
                if(res.status === 200){
                   this.setState({itemCategoryList:res.data.list})
                }
            }
        ).catch( err => {
                if(err.response.statusText === "Unauthorized"){
                    this.props.logout()
                }
            }
        )
    }
    getitemList= () => {
        axios.get('/api/Item/getitemlist',config).then(
            res => {
                if(res.status === 200){
                   this.setState({itemList:res.data.list})
                }
            }
        ).catch( err => {
                if(err.response.statusText === "Unauthorized"){
                    this.props.logout()
                }
            }
        )

    }


    saveupdatedeleteitem =  (action) => { 
        let payload = action === 'Save' ? {
            itemName: this.state.itemName,
            categoryID: parseInt(this.state.categoryID),
            price: parseInt(this.state.price),
            userID: localStorage.getItem('userID'),
            insertUpdateDelete: action
        }:{
            itemID:this.state.itemID,
            categoryID:parseInt(this.state.categoryID),
            price:parseInt(this.state.price),
            itemName: this.state.itemName,
            userID: localStorage.getItem('userID'),
            insertUpdateDelete: action
        }
        if(this.state.itemName === ""){
            alert('Please enter a itemName')
        }
        else if(this.state.categoryID === "Select a category id"){
            alert('Please select a category id')
        }
        else{
            this.setState({loader:true})
            axios.post('/api/Item/saveupdatedeleteitem',payload,config).then(
                res => {
                    if(res.status === 200){
                        this.setState({loader:false,itemName:"" ,price:0, update:false,categoryID:'Select a category id',itemID:null})
                        this.getitemList()
                    }
                    
                }
            ).catch( err => {
                    this.setState({loader:false,itemName:"",price:0, update:false,categoryID:'Select a category id',itemID:null})
                    if(err.response.statusText === "Unauthorized"){
                        this.props.logout()
                    }
                }
            )
        }
    }

    deleteItem = (id) => {
        let payload = {
            itemID:id,
            categoryID:0,
            itemName: "",
            price:0,
            userID: localStorage.getItem('userID'),
            insertUpdateDelete: "Delete"
        }
        axios.post('/api/Item/saveupdatedeleteitem',payload,config).then(
            res => {
                this.setState({loader:false})
                if(res.data.returnMessage === 'Fail'){
                    alert('This record can not be deleted')
                }
                if(res.data.returnMessage === 'Success'){
                    this.getitemList()
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
                                    <label htmlFor="exampleInputEmail1">Item Name</label>
                                    <input  type="text" name="text" value={this.state.itemName} onChange={(e) =>  this.setState({itemName:e.target.value})} className="form-control" id="exampleInputEmail1" placeholder="Enter a item name"/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">Price</label>
                                    <input  type="number" name="text" value={this.state.price} onChange={(e) =>  this.setState({price:e.target.value})} className="form-control" id="exampleInputEmail1" placeholder="Enter a item name"/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">Category ID</label>
                                    <select className="form-select"  value={this.state.categoryID} onChange={(e) => this.setState({categoryID: e.target.value})}>
                                        <option value="Select a category id">Select a Category Id</option>
                                        {this.state.itemCategoryList.map((cat,index) => {
                                            return(
                                                <option key={index} value={cat.categoryID}>{cat.categoryID}</option>
                                            )
                                        })}
                                    </select>
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
                                            <button type="submit" onClick={() => this.saveupdatedeleteitem('Save')} className="btn btn-primary">Add</button>
                                        )}
                                        {this.state.update === true && (
                                            <button type="submit" onClick={() => this.saveupdatedeleteitem('Update')} className="btn btn-primary">Update</button>
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
                                    <th scope="col">Item ID</th>
                                    <th scope="col">Item Name</th>
                                    <th scope="col">Category ID</th>
                                    <th scope="col">Price</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.itemList.map((item,index) => {
                                    return(
                                        <tr key={index}>
                                            <th scope="row">{item.itemID}</th>
                                            <td>{item.itemName}</td>
                                            <td>{item.categoryID}</td>
                                            <td>{item.price}</td>

                                            <td>                                                                        
                                                <button type="submit" onClick={() => this.deleteItem(item.itemID)}  className="btn btn-danger" style={{marginRight:'15px'}}>
                                                    Delete
                                                </button>
                                                <button type="submit" onClick={() => this.setState({update:true,price:item.price, itemName:item.itemName,categoryID:item.categoryID.toString(), itemID:item.itemID})} className="btn btn-success">
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
  

export default connect(null, mapDispatchToProps)(Item);

