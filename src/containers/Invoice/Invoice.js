import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../../store/actions/index';
import {getnewinvoicenoApi,getsalecustomerlistApi,getinvoicelistApi,getitemListApi,getitemListByIdApi} from '../../api/api'
import './Invoice.css'

class Invoice extends Component {
    
    state = {
        invoiceNo:null,
        invoiceList:[],
        customerList:[],
        itemList:[],
        customerID:'Select a customer id',
        date:"",
        remarks:"",
        discountType:'%',
        discount:0,
        itemID: 'Select Item',
        qty:0,
        price:0,
        itemDiscountType:'%',
        itemDiscount:0,
        invoiceDetail:[]
    }

    componentDidMount(){
       this.getnewinvoiceno()
       this.getsalecustomerlist()
       this.getinvoicelist()
       this.getitemList()
    }


    getnewinvoiceno = async () => {
        try{
            const res = await getnewinvoicenoApi()
            console.log(res)
            if(res.status === 200){
                this.setState({invoiceNo:res.data.invoiceno})
            }
        }
        catch(err){
            if(err.response.statusText === "Unauthorized"){
                this.props.logout()
            }
        }
    }

    getsalecustomerlist = async () => {
        try{
            const res = await getsalecustomerlistApi()
            if(res.status === 200){
                this.setState({customerList:res.data.list})
            }
        }
        catch(err){
            if(err.response.statusText === "Unauthorized"){
                this.props.logout()
            }
        }
    }

    getinvoicelist = async () => {
        try{
            const res = await getinvoicelistApi()
            console.log("res getinvoicelist" , res)
            if(res.status === 200){
                this.setState({invoiceList:res.data.list})
            }
        }
        catch(err){
            console.log(err)
            if(err.response.statusText === "Unauthorized"){
                this.props.logout()
            }
        }
    }

    getitemList= async () => {
        try{
            const res = await getitemListApi()
            if(res.status === 200){
                this.setState({itemList:res.data.list})
            }
        }
        catch (err){
            if(err.response.statusText === "Unauthorized"){
                this.props.logout()
            }
        }
    }

    handleSelectItemChange = async (e) => {
        this.setState({itemID:e.target.value})
        try{
            const res = await getitemListByIdApi(e.target.value)
            if(res.status === 200){
                this.setState({price:res.data.list.price})
            }
        }
        catch (err){
            if(err.response.statusText === "Unauthorized"){
                this.props.logout()
            }
        }
    }

    addInvoiceDetail = () => {
        var e = document.getElementById("itemSelect");
        var itemname = e.options[e.selectedIndex].text;
        console.log(itemname)

        if(this.state.itemID === 'Select Item'){
            alert('Please select a item')
        }
        else if(this.state.qty === 0 || this.state.qty === "0" || this.state.qty === ""){
            alert('Please enter a quantity')
        }
        else if(this.state.price === 0 || this.state.price === "0" || this.state.price === ""){
            alert('Please enter a price')
        }
        else if(this.state.itemDiscount === ""){
            alert('Please enter a item discount')
        }
        else if(this.state.discount === ""){
            alert('Please enter a discount')
        }
        else{
            let netPrice = 0
            let itemTotal = 0

            if(this.state.itemDiscountType === '%'){
                netPrice = parseFloat(this.state.price) - ((parseFloat(this.state.price)/100)*parseFloat(this.state.itemDiscount))
                itemTotal =  parseFloat(this.state.qty)*netPrice
            }
            else{
                netPrice = parseFloat(this.state.price) - parseFloat(this.state.itemDiscount)
                itemTotal =  parseFloat(this.state.qty)*netPrice
            }
            console.log(netPrice,itemTotal)
            let invoiceDetail = [...this.state.invoiceDetail]
            invoiceDetail.push({serialNo: invoiceDetail.length + 1, itemName:itemname , quantity:this.state.qty , price: this.state.price , itemDiscountType:this.state.itemDiscountType, itemDiscount:this.state.itemDiscount,netPrice:netPrice,itemTotal:itemTotal})
            this.setState({invoiceDetail:invoiceDetail, itemID:'Select Item',qty:0,price:0,itemDiscountType:'%',itemDiscount:0})
        }
        
    }

    getDiscountedAmount = (grosstotal) => {
        if(this.state.discountType === '%'){
            return ((grosstotal/100)*parseFloat(this.state.discount))
        }
        else{
            return this.state.discount
        }
    }

    
    render(){
        let grosstotal = 0
        return(
            <div className="container-fluid">
                <div className="row mb-2">
                    <div className="col-md-12">
                        <div className="card card-primary">
                            <div className="card-body">
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">Invoice No: <span className="invoice"> {this.state.invoiceNo}</span></label>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="exampleInputEmail1">Customer</label>
                                            <select className="form-select"  value={this.state.customerID} onChange={(e) => this.setState({customerID: e.target.value})}>
                                                <option value="Select a customer id">Select a Customer</option>
                                                {this.state.customerList.map((cust,index) => {
                                                    return(
                                                        <option key={index} value={cust.customerID}>{cust.customerName}</option>
                                                    )
                                                })}
                                            </select>                         
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="exampleInputPassword2">Date</label>
                                            <input type="text" name="text" value={this.state.date} onChange={(e) =>  this.setState({date:e.target.value})} className="form-control" placeholder="Enter a date"/>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="exampleInputEmail1">Discount Type</label>
                                            <select className="form-select"  value={this.state.discountType} onChange={(e) => this.setState({discountType: e.target.value})}>
                                                <option value="%">%</option>
                                                <option value="Rs">Rs</option>
                                            </select>                         
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="exampleInputPassword2">Discount</label>
                                            <input type="number" name="text" value={this.state.discount} onChange={(e) =>  this.setState({discount:e.target.value})} className="form-control" placeholder="Enter a discount"/>
                                        </div>
                                    </div>
                                </div>
                               
                                
                                <div className="form-group">
                                    <label htmlFor="exampleInputPassword2">Remarks</label>
                                    <input type="text" name="text" value={this.state.remarks} onChange={(e) =>  this.setState({remarks:e.target.value})} className="form-control" placeholder="Enter a remarks"/>
                                </div>
                                
                                
                                <h4 style={{textAlign:'center' , margin:'0px auto', fontWeight:'bold' , marginBottom:'20px'}}>Invoice Detail </h4>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="exampleInputEmail1">Select Item</label>
                                            <select className="form-select" id="itemSelect"  value={this.state.itemID} onChange={this.handleSelectItemChange}>
                                                <option value="Select Item">Select Item</option>
                                                {this.state.itemList.map((item,index) => {
                                                    return(
                                                        <option key={index} value={item.itemID}>{item.itemName}</option>
                                                    )
                                                })}
                                            </select>                         
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="exampleInputPassword2">Qty</label>
                                            <input type="number" name="text" value={this.state.qty} onChange={(e) =>  this.setState({qty:e.target.value})} className="form-control" placeholder="Enter a quantity"/>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="exampleInputPassword2">Price</label>
                                            <input type="number" name="text" value={this.state.price} onChange={(e) =>  this.setState({price:e.target.value})} className="form-control" placeholder="Enter a price"/>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="exampleInputEmail1">Item Discount Type</label>
                                            <select className="form-select"  value={this.state.itemDiscountType} onChange={(e) => this.setState({itemDiscountType: e.target.value})}>
                                                <option value="%">%</option>
                                                <option value="Rs">Rs</option>
                                            </select>                         
                                        </div>
                                        
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="exampleInputPassword2">Item Discount</label>
                                            <input type="number" name="text" value={this.state.itemDiscount} onChange={(e) =>  this.setState({itemDiscount:e.target.value})} className="form-control" placeholder="Enter a discount"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="center">
                                    <button onClick={this.addInvoiceDetail} type="submit"  className="btn btn-primary">
                                        + ADD
                                    </button>
                                </div>
                                {this.state.invoiceDetail.length > 0 && (
                                    <div className="row mt-4">
                                        <div className="col-md-12">
                                            <table className="table">
                                                <thead className="thead-dark">
                                                    <tr>
                                                        <th scope="col">Sr #</th>
                                                        <th scope="col">Item Name</th>
                                                        <th scope="col">Quantity</th>
                                                        <th scope="col">Price</th>
                                                        <th scope="col">Item Discount Type</th>
                                                        <th scope="col">Item Discount</th>
                                                        <th scope="col">Net Price</th>
                                                        <th scope="col">Item Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.state.invoiceDetail.map((invoice,index) => {
                                                        grosstotal = grosstotal+invoice.itemTotal
                                                        return(
                                                            <tr key={index}>
                                                                <th scope="row">{invoice.serialNo}</th>
                                                                <td>{invoice.itemName}</td>
                                                                <td>{invoice.quantity}</td>
                                                                <td>{invoice.price}</td>
                                                                <td>{invoice.itemDiscountType}</td>
                                                                <td>{invoice.itemDiscount}</td>
                                                                <td>{invoice.netPrice}</td>
                                                                <td>{invoice.itemTotal}</td>
                                                            </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </table>
                                            
                                        </div>
                                    </div>
                                )}
                                {this.state.invoiceDetail.length > 0 && (
                                    <>
                                        <div className="form-group">
                                            <label htmlFor="exampleInputEmail1">Gross Total: <span style={{color:"green"}}> {grosstotal}</span></label>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="exampleInputEmail1">Discount Amount: <span style={{color:"red"}}> {this.getDiscountedAmount(grosstotal)}</span></label>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="exampleInputEmail1">Net Total: <span style={{color:"green"}}> {grosstotal - this.getDiscountedAmount(grosstotal)}</span></label>
                                        </div>
                                    </>
                                )}
                            </div>
                           
                        </div>
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
  

export default connect(null, mapDispatchToProps)(Invoice);

