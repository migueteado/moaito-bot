import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxOpen, faClock, faGift, faGifts, faHome, faRocket, faShapes } from '@fortawesome/free-solid-svg-icons';

function DocsSidebar({ isToggled }) {
  return (
    <div className={ isToggled ? "fixed max-h-screen overflow-auto flex flex-col flex-shrink-0 bg-gray-900 text-gray-200 w-72 border-r border-gray-800 py-6 px-6 md:relative inset-y-0 left-0 transform transition duration-200 ease-in-out z-20" : "fixed max-h-screen overflow-auto flex flex-col flex-shrink-0 bg-gray-900 text-gray-200 w-72 border-r border-gray-800 py-6 px-6 md:relative inset-y-0 left-0 transform -translate-x-full md:translate-x-0 transition duration-200 ease-in-out z-20"}>
      <div className="text-xl font-extrabold text-white align-middle pb-4 px-3">
        <a href="/docs">MoaitoDocs</a>
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
          <Link href="/docs">
            <a className="flex items-center transition rounded-lg hover:bg-gray-800 px-3 py-2">
              <FontAwesomeIcon className="h-5 w-5 mr-2 inline-block" icon={faRocket}></FontAwesomeIcon>
              Getting Started
            </a>
          </Link>
          <Link href="/docs/built-in-commands">
            <a className="flex items-center transition rounded-lg hover:bg-gray-800 px-3 py-2">
              <FontAwesomeIcon className="h-5 w-5 mr-2 inline-block" icon={faBoxOpen}></FontAwesomeIcon>
              Built-In Commands
            </a>
          </Link>
          <Link href="/docs/custom-commands">
            <a className="flex items-center transition rounded-lg hover:bg-gray-800 px-3 py-2">
              <FontAwesomeIcon className="h-5 w-5 mr-2 inline-block" icon={faShapes}></FontAwesomeIcon>
              Custom Commands
            </a>
          </Link>
          <Link href="/docs/timers">
            <a className="flex items-center transition rounded-lg hover:bg-gray-800 px-3 py-2">
              <FontAwesomeIcon className="h-5 w-5 mr-2 inline-block" icon={faClock}></FontAwesomeIcon>
              Custom Commands
            </a>
          </Link>
          <Link href="/docs/rewards">
            <a className="flex items-center transition rounded-lg hover:bg-gray-800 px-3 py-2">
              <FontAwesomeIcon className="h-5 w-5 mr-2 inline-block" icon={faGifts}></FontAwesomeIcon>
              Rewards
            </a>
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default DocsSidebar;