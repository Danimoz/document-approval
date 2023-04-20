
const RefundDetails = ({ details }) => {
  const getDate = (date) => {
    const res = new Date(date)
    return res.toDateString()
  }

  return (
    <div className="my-3 ml-2 pl-2">
      <h3 className="font-bold">MEMO TYPE</h3>
      <h5>{details.memoType} </h5>
      <br />
      <h3 className="font-bold">DATE CREATED</h3>
      <h5>{getDate(details.created_at)}</h5>
      <br />
      <h3 className="font-bold">CREATED BY</h3>
      <h5>{`${details.user.first_name} ${details.user.last_name}`}</h5>
      <br />
      <h3 className="font-bold">ENROLLEE NAME & ADDRESS</h3>
      <h5>{details.refund.enrollee_name}</h5>
      <h5>{details.refund.enrollee_address}</h5>
      <br />
      <h3 className="font-bold">ENROLLEE ID</h3>
      <h5>{details.refund.enrollee_id}</h5>
      <br />
      <h3 className="font-bold">COMPANY & PROVIDER</h3>
      <h5>{details.refund.company_name}</h5>
      <h5>{details.refund.provider_name}</h5>
      <br />
      <h3 className="font-bold">EMAIL & TELEPHONE</h3>
      <h5>{details.refund.email}</h5>
      <h5>{details.refund.telephone}</h5>
      <br />
      <h3 className="font-bold">ACCOUNT DETAILS</h3>
      <h5>{details.refund.acct_name}</h5>
      <h5>{details.refund.acct_no}</h5>
      <h5>{details.refund.bank_name}</h5>
      <br />
      
      <div className="flex-row items-center justify-center">
        <div>
          <h4>REG DATE</h4>
          <h4>BIRTH DATE</h4>
        </div>
        <div>
          <h6>{getDate(details.refund.enrollee_reg_date)}</h6>
          <h6>{getDate(details.refund.enrollee_birth_date)}</h6>
        </div>
      </div>

      <h3 className="font-bold">TOTAL AMOUNT CLAIMED</h3>
      <h5>{details.refund.tot_amt_claimed} </h5>
      <br />
      <h3 className="font-bold">REFUND REASON</h3>
      <h5>{details.refund.refund_reason} </h5>
      <br />
      <h3 className="font-bold">ILLNESS</h3>
      <p className="whitespace-pre-line">{details.refund.illness}</p>
      <br />
            
      <h3 className="font-bold">STATUS</h3>
      <p className="whitespace-pre-line">{details.refund.state}</p>
      <br />
      <h3 className="font-bold">APPROVALS</h3>
      {details?.approvals.map((user, index) => (
        <div key={index}>
          <h5>{user.user} - {getDate(user.created_at)} </h5>
        </div>
      ))}
      <h3 className="font-bold">DOCUMENTS</h3>
      <h5><a href={details.refund?.document1}>DOCUMENT1</a></h5>
      <h5><a href={details.refund?.document2}>DOCUMENT1</a></h5>
      <h5><a href={details.refund?.document3}>DOCUMENT1</a></h5>
      <h5><a href={details.refund?.document4}>DOCUMENT1</a></h5>
      <br />
    </div>
  )
}

export default RefundDetails;