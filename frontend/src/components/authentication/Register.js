import { useRef, useState, useEffect } from "react";
import Tilt from 'react-parallax-tilt';
import { useNavigate, useLocation } from "react-router-dom";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import usePasswordToggle from "../../hooks/usePasswordToggle";
import useGetFromApi from '../../hooks/useGetFromApi';
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Load from "../helpers/Load";

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[0-9])(?=.*[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]).{8,24}$/;
const NAME_REGEX = /^[a-zA-Z .'-]+$/
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])*$/
const REGISTER_URL = '/users/register/'

const Register =()=> {
  const userRef = useRef();
  const errRef = useRef();

  const navigate = useNavigate();
  const location = useLocation();
  const deptUrl = '/users/get-department/' 
  const [userDepartment, setUserDepartment] = useState(0);
  const axiosPrivate = useAxiosPrivate();

  const [passwordInputType, passwordToggleIcon] = usePasswordToggle();
  const [confirmPasswordType, confirmPasswordIcon] = usePasswordToggle();

  const [user, setUser] = useState('')
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [email, setEmail] = useState('')
  const [validMail, setValidMail] = useState(false)
  const [emailFocus, setEmailFocus] = useState(false);

  const [firstName, setFirstName] = useState('')
  const [validFirstName, setValidFirstName] = useState(false)
  const [firstNameFocus, setFirstNameFocus] = useState(false)

  const [lastName, setLastName] = useState('')
  const [validLastName, setValidLastName] = useState(false)
  const [lastNameFocus, setLastNameFocus] = useState(false)

  const [pwd, setPwd] = useState('');
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState('');
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState('')
  const [success, setSuccess] = useState(false)

  const {items, loading, error} = useGetFromApi(deptUrl);

  const clearFormFields =() => {
    setUser('');
    setEmail('');
    setFirstName('');
    setLastName('');
    setPwd('');
    setMatchPwd('');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v1 = USER_REGEX.test(user)
    const v2 = PWD_REGEX.test(pwd)
    const v3 = EMAIL_REGEX.test(email)
    const v4 = NAME_REGEX.test(firstName)
    const v5 = NAME_REGEX.test(lastName)

    if (!v1 || !v2 || !v3 || !v4 || ! v5){
      setErrMsg('Invalid Entry');
      return;
    }
    if (userDepartment == 0){
      setErrMsg('Select a Department');
      return;
    };

    try {
      const response = await axiosPrivate.post(REGISTER_URL, 
        JSON.stringify({
          username: user,
          email: email,
          first_name: firstName,
          last_name: lastName,
          department: userDepartment,
          password: pwd
        }))
      if (response.status === 201){
        clearFormFields();
        setSuccess(true);
      }
    } catch (error) {
      if (!error?.response) {
        setErrMsg('No Server Response');
      } else if (error.response?.status === 401) {
        setErrMsg('Unauthorized')
      } else {
        setErrMsg('Registration Failed')
        navigate('/login', { state: {from: location}, replace: true})
      }
      errRef.current.focus()
    }
  }


  useEffect(() => {
    userRef.current.focus();
  }, [])

  useEffect(()=> {
    const result = USER_REGEX.test(user);
    setValidName(result);
  }, [user])

  useEffect(()=> {
    const result = EMAIL_REGEX.test(email);
    setValidMail(result);
  }, [email])

  useEffect(() => {
    const firstNameResult = NAME_REGEX.test(firstName)
    const lastNameResult = NAME_REGEX.test(lastName)
    setValidFirstName(firstNameResult)
    setValidLastName(lastNameResult)
  }, [firstName, lastName])

  useEffect(()=> {
    const result = PWD_REGEX.test(pwd);
    setValidPwd(result)
    const match = pwd === matchPwd;
    setValidMatch(match);
  }, [pwd, matchPwd])

  useEffect(() => {
    setErrMsg('');
  }, [user, pwd, matchPwd])

  return (
    <>
      <section className="bg-gray-900 h-screen w-screen relative overflow-hidden flex flex-col justify-center items-center">
        <div className="h-40-r w-40-r bg-gradient-to-r from-blue-400 to-green-500 rounded-full absolute left-2/3 -top-56 animate-pulse"></div>
        <div className="h-35-r w-35-r bg-gradient-to-r from-red-600 via-pink-500 to-purple-500 rounded-full absolute top-96 -left-0 animate-pulse"></div>
        <Tilt>
          <div className="container w-96 bg-white bg-opacity-10 relative z-2 rounded-2xl shadow-5xl border border-r-0 border-b-0 border-opacity-30 backdrop-filter backdrop-blur-sm">
            {
              success ?
              <div className="p-6">
                <h1 className="text-5xl font-semibold text-white">Registration Successful</h1>
              </div>
              : (
              <form onSubmit={handleSubmit} className="h-full flex flex-col justify-evenly items-center p-4">
                <h2 className="font-poppins text-white text-4xl tracking-wider mb-4">Register</h2>
                <p ref={errRef} className={errMsg ? 'text-2xl text-white font-semibold': 'hidden'} aria-live='assertive'>{errMsg}</p>
                <div className="flex items-center w-full">
                  <span className={validName ? 'valid text-green-500': 'hidden'}>
                    <FontAwesomeIcon icon={faCheck} />
                  </span>
                  <span className={validName || !user ? 'hidden': 'invalid text-red-500'}>
                    <FontAwesomeIcon icon={faTimes} />
                  </span>
                  <input 
                    type='text' 
                    placeholder="Username" 
                    className="auth-input-text"
                    ref={userRef}
                    onChange={(e) => setUser(e.target.value)}
                    onFocus={() => setUserFocus(true)}
                    onBlur={() => setUserFocus(false)}
                    aria-describedby = 'uidnote'
                    required
                  />
                </div>
                <p id="uidnote" className={userFocus && user && !validName ? 'instructions text-blue-500': 'hidden'}>
                  <FontAwesomeIcon icon={faInfoCircle} />
                  &nbsp; 4 to 24 characters. &nbsp; Must begin with a letter. <br />
                  Letters, numbers, underscores, hyphens allowed.
                </p>

                <div className="w-full flex items-center">
                  <span className={validMail ? 'valid text-green-500': 'hidden'}>
                    <FontAwesomeIcon icon={faCheck} />
                  </span>
                  <span className={validMail || !email ? 'hidden': 'invalid text-red-500'}>
                    <FontAwesomeIcon icon={faTimes} />
                  </span>
                  <input 
                    type='email' 
                    placeholder="Email"
                    autoComplete="off" 
                    className="auth-input-text"
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setEmailFocus(true)}
                    onBlur={() => setEmailFocus(false)}
                    aria-describedby = 'emailnote'
                    required 
                  />
                </div>
                <p id="emailnote" className={emailFocus && email && !validMail ? 'instruct text-blue-500' : 'hidden'}>
                  <FontAwesomeIcon icon={faInfoCircle} />
                  &nbsp; Please input a correct email. <br />
                </p>

                <div className="w-full flex items-center">
                  <span className={validFirstName ? 'valid text-green-500': 'hidden'}>
                    <FontAwesomeIcon icon={faCheck} />
                  </span>
                  <span className={validFirstName || !firstName ? 'hidden': 'invalid text-red-500'}>
                    <FontAwesomeIcon icon={faTimes} />
                  </span>
                  <input 
                    type='text'
                    autoComplete="off"
                    placeholder="First Name" 
                    className="auth-input-text"
                    onChange={(e) => setFirstName(e.target.value)}
                    onFocus={() => setFirstNameFocus(true)}
                    onBlur={() => setFirstNameFocus(false)}
                    aria-describedby = 'firstnamenote'
                    required
                  />
                </div>
                <p id="firstnamenote" className={firstNameFocus && firstName && !validFirstName ? 'instruct text-blue-500' : 'hidden'}>
                  <FontAwesomeIcon icon={faInfoCircle} />
                  &nbsp; Must begin with a leter. <br />
                </p>

                <div className="w-full flex items-center">
                  <span className={validLastName ? 'valid text-green-500': 'hidden'}>
                    <FontAwesomeIcon icon={faCheck} />
                  </span>
                  <span className={validLastName || !lastName ? 'hidden': 'invalid text-red-500'}>
                    <FontAwesomeIcon icon={faTimes} />
                  </span>
                  <input 
                    type='text' 
                    placeholder="Last Name"
                    autoComplete="off"
                    className="auth-input-text"
                    onChange={(e) => setLastName(e.target.value)}
                    onFocus={() => setLastNameFocus(true)}
                    onBlur={() => setLastNameFocus(false)}
                    aria-describedby = 'lastnamenote'
                    required
                  />
                </div>
                <p id="lastnamenote" className={lastNameFocus && lastName && !validLastName ? 'instruct text-blue-500' : 'hidden'}>
                  <FontAwesomeIcon icon={faInfoCircle} />
                  &nbsp; Must begin with a leter. <br />
                </p>

                
                {loading ? 
                  <Load />
                  :
                  error ? 
                  <p>Can't get Departments now</p>
                  :
                  <div className="flex w-full items-center">
                    <select value={userDepartment} onChange={(e) => setUserDepartment(e.target.value)} className="auth-input-text">
                      <option selected hidden>Department</option>
                      {
                        items.map((dept, index) => (
                          <option key={index} value={dept.id}>{dept.name}</option>
                        ))
                      }
                    </select>
                  </div>
                }
                  

                <div className="flex w-full items-center">
                  <span className={validPwd ? 'valid text-green-500': 'hidden'}>
                    <FontAwesomeIcon icon={faCheck} />
                  </span>
                  <span className={validPwd || !pwd ? 'hidden': 'invalid text-red-500'}>
                    <FontAwesomeIcon icon={faTimes} />
                  </span>

                  <input 
                    type={passwordInputType} 
                    placeholder="Password" 
                    className="auth-input-text"
                    onChange={(e) => setPwd(e.target.value)}
                    onFocus={() => setPwdFocus(true)}
                    onBlur={() => setPwdFocus(false)}
                    aria-describedby='pwd-note'
                    required 
                  />
                  <span className="cursor-pointer">{passwordToggleIcon}</span>
                </div>
                <p id="pwd-note" className={pwdFocus && !validPwd ? 'instructions text-blue-500' : 'hidden'}>
                  <FontAwesomeIcon icon={faInfoCircle} />
                  &nbsp; 8 to 24 characters. <br />
                  Must include letters, a number and a special character. <br />
                </p>

                <div className="flex items-center w-full">
                  <span className={validMatch && matchPwd ? 'valid text-green-500': 'hidden'}>
                    <FontAwesomeIcon icon={faCheck} />
                  </span>
                  <span className={validMatch || !matchPwd ? 'hidden': 'invalid text-red-500'}>
                    <FontAwesomeIcon icon={faTimes} />
                  </span>
                  <input 
                    type={confirmPasswordType} 
                    placeholder="Confirm Password"
                    onChange={(e) => setMatchPwd(e.target.value)}
                    aria-invalid={validMatch? 'false' : 'true'}
                    onFocus={()=> setMatchFocus(true)}
                    onBlur={()=> setMatchFocus(false)}
                    className="auth-input-text" 
                    aria-describedby='match-note'
                    required 
                  />
                  <span className="cursor-pointer">{confirmPasswordIcon}</span>
                </div>
                <p id="match-note" className={matchFocus && !validMatch ? 'instructions text-blue-500' : 'hidden'}>
                  <FontAwesomeIcon icon={faInfoCircle} />
                  &nbsp; Must match the first password.
                </p>
                <button 
                  type='submit'
                  className='font-poppins cursor-pointer px-5 py-1 rounded-full mb-5 mt-4 bg-white bg-opacity-50 hover:bg-opacity-80' 
                  disabled = {
                    !validFirstName && !validLastName && !validMail && !validMatch && !validPwd && !validName
                    ? true : false
                  }
                > Sign Up </button>
              </form>
              )
            }
          </div>
        </Tilt>
      </section>

    </>
  )
}

export default Register;