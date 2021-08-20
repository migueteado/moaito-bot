import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faSignOutAlt, faLifeRing, faGifts, faBoxOpen, faExclamation, faShapes, faClock, faHome, faTachometerAlt, faGavel } from '@fortawesome/free-solid-svg-icons';

function Sidebar({ user, isToggled }) {
  return (
    <div className={ isToggled ? "fixed max-h-screen overflow-auto flex flex-col flex-shrink-0 bg-gray-900 text-gray-200 w-72 border-r border-gray-800 py-6 px-6 md:relative inset-y-0 left-0 transform transition duration-200 ease-in-out z-20" : "fixed max-h-screen overflow-auto flex flex-col flex-shrink-0 bg-gray-900 text-gray-200 w-72 border-r border-gray-800 py-6 px-6 md:relative inset-y-0 left-0 transform -translate-x-full md:translate-x-0 transition duration-200 ease-in-out z-20"}>
      <div className="text-xl font-extrabold text-white align-middle pb-4 px-3">
        <a href="/">MoaitoBot</a>
      </div>
      <nav className="flex flex-col flex-grow">
        <div className="flex flex-col py-2 border-b border-gray-800">
          <Link href="/">
            <a className="flex items-center transition rounded-lg hover:bg-gray-800 px-3 py-2">
              <FontAwesomeIcon className="h-5 w-5 mr-2 inline-block" icon={faHome}></FontAwesomeIcon>
              Home
            </a>
          </Link>
        </div>
        <div className="flex flex-col py-2 border-b border-gray-800">
          <Link href="/dashboard">
            <a className="flex items-center transition rounded-lg hover:bg-gray-800 px-3 py-2">
              <FontAwesomeIcon className="h-5 w-5 mr-2 inline-block" icon={faTachometerAlt}></FontAwesomeIcon>
              Dashboard
            </a>
          </Link>
        </div>
        <div className="flex flex-col py-2 border-b border-gray-800">
          <Link href="/dashboard/chatbot/mod-tools">
            <a className="flex items-center transition rounded-lg hover:bg-gray-800 px-3 py-2">
              <FontAwesomeIcon className="h-5 w-5 mr-2 inline-block" icon={faGavel}></FontAwesomeIcon>
              Mod Tools
            </a>
          </Link>
          <Link href="/dashboard/chatbot/built-in-commands">
            <a className="flex items-center transition rounded-lg hover:bg-gray-800 px-3 py-2">
              <FontAwesomeIcon className="h-5 w-5 mr-2 inline-block" icon={faBoxOpen}></FontAwesomeIcon>
              Built-in Commands
            </a>
          </Link>
          <Link href="/dashboard/chatbot/custom-commands">
            <a className="flex items-center transition rounded-lg hover:bg-gray-800 px-3 py-2">
              <FontAwesomeIcon className="h-5 w-5 mr-2 inline-block" icon={faShapes}></FontAwesomeIcon>
              Custom Commands
            </a>
          </Link>
          <Link href="/dashboard/chatbot/timers">
            <a className="flex items-center transition rounded-lg hover:bg-gray-800 px-3 py-2">
              <FontAwesomeIcon className="h-5 w-5 mr-2 inline-block" icon={faClock}></FontAwesomeIcon>
              Timers
            </a>
          </Link>
        </div>
        
        <div className="flex flex-col py-2">
          <Link href="/dashboard/rewards">
            <a className="flex items-center transition rounded-lg hover:bg-gray-800 px-3 py-2">
              <FontAwesomeIcon className="h-5 w-5 mr-2 inline-block" icon={faGifts}></FontAwesomeIcon>
              Rewards
            </a>
          </Link>
        </div>
      </nav>
      <div>
        <Link href="/help">
          <a className="flex items-center transition rounded-lg hover:bg-gray-800 px-3 py-2 text-blue-500">
          <FontAwesomeIcon className="h-5 w-5 mr-2 inline-block" icon={faLifeRing}></FontAwesomeIcon>
            Help Center
          </a>
        </Link>
        <Link href="/dashboard/profile">
          <a className="flex items-center transition rounded-lg hover:bg-gray-800 px-3 py-2 text-purple-500">
          <FontAwesomeIcon className="h-5 w-5 mr-2 inline-block" icon={faUser}></FontAwesomeIcon>
            {user.login}
          </a>
        </Link>
        <a className="flex items-center transition rounded-lg hover:bg-gray-800 px-3 py-2 text-red-600" href="/api/auth/signout">
          <FontAwesomeIcon className="h-5 w-5 mr-2 inline-block" icon={faSignOutAlt}></FontAwesomeIcon>
          Sign out
        </a>
      </div>
    </div>
  );
}

export default Sidebar;