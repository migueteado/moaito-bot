import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPen, faToggleOn, faToggleOff, faTag, faCoins, faCopy } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { getUser } from "../../../lib/user";
import Footer from '../../../components/footer';
import Sidebar from '../../../components/sidebar';
import { useState } from "react";
import Topbar from "../../../components/topbar";
import { getReward } from "../../../lib/reward";
import axios from 'axios';
import { getSourceByUser } from '../../../lib/obs-source';

function Rewards({ user, rewards, access_token, source }) {
  const [isToggled, setToggle] = useState(false);
  const [userRewards, setUserRewards] = useState(rewards);
  const [userSource, setUserSource] = useState(source);

  const handleToggler = () => {
    setToggle(!isToggled);
  }

  const showToast = ( status, message) => {
    switch(status){
      case 'success':
        toast.success(message, {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        break;
      case 'error':
        toast.error(message, {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        break;
      case 'info':
        toast.info(message, {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        break;
      default:
        toast.dark(message, {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        break;
    }
  } 

  const handleRewardAction = (reward, action) => {
    switch(action) {
      case 'create':
        let userRewardsCreate = userRewards;
        userRewardsCreate.push(rewards);
        userRewardsCreate.sort((reward1, reward2) => {
          return reward1.cost - reward2.cost;
        });
        setUserRewards(userRewardsCreate);
        break;
      case 'update':
        let userRewardsUpdate = userRewards.filter(rw => rw.id !== reward.id);
        userRewardsUpdate.push(reward);
        userRewardsCreate.sort((reward1, reward2) => {
          return reward1.cost - reward2.cost;
        });
        setUserRewards(userRewardsUpdate);
        break;
      case 'delete':
        const userRewardsDelete = userRewards.filter(c => c.id !== reward.id);
        setUserRewards(userRewardsDelete);
        break;
      default:
        break;
    }
  }

  const handleChangeRewardStatus = async (e) => {
    try {
      e.preventDefault();
      const rewardId = e.target.closest('button').getAttribute('reward-id');
      const currentReward = userRewards.find(ur => ur.id === rewardId);
      const { data, status } = await axios.put(`/api/twitch-reward/${rewardId}`,{
        is_enabled: (currentReward.is_enabled ? false : true)
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`
        }
      }).then(res => res).catch(error => error.response);

      if(status !== 200) {
        throw new Error("Unable to Update reward");
      }

      const reward = data;
      handleRewardAction(reward, 'update');
      showToast('success', `Reward ${reward.title} successfully updated`);
    } catch (error) {
      if(!error.message) {
        showToast('error', `Unable to update reward`);
      }
      showToast('error', error.message);
    }
  }

  const handleDeleteReward = async (e) => {
    try {
      e.preventDefault();
      const rewardId = e.target.closest('button').getAttribute('reward-id');
      const { data, status } = await axios.delete(`/api/twitch-reward/${rewardId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`
        }
      }).then(res => res).catch(error => error.response);

      if(status !== 200) {
        throw new Error("Unable to Delete reward");
      }

      const reward = userRewards.find(rw => rw.id === rewardId);
      handleRewardAction(reward, 'delete');
      showToast('success', `Reward ${reward.title} successfully deleted`);
    } catch(error) {
      console.log(error);
      showToast('error', `Unable to delete reward`);
    }
  }

  const listRewards = userRewards.map(reward => 
    <div className={reward.is_enabled ? "flex flex-col rounded-lg p-5 text-white hover:shadow-xl bg-gray-800 justify-between" : "flex flex-col rounded-lg p-5 text-white bg-gray-800 justify-between opacity-30"} key={reward.id}>
      <div className="flex flex-col justify-between md:flex-row">
        <div className="flex">
          {
            reward.image && Object.keys(reward.image).length > 0 ?
            <div className="rounded-lg h-14 w-14 flex items-center justify-center mr-5 flex-shrink-0 flex-grow-0" style={{backgroundColor: reward.background_color }}>
              <img src={reward.image.url_1x} alt="" />
            </div>
            : 
            <div className="rounded-lg h-14 w-14 flex items-center justify-center mr-5 flex-shrink-0 flex-grow-0" style={{backgroundColor: reward.background_color }}>
              <img src={reward.default_image.url_1x} alt="" />
            </div>
          }
          <div>
            <h5 className="text-white font-bold text-lg">{reward.title}</h5>
            <p className="text-gray-500">{reward.prompt}</p>
          </div>
        </div>
        <div className="md:text-right flex flex-row md:flex-col justify-start md:justify-start items-center md:items-end pt-4 md:pt-0 text-gray-500">
          <div className="flex items-center mr-4 md:mr-0">
            <FontAwesomeIcon className="h-5 w-5 mr-2 inline-block" icon={faCoins}></FontAwesomeIcon>
            {reward.cost}
          </div>
        </div>
      </div>
      <div className="pt-4 rounded-b-lg text-white flex flex-row justify-end md:justify-start">
        <button className="text-blue-400 hover:text-blue-500 px-3 transition-all" reward-id={reward.id}><FontAwesomeIcon className="h-5 w-5 inline-block" icon={faPen}></FontAwesomeIcon></button>
      </div>
    </div>
  );

  return (
    <>
      <div className="relative min-h-screen max-h-screen md:flex bg-gray-900">
        <Topbar onToggleMenu={handleToggler} isToggled={ isToggled } />
        <Sidebar user={ user } isToggled={ isToggled } />
        <div className="relative w-full h-full overflow-auto max-h-screen">
          <div className="px-9 py-28 md:py-20">
            <div className="mb-10">
              <h1 className="text-2xl text-gray-200 font-bold">Rewards</h1>
              <h6 className="font-semibold text-gray-400">Custom rewards created by you that can be anhanced with MoaitoBot features</h6>
            </div>
            <div>
            <h6 className="font-bold text-white">OBS Source</h6>
              <div className="flex flex-row">
                <input className="mt-2 px-3 py-1 bg-gray-900 border border-gray-800 rounded-tl-lg rounded-bl-lg w-full outline-none bg-gray-900 text-gray-200 flex-grow" type="text" value={"https://bot.itsmoaito.com/alerts/v1/" + userSource.id} disabled/>
                <button  className="mt-2 pt-1 px-3 border border-l-0 border-gray-800 text-green-500 rounded-tr-lg rounded-br-lg hover:bg-gray-800 transition-all duration-500 font-semibold flex-grow-0" onClick={() => navigator.clipboard.writeText("https://bot.itsmoaito.com/alerts/v1/" + userSource.id)}>
                  <FontAwesomeIcon className="h-5 w-5" icon={faCopy}></FontAwesomeIcon>
                </button>
              </div>
            </div>
            <div className="py-4 px-2 text-white text-right font-bold">
              {userRewards.length + " custom rewards"} 
            </div>
            <div className="flex">
              {
                  rewards.length > 0 ? 
                  <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {listRewards}
                  </div>
                  :
                  <div className="w-full">
                    <h3 className="font-semibold text-gray-600 text-center text-2xl mb-12 max-w-4xl mx-auto px-8">There are no rewards here</h3>
                  </div>
              }
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;
  const { cookies } = req;
  const { access_token } = cookies;
  const user = await getUser(context);
  const rewards = await getReward(context);
  const source = await getSourceByUser(context);

  rewards.sort((reward1, reward2) => {
    return reward1.cost - reward2.cost;
  });

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
      rewards,
      access_token,
      source,
    }
  }
}

export default Rewards;