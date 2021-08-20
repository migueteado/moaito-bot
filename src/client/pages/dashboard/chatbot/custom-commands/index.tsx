import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserClock, faClock, faTrash, faPen, faToggleOn, faToggleOff, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { getUser } from "../../../../lib/user";
import { getCustomCommands } from "../../../../lib/command";
import Footer from '../../../../components/footer';
import Sidebar from '../../../../components/sidebar';
import { useState } from "react";
import Topbar from "../../../../components/topbar";
import NewCommandForm from "../../../../components/commands/new-command-form";
import axios from 'axios';
import EditCommandForm from '../../../../components/commands/edit-command-form';

function Commands({ user, commands, access_token }) {
  const [isToggled, setToggle] = useState(false);
  const [isNewSlided, setNewSlided] = useState(false);
  const [isEditSlided, setEditSlided] = useState(false);
  const [userCommands, setUserCommands] = useState(commands);
  const [editableCommand, setEditableCommand] = useState(userCommands[0] || {});

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

  const handleCommandAction = (command, action) => {
    switch(action) {
      case 'create':
        let userCommandsCreate = userCommands;
        userCommandsCreate.push(command);
        userCommandsCreate.sort((command1, command2) => {
          const v1 = command1.command.toUpperCase();
          const v2 = command2.command.toUpperCase();
          if(v1 < v2) return -1;
          if(v1 > v2) return 1;
          return 0;
        });
        setUserCommands(userCommandsCreate);
        break;
      case 'update':
        let userCommandsUpdate = userCommands.filter(c => c.id !== command.id);
        userCommandsUpdate.push(command);
        userCommandsUpdate.sort((command1, command2) => {
          const v1 = command1.command.toUpperCase();
          const v2 = command2.command.toUpperCase();
          if(v1 < v2) return -1;
          if(v1 > v2) return 1;
          return 0;
        });
        setUserCommands(userCommandsUpdate);
        break;
      case 'delete':
        const userCommandsDelete = userCommands.filter(c => c.id !== command.id);
        setUserCommands(userCommandsDelete);
        break;
      default:
        break;
    }
  }

  const handleAddCommand = () => {
    handleNewSlideOver();
  }

  const handleEditCommand = (e) => {
    const commandId = e.target.closest('button').getAttribute('command-id');
    const currentCommand = userCommands.find(uc => uc.id === commandId);
    setEditableCommand(currentCommand);
    handleEditSlideOver();
  }

  const handleChangeCommandStatus = async (e) => {
    try {
      e.preventDefault();
      const commandId = e.target.closest('button').getAttribute('command-id');
      const currentCommand = userCommands.find(uc => uc.id === commandId);
      const { data, status } = await axios.put(`/api/custom-command/${commandId}`,{
        status: (currentCommand.status === "on" ? "off" : "on")
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`
        }
      }).then(res => res).catch(error => error.response);

      if(status !== 200) {
        throw new Error("Unable to Update command");
      }

      const command = data;
      handleCommandAction(command, 'update');
      showToast('success', `Command ${command.command} successfully updated`);
    } catch (error) {
      if(!error.message) {
        showToast('error', `Unable to update command`);
      }
      showToast('error', error.message);
    }
  }

  const handleDeleteCommand = async (e) => {
    try {
      e.preventDefault();
      const commandId = e.target.closest('button').getAttribute('command-id');
      const { data, status } = await axios.delete(`/api/custom-command/${commandId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`
        }
      }).then(res => res).catch(error => error.response);

      if(status !== 200) {
        throw new Error("Unable to Delete command");
      }

      const command = userCommands.find(uc => uc.id === commandId);
      handleCommandAction(command, 'delete');
      showToast('success', `Command ${command.command} successfully deleted`);
    } catch(error) {
      console.log(error);
      showToast('error', `Unable to delete command`);
    }
  }

  const listCommands = userCommands.map((command, index) => 
    <div className="flex flex-col justify-between rounded-lg p-5 text-white hover:shadow-xl bg-gray-800 border border-gray-800" key={command.id}>
      <div className="flex flex-col justify-between md:flex-row">
        <div>
          <div className="text-white font-bold text-lg">{command.command}</div>
          <div className="text-gray-500">{command.description}</div>
        </div>
        <div className="md:text-right flex flex-row md:flex-col justify-start md:justify-start items-center md:items-end pt-4 md:pt-0 text-gray-500">
          <div className="flex items-center mr-4 md:mr-0">
            <FontAwesomeIcon className="h-5 w-5 mr-2 inline-block" icon={faClock}></FontAwesomeIcon>
            {command.globalCooldown}
          </div>
          <div className="flex items-center">
            <FontAwesomeIcon className="h-5 w-5 mr-2 inline-block" icon={faUserClock}></FontAwesomeIcon>
            {command.userCooldown}
          </div>
        </div>
      </div>
      <div className="pt-4 rounded-b-lg text-white flex flex-row justify-end md:justify-start">
        <button onClick={handleChangeCommandStatus} className="text-gray-400 hover:text-gray-500 px-3 transition-all duration-500" command-id={command.id}>
          {
            command.status === "on" ?
              <FontAwesomeIcon className="h-5 w-5 inline-block text-green-600" icon={faToggleOn}></FontAwesomeIcon>
            :
              <FontAwesomeIcon className="h-5 w-5 inline-block text-gray-600" icon={faToggleOff}></FontAwesomeIcon>
          }
        </button>
        <button onClick={handleEditCommand} className="text-blue-400 hover:text-blue-500 px-3 transition-all" command-id={command.id}><FontAwesomeIcon className="h-5 w-5 inline-block" icon={faPen}></FontAwesomeIcon></button>
        <button onClick={handleDeleteCommand} className="text-red-600 hover:text-red-700 px-3 transition-all" command-id={command.id}><FontAwesomeIcon className="h-5 w-5 inline-block" icon={faTrash}></FontAwesomeIcon></button>
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
              <h1 className="text-2xl text-gray-200 font-bold">Custom Commands</h1>
              <h6 className="font-semibold text-gray-400">Commands created by you to improve your channel interactivity</h6>
            </div>
            <div className="py-4 px-2 text-white text-right font-bold">
              {userCommands.length + " custom commands"} 
            </div>
            <div className="flex">
              {
                  commands.length > 0 ? 
                  <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {listCommands}
                  </div>
                  :
                  <div className="w-full">
                    <h3 className="font-semibold text-gray-600 text-center text-2xl mb-12 max-w-4xl mx-auto px-8">There are no commands here</h3>
                  </div>
              }
            </div>
          </div>
          <Footer />
        </div>
        <div className="fixed right-6 bottom-0 pt-4 pb-8">
          <button onClick={handleAddCommand} className="bg-green-500 hover:bg-green-600 text-white group flex rounded-full items-center px-4 py-4 text-2xl shadow-lg hover:shadow-xl ring-green-500 focus:ring-4 ring-opacity-50 transition-all">
            <FontAwesomeIcon className="h-5 w-5" icon={faPlus}></FontAwesomeIcon>
          </button>
        </div>
      </div>
      
      <NewCommandForm onToggleSlider={handleNewSlideOver} isSlided={isNewSlided} handleCommandAction={handleCommandAction} showToast={showToast} access_token={access_token} user={user}/>
      <EditCommandForm onToggleSlider={handleEditSlideOver} isSlided={isEditSlided} handleCommandAction={handleCommandAction} showToast={showToast} access_token={access_token} user={user} editableCommand={editableCommand}/>
    </>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;
  const { cookies } = req;
  const { access_token } = cookies;
  const user = await getUser(context);
  const commands = await getCustomCommands(context);

  commands.sort((command1, command2) => {
    const v1 = command1.command.toUpperCase();
    const v2 = command2.command.toUpperCase();
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
      commands,
      access_token,
    }
  }
}

export default Commands;