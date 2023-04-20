
const SalesDetails = ({ details }) => {
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
      <h3 className="font-bold">COMPANY NAME & ADDRESS</h3>
      <h5>{details.sales.company_name}</h5>
      <h5>{details.sales.company_address}</h5>
      <br />
      <h3 className="font-bold">LINE OF BUSINESS</h3>
      <h5>{details.sales.line_of_business} </h5>
      <br />

      <table className="table">
        <thead>
          <th>STARTING DATE</th>
          <th>POLICY START</th>
          <th>POLICY END</th>
        </thead>
        <tbody>
          <tr>
            <td>{details.sales.starting_date}</td>
            <td>{details.sales.policy_start}</td>
            <td>{details.sales.policy_end}</td>
          </tr>
        </tbody>
      </table>
      
      <h3 className="font-bold">CONTACT PERSON</h3>
      <h5>{details.sales.contact_person} </h5>
      <h5>{details.sales.phone_number} </h5>
      <br />
      <h3 className="font-bold">TOTAL ANNUAL PREMIUM</h3>
      <h5>{details.sales.tot_annual_premium} </h5>
      <br />
      <h3 className="font-bold">TOTAL NO OF LIVES</h3>
      <h5>{details.sales.total_no_of_lives} </h5>
      <br />
      <h3 className="font-bold">PAYMENT MADE</h3>
      <h5>{details.sales.payment_made} </h5>
      <br />
      <h3 className="font-bold">MODE OF PAYMENT</h3>
      <h5>{details.sales.mode_of_payment} </h5>
      <br />
      <h3 className="font-bold">PAYMENT NOTE</h3>
      <h5>{details.sales.payment_note} </h5>
      <br />
      <h3 className="font-bold">INSURED</h3>
      <h5>{details.sales.insured} </h5>
      <br />
      
      <h3 className="font-bold">STATUS</h3>
      <p className="whitespace-pre-line">{details.sales.state}</p>
      <br />
      <h3 className="font-bold">ITEMS</h3>
      {details.sales.items.map((user, index) => (
        <div key={index}>
          <h5>{user[0]} - {user[1]} </h5>
        </div>
      ))}
      <h3 className="font-bold">APPROVALS</h3>
      {details?.approvals.map((user, index) => (
        <div key={index}>
          <h5>{user.user} - {getDate(user.created_at)} </h5>
        </div>
      ))}
    </div>
  )
}

export default SalesDetails;
