import { useEffect, useState, useRef } from "react"
import useAxiosPrivate from "./useAxiosPrivate"

const GetFromApi = (url, callBack=[]) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const effectRan = useRef(false)
  const axiosPrivate = useAxiosPrivate();

  useEffect(()=>{
    let isMounted = true;
    let controller = new AbortController();

    if (effectRan.current === true) {
      const getItems = async ()=> {
        setLoading(true);
        try {
          const response = await axiosPrivate(url, {
            signal: controller.signal
          });
          isMounted && setItems(response.data)
          setLoading(false)
        } catch (err) {
          setError(err)
          setLoading(false)
        }
      }
      getItems();
    }

    return () => {
      isMounted = false;
      effectRan.current = true
      controller.abort();
    }

  }, [...callBack])
  return {items, loading, error};
}

export default GetFromApi;