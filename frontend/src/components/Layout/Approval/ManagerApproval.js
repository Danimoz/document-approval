import GMLineManagerApprove from '../../approvals/GMLineManagerApprove';
import MemoTable from '../../helpers/MemoTable';

const ManagerApproval = () => {
  return (
    <MemoTable 
      url={'/memo/manager-memo/'}
      admin={true}
      component={<GMLineManagerApprove id={Number(sessionStorage.getItem('memoId'))} />}
    />
  );
}

export default ManagerApproval;