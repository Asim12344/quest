
import axios from '../axios';

const getConfig = () => {
    const config = {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    };
    return config
}

export const getsalecustomerlistApi = () => {
    return axios.get('/api/SaleCustomer/getsalecustomerlist',getConfig())
}

export const saveupdatedeletesalecustomerApi = (payload) => {
    return axios.post('/api/SaleCustomer/saveupdatedeletesalecustomer',payload,getConfig())
}

export const deleteCustomerApi = (payload) => {
    return axios.post('/api/SaleCustomer/saveupdatedeletesalecustomer',payload,getConfig())
}

export const getitemcategorylistApi = () => {
    return axios.get('/api/ItemCategory/getitemcategorylist',getConfig())
}

export const saveupdatedeleteitemcategoryApi = (payload) => {
    return axios.post('/api/ItemCategory/saveupdatedeleteitemcategory',payload,getConfig())
}

export const deleteCategoryApi = (payload) => {
    return axios.post('/api/ItemCategory/saveupdatedeleteitemcategory',payload,getConfig())
}

export const getitemListApi = () => {
    return axios.get('/api/Item/getitemlist',getConfig())
}

export const saveupdatedeleteitemApi = (payload) => {
    return axios.post('/api/Item/saveupdatedeleteitem',payload,getConfig())
}

export const deleteItemApi = (payload) => {
    return axios.post('/api/Item/saveupdatedeleteitem',payload,getConfig())
}

export const getnewinvoicenoApi = () => {
    return axios.get('/api/Invoice/getnewinvoiceno',getConfig())
}

export const getinvoicelistApi = () => {
    return axios.get('/api/Invoice/getinvoicelist',getConfig())
}

export const getitemListByIdApi = (id) => {
    return axios.get('api/Item/getitembyid/'+id,getConfig())
}

export const deleteInvoiceApi = (payload) => {
    return axios.delete('/api/Invoice/deleteinvoice?id='+payload.id+'&userid='+payload.userid,getConfig())
}

export const saveupdatedeleteinvoiceApi = (payload) => {
    return axios.post('/api/Invoice/saveupdateinvoice',payload,getConfig())
}

export const getinvoicebyidApi = (no) => {
    return axios.get('/api/Invoice/getinvoicebyid/'+no,getConfig())

}
