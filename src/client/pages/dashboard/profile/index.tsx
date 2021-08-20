import { getProfile, getUser } from "../../../lib/user";
import Footer from '../../../components/footer';
import Sidebar from '../../../components/sidebar';
import { useState } from "react";
import Topbar from "../../../components/topbar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitch } from '@fortawesome/free-brands-svg-icons';

function Profile({ profile, user }) {
  const [isToggled, setToggle] = useState(false);

  const handleToggler = () => {
    setToggle(!isToggled);
  }

  return (
    <>
      <div className="relative min-h-screen max-h-screen  md:flex bg-gray-900">
        <Topbar onToggleMenu={handleToggler} isToggled={ isToggled } />
        <Sidebar user={ user } isToggled={ isToggled } />
        <div className="relative w-full h-full overflow-auto max-h-screen">
          <div className="px-9 py-28 md:py-20">
            <div className="mb-10">
              <h1 className="text-2xl text-gray-200 font-bold">User Profile</h1>
              <h6 className="font-semibold text-gray-400">Some information about you</h6>
            </div>
            <div className="flex mb-10">
              <div className="flex md:flex-row flex-col items-center">
                <img className="rounded-lg w-40 mb-5" src={profile.profile_image_url} alt="" />
                <div className="flex flex-col item-center md:items-start px-10">
                  <h4 className="font-semibold text-center md:text-left text-xl text-white mb-4">{profile.display_name}</h4>
                  <p className="text-white text-center md:text-left flex-grow">{profile.description}</p>
                  <a className="mt-5 text-center rounded-lg bg-indigo-500 text-white py-2 px-4 hover:bg-indigo-700 transition-all" href={`https://twitch.tv/${profile.login}`}>
                    <FontAwesomeIcon className="h-5 w-5 mr-2 inline-block" icon={faTwitch}></FontAwesomeIcon>
                    Go to Channel
                  </a>
                </div>
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
  const profile = await getProfile(context);
  const user = await getUser(context);

  if(!profile || !user) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  return {
    props: {
      profile,
      user,
    }
  }
}

export default Profile;