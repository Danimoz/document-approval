import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import useClickOutsideToClose from "../../../hooks/useClickOutsideToClose";
import Header from "../../helpers/Header";
import RequisitionModal from "../../helpers/RequisitionModal";
import LeaveModal from "../../helpers/LeaveModal";
import AccountOneModal from "../../helpers/AccountOneModal";
import RefundModal from "../../helpers/RefundModal";
import MemoTable from "../../helpers/MemoTable";

const Memo = () => {
  const title = 'Memo';
  const memoTypes = ['Requisition', 'Leave', 'Account One Form', 'Refund Form']
  const [showOptions, setShowOptions] = useState(false);
  const [memoType, setMemoType] = useState('');
  const [isReqModalOpen, setIsReqModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isAccountOneOpen, setIsAccountOneOpen] = useState(false);
  const [isRefundFormOpen, setIsRefundFormOpen] = useState(false);

  const handleMemoTypeClick =(memoType)=>{
    setMemoType(memoType);
    switch (memoType) {
      case 'Requisition':
        setIsReqModalOpen(true);
        break;
      case 'Leave':
        setIsLeaveModalOpen(true);
        break;
      case 'Account One Form':
        setIsAccountOneOpen(true);
        break;
      case 'Refund Form':
        setIsRefundFormOpen(true);
        break;
      default:
        break;
    }
    setShowOptions(false);
  }

  let optNode = useClickOutsideToClose(()=>{
    setShowOptions(false);
  })

  return (
    <div className="rounded-tl-3xl -ml-8 bg-blue-50 relative">
      <Header title={title}/>

      <div className="relative inline-block z-10">
        {!(isReqModalOpen || isRefundFormOpen || isAccountOneOpen || isLeaveModalOpen )&& <button 
          className="px-12 mx-12 tracking-wider focus:text-sky-100 text-white bg-blue-500 py-1 text-sm rounded leading-loose focus:outline-none focus:ring transition font-semibold"
          onClick={()=>setShowOptions(!showOptions)}
        >
          <FontAwesomeIcon icon={faPlus} />&nbsp; CREATE NEW MEMO
        </button>}

        {showOptions && 
          <div className="absolute mt-2 right-[4.2rem] origin-top-right w-56 cursor-pointer rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" 
            ref={optNode}
          >
            <ul className="py-1">
              {memoTypes.map((opt, index) => (
                <li className='hover:bg-sky-100 px-4 py-1' key={index} onClick={()=>handleMemoTypeClick(opt)}>{opt}</li>
              ))}
            </ul>
          </div>
        }
      </div>

      <RequisitionModal isModalOpen={isReqModalOpen} memoType={memoType} closeModal={setIsReqModalOpen} />
      <LeaveModal isModalOpen={isLeaveModalOpen} memoType={memoType} closeModal={setIsLeaveModalOpen} />
      <AccountOneModal isModalOpen={isAccountOneOpen} memoType={memoType} closeModal={setIsAccountOneOpen} />
      <RefundModal isModalOpen={isRefundFormOpen} memoType={memoType} closeModal={setIsRefundFormOpen} />

      <div className="bg-gradient-to-br from-secondary via-primary to-reinforce h-full mt-4">
        <MemoTable 
          url={'/memo/get-user-memo/'}
          admin={false}
          component={<></>} />
      </div>

    </div>
  )
}

export default Memo;