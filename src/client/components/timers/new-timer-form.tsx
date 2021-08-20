import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useState } from 'react';

function NewTimerForm({ onToggleSlider, isSlided, showToast, handleTimerAction, access_token, user }) {

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [interval, setInterval] = useState(5);
  const [chatMessages, setChatMessages] = useState(0);

  const handleCreateTimer = async (e) => {
    try {
      e.preventDefault();
      const { data, status } = await axios.post(`/api/timer`, {
        name: name,
        message: message,
        interval: interval,
        chatMessages: chatMessages,
        userId: user.id,
        status: "on"
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`
        }
      }).then(res => res).catch(error => error.response);

      if(!(status === 201 || status === 200)) {
        throw new Error("Unable to Create timer");
      }

      setName("");
      setMessage("");
      setInterval(5);
      setChatMessages(0);

      const newTimer = data;
      handleTimerAction(newTimer, 'create');
      showToast('success', `Timer ${newTimer.name} successfully created`);
      handleSlider(e);
    } catch(error) {
      if(!error.message) {
        showToast('error', `Unable to update timer`);
      }
      showToast('error', error.message);
    }
  }

  const handleNameChange = (e) => {
    e.preventDefault();
    if(e.target.value.length > 20) return;

    setName(e.target.value);
  }

  const handleMessageChange = (e) => {
    e.preventDefault();
    if(e.target.value.length > 140) return;
    setMessage(e.target.value);
  }

  const handleSlider = (e) => {
    e.preventDefault();
    onToggleSlider(!isSlided);
  }

  return (
    <>
      {
        isSlided ? 
          <div className="fixed inset-0 min-h-screen min-w-screen z-20 bg-black bg-opacity-60 backdrop-filter backdrop-blur-sm"></div>
          :
          ""
      }
      <div className={ isSlided ? "flex flex-col fixed min-h-screen max-h-screen max-w-screen-md w-full top-0 right-0 z-30 border-l border-gray-800 bg-gray-900 text-white transform transition duration-500 ease-in-out shadow-2xl" : "flex flex-col fixed min-h-screen max-h-screen max-w-screen-md w-full top-0 right-0 z-20 border-l border-gray-800 bg-gray-900 text-white transform transition duration-500 ease-in-out translate-x-full" }>
        <div className="flex justify-between pb-5 pt-6 px-6">
            <div className="text-lg font-semibold">New Timer</div>
            <button onClick={handleSlider} className="">
              <FontAwesomeIcon className="h-5 w-5" icon={faTimes}></FontAwesomeIcon>
            </button>
        </div>
        <div className="flex flex-grow flex-col h-full overflow-auto pb-14 px-6">
          <form onSubmit={handleCreateTimer}>
          <div className="grid grid-cols-1 gap-6 mb-6">
              <div className="relative w-full">
                <label className="relative text-sm font-semibold" htmlFor="">Name *</label>
                <input className="mt-2 px-3 py-1 bg-gray-900 border border-gray-800 rounded-lg w-full outline-none bg-gray-900 text-gray-200" type="text" name="command" onChange={handleNameChange} value={name} placeholder="Happy Timer"/>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 mb-6">
              <div className="relative w-full">
                <label className="relative text-sm font-semibold" htmlFor="">Message *</label>
                <input className="mt-2 px-3 py-1 bg-gray-900 border border-gray-800 rounded-lg w-full outline-none bg-gray-900 text-gray-200" type="text" name="description" onChange={handleMessageChange} value={message} placeholder="It is time to be happy!"/>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="relative w-full">
                <label className="relative text-sm font-semibold" htmlFor="">Interval</label>
                <input className="mt-2 px-3 py-1 bg-gray-900 border border-gray-800 rounded-lg w-full outline-none bg-gray-900 text-gray-200" type="number" name="global-cooldown" onChange={e => setInterval(parseInt(e.target.value))} value={interval} placeholder="30" />
              </div>
              <div className="relative w-full">
                <label className="relative text-sm font-semibold" htmlFor="">ChatMessages</label>
                <input className="mt-2 px-3 py-1 bg-gray-900 border border-gray-800 rounded-lg w-full outline-none bg-gray-900 text-gray-200" type="number" name="global-cooldown" onChange={e => setChatMessages(parseInt(e.target.value))} value={chatMessages} placeholder="30" />
              </div>
            </div>
            <div className="flex flex-row justify-center md:justify-end pt-4">
              <button className="py-2 px-3 bg-green-500 rounded-lg hover:bg-green-600 transition-all duration-500 w-full md:w-auto flex flex-row items-center justify-center" type="submit">
                <FontAwesomeIcon className="h-5 w-5 mr-2" icon={faSave}></FontAwesomeIcon>
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default NewTimerForm;