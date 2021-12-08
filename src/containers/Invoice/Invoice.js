import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../../store/actions/index';
import {getnewinvoicenoApi,getsalecustomerlistApi,getinvoicelistApi,getitemListApi,getitemListByIdApi,deleteInvoiceApi,saveupdatedeleteinvoiceApi,getinvoicebyidApi} from '../../api/api'
import Loader from "react-loader-spinner";
import Select from 'react-select';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import './Invoice.css'

class Invoice extends Component {
    
    state = {
        invoiceNo:null,
        invoiceList:[],
        customerList:[],
        itemList:[],
        customerID:"",
        customerName:"",
        date:new Date(),
        remarks:"",
        discountType:'%',
        discount:0,
        itemID: "",
        itemName: "",
        qty:0,
        price:0,
        itemDiscountType:'%',
        itemDiscount:0,
        invoiceDetail:[],
        loader:false,
        update:false,
        grossTotal: 0,
        selectedOption: null,
        selectedOptionItem: null,
        updateDetail:false,
        updateIndex:null
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
                let customerList = []
                for(let i = 0 ; i < res.data.list.length ; i++){
                    customerList.push({ label: res.data.list[i].customerName, value:res.data.list[i].customerID },)
                }

                this.setState({customerList:customerList})
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
            if(res.status === 200){
                this.setState({invoiceList:res.data.list})
            }
        }
        catch(err){
            if(err.response.statusText === "Unauthorized"){
                this.props.logout()
            }
        }
    }

    getitemList= async () => {
        try{
            const res = await getitemListApi()
            if(res.status === 200){
                let itemList = []
                for(let i = 0 ; i < res.data.list.length ; i++){
                    itemList.push({ label: res.data.list[i].itemName, value:res.data.list[i].itemID })
                }

                this.setState({itemList:itemList})
            }
        }
        catch (err){
            if(err.response.statusText === "Unauthorized"){
                this.props.logout()
            }
        }
    }

    handleSelectItemChange = async (opt) => {
        this.setState({itemID:opt.value , itemName:opt.label , selectedOptionItem:opt})
        try{
            const res = await getitemListByIdApi(opt.value)
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
        if(this.state.itemID === ''){
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
            let invoiceDetail = [...this.state.invoiceDetail]
            invoiceDetail.push({itemID: invoiceDetail.length + 1, itemName:this.state.itemName , qty:this.state.qty , price: this.state.price , itmDiscountType:this.state.itemDiscountType, itemDiscount:this.state.itemDiscount,netPrice:netPrice,itemTotal:itemTotal})
            this.setState({selectedOptionItem:null, invoiceDetail:invoiceDetail, itemID:'',qty:0,price:0,itemDiscountType:'%',itemDiscount:0})
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

    deleteInvoice = async (id) => {
        let payload = {
            id: id,
            userid: localStorage.getItem('userID'),
        }
        try{
            const res = await deleteInvoiceApi(payload)
            this.setState({loader:false})
            if(res.data.returnMessage === 'Fail'){
                alert('This user can not be deleted')
            }
            if(res.data.returnMessage === 'Success'){
                this.getinvoicelist()
            }
        }
        catch (err){
            this.setState({loader:false})
            if(err.response.statusText === "Unauthorized"){
                this.props.logout()
            }
        }
    }
    onChangeDate = date => {
        this.setState({date: date});
    }

    saveupdateinvoice = async (action,grosstotal) => {
        if(this.state.customerID === ""){
            alert('Please select a customer')
        }
        else if(this.state.remarks === ""){
            alert('Please enter a remarks')
        }
        else if(this.state.invoiceDetail.length === 0){
            alert('Please enter a invoice details')
        }
        else {
            let payload = action === 'Save' ? {
                computerNo: this.state.invoiceNo,
                recordDate: this.state.date.toISOString().slice(0,10),
                customerID: parseInt(this.state.customerID),
                grossTotal:grosstotal,
                discountType:this.state.discountType,
                discount:this.state.discount,
                discountAmount: this.getDiscountedAmount(grosstotal),
                netTotal: grosstotal - this.getDiscountedAmount(grosstotal),
                remarks:this.state.remarks,
                userID: localStorage.getItem('userID'),
                insertUpdateDelete: action,
                InvoiceDetailList:this.state.invoiceDetail
            }:{
                computerNo: this.state.invoiceNo,
                recordDate: this.state.date.toISOString().slice(0,10),
                customerID: parseInt(this.state.customerID),
                grossTotal:grosstotal,
                discountType:this.state.discountType,
                discount:this.state.discount,
                discountAmount: this.getDiscountedAmount(grosstotal),
                netTotal: grosstotal - this.getDiscountedAmount(grosstotal),
                remarks:this.state.remarks,
                userID: localStorage.getItem('userID'),
                insertUpdateDelete: action,
                InvoiceDetailList:this.state.invoiceDetail
            }
            this.setState({loader:true})
            try{
                const res = await saveupdatedeleteinvoiceApi(payload)
                if(res.status === 200){
                    this.setState({loader:false,customerID:"" ,selectedOption:null, customerName:"", discountType:'%', update:false,discount:0,remarks:"",invoiceDetail:[]})
                    this.getinvoicelist()
                    this.getnewinvoiceno()
                }
            }
            catch(err){
                this.setState({loader:false,customerID:"" , customerName:"", discountType:'%', update:false,discount:0,remarks:"",invoiceDetail:[]})
                if(err.response.statusText === "Unauthorized"){
                    this.props.logout()
                }
            }
        }
    }

    updateInvoice = async (no) => {
        try{
            const res = await getinvoicebyidApi(no)
            this.setState({selectedOption:{label:res.data.list.customerName,value:res.data.list.customerID}, invoiceNo:res.data.list.computerNo ,update:true,customerID:res.data.list.customerID,customerName:res.data.list.customerName, date: new Date(res.data.list.recordDate), remarks: res.data.list.remarks, discount: res.data.list.discount , discountType:res.data.list.discountType, grossTotal:res.data.list.grossTotal})
            
        }
        catch(err){
            if(err.response.statusText === "Unauthorized"){
                this.props.logout()
            }
        }

    }

    handleChange = (selectedOption) => {
        this.setState({ selectedOption : selectedOption,customerID: selectedOption.value , customerName:selectedOption.label});
    };

    deleteInvoiceItem = (index) => {
        let invoiceDetail = [...this.state.invoiceDetail]
        invoiceDetail.splice(index, 1);
        this.setState({invoiceDetail:invoiceDetail})
    }

    updateInvoiceItem = (index) => {
        let invoiceDetail = [...this.state.invoiceDetail]
        this.setState({updateIndex:index, selectedOptionItem:{value:invoiceDetail[index].itemID, label:invoiceDetail[index].itemName}, itemID:invoiceDetail[index].itemID, itemName:invoiceDetail[index].itemName,qty: invoiceDetail[index].qty , price:invoiceDetail[index].price , itemDiscountType:invoiceDetail[index].itmDiscountType,discountType:invoiceDetail[index].discountType, updateDetail:true})
    }

    updateInvoiceDetail = () => {
        let invoiceDetail = [...this.state.invoiceDetail]
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
        invoiceDetail[this.state.updateIndex].itemName = this.state.itemName
        invoiceDetail[this.state.updateIndex].qty = this.state.qty
        invoiceDetail[this.state.updateIndex].price = this.state.price
        invoiceDetail[this.state.updateIndex].itmDiscountType = this.state.itemDiscountType
        invoiceDetail[this.state.updateIndex].itemDiscount = this.state.itemDiscount
        invoiceDetail[this.state.updateIndex].netPrice = netPrice
        invoiceDetail[this.state.updateIndex].itemTotal = itemTotal

        this.setState({invoiceDetail:invoiceDetail,updateDetail:false,selectedOptionItem:null, itemID:'',qty:0,price:0,itemDiscountType:'%',itemDiscount:0})

    }

    
    
    render(){
        let grosstotal = this.state.grossTotal

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
                                            <Select
                                                value={this.state.selectedOption}
                                                options={this.state.customerList}
                                                onChange={this.handleChange}
                                            />
                                           
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="exampleInputPassword2">Date</label>
                                            <DatePicker
                                                selected={this.state.date}
                                                onChange={date => this.onChangeDate(date)}
                                            />
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
                                            <Select
                                                value={this.state.selectedOptionItem}
                                                options={this.state.itemList}
                                                onChange={this.handleSelectItemChange}
                                            />
                                           
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
                                    {this.state.updateDetail === false && (
                                        <button onClick={this.addInvoiceDetail} type="submit"  className="btn btn-primary">
                                            + ADD
                                        </button>
                                    )}
                                    {this.state.updateDetail === true && (
                                        <button onClick={this.updateInvoiceDetail} type="submit"  className="btn btn-primary">
                                            Update
                                        </button>
                                    )}
                                </div>
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
                                                    <th scope="col">Action</th>

                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.invoiceDetail.map((invoice,index) => {
                                                    grosstotal = grosstotal+invoice.itemTotal
                                                    return(
                                                        <tr key={index}>
                                                            <th scope="row">{invoice.itemID}</th>
                                                            <td>{invoice.itemName}</td>
                                                            <td>{invoice.qty}</td>
                                                            <td>{invoice.price}</td>
                                                            <td>{invoice.itmDiscountType}</td>
                                                            <td>{invoice.itemDiscount}</td>
                                                            <td>{invoice.netPrice}</td>
                                                            <td>{invoice.itemTotal}</td>
                                                            <td>                                                                        
                                                                <button type="submit" onClick={() => this.deleteInvoiceItem(index)} className="btn btn-danger" style={{marginRight:'15px'}}>
                                                                    Delete
                                                                </button>
                                                                <button type="submit" onClick={() => this.updateInvoiceItem(index)} className="btn btn-success">
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
                                <div className="row">
                                    <div className="col-md-2">
                                        <div className="form-group">
                                            <label htmlFor="exampleInputEmail1">Gross Total</label>
                                            <div style={{color:"green"}}> {grosstotal}</div>
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <div className="form-group">
                                            <label htmlFor="exampleInputEmail1">Discount Type</label>
                                            <select className="form-select"  value={this.state.discountType} onChange={(e) => this.setState({discountType: e.target.value})}>
                                                <option value="%">%</option>
                                                <option value="Rs">Rs</option>
                                            </select>                         
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <div className="form-group">
                                            <label htmlFor="exampleInputPassword2">Discount</label>
                                            <input type="number" name="text" value={this.state.discount} onChange={(e) =>  this.setState({discount:e.target.value})} className="form-control" placeholder="Enter a discount"/>
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <div className="form-group">
                                            <label htmlFor="exampleInputEmail1">Discount Amount: </label>
                                            <div style={{color:"red"}}> {this.getDiscountedAmount(grosstotal)}</div>
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <div className="form-group">
                                            <label htmlFor="exampleInputEmail1">Net Total: </label>
                                            <div style={{color:"green"}}> {grosstotal - this.getDiscountedAmount(grosstotal)}</div>
                                        </div>
                                    </div>

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
                                            <button type="submit" onClick={() => this.saveupdateinvoice('Save',grosstotal)} className="btn btn-primary">Add Invoice</button>
                                        )}
                                        {this.state.update === true && (
                                            <button type="submit" onClick={() => this.saveupdateinvoice('Update')} className="btn btn-primary">Update</button>
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
                                    <th scope="col">Invoice No</th>
                                    <th scope="col">Customer</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">Net Total</th>
                                    <th scope="col">Action</th>

                                </tr>
                            </thead>
                            <tbody>
                                {this.state.invoiceList.map((invoice,index) => {
                                    return(
                                        <tr key={index}>
                                            <th scope="row">{invoice.computerNo}</th>
                                            <td>{invoice.customerName}</td>
                                            <td>{invoice.recordDateString}</td>
                                            <td>{invoice.netTotal}</td>
                                            <td>                                                                        
                                                <button type="submit" onClick={() => this.deleteInvoice(invoice.computerNo)}  className="btn btn-danger" style={{marginRight:'15px'}}>
                                                    Delete
                                                </button>
                                                <button type="submit" onClick={() => this.updateInvoice(invoice.computerNo)} className="btn btn-success">
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
  

export default connect(null, mapDispatchToProps)(Invoice);

