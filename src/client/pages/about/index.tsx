import React from 'react';
import Footer from '../../components/footer';
import Header from '../../components/header';
import { getUser } from '../../lib/user';

const About = ({ user }) => {
  return (
    <>
      <Header user={user} />
      <div className="py-36 bg-gray-900">
        <div className="container mx-auto px-8 max-w-xl">
          <h3 className="font-bold text-4xl text-left text-gray-200 mb-8">About</h3>
          <p className="text-justify text-lg text-white mb-2">
            Hi, nice to meet you. My name is Miguel, I'm the main content creator for itsMoaito and also the head developer and maintainer of MoaitoBot.
            <br /><br />
            I am a computer engineer and specialized in Software Development. Right before graduating I started working as a Software Engineer and haven't stopped since then.
            <br /><br />
            I have always enjoyed playing videogames and learning about technologies, but never had as much time as I wanted to invest on it... untill now.
            <br /><br />
            In mid 2020 I started streaming videogames as a hobby, and I have really been enjoying it. During this time I have met very awesome people and together we have built a small and cohesive community full of joy, laughs and support.
            <br /><br />
            At some point I noticed that some of my viewers liked other things besides playing videogames, some are designers, accountants, engineers, managers, even some are content creators themselves.
            <br /><br />
            Then I decided that we should start building projects, as a community, and started teaching some development knowledge from time to time on our channel, mainly when I was tired of playing videogames, that is when MoaitoBot started. It is a personal project made to support our growing community, to provide knowledge and to be a tool for new content creators like me.
            <br /><br />
            I really hope you like it.
          </p>
          <p className="text-right text-lg text-green-500 mb-2">
            Att. itsMoaito
          </p>
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

export default About;