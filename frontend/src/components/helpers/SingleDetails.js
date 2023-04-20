import PaymentDetails from "../approvals/PaymentDetails";
import RefundDetails from "../approvals/RefundDetails";
import RequisitionDetails from "../approvals/RequisitionDetails";
import SalesDetails from "../approvals/SalesDetails";
import StaffRequestDetails from "../approvals/StaffRequestDetails";

const SingleDetails = ({ mitems }) => {
  switch (mitems.memoType) {
    case "Payment":
      return <PaymentDetails details={mitems} />;
    case "Requisition":
      return <RequisitionDetails details={mitems} />;
    case "Sales":
      return <SalesDetails details={mitems} />;
    case "Refund":
      return <RefundDetails details={mitems} />;
    case "Staff Request":
      return <StaffRequestDetails details={mitems} />;
    default:
      return <></>;
  }
};

export default SingleDetails;