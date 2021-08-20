import React from 'react';
import Footer from '../components/footer';
import Header from '../components/header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloud, faRobot, faSync } from '@fortawesome/free-solid-svg-icons';
import { faTwitch } from '@fortawesome/free-brands-svg-icons';
import { getUser } from '../lib/user';
import Link from 'next/link';

const Home = ({ user }) => {
  return (
    <>
      <Header user={user} />
      <div className="py-24 bg-gray-900">
        <div>
          <h1 className="font-bold text-white text-center text-6xl md:text-8xl mb-24 main-title mt-24">MoaitoBot</h1>
          <h4 className="font-semibold text-white text-center text-2xl mb-12 max-w-4xl mx-auto px-8">A Cloud based chat bot and alert system made by a streamer. Centered around the Twitch user MoaitoBot takes interaction and engagement to the next level.</h4>
        </div>
        <div className="text-center mt-24">
          { user ? 
            <Link href="/dashboard">
              <a className="rounded-lg text-indigo-400 py-2 px-4 transition-all border-indigo-400 border hover:text-white hover:bg-indigo-400">Go to Dashboard</a>
            </Link>
            : 
            <a href="/api/auth/twitch" className="rounded-lg bg-purple-500 text-white py-2 px-4 hover:bg-purple-700 transition-all">
              <FontAwesomeIcon className="h-5 w-5 mr-2 inline-block" icon={faTwitch}></FontAwesomeIcon>
              Sign In
            </a>
          }
        </div>
      </div>
      <div className="py-24 bg-gray-900">
        <div className="container mx-auto px-8">
          <h3 className="font-bold text-3xl text-center text-gray-200 mb-8">KEY ASPECTS</h3>
          <p className="text-center text-lg text-white mb-12">The magic things that make this site awesome, and we keep working on more!</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="rounded-md w-full hover:shadow-xl bg-gray-800 transform hover:-translate-y-2 transition-all duration-500">
              <div className="rounded-t-md bg-green-500 p-5 flex align-center">
                <FontAwesomeIcon className="text-5xl text-white mx-auto" icon={faCloud}></FontAwesomeIcon>
              </div>
              <div className="p-5 text-center text-white">
                <h4 className="font-bold text-lg mb-2">Cloud Based</h4>
                <p>MoaitoBot runs in the cloud. Nothing to boot up or download.</p>
              </div>
            </div>
            <div className="rounded-md w-full hover:shadow-xl bg-gray-800 transform hover:-translate-y-2 transition-all duration-500">
              <div className="rounded-t-md bg-green-500 p-5 flex align-center">
                <FontAwesomeIcon className="text-5xl text-white mx-auto" icon={faRobot}></FontAwesomeIcon>
              </div>
              <div className="p-5 text-center text-white">
                <h4 className="font-bold text-lg mb-2">Chat Bot</h4>
                <p>Completely taylored to your needs chatbot interactions and automated reward system.</p>
              </div>
            </div>
            <div className="rounded-md w-full hover:shadow-xl bg-gray-800 transform hover:-translate-y-2 transition-all duration-500">
              <div className="rounded-t-md bg-green-500 p-5 flex align-center">
                <FontAwesomeIcon className="text-5xl text-white mx-auto" icon={faSync}></FontAwesomeIcon>
              </div>
              <div className="p-5 text-center text-white">
                <h4 className="font-bold text-lg mb-2">Updates</h4>
                <p>Collaborations allows for frequent Updates and the development of new features</p>
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

export default Home;