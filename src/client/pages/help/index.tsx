import React from 'react';
import Footer from '../../components/footer';
import Header from '../../components/header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';
import { faRocket, faCommentAlt } from '@fortawesome/free-solid-svg-icons';
import { getUser } from '../../lib/user';
import Link from 'next/link';

const Help = ({ user }) => {
  return (
    <>
      <Header user={user} />
      <div className="py-36 bg-gray-900">
        <div className="container mx-auto px-8">
          <h3 className="font-bold text-4xl text-center text-gray-200 mb-8">HELP CENTER</h3>
          <p className="text-center text-lg text-white mb-24">We have some very helpfull resources here.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <Link href="/help/faq">
              <div className="rounded-md w-full hover:shadow-xl bg-gray-800 transform hover:-translate-y-2 transition-all duration-500 cursor-pointer">
                <div className="rounded-t-md bg-green-500 p-5 flex align-center">
                  <FontAwesomeIcon className="text-5xl text-white mx-auto" icon={faQuestionCircle}></FontAwesomeIcon>
                </div>
                <div className="p-5 text-center text-white">
                  <h4 className="font-bold text-2xl mb-5">FAQ Page</h4>
                  <p>Maybe your question has already been answered.</p>
                </div>
              </div>
            </Link>
            <Link href="/docs">
              <div className="rounded-md w-full hover:shadow-xl bg-gray-800 transform hover:-translate-y-2 transition-all duration-500 cursor-pointer">
                <div className="rounded-t-md bg-green-500 p-5 flex align-center">
                  <FontAwesomeIcon className="text-5xl text-white mx-auto" icon={faRocket}></FontAwesomeIcon>
                </div>
                <div className="p-5 text-center text-white">
                  <h4 className="font-bold text-2xl mb-5">Getting Started</h4>
                  <p>Kickstart your experience with our guide!</p>
                </div>
              </div>
            </Link>
            <Link href="/help/contact">
              <div className="rounded-md w-full hover:shadow-xl bg-gray-800 transform hover:-translate-y-2 transition-all duration-500 cursor-pointer">
                <div className="rounded-t-md bg-green-500 p-5 flex align-center">
                  <FontAwesomeIcon className="text-5xl text-white mx-auto" icon={faCommentAlt}></FontAwesomeIcon>
                </div>
                <div className="p-5 text-center text-white">
                  <h4 className="font-bold text-2xl mb-5">Contact</h4>
                  <p>Are you really really stuck in an issue?</p>
                </div>
              </div>
            </Link>
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

export default Help;