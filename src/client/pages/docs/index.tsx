import Footer from '../../components/footer';
import DocsSidebar from '../../components/docs-sidebar';
import DocsTopbar from "../../components/docs-topbar";
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxOpen, faClock, faCopy, faExclamation, faGifts } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import Link from 'next/link';

function Docs() {
  const [isToggled, setToggle] = useState(false);

  const handleToggler = () => {
    setToggle(!isToggled);
  }

  return (
    <>
      <div className="relative min-h-screen max-h-screen md:flex bg-gray-900">
        <DocsTopbar onToggleMenu={handleToggler} isToggled={ isToggled } />
        <DocsSidebar isToggled={ isToggled } />
        <div className="relative w-full h-full overflow-auto max-h-screen">
          <div className="px-9 py-28 md:py-20 max-w-6xl">
            <div className="mb-20">
              <h1 className="font-bold text-4xl text-left text-gray-200 mb-8">Getting Started With MoaitoBot!</h1>
            </div>
            <div className="mb-20">
              <h5 className="font-bold text-2xl text-left text-gray-200">Register</h5>
              <h6 className="font-semibold text-lg text-gray-400 mb-8">Learn how to create your own account</h6>
              <p className="text-white">In order to start using MoaitoBot we must create an account and connect it to our Twitch Account. It is as simple as clicking the purple button in our <Link href="/"><a className="text-green-500 font-semibold hover:text-green-700">Home Page</a></Link> and use the sign in provided by Twitch. Once you provide the Authorization you'll have access to your MoaitoBot dashboard linked to your Twitch Account!</p>
            </div>
            <div className="mb-20">
              <h5 className="font-bold text-2xl text-left text-gray-200">Connecting MoaitoBot to your Twitch Chat</h5>
              <h6 className="font-semibold text-lg text-gray-400 mb-8">Learn how to connect MoaitoBot to your chat</h6>
              <p className="text-white mb-4">Once you are registered the next step would be to give MoaitoBot the required permission to interact in your chat properly.</p>
              <p className="text-white">First go to your twitch chat and type the following command </p>
              <div className="my-4 flex flex-col bg-gray-800 rounded-lg border border-gray-800">
                <div className="flex flex-row py-2 p-3 justify-between items-center">
                  <div className="text-gray-200 font-semibold">Twitch Chat Command to give Moderator privileges to MoaitoBot</div>
                  <button className="ml-2 py-1 px-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-green-500 hover:text-green-600 transition-all duration-500" onClick={() => navigator.clipboard.writeText("/mod MoaitoBot")}>
                    <FontAwesomeIcon className="w-5 h-5 " icon={faCopy}></FontAwesomeIcon>
                  </button>
                </div>
                
                <div className="py-4 px-6 bg-gray-900 rounded-b-lg font-semibold text-white"><span className="text-pink-500">/mod</span> MoaitoBot</div>
              </div>
              <p className="text-white">Now go to your <Link href="/dashboard"><a className="text-green-500 font-semibold hover:text-green-700">MoaitoBot Dashboard</a></Link> and press the Join Channel button.</p>
            </div>
            <div className="mb-20">
              <h1 className="font-bold text-2xl text-left text-gray-200">Continue Following our Documentation</h1>
              <h6 className="font-semibold text-lg text-gray-400 mb-8">Learn about all the things you can do with MoaitoBot</h6>
            </div>
            <div className="mb-20">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <Link href="/docs/built-in-commands">
                  <div className="rounded-md w-full hover:shadow-xl bg-gray-800 transform hover:-translate-y-2 transition-all duration-500 cursor-pointer">
                    <div className="rounded-t-md bg-green-500 p-5 flex align-center">
                      <FontAwesomeIcon className="text-5xl text-white mx-auto" icon={faBoxOpen}></FontAwesomeIcon>
                    </div>
                    <div className="p-5 text-center text-white">
                      <h4 className="font-bold text-lg mb-2">Built-in Commands</h4>
                    </div>
                  </div>
                </Link>
                <Link href="/docs/custom-commands">
                  <div className="rounded-md w-full hover:shadow-xl bg-gray-800 transform hover:-translate-y-2 transition-all duration-500 cursor-pointer">
                    <div className="rounded-t-md bg-green-500 p-5 flex align-center">
                      <FontAwesomeIcon className="text-5xl text-white mx-auto" icon={faExclamation}></FontAwesomeIcon>
                    </div>
                    <div className="p-5 text-center text-white">
                      <h4 className="font-bold text-lg mb-2">Custom Commands</h4>
                    </div>
                  </div>
                </Link>
                <Link href="/docs/timers">
                  <div className="rounded-md w-full hover:shadow-xl bg-gray-800 transform hover:-translate-y-2 transition-all duration-500">
                    <div className="rounded-t-md bg-green-500 p-5 flex align-center">
                      <FontAwesomeIcon className="text-5xl text-white mx-auto" icon={faClock}></FontAwesomeIcon>
                    </div>
                    <div className="p-5 text-center text-white">
                      <h4 className="font-bold text-lg mb-2">Timers</h4>
                    </div>
                  </div>
                </Link>
                <Link href="/docs/rewards">
                  <div className="rounded-md w-full hover:shadow-xl bg-gray-800 transform hover:-translate-y-2 transition-all duration-500">
                    <div className="rounded-t-md bg-green-500 p-5 flex align-center">
                      <FontAwesomeIcon className="text-5xl text-white mx-auto" icon={faGifts}></FontAwesomeIcon>
                    </div>
                    <div className="p-5 text-center text-white">
                      <h4 className="font-bold text-lg mb-2">Custom Rewards</h4>
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

export default Docs;