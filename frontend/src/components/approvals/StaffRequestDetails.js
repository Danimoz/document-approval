
const StaffRequestDetails = ({ details}) => {
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
      <h3 className="font-bold">TYPE</h3>
      <h5>{details.staff_request.request_type}</h5>
      <br />
      <h3 className="font-bold">PURPOSE</h3>
      <h5>{details.staff_request.purpose}</h5>
      <br />
      <div className="flex-row items-center justify-center">
        <div>
          <h4>START DATE</h4>
          <h4>END DATE</h4>
          <h4>RESUMPTION DATE</h4>
        </div>
        <div>
          <h6>{getDate(details.staff_request.start_date)}</h6>
          <h6>{getDate(details.staff_request.end_date)}</h6>
          <h6>{getDate(details.staff_request.expected_resumption_date)}</h6>
        </div>
      </div>
      <h3 className="font-bold">RELIEF STAFF</h3>
      <h5>{details.staff_request.relief_staff_name.first_name}</h5>
      <h5>{details.staff_request.relief_staff_designation}</h5>
      <br />
      <h3 className="font-bold">STATUS</h3>
      <p className="whitespace-pre-line">{details.staff_request.state}</p>
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

export default StaffRequestDetails;
