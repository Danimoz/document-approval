import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";

const RefundModal = ({isModalOpen, memoType, closeModal}) => {
  const details = {
    enrollee_name: '',
    enrollee_address: '',
    enrollee_id: '',
    enrollee_reg_date: '',
    enrollee_birth_date: '',
    company_name: '',
    provider_name: '',
    illness: '',
    refund_reason:'',
    telephone: '',
    email: '',
    acct_no: '',
    tot_amt_claimed: '',
    acct_name: '',
    bank_name: '',
    document1: null,
    document2: null,
    document3: null,
    document4: null
  }
  const [formDetails, setFormDetails] = useState(details)
  const [payCheck, setPaycheck] = useState(false)
  const [outCheck, setOutcheck] = useState(false)
  const [otherCheck, setOthercheck] = useState(false)
  const [errMsg, setErrMsg] = useState('')
  const errRef = useRef()
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const handleFormChange =(e) => {
    e.target.type === 'file' ?
      setFormDetails({ ...formDetails, [e.target.name]:e.target.files[0] }) :
      setFormDetails({ ...formDetails, [e.target.name]:e.target.value })
  }

  const handleCheck =(e) => {
    switch (e.target.id) {
      case 'pay':
        setPaycheck(!payCheck)
        setOutcheck(false)
        setOthercheck(false)
        break;
      case 'out':
        setOutcheck(!outCheck)
        setPaycheck(false)
        setOthercheck(false)
        break;
      default:
        setOthercheck(!otherCheck)
        setPaycheck(false)
        setOutcheck(false)
        otherCheck ? e.target.parentNode.children.othertext.classList.add('hidden') : 
          e.target.parentNode.children.othertext.classList.remove('hidden')
        break;
    } 
  }

  const errorNotify =()=> {
    toast.error('There was an error, try again!', {
      position: 'top-right',
      theme: 'colored'
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let refundReason = '';

    if (payCheck) {
      refundReason = 'Selected provider requested payment for covered services'
    } else if (outCheck) {
      refundReason = 'Visited Out of network provider in an emergency'
    } else if (otherCheck) {
      refundReason = document.querySelector('form').children[6].children[2].children.othertext.value
    }

    const formData = new FormData();
    Object.keys(formDetails).forEach(key => {
      if (formDetails[key] !== null) formData.append(key, formDetails[key])
    })
    setFormDetails({ ...formDetails, ['refund_reason']: refundReason})

    try {
      const response = await axiosPrivate.post('/memo/create-refund/', formData, {
        headers: {'Content-Type': 'multipart/form-data'}
      })
      toast.success('Your Form has been sent to your Line Manager for Approval!', {
        position: 'top-right',
        theme: "colored"
      })
      setFormDetails(details)
      document.querySelector('form').reset()
      navigate('/memo', {replace: true})
    } catch (err) {
      errorNotify();
      setErrMsg('Check the Form and Try Again')
      if (!err?.response) {
        errorNotify()
        setErrMsg('Network Related Problem')
      }
      errRef.current.focus()
    }

  }

  if (!isModalOpen) return null
  return (
    <div className="inset-0 bg-opacity-30 backdrop-blur-sm fixed justify-center flex items-center overflow-auto">
      <div className="bg-sky-300 p-2 w-full mx-12 rounded-2xl shadow-5xl">
        <button className="p-2 m-3" onClick={() => closeModal(false)}><FontAwesomeIcon icon={faTimes} size='2xl'/></button>
        <div className="font-semibold text-center text-2xl text-gray-700 mb-4">
          <h1>{memoType}</h1>
          <p ref={errRef} className={errMsg ? 'text-center text-xl text-red-400' : 'hidden'} aria-live='assertive'>{errMsg}</p>
        </div>

        <form className="flex flex-col" encType="multipart/form-data" onSubmit={handleSubmit}>
          <div className="relative mt-2">
            <input id='enrolleeName' type='text' name='enrollee_name' value={formDetails.enrollee_name} onChange={(e) => handleFormChange(e)} className="form-input-text peer placeholder-transparent" placeholder="Enrollee's Name" required />
            <label htmlFor="enrolleeName" className="float-label">Enrollee's Name</label>
          </div>
          <div className="relative mt-2">
            <input type='text' id='enrolleeAddress' name='enrollee_address' value={formDetails.enrollee_address} onChange={(e) => handleFormChange(e)} className="form-input-text peer placeholder-transparent" placeholder="Enrollee's Address" required />
            <label htmlFor="enrolleeAddress" className="float-label">Enrollee's Address</label>
          </div>
          <div className="flex">
            <div className="relative mt-2 w-full">
              <input type='text' id='enrolleeID' name='enrollee_id' value={formDetails.enrollee_id} onChange={(e) => handleFormChange(e)} className="form-input-text peer placeholder-transparent" placeholder="Enrollee Identification Number" required />
              <label htmlFor="enrolleeID" className="float-label">Enrollee's ID</label>
            </div>
            <div className="relative mt-2 w-full">
              <input type='text' id='regDate' name='enrollee_reg_date' onFocus={(e)=>e.target.type = 'date'} value={formDetails.enrollee_reg_date} onChange={(e) => handleFormChange(e)} className="form-input-text peer placeholder-transparent" placeholder="Enrollee Registration Date" required />
              <label htmlFor="regDate" className="float-label">Enrollee's Registration Date</label>
            </div>
            <div className="relative mt-2 w-full">
              <input type='text' id='birthDate' name='enrollee_birth_date' onFocus={(e)=>e.target.type = 'date'} value={formDetails.enrollee_birth_date} onChange={(e) => handleFormChange(e)} className="form-input-text peer placeholder-transparent" placeholder="Enrollee Birth Date" required />
              <label htmlFor="birthDate" className="float-label">Enrollee's Birth Date</label>
            </div>
          </div>
          <div className="flex">
            <div className="relative mt-2 w-full">
              <input type='text' id='companyName' name='company_name' value={formDetails.company_name} onChange={(e) => handleFormChange(e)} className="form-input-text peer placeholder-transparent" placeholder="Name of Company" required />
              <label htmlFor="companyName" className="float-label">Company Name</label>
            </div>
            <div className="relative mt-2 w-full">
              <input type='text' id='providerName' name='provider_name' value={formDetails.provider_name} onChange={(e) => handleFormChange(e)} className="form-input-text peer placeholder-transparent" placeholder="Name of Provider" required />
              <label htmlFor="providerName" className="float-label">Provider Name</label>
            </div>
          </div>
          <div className="relative mt-2">
            <textarea id='reason' wrap='soft' name='illness' value={formDetails.illness} onChange={(e) => handleFormChange(e)} className="form-input-text peer placeholder-transparent" placeholder="Description of Injury or Illness" required/>
            <label htmlFor="reason" className="float-label">Description of Illness or Injury</label>
          </div>
          <h4 className="ml-2">Reason for Refund</h4>
          <div className="flex items-center">
            <div className="flex my-1">
              <input type='checkbox' id='pay' onChange={(e) => handleCheck(e)} checked={payCheck} className="ml-2" />
              <label htmlFor="pay" className="mx-4">Selected provider requested payment for covered services </label>
            </div>
            <div className="flex my-1">
              <input type='checkbox' id='out' onChange={(e) => handleCheck(e)} checked={outCheck} />
              <label htmlFor="out" className="mx-4">Visited Out of network provider in an emergency</label>
            </div>
            <div className="flex my-1 items-center">
              <input type='checkbox' id='other' onChange={(e) => handleCheck(e)} checked={otherCheck} />
              <label htmlFor="other" className="mx-4">Other</label>
              <input type='text' name='othertext' className='form-input-text hidden' />
            </div>
          </div>
          <h4 className="ml-2">Supporting Documents</h4>
          <div className="flex">
            <input type='file' name='document1' onChange={(e) => handleFormChange(e)} className='form-input-text' />
            <input type='file' name='document2' onChange={(e) => handleFormChange(e)} className='form-input-text' />
            <input type='file' name='document3' onChange={(e) => handleFormChange(e)} className='form-input-text' />
            <input type='file' name='document4' onChange={(e) => handleFormChange(e)} className='form-input-text' />
          </div>
          <div className="flex">
            <div className="relative mt-2 w-full">
              <input type='tel' id='telno' name='telephone' value={formDetails.telephone} onChange={(e) => handleFormChange(e)} placeholder='Telephone Number' className="form-input-text peer placeholder-transparent" required/>
              <label htmlFor="telno" className="float-label">Telephone Number</label>
            </div>
            <div className="relative mt-2 w-full">
              <input type='email' id='mail' name='email' value={formDetails.email} onChange={(e) => handleFormChange(e)} placeholder="Email Address" className="form-input-text peer placeholder-transparent" required/>
              <label htmlFor="mail" className="float-label">Email Address</label>
            </div>
          </div>
          <div className="flex">
            <div className="relative mt-2 w-full">  
              <input type='number' id='totAmt' name='tot_amt_claimed' value={formDetails.tot_amt_claimed} onChange={(e) => handleFormChange(e)} placeholder='Total Amount Claimed' className="form-input-text peer placeholder-transparent" required/>
              <label htmlFor="totAmt" className="float-label">Total Amount Claimed</label>
            </div>
            <div className="relative mt-2 w-full">
              <input type='number' id='acctNo' name='acct_no' value={formDetails.acct_no} onChange={(e) => handleFormChange(e)} placeholder="Account Number" className="form-input-text peer placeholder-transparent" required/>
              <label htmlFor="acctNo" className="float-label">Account Number</label>
            </div>
          </div>
          <div className="flex">
            <div className="relative mt-2 w-full">
              <input type='text' id='acctName' name='acct_name' value={formDetails.acct_name} onChange={(e) => handleFormChange(e)} placeholder='Account Name' className="form-input-text peer placeholder-transparent" required/>
              <label htmlFor="acctName" className="float-label">Account Name</label>
            </div>
            <div className="relative mt-2 w-full">
              <input type='text' id='bankName' name='bank_name' value={formDetails.bank_name} onChange={(e) => handleFormChange(e)} placeholder="Bank Name" className="form-input-text peer placeholder-transparent" required/>
              <label htmlFor="bankName" className="float-label">Bank Name</label>
            </div>
          </div>
          <input type='submit' value='SEND' className="mt-4 rounded-full py-2 px-3 uppercase text-xl bg-primary text-white font-bold cursor-pointer focus:text-white" required/>
        </form>
        <ToastContainer />
      </div>
    </div>
  )
}

export default RefundModal;