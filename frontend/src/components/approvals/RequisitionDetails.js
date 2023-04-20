
const RequisitionDetails = ({ details}) => {
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
      <h3 className="font-bold">TITLE</h3>
      <h5>{details.requisition.title}</h5>
      <br />
      <h3 className="font-bold">MESSAGE</h3>
      <p className="whitespace-pre-line">{details.requisition.message}</p>
      <br />
      <h3 className="font-bold">DOCUMENT</h3>
      <p className="whitespace-pre-line">{details.requisition?.document}</p>
      <br />
      <h3 className="font-bold">STATUS</h3>
      <p className="whitespace-pre-line">{details.requisition.state}</p>
      <br />
      <h3 className="font-bold">APPROVALS</h3>
      {details?.approvals.map((user, index) => (
        <div>
          <h5>{user.user} - {getDate(user.created_at)} </h5>
        </div>
      ))}
    </div>
  )
}

export default RequisitionDetails;