import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import Register from './components/authentication/Register';
import Login from './components/authentication/Login';
import ApprovalMemo from './components/Layout/Approval';
import UserMemo from './components/Layout/UserMemo';
import Dashboard from './components/Layout/Dashboard';
import PersistLogin from './components/authentication/PersistLogin';
import { Route, Routes } from 'react-router-dom';
import RequireAuth from './components/authentication/RequireAuth';
import HodSpecificApproval from './components/Layout/Approval/HodSpecificApproval';


function App() {
  return (
    <main className="App">
      <div className='site-map'>
        <Routes>
          <Route path='/login' element={<Login />} />

          <Route element={<PersistLogin />}>
            <Route element={<RequireAuth />}>
              <Route path='/register' element={<Register />} />
            </Route>

            <Route element={<RequireAuth />}>
              <Route path='/' element={<Dashboard />} />
            </Route>
            <Route element={<RequireAuth />}>
              <Route path='/memo' element={<UserMemo />} />
            </Route>
            <Route element={<RequireAuth />}>
              <Route path='/approve-memo' element={<ApprovalMemo />} />
            </Route>
            <Route element={<RequireAuth />}>
              <Route path='/specific-memo' element={<HodSpecificApproval />} />
            </Route>


          </Route>

        </Routes>
      </div>
    </main>
  )
}

export default App;
