import { useState } from 'react';
import { faSignOut, faUser } from '@fortawesome/free-solid-svg-icons';
import DefaultUser from '../../asset/images/defaultuser.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useClickOutsideToClose from '../../hooks/useClickOutsideToClose';
import useLogout from '../../hooks/useLogout';
import { useNavigate } from 'react-router-dom';

const Header = ({title}) => {
  const UserList = [
    {title: 'Profile', icon: faUser },
    {title: 'Logout', icon: faSignOut},
    {title: 'Logout', icon: faSignOut}
  ]
  const logout = useLogout();
  const navigate = useNavigate();

  const [showOptions, setShowOptions] = useState(false);
  const handleClick = () => {
    setShowOptions(!showOptions)
  }
  
  let domNode = useClickOutsideToClose(() => {
    setShowOptions(false);
  })

  const signOut = async ()=> {
    await logout();
    localStorage.clear();
    navigate('/login');
  }

  return (
    <>
      <header className="px-9 py-9 flex justify-between items-center">
        <h1 className="font-semibold text-2xl">{title}</h1>
        <div>
          <img
            id='menu-button' 
            src={DefaultUser}
            className='inline-flex justify-center'
            width='40' height={40}
            onClick={handleClick}
          />
        </div>
      </header>

      {showOptions && (
        <div className='dropdown-menu' 
          role='menu'
          ref={domNode}
          aria-orientation="vertical" 
          aria-labelledby="menu-button" 
          tabIndex="-1"
        >
          <ul className='py-1' role='none'>
            {UserList.map((menu, index) => (
              <li 
                key={index} 
                className='block px-4 py-2 hover:bg-sky-100' 
                role='menuitem'
                tabIndex='-1'
                onClick={menu.title==='Logout' && signOut}
              >
                <FontAwesomeIcon icon={menu.icon} className='mr-3' />
                {menu.title}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}

export default Header;