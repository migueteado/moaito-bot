import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlus, faSave, faToggleOff, faToggleOn } from '@fortawesome/free-solid-svg-icons';
import UserLevels from '../../lib/user-level';
import CommandType from '../../lib/command-type';
import axios from 'axios';
import { useEffect, useState } from 'react';
import PunishmentType from '../../lib/punishment-type';
import QuestionTooltip from '../question-tooltip';
import { alphabeticalSort } from '../../lib/utils';

function EditWordProtectionForm({ onToggleSlider, isSlided, showToast, access_token, user, wordProtection, handleAction }) {

  const [responseStatus, setResponseStatus] = useState(wordProtection.responseStatus);
  const [response, setResponse] = useState(wordProtection.response);
  const [userLevel, setUserLevel] = useState(wordProtection.userLevel || "moderator");
  const [blacklist, setBlacklist] = useState(wordProtection.blacklist && wordProtection.blacklist.length > 0 ? wordProtection.blacklist.split(",").sort(alphabeticalSort) : []);
  const [blacklistWord, setBlacklistWord] = useState("");

  useEffect(() => {
    setResponseStatus(wordProtection.responseStatus);
    setResponse(wordProtection.response);
    setUserLevel(wordProtection.userLevel || "moderator");
    setBlacklist(wordProtection.blacklist && wordProtection.blacklist.length > 0 ? wordProtection.blacklist.split(",").sort(alphabeticalSort) : []);
    setBlacklistWord("");
  }, [wordProtection]);

  const handleEditWordProtection = async (e) => {
    try {
      e.preventDefault();
      const { data, status } = await axios.put(`/api/mod-tools/word-protection/${wordProtection.id}`, {
        responseStatus: responseStatus,
        response: response,
        status: wordProtection.status,
        userLevel: userLevel,
        blacklist: blacklist,
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
        throw new Error("Unable to Edit Word Protection");
      }

      const updatedWordProtection = data;
      handleAction(updatedWordProtection, 'update');
      showToast('success', `Word Protection successfully updated`);
      handleSlider(e);
    } catch(error) {
      if(!error.message) {
        showToast('error', `Unable to update Word Protection`);
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

  const handleBlacklistWordChange = (e) => {
    setBlacklistWord(e.target.value.replace(/[^0-9a-zA-Z]/g, ''));
  }

  const handleAddBlacklistWord = (e) => {
    e.preventDefault();
    if(!!blacklistWord && !blacklist.includes(blacklistWord)) {
      setBlacklist(prevBlacklist => ([...prevBlacklist, blacklistWord].sort(alphabeticalSort)));
      setBlacklistWord("");
    } else {
      setBlacklistWord("");
    }
  }

  const removeBlacklistWord = (e) => {
    e.preventDefault();
    setBlacklist(blacklist.filter(a => a !== e.target.closest('button').value));
  }

  const listBlacklist = blacklist.map((word, index) => 
    <div className="bg-gray-800 text-white rounded-lg py-1 px-3 mr-1 mb-1 text-sm flex" key={word}>
      <div className="mr-2">{word}</div>
      <button onClick={removeBlacklistWord} value={word}>
        <FontAwesomeIcon className="h-5 w-5 text-red-500" icon={faTimes}></FontAwesomeIcon>
      </button>
    </div>
  );

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
            <div className="text-lg font-semibold">Word Protection</div>
            <button onClick={handleSlider} className="">
              <FontAwesomeIcon className="h-5 w-5" icon={faTimes}></FontAwesomeIcon>
            </button>
        </div>
        <div className="flex flex-grow flex-col h-full overflow-auto pb-14 px-6">
          <form onSubmit={handleEditWordProtection}>
            <div className="grid grid-cols-1 gap-6 mb-6">
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
            </div>
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
            <div className="grid grid-cols-1 gap-6 mb-6">
              <div className="relative w-full">
                <label className="relative text-sm font-semibold" htmlFor="">Blacklist
                  <QuestionTooltip content={"Include your prohibited words."}/>
                </label>
                <div className="flex flex-row mb-2">
                  <input className="mt-2 px-3 py-1 bg-gray-900 border border-gray-800 rounded-tl-lg rounded-bl-lg w-full outline-none bg-gray-900 text-gray-200 flex-grow" type="text" placeholder="word to blacklist" name="alias" id="alias" onChange={handleBlacklistWordChange} value={blacklistWord}/>
                  <button onClick={handleAddBlacklistWord} className="mt-2 pt-1 px-3 border border-l-0 border-gray-800 text-blue-500 rounded-tr-lg rounded-br-lg hover:bg-gray-800 transition-all duration-500 font-semibold">
                    <FontAwesomeIcon className="h-5 w-5" icon={faPlus}></FontAwesomeIcon>
                  </button>
                </div>
                <div className="flex flex-row flex-wrap">
                  {listBlacklist}
                </div>
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

export default EditWordProtectionForm;