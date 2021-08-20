import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlus, faSave } from '@fortawesome/free-solid-svg-icons';
import UserLevels from '../../lib/user-level';
import CommandType from '../../lib/command-type';
import axios from 'axios';
import { useState } from 'react';

function NewCommandForm({ onToggleSlider, isSlided, showToast, handleCommandAction, access_token, user }) {

  const [command, setCommand] = useState("");
  const [description, setDescription] = useState("");
  const [response, setResponse] = useState([""]);
  const [globalCooldown, setGlobalCooldown] = useState(0);
  const [userCooldown, setUserCooldown] = useState(0);
  const [commandType, setCommandType] = useState("simple");
  const [userLevel, setUserLevel] = useState("all");
  const [aliases, setAliases] = useState([]);
  const [keywords, setKeywords] = useState([]);
  
  const [alias, setAlias] = useState("");
  const [keyword, setKeyword] = useState("");

  const handleCreateCommand = async (e) => {
    try {
      e.preventDefault();
      const { data, status } = await axios.post(`/api/custom-command`, {
        command: command,
        description: description,
        response: response,
        globalCooldown: globalCooldown,
        userCooldown: userCooldown,
        userId: user.id,
        commandType: commandType,
        userLevel: userLevel,
        aliases: aliases,
        keywords: keywords,
        status: "on"
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`
        }
      }).then(res => res).catch(error => error.response);

      if(!(status === 201 || status === 200)) {
        throw new Error("Unable to Create command");
      }

      setCommand("");
      setDescription("");
      setResponse([""]);
      setGlobalCooldown(0);
      setUserCooldown(0);
      setCommandType("simple");
      setUserLevel("all");
      setAliases([]);
      setKeywords([]);
      setAlias("");
      setKeyword("");

      const newCommand = data;
      handleCommandAction(newCommand, 'create');
      showToast('success', `Command ${newCommand.command} successfully created`);
      handleSlider(e);
    } catch(error) {
      if(!error.message) {
        showToast('error', `Unable to update command`);
      }
      showToast('error', error.message);
    }
  }

  const handleCommandChange = (e) => {
    e.preventDefault();
    if(e.target.value.length > 20) return;

    if(e.target.value.length === 0) {
      setCommand(e.target.value);
    } else if(e.target.value.length === 1) {
      const commandSign = e.target.value.substr(0,1);
      if(commandSign !== "!") return  
      setCommand(commandSign);
    } else {
      const commandSign = e.target.value.substr(0,1);
      let commandRest = e.target.value.substr(1);

      if(commandSign !== "!") return  
      commandRest = commandRest.replace(/[^0-9a-zA-Z]/g, '');
      setCommand(commandSign + commandRest);
    }
  }

  const handleDescriptionChange = (e) => {
    e.preventDefault();
    if(e.target.value.length > 100) return;
    setDescription(e.target.value);
  }

  const handleAliasChange = (e) => {
    e.preventDefault();
    if(e.target.value.length > 20) return;

    if(e.target.value.length === 0) {
      setAlias(e.target.value);
    } else if(e.target.value.length === 1) {
      const aliasSign = e.target.value.substr(0,1);
      if(aliasSign !== "!") return  
      setAlias(aliasSign);
    } else {
      const aliasSign = e.target.value.substr(0,1);
      let aliasRest = e.target.value.substr(1);

      if(aliasSign !== "!") return  
      aliasRest = aliasRest.replace(/[^0-9a-zA-Z]/g, '');
      setAlias(aliasSign + aliasRest);
    }
  }

  const handleKeywordChange = (e) => {
    setKeyword(e.target.value.replace(/[^0-9a-zA-Z]/g, ''));
  }

  const handleSlider = (e) => {
    e.preventDefault();
    onToggleSlider(!isSlided);
  }

  const handleAddAlias = (e) => {
    e.preventDefault();
    if(!!alias && alias.charAt(0) === "!" && !aliases.includes(alias)) {
      setAliases(prevAliases => ([...prevAliases, alias]));
      setAlias("");
    } else {
      setAlias("");
    }
  }

  const handleAddKeyword = (e) => {
    e.preventDefault();
    if(!!keyword && !keywords.includes(keyword)) {
      setKeywords(prevKeywords => ([...prevKeywords, keyword]));
      setKeyword("");
    } else {
      setKeyword("");
    }
  }

  const handleCommandTypeChange = (e) => {
    if(e.target.value === "simple") {
      setResponse(prevResponse => [prevResponse[0]])
    } else {
      setResponse(prevResponse => prevResponse);
    }
    setCommandType(e.target.value);
  }

  const handleResponseChange = (e, index) => {
    e.preventDefault();
    if(e.target.value.length > 500) return;

    setResponse(prevResponse => {
      prevResponse[index] = e.target.value;
      return [...prevResponse];
    });
  }

  const addResponse = (e) => {
    e.preventDefault();
    setResponse(prevResponse => [...prevResponse, ""]);
  }

  const removeResponse = (e, index) => {
    e.preventDefault();
    setResponse(prevResponse => {
      prevResponse.splice(index, 1);
      return [...prevResponse];
    });
  }

  const removeAlias = (e) => {
    e.preventDefault();
    setAliases(aliases.filter(a => a !== e.target.closest('button').value));
  }

  const removeKeyword = (e) => {
    e.preventDefault();
    setKeywords(keywords.filter(a => a !== e.target.closest('button').value));
  }

  const handleAliasKeyDown = (e) => {
    if(e.key === 'Enter') {
      e.preventDefault();
      handleAddAlias(e);
    }
  }

  const handleKeywordKeyDown = (e) => {
    if(e.key === 'Enter') {
      e.preventDefault();
      handleAddKeyword(e);
    }
  }

  const listAliases = aliases.map((alias, index) => 
    <div className="bg-gray-800 text-white rounded-lg py-1 px-3 mr-1 mb-1 text-sm flex" key={alias}>
      <div className="mr-2">{alias}</div>
      <button onClick={removeAlias} value={alias}>
        <FontAwesomeIcon className="h-5 w-5 text-red-500" icon={faTimes}></FontAwesomeIcon>
      </button>
    </div>
  );

  const listKeywords = keywords.map((keyword, index) => 
    <div className="bg-gray-800 text-white rounded-lg py-1 px-3 mr-1 mb-1 text-sm flex" key={keyword}>
      <div className="mr-2">{keyword}</div>
      <button onClick={removeKeyword} value={keyword}>
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
            <div className="text-lg font-semibold">New Command</div>
            <button onClick={handleSlider} className="">
              <FontAwesomeIcon className="h-5 w-5" icon={faTimes}></FontAwesomeIcon>
            </button>
        </div>
        <div className="flex flex-grow flex-col h-full overflow-auto pb-14 px-6">
          <form onSubmit={handleCreateCommand}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="relative w-full">
                <label className="relative text-sm font-semibold" htmlFor="">Command *</label>
                <input className="mt-2 px-3 py-1 bg-gray-900 border border-gray-800 rounded-lg w-full outline-none bg-gray-900 text-gray-200" type="text" name="command" onChange={handleCommandChange} value={command} placeholder="!command"/>
              </div>
              <div className="relative w-full">
                <label className="relative text-sm font-semibold" htmlFor="">Command Type</label>
                <select className="mt-2 px-3 py-1 bg-gray-900 border border-gray-800 rounded-lg w-full outline-none bg-gray-900 text-gray-200 appearance-none" name="command-type" id="commandType" onChange={handleCommandTypeChange} value={commandType}>
                  {
                    CommandType.map(ul => <option value={ul.toLowerCase()} key={ul}>{ul}</option>)
                  }
                </select>
              </div>
              <div className="relative w-full">
                <label className="relative text-sm font-semibold" htmlFor="">User Level</label>
                <select className="mt-2 px-3 py-1 bg-gray-900 border border-gray-800 rounded-lg w-full outline-none bg-gray-900 text-gray-200 appearance-none" name="user-level" id="userLevel" onChange={e => setUserLevel(e.target.value)} value={userLevel}>
                  {
                    UserLevels.map(ul => <option value={ul.toLowerCase()} key={ul}>{ul}</option>)
                  }
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 mb-6">
              <div className="relative w-full">
                <label className="relative text-sm font-semibold" htmlFor="">Description *</label>
                <input className="mt-2 px-3 py-1 bg-gray-900 border border-gray-800 rounded-lg w-full outline-none bg-gray-900 text-gray-200" type="text" name="description" onChange={handleDescriptionChange} value={description} placeholder="A brief description to recognize what the command does"/>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 mb-6">
              <div className="relative w-full">
                <label className="relative text-sm font-semibold" htmlFor="">Response *</label>
                <div className="grid grid-cols-1 gap-2">
                  {
                    response.map((res, index) => {
                      if(response.length > 1) {
                        return (
                          <div className="flex flex-row" key={"response" + index}>
                            <input className="mt-2 px-3 py-1 bg-gray-900 border border-gray-800 rounded-tl-lg rounded-bl-lg w-full outline-none bg-gray-900 text-gray-200 flex-grow" type="text" onChange={(e) => handleResponseChange(e, index)} value={res}/>
                            <button onClick={(e) => removeResponse(e, index)} className="mt-2 pt-1 px-3 border border-l-0 border-gray-800 text-red-500 rounded-tr-lg rounded-br-lg hover:bg-gray-800 transition-all duration-500 font-semibold flex-grow-0">
                              <FontAwesomeIcon className="h-5 w-5" icon={faTimes}></FontAwesomeIcon>
                            </button>
                          </div>
                        );
                      } else {
                        return (
                          <div className="flex flex-row" key={"response" + index}>
                            <input className="mt-2 px-3 py-1 bg-gray-900 border border-gray-800 rounded-lg w-full outline-none bg-gray-900 text-gray-200 flex-grow" type="text" onChange={(e) => handleResponseChange(e, index)} value={res}/>
                          </div>
                        );
                      }
                    })
                  }
                  {
                    commandType === "simple" ?
                      ""
                      :
                      <button onClick={addResponse} className="mt-2 pt-1 px-3 border border-gray-800 text-blue-500 rounded-lg hover:bg-gray-800 transition-all duration-500 font-semibold w-auto">
                        <FontAwesomeIcon className="h-5 w-5" icon={faPlus}></FontAwesomeIcon>
                      </button>
                  }
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="relative w-full">
                <label className="relative text-sm font-semibold" htmlFor="">Global Cooldown</label>
                <input className="mt-2 px-3 py-1 bg-gray-900 border border-gray-800 rounded-lg w-full outline-none bg-gray-900 text-gray-200" type="number" name="global-cooldown" onChange={e => setGlobalCooldown(parseInt(e.target.value))} value={globalCooldown} placeholder="30" />
              </div>
              <div className="relative w-full">
                <label className="relative text-sm font-semibold" htmlFor="">User Cooldown</label>
                <input className="mt-2 px-3 py-1 bg-gray-900 border border-gray-800 rounded-lg w-full outline-none bg-gray-900 text-gray-200" type="number" name="global-cooldown" onChange={e => setUserCooldown(parseInt(e.target.value))} value={userCooldown} placeholder="30" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="relative w-full">
                <label className="relative text-sm font-semibold" htmlFor="">Aliases</label>
                <div className="flex flex-row mb-2">
                  <input className="mt-2 px-3 py-1 bg-gray-900 border border-gray-800 rounded-tl-lg rounded-bl-lg w-full outline-none bg-gray-900 text-gray-200 flex-grow" type="text" placeholder="!alias" name="alias" id="alias" onChange={handleAliasChange} onKeyDown={handleAliasKeyDown} value={alias}/>
                  <button onClick={handleAddAlias} className="mt-2 pt-1 px-3 border border-l-0 border-gray-800 text-blue-500 rounded-tr-lg rounded-br-lg hover:bg-gray-800 transition-all duration-500 font-semibold">
                    <FontAwesomeIcon className="h-5 w-5" icon={faPlus}></FontAwesomeIcon>
                  </button>
                </div>
                <div className="flex flex-row flex-wrap">
                  {listAliases}
                </div>
              </div>
              <div className="relative w-full">
                <label className="relative text-sm font-semibold" htmlFor="">Keywords</label>
                <div className="flex flex-row mb-2">
                  <input className="mt-2 px-3 py-1 bg-gray-900 border border-gray-800 rounded-tl-lg rounded-bl-lg w-full outline-none bg-gray-900 text-gray-200 flex-grow" type="text" placeholder="keyword" name="keyword" id="keyword" onChange={handleKeywordChange} onKeyDown={handleKeywordKeyDown} value={keyword}/>
                  <button onClick={handleAddKeyword} className="mt-2 pt-1 px-3 border border-l-0 border-gray-800 text-blue-500 rounded-tr-lg rounded-br-lg hover:bg-gray-800 transition-all duration-500 font-semibold">
                    <FontAwesomeIcon className="h-5 w-5" icon={faPlus}></FontAwesomeIcon>
                  </button>
                </div>
                <div className="flex flex-row flex-wrap">
                  {listKeywords}
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

export default NewCommandForm;