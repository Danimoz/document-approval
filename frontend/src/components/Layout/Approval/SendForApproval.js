
import Header from "../../helpers/Header";
import ManagerApproval from "./ManagerApproval";

const SendForApproval =()=> {
  const title = `${localStorage.getItem('userDept')} Department Memos`
  return (
    <div className="rounded-tl-3xl -ml-8 bg-blue-50 relative">
      <Header title={title} />

      <div className="bg-gradient-to-br from-secondary via-primary to-reinforce flex justify-center h-screen mt-4">
        <div className="w-full">
          <ManagerApproval />
        </div>
      </div>
    </div>
  )
}

export default SendForApproval;