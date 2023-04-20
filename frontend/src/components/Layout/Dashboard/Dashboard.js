import Header from "../../helpers/Header";
import { messaging } from "../../../services/firebase";
import { getToken } from 'firebase/messaging';
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useEffect, useRef, useState } from "react";
import useGetFromApi from "../../../hooks/useGetFromApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft, faCaretRight, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";

const Dashboard = () => {
  const axiosPrivate = useAxiosPrivate();
  const effectRan = useRef(false);
  const title = 'Home';
  const {items:newsItems, loading:newsLoading, error:newsError} = useGetFromApi('/managers/news');
  
  const getDate = (date) => {
    const res = new Date(date);
    const formattedDate = res.toLocaleDateString("en-US", {weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'});
    return formattedDate;
  }

  async function requestPermission() {
    if (Notification.permission !== 'granted') {
      const permission = await Notification.requestPermission()
      const month = new Date().getMonth();
      if (permission === 'granted' && JSON.parse(localStorage.getItem('requestMonth')) !== month) {
        // Generate Token and send to backend
        const token = await getToken(messaging, {vapidKey:process.env.REACT_APP_FIREBASE_VAPID_KEY});
        const result = await axiosPrivate.post('/memo/get-device-token/', token)
        localStorage.setItem('requestMonth', month)
      } else if (permission === 'denied') {
        alert("You denied the notification")
      }
    }
  }

  const takeAttendance = async ()=> {
    const date = new Date().toISOString().slice(0, 10)
    if (localStorage.getItem('attendance') !== date) {
      try {
        const addAttendance = await axiosPrivate.post('/managers/take-attendance/', {})
        localStorage.setItem('attendance', date)
      } catch (err) {
        console.log(err)
      }
    }
  }

  const [currentItemIdex, setCurrentItemIndex] = useState(0);
  const handleNextClick = () => {
    setCurrentItemIndex(currentItemIdex === newsItems.length - 1 ? 0 : currentItemIdex + 1)
  };

  const handlePrevClick = () => {
    setCurrentItemIndex(currentItemIdex === 0 ? newsItems.length - 1 : currentItemIdex - 1);
  }

  useEffect(()=> {
    const intervalId = setInterval(() => {
      handleNextClick();
    }, 5000);
    return () => clearInterval(intervalId)
  }, [currentItemIdex]);

  useEffect(()=> {
    if (effectRan.current === true){
      requestPermission();
      takeAttendance();
    }
    return ()=>{
      effectRan.current = true;
    }
  }, [])

  const editNews = (id) => {
    console.log(id)
  }

  const deleteNews = (id) => {
    console.log(id)
  }

  return (
    <div className="rounded-tl-3xl -ml-8 bg-blue-50 relative overflow-y-auto">
      <Header title={title} />
      <div className="bg-gradient-to-br from-secondary via-primary to-reinforce flex justify-center h-screen mt-2">
        <div className="px-4 mx-4 mt-4 w-full">
          <div className="w-full">
            <h4 className="flex justify-center uppercase text-semibold text-white text-xl">News</h4>
            {
              (JSON.parse(localStorage.getItem('userIsGm')) === true || localStorage.getItem('userDept')) === 'HR'
              ?
              <div>
                <button className="bg-primary p-2 rounded-lg shadow-lg text-white focus:text-white">
                  CREATE NEWS
                </button>
                <table className="table-auto min-w-full bg-sky-100 rounded-lg mt-2">
                  <thead className='leading-normal uppercase'>
                    <tr>
                      <th className='py-1 px-2 text-left'>News</th>
                      <th className='py-1 px-2 text-left'>Author</th>
                      <th className='py-1 px-2 text-left'>Date Posted</th>
                      <th className='py-1 px-2 text-left'></th>
                      <th className='py-1 px-2 text-left'></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y py-1.5 px-3">
                    {
                      newsError ?
                        <h4>Can't display news at this time..</h4>
                      :
                      newsLoading ?
                      <h4> Loading .... </h4>
                      :
                      newsItems.map((news, key) => (
                        <tr key={key}>
                          <td className='py-1 px-2'>{news?.headline}</td>
                          <td className='py-1 px-2'>{news?.author?.first_name} {news?.author?.last_name}</td>
                          <td className='py-1 px-2'>{getDate(news?.created_at)}</td>
                          <td className='py-1 px-2'>{news?.author?.email === localStorage.getItem('userEmail') && <FontAwesomeIcon icon={faEdit} onClick={editNews(news.id)} />}</td>
                          <td className='py-1 px-2'>{news?.author?.email === localStorage.getItem('userEmail') && <FontAwesomeIcon icon={faTrash} onClick={deleteNews(news.id)} />}</td>
                        </tr>
                      ))
                    }
                  </tbody>                  
                </table>
              </div>
              :
              <div className="flex justify-between items-center">
                <button className="bg-sky-100 rounded-xl px-3" onClick={handlePrevClick}>
                  <span>
                    <FontAwesomeIcon icon={faCaretLeft} size='2x' />
                  </span>
                </button>
                <div className="w-full px-3 mx-3 shadow-2xl dark:bg-neutral-700">
                  {
                    newsError ?
                      <h4>Can't display news at this time..</h4>
                      :
                    newsLoading ?
                      <h4> Loading .... </h4>
                      :
                      <div className=" bg-white w-full px-3">
                        <h4 className="px-2">From: {newsItems[currentItemIdex]?.author?.first_name} {newsItems[currentItemIdex]?.author?.last_name}</h4>
                        <h4 className="text-lg flex justify-center uppercase font-semibold px-2 ">{newsItems[currentItemIdex]?.headline}</h4>
                        <p className="whitespace-pre-line text-justify px-2 ">{newsItems[currentItemIdex]?.content}</p>
                      </div>
                  }
                  
                </div>
                <button onClick={handleNextClick} className="bg-sky-100 rounded-xl px-3">
                  <span>
                    <FontAwesomeIcon icon={faCaretRight} size='2x' />
                  </span>
                </button>
              </div>
            }
          </div>

          <div className="w-full mt-3">
            <h4 className="flex justify-center uppercase text-semibold text-white text-xl">birthdays</h4>

          </div>

        </div>
      </div>
    </div>
  )
}

export default Dashboard;