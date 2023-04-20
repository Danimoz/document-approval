import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useGetFromApi from '../../hooks/useGetFromApi';

const LeaveModal =({isModalOpen, memoType, closeModal})=> {
  const errRef = useRef()
  const leaveTypes = ['Annual Leave', 'Casual Leave', 'Exam Leave', 'Maternity Leave', 'Paternity Leave']
  const staffUrl = '/users/get-all-users/'
  const axiosPrivate = useAxiosPrivate();

  const details = {
    leave_type: '',
    start_date: '',
    end_date: '',
    expected_resumption_date: '',
    purpose: '',
    relief_staff_name: '',
    relief_staff_designation: ''
  }
  const [formDetails, setFormDetails] = useState(details)
  const {items, loading, error} = useGetFromApi(staffUrl)
  const [errMsg, setErrMsg] = useState('')

  const handleChange = (e) => {
    setFormDetails({ ...formDetails, [e.target.name]:e.target.value })
  }

  const errorNotify =()=> {
    toast.error('There was an error, try again!', {
      position: 'top-right',
      theme: 'colored'
    })
  }

  const handleSubmit = async (e)=> {
    e.preventDefault();
    try{
      const response = await axiosPrivate.post('/memo/create-leave/', JSON.stringify(formDetails))
      toast.success('Your Form has been sent to your Line Manager for Approval!', {
        position: 'top-right',
        theme: "colored"
      })
      setFormDetails(details)
      document.querySelector('form').reset()
    } catch (err) {
      setErrMsg('Check the Form and Try Again')
      errorNotify()
      if (!err?.response) {
        errorNotify()
        setErrMsg('Network Related Problem')
      }
      errRef.current.focus()
    }
  }

  if (!isModalOpen) return null
  return (
    <div className="inset-0 bg-opacity-30 backdrop-blur-sm fixed justify-center flex items-center">
      <div className="bg-sky-300 p-2 w-full mx-12 shadow-5xl">
        <button className="p-2 m-3" onClick={() => closeModal(false)}><FontAwesomeIcon icon={faTimes} size='2xl'/></button>
        <div className="font-semibold text-center text-xl text-gray-700 mb-6">
          <h1>{memoType} Memo</h1>
          <p ref={errRef} className={errMsg ? 'text-center text-xl text-red-400' : 'hidden'} aria-live='assertive'>{errMsg}</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <select
            onChange={(e)=>handleChange(e)}
            defaultValue={formDetails.leave_type}
            name='leave_type' 
            required 
            className="p-1.5 bg-transparent focus:outline-none border border-r-0 border-t-0 border-l-0 tracking-wide"
            >
            <option hidden>Leave Type</option>
            {leaveTypes.map((leave, index) => (
              <option key={index} value={leave}>{leave}</option>
            ))}
          </select>
          <div className="flex">
            <div className="mt-3 relative w-full">
              <input name='start_date' value={formDetails.start_date} onChange={(e)=>handleChange(e)} id="startDate" placeholder='Start Date' type='text' onFocus={(e)=>e.target.type='date'} className="peer form-input-text placeholder-transparent" required/>
              <label htmlFor="startDate" className="float-label">Start Date</label> 
            </div>
            <div className="mt-3 relative w-full">
              <input name='end_date' value={formDetails.end_date} onChange={(e)=>handleChange(e)} id='endDate' placeholder='End Date' type='text' onFocus={(e)=>e.target.type='date'} className="peer form-input-text placeholder-transparent" required/>
              <label htmlFor="endDate" className="float-label">End Date</label>
            </div>
            <div className="mt-3 relative w-full">
              <input name='expected_resumption_date' value={formDetails.expected_resumption_date} onChange={(e)=>handleChange(e)} id='expectedDate' placeholder='Expected Resumption Date' type='text' className="peer form-input-text placeholder-transparent" onFocus={(e)=>e.target.type='date'} required/>
              <label htmlFor="expectedDate" className="float-label">Expected Resumption Date</label>
            </div>
          </div>
          <div className="mt-3 relative w-full">
            <input name='purpose' value={formDetails.purpose} onChange={(e)=>handleChange(e)} id='purpose' type='text' className="form-input-text peer placeholder-transparent" placeholder="Purpose of Leave" required/>
            <label htmlFor="purpose" className="float-label">Purpose of Leave</label>
          </div>
          <div className="flex">
            <div className="mt-3 relative w-full">
              <datalist id='staff'>
                {items.map((staff, index) => (
                  <option key={index} value={staff.username}>{staff.username}</option>
                ))}
              </datalist>
              <input name='relief_staff_name' value={formDetails.relief_staff_name} onChange={(e)=>handleChange(e)} id='staf' type='text' list='staff' className="form-input-text peer placeholder-transparent" placeholder='Relief Staff' required />
              <label htmlFor="staf" className="float-label">Relief Staff Name</label>
            </div>
            <div className="mt-3 relative w-full">
              <input name='relief_staff_designation' value={formDetails.relief_staff_designation} onChange={(e)=>handleChange(e)} type='text' id='designation' placeholder='Designation' className='form-input-text peer placeholder-transparent' required/>
              <label htmlFor="designation" className="float-label">Relief Staff Designation</label>
            </div>
          </div>
          <input type='submit' value='SEND' className="mt-4 rounded-full py-2 px-3 uppercase text-xl bg-primary text-white font-bold cursor-pointer focus:text-white" />
        </form>
        <ToastContainer />
      </div>
    </div>
  )
}

export default LeaveModal;