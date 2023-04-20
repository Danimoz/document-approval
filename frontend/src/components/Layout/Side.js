import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";

const Side =()=> {
  const [active, setActive] = useState('');
  const location = useLocation();

  useEffect(()=>{
    const currentPathname = location.pathname;
    setActive(currentPathname.substring(1) || "Dashboard")
  }, [location.pathname])

  const isGm = JSON.parse(localStorage.getItem('userIsGm'))
  const isHod = JSON.parse(localStorage.getItem('userIsHod'))
  const userDept = localStorage.getItem('userDept')
  
  return (
    <nav className="flex flex-col text-white bg-ternary h-screen">
      <div className="company-name">Clearline Portal</div>
      <ul className="mb-auto sidebar">
        <li className={(active === 'Dashboard' || active === '') ? 'active' : 'undefined'}>
          <Link to='/' className="sidebar-a" onClick={()=> setActive('Dashboard')}>Dashboard</Link>
        </li>
        {
          (isGm === true || isHod === true) &&
            <li className={active === 'approve-memo' ? 'active' : ''}>
              <Link to='/approve-memo' className="sidebar-a font-sm">Send for Approval</Link>
              {
                isHod === true && ['ICU', 'Finance', 'Quality Assurance', 'HR', 'Admin'].includes(userDept) &&
                  <Link to='/specific-memo' className="sidebar-a">Specific Memo</Link>
              }
            </li>
        }
        {
          !isGm && !isHod &&
            <li className={active === 'memo' ? 'active' : 'undefined'}>
              <Link to='/memo' className="sidebar-a" onClick={()=> setActive('memo')}>Memo</Link>
            </li>
        }

        <li className={active === 'Files' ? 'active' : 'undefined'}>
          <a href='#' className="sidebar-a" onClick={()=> setActive('Files')}>Files</a>
        </li>
        <li className={active === 'Tasks' ? 'active' : 'undefined'}>
          <a href='#' className="sidebar-a" onClick={()=> setActive('Tasks')}>Tasks</a>
        </li>
      </ul>
    </nav>
  )
}

export default Side;