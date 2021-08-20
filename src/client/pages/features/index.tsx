import React from 'react';
import Footer from '../../components/footer';
import Header from '../../components/header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';
import { faTerminal, faCommentDots, faUsers, faComments, faGavel } from '@fortawesome/free-solid-svg-icons';
import { getUser } from '../../lib/user';

const Features = ({ user }) => {
  return (
    <>
      <Header user={user} />
      <div className="py-36 bg-gray-900">
        <div className="container mx-auto px-8">
          <h3 className="font-bold text-4xl text-center text-gray-200 mb-8">FEATURES</h3>
          <p className="text-center text-lg text-white mb-24">Our breathtaking and continuously growing set of features!</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="rounded-md w-full hover:shadow-xl bg-gray-800 transform hover:-translate-y-2 transition-all duration-500">
              <div className="rounded-t-md bg-green-500 p-5 flex align-center">
                <FontAwesomeIcon className="text-5xl text-white mx-auto" icon={faGavel}></FontAwesomeIcon>
              </div>
              <div className="p-5 text-center text-white">
                <h4 className="font-bold text-2xl mb-5">Mod Tools</h4>
                <p>Use our customizable moderation tools to your advantage.</p>
              </div>
            </div>
            <div className="rounded-md w-full hover:shadow-xl bg-gray-800 transform hover:-translate-y-2 transition-all duration-500">
              <div className="rounded-t-md bg-green-500 p-5 flex align-center">
                <FontAwesomeIcon className="text-5xl text-white mx-auto" icon={faTerminal}></FontAwesomeIcon>
              </div>
              <div className="p-5 text-center text-white">
                <h4 className="font-bold text-2xl mb-5">Run Twitch Commands</h4>
                <p>Freely run your favorite twitch mod commands with our chat bot.</p>
              </div>
            </div>
            <div className="rounded-md w-full hover:shadow-xl bg-gray-800 transform hover:-translate-y-2 transition-all duration-500">
              <div className="rounded-t-md bg-green-500 p-5 flex align-center">
                <FontAwesomeIcon className="text-5xl text-white mx-auto" icon={faCommentDots}></FontAwesomeIcon>
              </div>
              <div className="p-5 text-center text-white">
                <h4 className="font-bold text-2xl mb-5">Custom Commands</h4>
                <p>Create your own custom commands to improve chat interactions</p>
              </div>
            </div>
            <div className="rounded-md w-full hover:shadow-xl bg-gray-800 transform hover:-translate-y-2 transition-all duration-500">
                <div className="rounded-t-md bg-green-500 p-5 flex align-center">
                  <FontAwesomeIcon className="text-5xl text-white mx-auto" icon={faUsers}></FontAwesomeIcon>
                </div>
                <div className="p-5 text-center text-white">
                  <h4 className="font-bold text-2xl mb-5">Manage your Channel</h4>
                  <p>Manage your channel with our built-in set of commands.</p>
                </div>
              </div>
            <div className="rounded-md w-full hover:shadow-xl bg-gray-800 transform hover:-translate-y-2 transition-all duration-500">
              <div className="rounded-t-md bg-green-500 p-5 flex align-center">
                <FontAwesomeIcon className="text-5xl text-white mx-auto" icon={faComments}></FontAwesomeIcon>
              </div>
              <div className="p-5 text-center text-white">
                <h4 className="font-bold text-2xl mb-5">Built Interactions</h4>
                <p>Built your custom interactions with our commands system</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export async function getServerSideProps(context) {
  const user = await getUser(context);

  return {
    props: {
      user,
    }
  }
}

export default Features;