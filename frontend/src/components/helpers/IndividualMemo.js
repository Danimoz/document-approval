import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState, useRef } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Load from "./Load";
import SingleDetails from "./SingleDetails";


const IndividualMemo = ({id, open, close, admin, component=<></>}) => {
  const effectRan = useRef(false)
  const [mitems, setMitems] = useState([])
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const axiosPrivate = useAxiosPrivate();

  useEffect(()=>{
    let isMounted = true;
    let controller = new AbortController();

    if (effectRan.current === true) {
      const getItems = async()=> {
        if (id > 0 && open) {
          setLoading(true);
          try {
            const response = await axiosPrivate(`/memo/get-single-memo/${id}/`, {
              signal: controller.signal
            });
            isMounted && setMitems(response.data)
            setLoading(false)
          } catch(err) {
            setError(err)
            setLoading(false)
          }
        }
      }
      getItems();
    }
    return () => {
      isMounted = false;
      effectRan.current = true
      controller.abort();
    }

  }, [id])
   
  

  if (!open) return null
  return (
    <div className="fixed h-full flex right-0 top-0 bottom-0 w-96 transition-all">
      <div className="bg-sky-300 w-full overflow-y-auto">
        <div className="p-2 mr-3 flex justify-end">
          <button onClick={() => close(false)}>
            <FontAwesomeIcon icon={faClose} size='2x' />
          </button>
        </div>
        {
          loading ?
            <Load />
          :
          error ?
            <p>Can't Retrieve Items now. Try again</p>
          :
          <div>
            {admin ?
              <>
                {component}
                <SingleDetails mitems={mitems} />
              </>
              : 
              <>
                <SingleDetails mitems={mitems} />
              </>
            }
            
          </div>
        }
      </div>
    </div>
  )
}

export default IndividualMemo;