import { Menu, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faChevronDown, faBars, faTimes, faSignOutAlt, faTachometerAlt } from '@fortawesome/free-solid-svg-icons';
import { faTwitch } from '@fortawesome/free-brands-svg-icons';
import Link from 'next/link';

function Header({ user }) {
  const [isToggled, setToggle] = useState(false);

  const handleToggler = (e) => {
    e.preventDefault();
    setToggle(!isToggled);
  }

  return (
    <div className="fixed min-w-full bg-gray-900 border-b border-gray-800 z-10">
      <div className="flex justify-between items-center flex-col md:flex-row py-6 md:py-4 px-6">
        <div className="flex justify-between items-center w-full md:w-auto">
          <div className="text-xl font-extrabold text-white align-middle">
            <a href="/">MoaitoBot</a>
          </div>
          <div className="text-green-400 font-semibold hover:text-green-300 transition-all md:hidden">
            <button onClick={handleToggler}>
              {
                isToggled ? 
                <FontAwesomeIcon className="inline-block" icon={faTimes}></FontAwesomeIcon>
                :
                <FontAwesomeIcon className="inline-block" icon={faBars}></FontAwesomeIcon>
              }
            </button>
          </div>
        </div>  
        <div className={ isToggled ? "flex md:flex flex-grow flex-col md:flex-row w-full md:w-auto" : "hidden md:flex flex-grow flex-col md:flex-row w-full md:w-auto"} >
          <div className="flex flex-col md:flex-row mt-4 md:mt-0 md:ml-10 mr-auto space-y-2 md:space-y-0 md:space-x-6 text-gray-50 font-semibold w-full">
            <div className="transition rounded-lg hover:bg-gray-800 px-3 py-2">
              <Link href="/features">
                Features
              </Link>
            </div>
            <div className="transition rounded-lg hover:bg-gray-800 px-3 py-2">
              <Link href="/about">
                About
              </Link>
            </div>
            <div className="transition rounded-lg hover:bg-gray-800 px-3 py-2">
              <Link href="/help">
                Help Center
              </Link>
            </div>
            {
              user ? 
              <div className="flex flex-col md:flex-row mt-4 md:mt-0 md:ml-6 mr-auto space-y-2 md:space-y-0 md:space-x-5 text-gray-50 font-semibold md:hidden w-full">
                <div className="transition rounded-lg hover:bg-gray-800 px-3 py-2">
                  <Link href="/dashboard">
                    <a>
                      <FontAwesomeIcon className="h-5 w-5 mr-2 inline-block" icon={faTachometerAlt}></FontAwesomeIcon>
                      Dashboard
                    </a>
                  </Link>
                </div> 
                <div className="transition rounded-lg hover:bg-gray-800 px-3 py-2">
                  <Link href="/dashboard/profile">
                    <a>
                      <FontAwesomeIcon className="h-5 w-5 mr-2 inline-block" icon={faUser}></FontAwesomeIcon>
                      Profile
                    </a>
                  </Link>
                </div> 
                <div>
                  <a className="transition rounded-lg hover:bg-gray-800 px-3 py-2 text-red-600 group flex rounded-md items-center w-full" href="/api/auth/signout">
                    <FontAwesomeIcon className="h-5 w-5 mr-2 inline-block" icon={faSignOutAlt}></FontAwesomeIcon>
                    Sign out
                  </a>
                </div> 
              </div>
              : ""
            }
          </div>
          <div className="hidden md:flex">
            {user
              ? <Menu>
                  <Menu.Button className="flex items-center text-purple-400 font-semibold hover:text-purple-300 transition-all focus:border-0 transition rounded-lg hover:bg-gray-800 px-3 py-2">
                    <FontAwesomeIcon className="h-5 w-5 mr-2 inline-block" icon={faUser}></FontAwesomeIcon>
                    {user.login}
                    <FontAwesomeIcon className="h-5 w-5 ml-2 inline-block" icon={faChevronDown}></FontAwesomeIcon>
                    
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-5 w-56 mt-2 origin-top-right bg-gray-800 divide-y divide-gray-900 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-white">
                      <div className="px-1 py-1">
                        <Menu.Item>
                          <Link href="/dashboard">
                            <a className="group flex rounded-md items-center w-full px-2 py-2 text-sm">
                              <FontAwesomeIcon className="h-5 w-5 mr-2 inline-block" icon={faTachometerAlt}></FontAwesomeIcon>
                              Dashboard
                            </a>
                          </Link>
                        </Menu.Item>
                      </div>
                      <div className="px-1 py-1">
                        <Menu.Item>
                          <Link href="/dashboard/profile">
                            <a className="group flex rounded-md items-center w-full px-2 py-2 text-sm">
                              <FontAwesomeIcon className="h-5 w-5 mr-2 inline-block" icon={faUser}></FontAwesomeIcon>
                              Profile
                            </a>
                          </Link>
                        </Menu.Item>
                      </div>
                      <div className="px-1 py-1">
                        <Menu.Item>
                          <a className="text-red-600 group flex rounded-md items-center w-full px-2 py-2 text-sm" href="/api/auth/signout">
                            <FontAwesomeIcon className="h-5 w-5 mr-2 inline-block" icon={faSignOutAlt}></FontAwesomeIcon>
                            Sign out
                          </a>
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              : <a href="/api/auth/twitch" className="rounded-lg bg-purple-500 text-white py-2 px-4 hover:bg-purple-700 transition-all whitespace-nowrap">
                  <FontAwesomeIcon className="h-5 w-5 mr-2 inline-block" icon={faTwitch}></FontAwesomeIcon>
                  Sign In
                </a>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
