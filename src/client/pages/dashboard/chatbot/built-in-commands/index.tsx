import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserClock, faClock, faTrash, faPen, faToggleOn, faToggleOff, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify'
import { getUser } from "../../../../lib/user";
import { getBuiltInCommands } from "../../../../lib/command";
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

  const handleCommandAction = (command, action) => {
    switch(action) {
      case 'update':
        let userCommandsUpdate = userCommands.filter(c => c.command !== command.command);
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

  const handleChangeCommandStatus = async (e) => {
    try {
      e.preventDefault();
      const commandId = e.target.closest('button').getAttribute('command-id');
      const currentCommand = userCommands.find(uc => uc.command === commandId);
      const { data, status } = await axios.post(`/api/built-in-command`,{
        command: currentCommand.command,
        status: (currentCommand.status === "on" ? "off" : "on"),
        userId: user.id,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`
        }
      }).then(res => res).catch(error => error.response);

      if(status !== 201) {
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

  const listCommands = userCommands.map((command, index) => 
    <div className="flex flex-col rounded-lg p-5 text-white hover:shadow-xl bg-gray-800" key={command.command}>
      <div className="flex flex-col justify-between md:flex-row">
        <div>
          <div className="text-white font-bold text-lg">{command.command}</div>
          <div className="text-gray-500">{command.description}</div>
        </div>
      </div>
      <div className="pt-4 rounded-b-lg text-white flex flex-row justify-end md:justify-start">
        <button onClick={handleChangeCommandStatus} className="text-gray-400 hover:text-gray-500 px-3 transition-all duration-500" command-id={command.command}>
          {
            command.status === "on" ?
              <FontAwesomeIcon className="h-5 w-5 inline-block text-green-600" icon={faToggleOn}></FontAwesomeIcon>
            :
              <FontAwesomeIcon className="h-5 w-5 inline-block text-red-600" icon={faToggleOff}></FontAwesomeIcon>
          }
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="relative min-h-screen max-h-screen md:flex bg-gray-900">
        <Topbar onToggleMenu={handleToggler} isToggled={ isToggled } />
        <Sidebar user={ user } isToggled={ isToggled } />
        <div className="relative w-full h-full overflow-auto max-h-screen">
          <div className="px-9 py-28 md:py-20">
            <div className="mb-10">
              <h1 className="text-2xl text-gray-200 font-bold">Built In Commands</h1>
              <h6 className="font-semibold text-gray-400">Commands provided with MoaitoBot</h6>
            </div>
            <div className="py-4 px-2 text-white text-right font-bold">
              {userCommands.length + " built in commands"} 
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
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;
  const { cookies } = req;
  const { access_token } = cookies;
  const user = await getUser(context);
  const commands = await getBuiltInCommands(context);

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