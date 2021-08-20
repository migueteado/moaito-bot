import React, { useState } from 'react';
import Footer from '../../../components/footer';
import Header from '../../../components/header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { getUser } from '../../../lib/user';

const Faq = ({ user }) => {

  const faqContent = [
    {
      question: `What is a chatbot?`,
      answer: `A chatbot is a computer program designed to simulate conversation with human users, especially over the internet. They often treat conversations like they're a game of tennis: talk, reply, talk, reply.`,
      isOpen: false,
    },
    {
      question: `What is a chat command?`,
      answer: `A chat command is an instruction for the chatbot to do something, usually to provide a response. It is often used to provide a shortcut for information about a specific topic.`,
      isOpen: false,
    },
    {
      question: `What is a timer?`,
      answer: `A timer is an automated mechanism for activating an instruction at a preset time.`,
      isOpen: false,
    },
    {
      question: `Why did you create MoaitoBot?`,
      answer: `I felt like the chatbots that were already in the market did not fulfill all my needs, so as a developer I decided to build my own solution.`,
      isOpen: false,
    },
    {
      question: `What should I do if MoaitoBot is not responding in my twitch chat?`,
      answer: `Your best bet would be to go to your Dashboard and disconnect, then reconnect the bot to your chat.`,
      isOpen: false,
    },
  ];

  const [content, setContent] = useState(faqContent);

  const handleToggle = (e, index) => {
    setContent(prevContent => {
      prevContent[index].isOpen = !prevContent[index].isOpen;
      return [...prevContent];
    });
  }

  const listFaq = content.map((c, index) => 
    <div className=" border border-gray-800 bg-gray-900 rounded-lg text-white" key={"faq" + index}>
      <div className="flex flex-row items-center justify-between py-3 px-4 bg-gray-800 rounded-lg cursor-pointer" onClick={(e) => handleToggle(e, index)}>
        <div className="font-semibold text-lg">{c.question}</div>
        {
          c.isOpen ? 
            <FontAwesomeIcon className="h-5 w-5 text-green-500" icon={faChevronUp}></FontAwesomeIcon>
            :
            <FontAwesomeIcon className="h-5 w-5 text-green-500" icon={faChevronDown}></FontAwesomeIcon>
        }
      </div>
      <div className={ c.isOpen ? "py-3 px-4 overflow-hidden transition-all h-auto" : "px-4 overflow-hidden h-0 transition-all"}>
        <p>
          {c.answer}
        </p>
      </div>
    </div>
  );

  return (
    <>
      <Header user={user} />
      <div className="py-36 bg-gray-900">
        <div className="container mx-auto px-8">
          <h3 className="font-bold text-4xl text-left text-gray-200">FAQ</h3>
          <h6 className="text-sm text-gray-400 mb-8">(Frequently Asked Questions)</h6>
          <p className="text-left text-lg text-white mb-16">Some questions that have already been answered.</p>
          <div className="grid grid-cols-1 gap-6">
            {listFaq}
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

export default Faq;