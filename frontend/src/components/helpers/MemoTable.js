import useGetFromApi from '../../hooks/useGetFromApi';
import { useState } from 'react';
import IndividualMemo from './IndividualMemo';
import Load from './Load';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleLeft, faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';


const MemoTable = ({ url, admin, component=null }) => {
  const [detailOpen, setDetailOpen] = useState(false)
  const [id, setId] = useState(0)
  const [memoUrl, setMemoUrl] = useState(url)
  const { items, loading, error } = useGetFromApi(memoUrl, [memoUrl])
  const BASE_URL = process.env.REACT_APP_API_BASE_URL

  const getDate = (date) => {
    const res = new Date(date)
    return res.toDateString()
  }

  const getId = () => {
    return id;
  }

  const removeFirstLetterFromUrl = (str) => {
    return str.substring(1);
  }

  const getNextUrl =()=>{
    if (items?.next){
      const next = items?.next
      const params = new URL(next);
      const p = params.searchParams.get('p');
      setMemoUrl(`${url}?p=${p}`)
    }
  }

  const getPrevUrl =()=>{
    if (items?.previous === `${BASE_URL}${url}`) setMemoUrl({ str: removeFirstLetterFromUrl(url) })
    else if (items?.previous) {
      const previous = items?.previous
      const params = new URL(previous);
      const p = params.searchParams.get('p');
      setMemoUrl(`${url}?p=${p}`)
    }
  }
  
  return (
    <>
      <div className='p-2 m-2 overflow-y-auto'>
        {loading ?
          <Load />
          :
          error ?
          <p>Can't Load Items at this time</p>
          :
          <table className="min-w-full">
            <thead className='bg-reinforce leading-normal uppercase'>
              <tr>
              <th className='py-1 px-2 text-left'>Type</th>
                <th className='text-center'>Status</th>
                <th className='py-1 px-2 text-left'>With</th>
                {admin && <th className='py-1 px-2 text-left'>Initiator</th>}
                <th className='py-1 px-2 text-left'>Date</th>
                <th className='py-1 px-2 text-left'>Approvals</th>
                <th className='py-1 px-2 text-center'>Details</th>
              </tr>
            </thead>
            <tbody>
              {
                items?.results?.map((memo, index) => (
                  <tr key={index} className='border-b mt-1 text-sm transition duration-300 ease-in-out hover:bg-sky-100'>
                    <td className='py-1 px-2'>{memo.memoType}</td>
                    <td className='py-1 px-2 text-center'>
                      <span className={memo.status === 'Pending' ? 'bg-secondary py-1 px-2 text-white rounded-full' : memo.status === 'Approved' ? 'bg-primary text-white py-1 px-2 rounded-full' : 'bg-red-600 text-white rounded-full py-1 px-2' }>{memo.status}</span>
                    </td>
                    <td className='py-1 px-2'>{memo.state}</td>
                    {admin && <td className='py-1 px-2'>{memo.user.first_name}</td>}
                    <td className='py-1 px-2'>{getDate(memo.created_at)}</td>
                    <td className='py-1 px-2'>
                      {
                        memo?.approvals.map((name, index) => (
                          <div className='flex'>
                            <h5>{name.user}, &nbsp;</h5>
                          </div>
                        ))
                      }
                    </td>
                    <td className='text-center'><button onClick={()=>{
                      setId(memo.id)
                      {admin && sessionStorage.setItem('memoId', memo.id)}
                      setDetailOpen(true)
                      }} className='bg-reinforce rounded-xl w-full px-4 py-2'>Details</button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        }
        <div className='flex justify-center items-center'>
          {
            items?.previous && 
              <button onClick={() => getPrevUrl()} className='p-2 m-2'><FontAwesomeIcon icon={faArrowCircleLeft} size='2x' /></button>
          }
          {
            items?.next &&
              <button onClick={() => getNextUrl()}><FontAwesomeIcon icon={faArrowCircleRight} size='2x' /></button>
          }
        </div>
      </div>

      <IndividualMemo 
        open={detailOpen} 
        id={id} 
        close={setDetailOpen} 
        admin={admin}
        component={component} 
      />
    </>
  )
}

export default MemoTable