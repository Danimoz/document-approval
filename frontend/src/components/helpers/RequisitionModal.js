import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tilt from 'react-parallax-tilt';
import { useRef, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const MemoModal =({isModalOpen, memoType, closeModal})=> {
  const [formObject, setFormObject] = useState({
    title: '', message: '', document: null
  })
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState('')  
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  if (!isModalOpen) return null
  
  const handleFormChange =(e)=> {
    e.target.type === 'file' ?
      setFormObject({ ...formObject, [e.target.name]: e.target.files[0] }) :
      setFormObject({ ...formObject, [e.target.name]: e.target.value })
  }

  const notifyError = () => {
    toast.error('There was an error, try again!', {
      position: 'top-right',
      theme: 'colored'
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (formObject.title === '' || formObject.message === '' ) return
    Object.keys(formObject).forEach(key => {
      if (formObject[key] !== null) formData.append(key, formObject[key])
    })

    try {
      const response = await axiosPrivate.post('/memo/create-requisition/', formData, {
        headers: {'Content-Type': 'multipart/form-data'}
      });
      console.log(response)
      setFormObject({ title: '', message: '', document: null})
      toast.success('Your Memo has been sent to your Line Manager for Approval!', {
        position: 'top-right',
        theme: "colored"
      })
      navigate('/memo', {replace: true})
    } catch (err) {
      notifyError()
      setErrMsg('Check your fields and try again')
      if (!err?.response){
        notifyError();
        setErrMsg('Network problem')
      }
      errRef.current.focus()
    }
    
  }

  return (
    <div className="inset-0 min-w-full backdrop-blur-sm fixed justify-center flex items-center">
      <Tilt>
        <div className="p-2 w-full mx-12 rounded-2xl shadow-5xl border border-r-0 border-b-0 border-opacity-30">
          <button className="p-2 m-4" onClick={() => closeModal(false)}><FontAwesomeIcon icon={faTimes} size='2xl'/></button>
          <div className="font-semibold text-center text-xl text-gray-700 mb-6">
            <h1>{memoType} Memo</h1>
            <p ref={errRef} className={errMsg ? 'text-center text-xl text-red-400' : 'hidden'} aria-live='assertive'>{errMsg}</p>
          </div>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="flex flex-col">
              <input type='text' name='title' onChange={(e)=> handleFormChange(e)} value={formObject.title} className='mx-6 modalinput mb-6' placeholder='Title' required />
              <textarea rows='8' name='message' onChange={(e)=> handleFormChange(e)} value={formObject.message} className="modalinput mx-6 mb-6" placeholder="Message" required />
              <input name='document' type='file' onChange={(e)=> handleFormChange(e)} className="modalinput mx-6" />
            </div>
            <div className="flex justify-center my-4">
              <button className="rounded-full py-2 px-3 uppercase text-xs font-bold cursor-pointer focus:text-white text-white tracking-wider bg-primary">Send</button>
            </div>
          </form>
          <ToastContainer />
        </div>
      </Tilt>
    </div>
  )
}

export default MemoModal;