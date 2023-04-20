import { useRef, useState, useEffect } from 'react';
import Tilt from 'react-parallax-tilt';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from '../../api/axios';
import useAuth from '../../hooks/useAuth';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import usePasswordToggle from "../../hooks/usePasswordToggle";

const LOGIN_URL = '/users/token/'

const Login = () => {
  const { setAuth, persist, setPersist } = useAuth();
  
  const navigate = useNavigate();
  const location = useLocation();
  const axiosPrivate = useAxiosPrivate();
  const from = location?.state?.from?.pathname || '/';

  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('')
  const [errMsg, setErrMsg] = useState('')

  const [passwordInputType, passwordToggleIcon] = usePasswordToggle();

  useEffect(() => {
    userRef.current.focus();
  }, [])

  useEffect(() => {
    setErrMsg('')
  }, [user, pwd])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(LOGIN_URL, 
        JSON.stringify({username: user, password: pwd}), 
        {
          headers: {'Content-Type': 'application/json'},
          withCredentials: true
        });
        const accessToken = response?.data?.access
        setAuth({ user, accessToken})
        setUser('')
        setPwd('');

        const details = await axiosPrivate('/users/details/')
        localStorage.setItem('userEmail', details?.data[0]?.email)
        localStorage.setItem('userDept', details?.data[0]?.department?.name)
        localStorage.setItem('userIsGm', details?.data[0]?.is_gm)
        localStorage.setItem('userIsHod', details?.data[0]?.is_hod)
        navigate(from, { replace: true });
        
    } catch (error) {
      if (!error?.response) {
        setErrMsg(' No Server Response');
      } else if (error.response?.status === 400) {
        setErrMsg('Wrong Username or Password')
        console.log(error)
      } else if (error.response?.status === 401) {
        setErrMsg('Unauthorized')
      } else {
        setErrMsg('Login Failed')
        console.log(error)
      }

      errRef.current.focus()
    }
  }

  const togglePersist =()=>{
    setPersist(prev => !prev);
  }

  useEffect(()=> {
    localStorage.setItem('persist', persist)
  }, [persist])

  return (
    <section className="bg-gray-900 h-screen w-screen relative overflow-hidden flex flex-col justify-center items-center">
      <div className="h-40-r w-40-r bg-gradient-to-r from-blue-400 to-green-500 rounded-full absolute left-2/3 -top-56 animate-pulse"></div>
      <div className="h-35-r w-35-r bg-gradient-to-r from-red-600 via-pink-500 to-purple-500 rounded-full absolute top-96 -left-0 animate-pulse"></div>
      <Tilt>
        <div className="container w-96 bg-white bg-opacity-10 relative z-2 rounded-2xl shadow-5xl border border-r-0 border-b-0 border-opacity-30 backdrop-filter backdrop-blur-sm">
          <p ref={errRef} className={errMsg ? 'text-center text-xl text-red-400' : 'hidden'} aria-live='assertive'>{errMsg}</p>
          <form onSubmit={handleSubmit} className="h-full flex flex-col justify-evenly items-center p-4">
            <h2 className="font-poppins text-white text-4xl tracking-wider mb-4">Login</h2>

            <div className="flex items-center w-full">
              <input 
                type='text' 
                placeholder="Username" 
                className="auth-input-text"
                ref={userRef}
                onChange={(e) => setUser(e.target.value)}
                value={user}
                required
              />
            </div>

            <div className="flex items-center w-full">
              <input 
                type={passwordInputType}
                placeholder="Password" 
                className="auth-input-text"
                onChange={(e) => setPwd(e.target.value)}
                value={pwd}
                required
              />
              <span className="cursor-pointer">{passwordToggleIcon}</span>
            </div>

            <button 
              type='submit'
              className='font-poppins cursor-pointer px-5 py-1 rounded-full mb-5 mt-4 bg-white bg-opacity-50 hover:bg-opacity-80'
            >Sign In</button>

            <div className='auth-input-text'>
              <input type='checkbox' id='persist' onChange={togglePersist} checked={persist} />
              <label htmlFor='persist' className='mx-4'>Keep me signed in</label>
            </div>
          </form>
        </div>
      </Tilt>

    </section>
  )
}

export default Login