import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlus, faSave, faToggleOff, faToggleOn } from '@fortawesome/free-solid-svg-icons';
import UserLevels from '../../lib/user-level';
import CommandType from '../../lib/command-type';
import axios from 'axios';
import { useEffect, useState } from 'react';
import PunishmentType from '../../lib/punishment-type';
import QuestionTooltip from '../question-tooltip';

function EditCapsProtectionForm({ onToggleSlider, isSlided, showToast, access_token, user, capsProtection, handleAction }) {

  const [min, setMin] = useState(capsProtection.min);
  const [max, setMax] = useState(capsProtection.max);
  const [responseStatus, setResponseStatus] = useState(capsProtection.responseStatus);
  const [response, setResponse] = useState(capsProtection.response);
  const [punishmentTime, setPunishmentTime] = useState(capsProtection.punishmentTime);
  const [punishment, setPunishment] = useState(capsProtection.punishment);
  const [userLevel, setUserLevel] = useState(capsProtection.userLevel || "moderator");

  useEffect(() => {
    setMin(capsProtection.min);
    setMax(capsProtection.max);
    setResponseStatus(capsProtection.responseStatus);
    setResponse(capsProtection.response);
    setPunishmentTime(capsProtection.punishmentTime);
    setPunishment(capsProtection.punishment);
    setUserLevel(capsProtection.userLevel || "moderator");
  }, [capsProtection]);

  const handleEditCapsProtection = async (e) => {
    try {
      e.preventDefault();
      const { data, status } = await axios.put(`/api/mod-tools/caps-protection/${capsProtection.id}`, {
        min: min,
        max: max,
        responseStatus: responseStatus,
        response: response,
        punishmentTime: punishmentTime,
        punishmentType: punishment,
        status: capsProtection.status,
        userLevel: userLevel,
        userId: user.id,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`
        }
      }).then(res => res).catch(error => {
        console.log(error.response);
        return error.response;
      });

      if(!(status === 204 || status === 201 || status === 200)) {
        throw new Error("Unable to Edit Caps Protection");
      }

      const updatedCapsProtection = data;
      handleAction(updatedCapsProtection, 'update');
      showToast('success', `Caps Protection successfully updated`);
      handleSlider(e);
    } catch(error) {
      if(!error.message) {
        showToast('error', `Unable to update Caps Protection`);
      }
      showToast('error', error.message);
    }
  }

  const handleSlider = (e) => {
    e.preventDefault();
    onToggleSlider(!isSlided);
  }  

  const handleResponseStatusChange = (e) => {
    e.preventDefault();
    if(responseStatus === "on") {
      setResponseStatus("off");
    } else {
      setResponseStatus("on");
    }
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
            <div className="text-lg font-semibold">Caps Protection</div>
            <button onClick={handleSlider} className="">
              <FontAwesomeIcon className="h-5 w-5" icon={faTimes}></FontAwesomeIcon>
            </button>
        </div>
        <div className="flex flex-grow flex-col h-full overflow-auto pb-14 px-6">
          <form onSubmit={handleEditCapsProtection}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="relative w-full">
                <label className="relative text-sm font-semibold" htmlFor="">
                  Automatic Permition
                  <QuestionTooltip content={"Users in this level and above won't be punished"}/>
                </label>
                <select className="mt-2 px-3 py-1 bg-gray-900 border border-gray-800 rounded-lg w-full outline-none bg-gray-900 text-gray-200 appearance-none" name="user-level" id="userLevel" onChange={e => setUserLevel(e.target.value)} value={userLevel}>
                  {
                    UserLevels.map(ul => <option value={ul.toLowerCase()} key={ul}>{ul}</option>)
                  }
                </select>
              </div>
              <div className="relative w-full">
                <label className="relative text-sm font-semibold" htmlFor="">Punishment</label>
                <select className="mt-2 px-3 py-1 bg-gray-900 border border-gray-800 rounded-lg w-full outline-none bg-gray-900 text-gray-200 appearance-none" name="punishment" id="punishment" onChange={e => setPunishment(e.target.value)}  value={punishment}>
                  {
                    PunishmentType.map(pt => <option value={pt.toLowerCase()} key={pt}>{pt}</option>)
                  }
                </select>
              </div>
            </div>
              {
                punishment === "timeout" ?
                  <div className="grid grid-cols-1 gap-6 mb-6">
                    <div className="relative w-full">
                      <label className="relative text-sm font-semibold" htmlFor="">Punishment Time</label>
                      <input className="mt-2 px-3 py-1 bg-gray-900 border border-gray-800 rounded-lg w-full outline-none bg-gray-900 text-gray-200" type="number" name="punishment-time" onChange={e => setPunishmentTime(parseInt(e.target.value))} value={punishmentTime} placeholder="30" />
                    </div>
                  </div>
                :
                  ""
              }
            <div className="grid grid-cols-1 gap-6 mb-6">
              <div className="relative w-full">
                <label className="relative text-sm font-semibold" htmlFor="">Response
                  <QuestionTooltip content={"Response to send when a user breaks this rule."}/>
                </label>
                <div className="flex flex-row">
                  <button className="flex items-center mt-2 px-3 border border-r-0 border-gray-800 text-gray-400 hover:text-gray-500 rounded-tl-lg rounded-bl-lg transition-all duration-500 font-semibold flex-grow-0" onClick={handleResponseStatusChange}>
                    {
                      responseStatus === "on" ?
                        <FontAwesomeIcon className="h-5 w-5 inline-block text-green-600" icon={faToggleOn}></FontAwesomeIcon>
                      :
                        <FontAwesomeIcon className="h-5 w-5 inline-block text-gray-600" icon={faToggleOff}></FontAwesomeIcon>
                    }
                  </button>
                  <input className="mt-2 px-3 py-1 bg-gray-900 border border-gray-800 rounded-tr-lg rounded-br-lg w-full outline-none bg-gray-900 text-gray-200 flex-grow" type="text" name="response" value={response} onChange={e => setResponse(e.target.value)}/>
                </div>
                
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="relative w-full">
                <label className="relative text-sm font-semibold" htmlFor="">
                  Min
                  <QuestionTooltip content={"Minimum amount of caps to start detecting."}/>
                </label>
                <input className="mt-2 px-3 py-1 bg-gray-900 border border-gray-800 rounded-lg w-full outline-none bg-gray-900 text-gray-200" type="number" name="min" onChange={e => setMin(parseInt(e.target.value))} value={min} placeholder="30" />
              </div>
              <div className="relative w-full">
                <label className="relative text-sm font-semibold" htmlFor="">
                  Max
                  <QuestionTooltip content={"Maximum amount of caps permited."}/>
                </label>
                <input className="mt-2 px-3 py-1 bg-gray-900 border border-gray-800 rounded-lg w-full outline-none bg-gray-900 text-gray-200" type="number" name="max" onChange={e => setMax(parseInt(e.target.value))} value={max} placeholder="30" />
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

export default EditCapsProtectionForm;