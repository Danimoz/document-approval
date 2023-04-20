import { useState, useRef } from "react";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Load from "./Load";

const AccountOneModal = ({isModalOpen, memoType, closeModal}) => {
  const [items, setItems] = useState([
    { product: '', type: '', number: '' }
  ])
  const [load, setLoad] = useState(false);
  const errRef = useRef(null);
  const subject = 'Details of New Account';
  const axiosPrivate = useAxiosPrivate();
  const details = {
    subject,
    company_name: '',
    company_address: '',
    line_of_business: '',
    starting_date: '',
    policy_start: '',
    policy_end: '',
    tot_annual_premium: '',
    payment_made: '',
    payment_note: '',
    mode_of_payment: '',
    total_no_of_lives: '',
    insured: '',
    items,
    contact_person: '',
    phone_number: '',
  }
  const [formDetails, setFormDetails] = useState(details)
  const [errMsg, setErrMsg] = useState('');
  const navigate = useNavigate();
  
  const errorNotify =()=> {
    toast.error('There was an error, try again!', {
      position: 'top-right',
      theme: 'colored'
    })
  }
  const validateNumber =()=> {
    let total = 0
    items.forEach(item => {
      total += Number(item.number)
    });
    if (total === Number(formDetails.total_no_of_lives)) return true
    else return false;
  }

  if (!isModalOpen) return null;
  const productList = ['Bronze', 'Silver', 'Gold', 'Gold Plus', 'Platinum']
  const productType = ['Single', 'Family']

  const addProd =()=> {
    setItems([...items, { product: '', type: '', number: 0 }])
  }

  const removeProd =(index)=> {
    const list = [...items]
    list.splice(index, 1);
    setItems(list)
  }

  const handleChangeInput = (index, e) => {
    const {name, value} = e.target;
    const values = [...items]
    values[index][name] = value;
    setItems(values);
  }

  const handleFormChange =(e)=> {
    setFormDetails({ ...formDetails, [e.target.name]:e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const checkNo = validateNumber()
    if (checkNo) {
      try {
        setLoad(true)
        const response = await axiosPrivate.post('/memo/create-acct-for-one/', JSON.stringify(formDetails))
        toast.success('Your Form has been sent to your Line Manager for Approval!', {
          position: 'top-right',
          theme: "colored"
        })
        setFormDetails(details)
        document.querySelector('form').reset()
        navigate('/')
      } catch (err) {
        setLoad(false)
        if (!err?.response) {
          errorNotify()
          setErrMsg('Network Related Problem')
        }
        setErrMsg('Check the Form and Try Again')
        errorNotify()
        errRef.current.focus()
      }
    } else {
      setErrMsg('Total Numbers must match the number of people')
      errRef.current.focus()
    }
  }
  
  return (
    <div className="inset-0 bg-opacity-30 backdrop-blur-sm fixed justify-center flex items-center overflow-auto">
      <div className="bg-sky-300 p-2 w-full mx-12 shadow-5xl">
        <button className="p-1 m-1" onClick={() => closeModal(false)}><FontAwesomeIcon icon={faTimes} size='2xl'/></button>
        <div className="font-semibold text-center text-xl text-gray-700 mb-6">
          <h1>{memoType}</h1>
          <p ref={errRef} className={errMsg ? 'text-center text-xl text-red-400' : 'hidden'}>{errMsg}</p>
        </div>
        {
          load ? 
            <Load />
          :
          <form onSubmit={handleSubmit} className="flex flex-col p-3">
            <div className="relative mt-2">
              <input type='text' id='companyName' name='company_name' value={formDetails.company_name} onChange={(e) => handleFormChange(e)} placeholder='Company Name' className="form-input-text peer placeholder-transparent" required />
              <label htmlFor="companyName" className="float-label">Company Name</label>
            </div>
            <div className="flex">
              <div className="relative mt-2 w-full">
                <input type='text' id='companyAddress' name='company_address' value={formDetails.company_address} onChange={(e) => handleFormChange(e)} placeholder='Address' className='form-input-text peer placeholder-transparent' required />
                <label htmlFor="companyAddress" className="float-label">Company Address</label>
              </div>
              <div className="relative mt-2 w-full">
                <input type='text' id='lineBiz' name='line_of_business' value={formDetails.line_of_business} onChange={(e) => handleFormChange(e)} placeholder='Line of Business' className='form-input-text peer placeholder-transparent' required />
                <label htmlFor="lineBiz" className="float-label">Line of business</label>
              </div>
            </div>
            <div className="flex">
              <div className="relative mt-2 w-full">
                <input type ='text' id='startDate' name='starting_date' value={formDetails.starting_date} onChange={(e) => handleFormChange(e)} placeholder='Starting Date' onFocus={(e)=>e.target.type = 'date'} className='form-input-text peer placeholder-transparent' required />
                <label htmlFor="startDate" className="float-label">Starting Date</label>
              </div>
              <div className="relative mt-2 w-full">
                <input type ='text' id='policyStart' name='policy_start' value={formDetails.policy_start} onChange={(e) => handleFormChange(e)} placeholder='Policy Year Start' onFocus={(e)=>e.target.type = 'month'} className='form-input-text peer placeholder-transparent' required />
                <label htmlFor="policyStart" className="float-label">Policy Year Start</label>
              </div>
              <div className="relative mt-2 w-full">
                <input type ='text' id='policyEnd' name='policy_end' value={formDetails.policy_end} onChange={(e) => handleFormChange(e)} placeholder='Policy Year End' onFocus={(e)=>e.target.type = 'month'} className='form-input-text peer placeholder-transparent' required />
                <label htmlFor="policyEnd" className="float-label">Policy Year End</label>
              </div>
            </div>
            <div className="flex">
              <div className="relative mt-2 w-full">
                <input type='number' id='premium' name='tot_annual_premium' onChange={(e) => handleFormChange(e)} value={formDetails.tot_annual_premium} min='0' placeholder='Total Annual Premium' className="form-input-text peer placeholder-transparent" required/>
                <label htmlFor="premium" className="float-label">Total Annual Premium</label>
              </div>
              <div className="relative mt-2 w-full">
                <input type='number' id='paymentMade' onChange={(e) => handleFormChange(e)} name='payment_made' value={formDetails.payment_made} min='0' placeholder='Payment Made' className="form-input-text peer placeholder-transparent" required/>
                <label htmlFor="paymentMade" className="float-label">Payment Made</label>
              </div>
              <div className="relative mt-2 w-full">
                <input type='text' id='paymentNote' onChange={(e) => handleFormChange(e)} name='payment_note' value={formDetails.payment_note} placeholder="Payment Note" className="form-input-text peer placeholder-transparent" required/>
                <label htmlFor="paymentNote" className="float-label">Payment Note</label>
              </div>
            </div>
            <div className="relative mt-2">
              <input type='text' id='paymentMode' name='mode_of_payment' onChange={(e) => handleFormChange(e)} value={formDetails.mode_of_payment} placeholder='Mode of Payment' className='form-input-text peer placeholder-transparent' required/>
              <label htmlFor="paymentMode" className="float-label">Mode of Payment</label>
            </div>
            <div className="flex flex-col">
              {items.map((input, index) => (
                <div key={index} className="flex w-full">
                  <select value={input.product} name='product' onChange={(e) => handleChangeInput(index, e)} className="w-full bg-transparent border border-r-0 border-t-0 border-l-0 tracking-wide" required>
                    <option selected hidden>Select a Product</option>
                    {productList.map((prod, index) => (
                      <option key={index}>{prod}</option>
                    ))}
                  </select>
                  <select value={input.type} name='type' onChange={(e) => handleChangeInput(index, e)} className="w-full bg-transparent border border-r-0 border-t-0 border-l-0 tracking-wide" required>
                    <option selected hidden>Select Product Type</option>
                    {productType.map((prod, index) => (
                      <option key={index}>{prod}</option>
                    ))}
                  </select>
                  <div className="relative w-full mt-2">
                    <input id='no' type='number' name='number' value={input.number} onChange={(e) => handleChangeInput(index, e)} placeholder='Number' className='form-input-text peer placeholder-transparent' required/>
                    <label htmlFor="no" className="float-label">Number</label>
                  </div>
                  <button onClick={addProd} className="bg-primary focus:text-white text-white w-full rounded-full p-1 m-1">ADD</button>
                  { items.length > 1 &&
                    <button onClick={() => removeProd(index)} className="bg-secondary focus:text-white w-full rounded-full p-1 m-1">REMOVE</button>
                  }
                </div>
              ))}
            </div>

            <div className="flex">
              <div className="relative mt-2 w-full">
                <input type='text' id='insured' name='insured' onChange={(e) => handleFormChange(e)} value={formDetails.insured} placeholder="Insured" className="form-input-text peer placeholder-transparent" />
                <label htmlFor="insured" className="float-label">Insured</label>
              </div>
              <div className="relative mt-2 w-full">
                <input type='number' id='totno' name='total_no_of_lives' onChange={(e) => handleFormChange(e)} value={formDetails.total_no_of_lives} placeholder='Total Number Of Lives' className="form-input-text peer placeholder-transparent"/>
                <label htmlFor="totno" className="float-label">Total No of Lives</label>
              </div>
            </div>
            <div className="flex">
              <div className="relative mt-2 w-full">
                <input type='text' id='person' name='contact_person' onChange={(e) => handleFormChange(e)} value={formDetails.contact_person} placeholder="Contact Person" className="form-input-text peer placeholder-transparent" />
                <label htmlFor="person" className="float-label">Contact Person</label>
              </div>
              <div className="relative mt-2 w-full">
                <input type='tel' id='tel' name='phone_number' onChange={(e) => handleFormChange(e)} value={formDetails.phone_number} placeholder="Phone Number" className="form-input-text peer placeholder-transparent" />
                <label htmlFor="tel" className="float-label">Phone Number</label>
              </div>
            </div>
            <button type="submit" className="mt-4 rounded-full py-2 px-3 uppercase text-xl bg-primary text-white font-bold cursor-pointer focus:text-white">SUBMIT</button>
          </form>   
        }
        <ToastContainer />
      </div>
    </div>
  )   
}

export default AccountOneModal;