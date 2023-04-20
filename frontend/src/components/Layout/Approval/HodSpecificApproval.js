import HodSpecificApprove from "../../approvals/HodSpecificApprove";
import Header from "../../helpers/Header";
import MemoTable from "../../helpers/MemoTable";
import Side from "../Side";

const HodSpecificApproval = () => {
  const userDept = localStorage.getItem('userDept')
  const title = `${userDept} Specific Memos`

  return (
    <>
      <Side />
      <main className="rounded-tl-3xl -ml-8 bg-blue-50 relative">
        <Header title={title} />
        <div className="bg-gradient-to-br from-secondary via-primary to-reinforce flex justify-center h-screen mt-4">
          <div className="w-full">
            <MemoTable 
              url={'/memo/specific-hod-memo/'}
              admin={true}
              component={<HodSpecificApprove id={Number(sessionStorage.getItem('memoId'))}/>}
            />
          </div>
        </div>
      </main>
    </>
  )
}

export default HodSpecificApproval;