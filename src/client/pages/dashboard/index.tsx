import { getUser } from "../../lib/user";
import Footer from '../../components/footer';
import Sidebar from '../../components/sidebar';
import { useState } from "react";
import Topbar from "../../components/topbar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxOpen, faClock, faGavel, faGifts, faShapes, faSignInAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { getChatbot } from "../../lib/chatbot";
import { useRouter } from 'next/router';
import Link from "next/link";

function Dashboard({ user, chatbot }) {
  const [isToggled, setToggle] = useState(false);
  const router = useRouter();

  const handleToggler = () => {
    setToggle(!isToggled);
  }

  const handlePart = async (e) => {
    e.preventDefault();
    router.push('/dashboard?action=part')
  }

  const handleJoin = (e) => {
    e.preventDefault();
    router.push('/dashboard?action=join')
  }

  return (
    <>
      <div className="relative min-h-screen max-h-screen md:flex bg-gray-900">
        <Topbar onToggleMenu={handleToggler} isToggled={ isToggled } />
        <Sidebar user={ user } isToggled={ isToggled } />
        <div className="relative w-full h-full overflow-auto max-h-screen">
          <div className="px-9 py-28 md:py-20">
            <div className="mb-10">
              <h1 className="text-2xl text-gray-200 font-bold">Dashboard</h1>
            </div>
            <div className="flex mb-10">
              <div className="flex flex-col justify-between bg-indigo-800 p-4 w-full rounded-lg">
                <h5 className="text-white text-lg font-bold mb-4">Development In Progress...</h5>
                <p className="font-semibold text-indigo-400">As this site is still under development some of the features are not ready yet and/or might be changed/removed without notice.</p>
              </div>
            </div>
            <div className="flex mb-10">
              <div className="flex flex-col md:flex-row items-center justify-between border border-gray-800 p-4 w-full rounded-lg bg-gray-800">
                <div className="text-xl font-semibold text-white mb-5 md:mb-0">
                  Chatbot Status: 
                  {
                    chatbot ? 
                      <span className={ chatbot.status === "on" ? "text-green-500 ml-2 font-bold" : "text-red-600 ml-2 font-bold"}>{ chatbot.status.toUpperCase() }</span>
                    :
                      <span className="text-red-600 ml-2 font-bold">OFF</span>
                  } 
                </div>
                {
                  chatbot ? 
                  chatbot.status === "on" ?
                    <button onClick={handlePart} className="flex items-center bg-red-600 hover:bg-red-900 transition rounded-lg py-2 px-4 text-white">
                      <FontAwesomeIcon className="h-5 w-5 mr-2 inline-block" icon={faSignOutAlt}></FontAwesomeIcon>
                      Part Channel
                    </button>
                    :
                    <button onClick={handleJoin} className="flex items-center bg-green-500 hover:bg-green-800 transition rounded-lg py-2 px-4 text-white">
                      <FontAwesomeIcon className="h-5 w-5 mr-2 inline-block" icon={faSignInAlt}></FontAwesomeIcon>
                      Join Channel
                    </button>
                  :
                  <button onClick={handleJoin} className="flex items-center bg-green-500 hover:bg-green-800 transition rounded-lg py-2 px-4 text-white">
                    <FontAwesomeIcon className="h-5 w-5 mr-2 inline-block" icon={faSignInAlt}></FontAwesomeIcon>
                    Join Channel
                  </button>
                }
              </div>
            </div>
            <div className="flex mb-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
                <Link href="/dashboard/chatbot/mod-tools">
                  <div className="rounded-md w-full hover:shadow-xl bg-gray-800 transform hover:-translate-y-2 transition-all duration-500 flex cursor-pointer">
                    <div className="p-5 text-center text-gray-200 flex items-center mx-auto">
                      <FontAwesomeIcon className="text-5xl mr-5" icon={faGavel}></FontAwesomeIcon>
                      <h4 className="font-bold text-lg">Mod Tools</h4>
                    </div>
                  </div>
                </Link>
                <Link href="/dashboard/chatbot/built-in-commands">
                  <div className="rounded-md w-full hover:shadow-xl bg-gray-800 transform hover:-translate-y-2 transition-all duration-500 flex cursor-pointer">
                    <div className="p-5 text-center text-gray-200 flex items-center mx-auto">
                      <FontAwesomeIcon className="text-5xl mr-5" icon={faBoxOpen}></FontAwesomeIcon>
                      <h4 className="font-bold text-lg">Built-In Commands</h4>
                    </div>
                  </div>
                </Link>
                <Link href="/dashboard/chatbot/custom-commands">
                  <div className="rounded-md w-full hover:shadow-xl bg-gray-800 transform hover:-translate-y-2 transition-all duration-500 flex cursor-pointer">
                    <div className="p-5 text-center text-gray-200 flex items-center mx-auto">
                      <FontAwesomeIcon className="text-5xl mr-5" icon={faShapes}></FontAwesomeIcon>
                      <h4 className="font-bold text-lg">Custom Commands</h4>
                    </div>
                  </div>
                </Link>
                <Link href="/dashboard/chatbot/timers">
                  <div className="rounded-md w-full hover:shadow-xl bg-gray-800 transform hover:-translate-y-2 transition-all duration-500 flex cursor-pointer">
                    <div className="p-5 text-center text-gray-200 flex items-center mx-auto">
                      <FontAwesomeIcon className="text-5xl mr-5" icon={faClock}></FontAwesomeIcon>
                      <h4 className="font-bold text-lg">Timers</h4>
                    </div>
                  </div>
                </Link>
                <Link href="/dashboard/rewards">
                  <div className="rounded-md w-full hover:shadow-xl bg-gray-800 transform hover:-translate-y-2 transition-all duration-500 flex cursor-pointer">
                    <div className="p-5 text-center text-gray-200 flex items-center mx-auto">
                      <FontAwesomeIcon className="text-5xl mr-5" icon={faGifts}></FontAwesomeIcon>
                      <h4 className="font-bold text-lg">Rewards</h4>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
      
    </>
  );
}

export async function getServerSideProps(context) {
  const user = await getUser(context);
  const chatbot = await getChatbot(context);

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
      chatbot,
    }
  }
}

export default Dashboard;