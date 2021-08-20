import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faClock, faTrash, faPen, faToggleOn, faToggleOff, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify'
import { getUser } from "../../../../lib/user";
import Footer from '../../../../components/footer';
import Sidebar from '../../../../components/sidebar';
import { useState } from "react";
import Topbar from "../../../../components/topbar";
import NewTimerForm from "../../../../components/timers/new-timer-form";
import axios from 'axios';
import EditTimerForm from '../../../../components/timers/edit-timer-form';
import { getTimers } from '../../../../lib/timer';

function Timers({ user, timers, access_token }) {
  const [isToggled, setToggle] = useState(false);
  const [isNewSlided, setNewSlided] = useState(false);
  const [isEditSlided, setEditSlided] = useState(false);
  const [userTimers, setUserTimers] = useState(timers);
  const [editableTimer, setEditableTimer] = useState(userTimers[0] || {});

  const showToast = ( status, message) => {
    switch(status){
      case 'success':
        toast.success(message, {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        break;
      case 'error':
        toast.error(message, {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        break;
      case 'info':
        toast.info(message, {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        break;
      default:
        toast.dark(message, {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        break;
    }
  } 

  const handleToggler = () => {
    setToggle(!isToggled);
  }

  const handleNewSlideOver = () => {
    setNewSlided(!isNewSlided);
    if(!isNewSlided) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }

  const handleEditSlideOver = () => {
    setEditSlided(!isEditSlided);
    if(!isEditSlided) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }

  const handleTimerAction = (timer, action) => {
    switch(action) {
      case 'create':
        let userTimersCreate = userTimers;
        userTimersCreate.push(timer);
        userTimersCreate.sort((timer1, timer2) => {
          const v1 = timer1.name.toUpperCase();
          const v2 = timer2.name.toUpperCase();
          if(v1 < v2) return -1;
          if(v1 > v2) return 1;
          return 0;
        });
        setUserTimers(userTimersCreate);
        break;
      case 'update':
        let userTimersUpdate = userTimers.filter(c => c.id !== timer.id);
        userTimersUpdate.push(timer);
        userTimersUpdate.sort((timer1, timer2) => {
          const v1 = timer1.name.toUpperCase();
          const v2 = timer2.name.toUpperCase();
          if(v1 < v2) return -1;
          if(v1 > v2) return 1;
          return 0;
        });
        setUserTimers(userTimersUpdate);
        break;
      case 'delete':
        const userTimersDelete = userTimers.filter(c => c.id !== timer.id);
        setUserTimers(userTimersDelete);
        break;
      default:
        break;
    }
  }

  const handleAddTimer = () => {
    handleNewSlideOver();
  }

  const handleEditTimer = (e) => {
    const timerId = e.target.closest('button').getAttribute('timer-id');
    const currentTimer = userTimers.find(uc => uc.id === timerId);
    setEditableTimer(currentTimer);
    handleEditSlideOver();
  }

  const handleChangeTimerStatus = async (e) => {
    try {
      e.preventDefault();
      const timerId = e.target.closest('button').getAttribute('timer-id');
      const currentTimer = userTimers.find(uc => uc.id === timerId);
      const { data, status } = await axios.put(`/api/timer/${timerId}`,{
        status: (currentTimer.status === "on" ? "off" : "on")
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`
        }
      }).then(res => res).catch(error => error.response);

      if(status !== 200) {
        throw new Error("Unable to Update command");
      }

      const timer = data;
      handleTimerAction(timer, 'update');
      showToast('success', `Timer ${timer.name} successfully updated`);
    } catch (error) {
      if(!error.message) {
        showToast('error', `Unable to update timer`);
      }
      showToast('error', error.message);
    }
  }

  const handleDeleteTimer = async (e) => {
    try {
      e.preventDefault();
      const timerId = e.target.closest('button').getAttribute('timer-id');
      const { data, status } = await axios.delete(`/api/timer/${timerId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`
        }
      }).then(res => res).catch(error => error.response);

      if(status !== 200) {
        throw new Error("Unable to Delete timer");
      }

      const timer = userTimers.find(uc => uc.id === timerId);
      handleTimerAction(timer, 'delete');
      showToast('success', `Timer ${timer.name} successfully deleted`);
    } catch(error) {
      console.log(error);
      showToast('error', `Unable to delete timer`);
    }
  }

  const listTimers = userTimers.map((timer, index) => 
    <div className="flex flex-col justify-between rounded-lg p-5 text-white hover:shadow-xl bg-gray-800" key={timer.id}>
      <div className="flex flex-col justify-between md:flex-row">
        <div>
          <div className="text-white font-bold text-lg">{timer.name}</div>
          <div className="text-gray-500">{timer.message}</div>
        </div>
        <div className="md:text-right flex flex-row md:flex-col justify-start md:justify-start items-center md:items-end pt-4 md:pt-0 text-gray-500">
          <div className="flex items-center mr-4 md:mr-0">
            <FontAwesomeIcon className="h-5 w-5 mr-2 inline-block" icon={faClock}></FontAwesomeIcon>
            {timer.interval}
          </div>
          <div className="flex items-center">
            <FontAwesomeIcon className="h-5 w-5 mr-2 inline-block" icon={faComment}></FontAwesomeIcon>
            {timer.chatMessages}
          </div>
        </div>
      </div>
      <div className="pt-4 rounded-b-lg text-white flex flex-row justify-end md:justify-start">
        <button onClick={handleChangeTimerStatus} className="text-gray-400 hover:text-gray-500 px-3 transition-all duration-500" timer-id={timer.id}>
          {
            timer.status === "on" ?
              <FontAwesomeIcon className="h-5 w-5 inline-block text-green-600" icon={faToggleOn}></FontAwesomeIcon>
            :
              <FontAwesomeIcon className="h-5 w-5 inline-block text-gray-600" icon={faToggleOff}></FontAwesomeIcon>
          }
        </button>
        <button onClick={handleEditTimer} className="text-blue-400 hover:text-blue-500 px-3 transition-all" timer-id={timer.id}><FontAwesomeIcon className="h-5 w-5 inline-block" icon={faPen}></FontAwesomeIcon></button>
        <button onClick={handleDeleteTimer} className="text-red-600 hover:text-red-700 px-3 transition-all" timer-id={timer.id}><FontAwesomeIcon className="h-5 w-5 inline-block" icon={faTrash}></FontAwesomeIcon></button>
      </div>
    </div>
  );

  return (
    <>
      <div className="relative min-h-screen max-h-screen md:flex bg-gray-900">
        <Topbar onToggleMenu={handleToggler} isToggled={ isToggled } />
        <Sidebar user={ user } isToggled={ isToggled } />
        <div className="relative w-full h-full overflow-auto max-h-screen ">
          <div className="px-9 py-28 md:py-20">
            <div className="mb-10">
              <h1 className="text-2xl text-gray-200 font-bold">Timers</h1>
              <h6 className="font-semibold text-gray-400">Message that are shown in specified periods of time</h6>
            </div>
            <div className="py-4 px-2 text-white text-right font-bold">
              {userTimers.length + " timers"} 
            </div>
            <div className="flex">
              {
                  timers.length > 0 ? 
                  <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {listTimers}
                  </div>
                  :
                  <div className="w-full">
                    <h3 className="font-semibold text-gray-600 text-center text-2xl mb-12 max-w-4xl mx-auto px-8">There are no timers here</h3>
                  </div>
              }
            </div>
          </div>
          <Footer />
        </div>
        <div className="fixed right-6 bottom-0 pt-4 pb-8">
          <button onClick={handleAddTimer} className="bg-green-500 hover:bg-green-600 text-white group flex rounded-full items-center px-4 py-4 text-2xl shadow-lg hover:shadow-xl ring-green-500 focus:ring-4 ring-opacity-50 transition-all">
            <FontAwesomeIcon className="h-5 w-5" icon={faPlus}></FontAwesomeIcon>
          </button>
        </div>
      </div>
      <NewTimerForm onToggleSlider={handleNewSlideOver} isSlided={isNewSlided} handleTimerAction={handleTimerAction} showToast={showToast} access_token={access_token} user={user}/>
      <EditTimerForm onToggleSlider={handleEditSlideOver} isSlided={isEditSlided} handleTimerAction={handleTimerAction} showToast={showToast} access_token={access_token} user={user} editableTimer={editableTimer}/>
    </>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;
  const { cookies } = req;
  const { access_token } = cookies;
  const user = await getUser(context);
  const timers = await getTimers(context);

  timers.sort((timer1, timer2) => {
    const v1 = timer1.name.toUpperCase();
    const v2 = timer2.name.toUpperCase();
    if(v1 < v2) return -1;
    if(v1 > v2) return 1;
    return 0;
  });

  if(!user) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  return {
    props: {
      user,
      timers,
      access_token,
    }
  }
}

export default Timers;