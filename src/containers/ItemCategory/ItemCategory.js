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

class ItemCategory extends Component {
    
    state = {
        itemCategoryList:[],
        categoryName:"",
        loader:false,
        update:false,
        categoryID:null
    }

    componentDidMount(){
        this.getitemcategorylist()
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

    saveupdatedeleteitemcategory =  (action) => { 
        let payload = action === 'Save' ? {
            categoryName: this.state.categoryName,
            userID: localStorage.getItem('userID'),
            insertUpdateDelete: action
        }:{
            categoryID:this.state.categoryID,
            categoryName: this.state.categoryName,
            userID: localStorage.getItem('userID'),
            insertUpdateDelete: action
        }
        if(this.state.categoryName === ""){
            alert('Please enter a categoryName')
        }
        else{
            this.setState({loader:true})
            axios.post('/api/ItemCategory/saveupdatedeleteitemcategory',payload,config).then(
                res => {
                    if(res.status === 200){
                        this.setState({loader:false,categoryName:"" , update:false,categoryID:null})
                        this.getitemcategorylist()
                    }
                    
                }
            ).catch( err => {
                    this.setState({loader:false,categoryName:"", update:false,categoryID:null})
                    if(err.response.statusText === "Unauthorized"){
                        this.props.logout()
                    }
                }
            )
        }
    }

    deleteCategory = (id) => {
        let payload = {
            categoryID:id,
            customerName: "",
            userID: localStorage.getItem('userID'),
            insertUpdateDelete: "Delete"
        }
        axios.post('/api/ItemCategory/saveupdatedeleteitemcategory',payload,config).then(
            res => {
                this.setState({loader:false})
                if(res.data.returnMessage === 'Fail'){
                    alert('This record can not be deleted')
                }
                if(res.data.returnMessage === 'Success'){
                    this.getitemcategorylist()
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
                                    <label htmlFor="exampleInputEmail1">Category Name</label>
                                    <input  type="text" name="text" value={this.state.categoryName} onChange={(e) =>  this.setState({categoryName:e.target.value})} className="form-control" id="exampleInputEmail1" placeholder="Enter a category name"/>
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
                                            <button type="submit" onClick={() => this.saveupdatedeleteitemcategory('Save')} className="btn btn-primary">Add</button>
                                        )}
                                        {this.state.update === true && (
                                            <button type="submit" onClick={() => this.saveupdatedeleteitemcategory('Update')} className="btn btn-primary">Update</button>
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
                                    <th scope="col">Category ID</th>
                                    <th scope="col">Category Name</th>
                                    
                                    <th scope="col">Action</th>

                                </tr>
                            </thead>
                            <tbody>
                                {this.state.itemCategoryList.map((cat,index) => {
                                    return(
                                        <tr key={index}>
                                            <th scope="row">{cat.categoryID}</th>
                                            <td>{cat.categoryName}</td>
                                           
                                            <td>                                                                        
                                                <button type="submit" onClick={() => this.deleteCategory(cat.categoryID)}  className="btn btn-danger" style={{marginRight:'15px'}}>
                                                    Delete
                                                </button>
                                                <button type="submit" onClick={() => this.setState({update:true,categoryName:cat.categoryName,categoryID:cat.categoryID})} className="btn btn-success">
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
  

export default connect(null, mapDispatchToProps)(ItemCategory);

