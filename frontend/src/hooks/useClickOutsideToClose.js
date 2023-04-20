import { useEffect, useRef } from "react";

let useClickOutsideToClose = (func) => {
  let domNode = useRef();

  useEffect(()=>{
    let handler = (e)=>{
      if (!domNode.current?.contains(e.target)) func();
    }
    document.addEventListener('mousedown', handler)
    
    return () => {
      document.removeEventListener('mousedown', handler)
    };
  });

  return domNode;
}

export default useClickOutsideToClose;