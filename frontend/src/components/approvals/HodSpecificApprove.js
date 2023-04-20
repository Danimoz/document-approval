import { useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Load from "../helpers/Load";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const HodSpecificApprove = ({id}) => {
  const [url, setUrl] = useState('');
  const [load, setLoad] = useState(false)
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const referDepts = ['Admin', 'ICU', 'HR' ]
  const userDept = localStorage.getItem('userDept')
  const urls = {
    'Quality Assurance': `/memo/qa/${id}/approve_or_reject/`,
    'HR': `/memo/hr/${id}/approve_or_reject/`,
    'ICU': `/memo/icu/${id}/approve_or_reject/`,
    'Finance': `/memo/finance/${id}/approve_or_reject/`,
    'Admin': `/memo/admin/${id}/approve_or_reject/`,
  }
  const link = urls[userDept]
  setUrl(link)

  const notify =(notifyType, message) => {
    const options = {position: 'top-right', theme: 'colored'}
    if(notifyType === 'success'){
      toast.success(message, options)
    } else {
      toast.error(message, options)
    }
  }

  const handleMemoAction = async (memoAction) => {
    const confirmMessage = memoAction === 'approve' ? 'Are you sure you want to Accept?' 
      : memoAction === 'refer' ? 'Are you sure you want to Refer?' : 'Are you sure you want to Reject?';
    if (window.confirm(confirmMessage)) {
      try {
        setLoad(true);
        await axiosPrivate.patch(url, { action: memoAction });
        const successMessage = memoAction === 'approve' ? 'Memo successfully approved' : 
          memoAction === 'refer' ? 'Memo successfully referred': 'Memo successfully rejected';
        notify('success', successMessage);
        sessionStorage.clear()
        navigate('/approve-memo');
      } catch (err) {
        notify('error', 'An error occured!');
      }
      setLoad(false)
      sessionStorage.clear()
    }
  }
  
  return (
    <>
    {
      load ?
        <Load />
      :
      <div className="ml-2 pl-2 flex items-center">
        <button
          onClick={()=> handleMemoAction('approve')} 
          className="rounded w-full bg-primary px-2 pb-2 pt-2.5 m-2 transition duration-150 ease-in-out focus:text-white"
        >
          Accept
        </button>
        {
          referDepts.includes(userDept) &&
            <button
              onClick={() => handleMemoAction('refer')} 
              className="rounded w-full bg-secondary px-2 pb-2 pt-2.5 m-2 transition duration-150 ease-in-out focus:text-white"
            >
              Refer
            </button>
        }
        {
          userDept === 'Admin' &&
            <button
              onClick={()=> handleMemoAction('reject')}
              className="rounded w-full bg-red-500 text-white px-2 pb-2 pt-2.5 m-2 transition duration-150 ease-in-out focus:text-white"
            >
              Reject
            </button>
        }
      </div>
    }
    </>
  )
}

export default HodSpecificApprove;