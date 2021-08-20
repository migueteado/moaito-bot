import { getUser } from "../../../../lib/user";
import Footer from '../../../../components/footer';
import Sidebar from '../../../../components/sidebar';
import { toast } from 'react-toastify';
import { useState } from "react";
import Topbar from "../../../../components/topbar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxOpen, faClock, faGifts, faPen, faShapes, faSignInAlt, faSignOutAlt, faToggleOff, faToggleOn } from '@fortawesome/free-solid-svg-icons';
import EditCapsProtectionForm from "../../../../components/mod-tools/edit-caps-protection-form";
import { getCapsProtection, getLinkProtection, getParagraphProtection, getSymbolProtection, getWordProtection } from "../../../../lib/mod-tools";
import axios from "axios";
import EditSymbolProtectionForm from "../../../../components/mod-tools/edit-symbol-protection-form";
import EditParagraphProtectionForm from "../../../../components/mod-tools/edit-paragraph-protection-form";
import EditWordProtectionForm from "../../../../components/mod-tools/edit-word-protection-form";
import EditLinkProtectionForm from "../../../../components/mod-tools/edit-link-protection-form";

function Dashboard({ user, access_token, wordProtection, capsProtection, symbolProtection, linkProtection, paragraphProtection }) {
  const [isToggled, setToggle] = useState(false);
  const [isCapsSlided, setCapsSlided] = useState(false);
  const [isWordSlided, setWordSlided] = useState(false);
  const [isLinkSlided, setLinkSlided] = useState(false);
  const [isSymbolSlided, setSymbolSlided] = useState(false);
  const [isParagraphSlided, setParagraphSlided] = useState(false);
  const [currentCapsProtection, setCurrentCapsProtection] = useState(capsProtection);
  const [currentWordProtection, setCurrentWordProtection] = useState(wordProtection);
  const [currentLinkProtection, setCurrentLinkProtection] = useState(linkProtection);
  const [currentSymbolProtection, setCurrentSymbolProtection] = useState(symbolProtection);
  const [currentParagraphProtection, setCurrentParagraphProtection] = useState(paragraphProtection);

  const showToast = (status, message) => {
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

  const handleToggler = () => {
    setToggle(!isToggled);
  }

  const handleEditCapsSlideOver = () => {
    setCapsSlided(!isCapsSlided);
    if(!isCapsSlided) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }

  const handleEditWordSlideOver = () => {
    setWordSlided(!isWordSlided);
    if(!isWordSlided) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }

  const handleEditLinkSlideOver = () => {
    setLinkSlided(!isLinkSlided);
    if(!isLinkSlided) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }

  const handleEditSymbolSlideOver = () => {
    setSymbolSlided(!isSymbolSlided);
    if(!isSymbolSlided) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }

  const handleEditParagraphSlideOver = () => {
    setParagraphSlided(!isParagraphSlided);
    if(!isParagraphSlided) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }

  const handleCapsProtectionAction = (updatedCapsProtection) => {
    setCurrentCapsProtection(updatedCapsProtection);
  }

  const handleWordProtectionAction = (updatedWordProtection) => {
    setCurrentWordProtection(updatedWordProtection);
  }

  const handleLinkProtectionAction = (updatedLinkProtection) => {
    setCurrentLinkProtection(updatedLinkProtection);
  }

  const handleSymbolProtectionAction = (updatedSymbolProtection) => {
    setCurrentSymbolProtection(updatedSymbolProtection);
  }

  const handleParagraphProtectionAction = (updatedParagraphProtection) => {
    setCurrentParagraphProtection(updatedParagraphProtection);
  }

  const handleChangeCapsProtectionStatus = async (e) => {
    try {
      e.preventDefault();
      const newStatus = currentCapsProtection.status === "on" ? "off" : "on";
      const { data, status } = await axios.put(`/api/mod-tools/caps-protection/${currentCapsProtection.id}`, {
        status: newStatus,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`
        }
      }).then(res => res).catch(error => {
        console.log(error.response);
        return error.response;
      });

      if(!(status === 204 || status === 201 || status === 200)) {
        throw new Error("Unable to Edit Caps Protection");
      }

      const updatedCapsProtection = data;
      handleCapsProtectionAction(updatedCapsProtection);
      showToast('success', `Caps Protection successfully updated`);
    } catch(error) {
      if(!error.message) {
        showToast('error', `Unable to update Caps Protection`);
      }
      showToast('error', error.message);
    }
  }

  const handleChangeWordProtectionStatus = async (e) => {
    try {
      e.preventDefault();
      const newStatus = currentWordProtection.status === "on" ? "off" : "on";
      const { data, status } = await axios.put(`/api/mod-tools/word-protection/${currentWordProtection.id}`, {
        status: newStatus,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`
        }
      }).then(res => res).catch(error => {
        console.log(error.response);
        return error.response;
      });

      if(!(status === 204 || status === 201 || status === 200)) {
        throw new Error("Unable to Edit Word Protection");
      }

      const updatedWordProtection = data;
      handleWordProtectionAction(updatedWordProtection);
      showToast('success', `Word Protection successfully updated`);
    } catch(error) {
      if(!error.message) {
        showToast('error', `Unable to update Word Protection`);
      }
      showToast('error', error.message);
    }
  }

  const handleChangeLinkProtectionStatus = async (e) => {
    try {
      e.preventDefault();
      const newStatus = currentLinkProtection.status === "on" ? "off" : "on";
      const { data, status } = await axios.put(`/api/mod-tools/link-protection/${currentLinkProtection.id}`, {
        status: newStatus,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`
        }
      }).then(res => res).catch(error => {
        console.log(error.response);
        return error.response;
      });

      if(!(status === 204 || status === 201 || status === 200)) {
        throw new Error("Unable to Edit Link Protection");
      }

      const updatedLinkProtection = data;
      handleLinkProtectionAction(updatedLinkProtection);
      showToast('success', `Link Protection successfully updated`);
    } catch(error) {
      if(!error.message) {
        showToast('error', `Unable to update Link Protection`);
      }
      showToast('error', error.message);
    }
  }

  const handleChangeSymbolProtectionStatus = async (e) => {
    try {
      e.preventDefault();
      const newStatus = currentSymbolProtection.status === "on" ? "off" : "on";
      const { data, status } = await axios.put(`/api/mod-tools/symbol-protection/${currentSymbolProtection.id}`, {
        status: newStatus,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`
        }
      }).then(res => res).catch(error => {
        console.log(error.response);
        return error.response;
      });

      if(!(status === 204 || status === 201 || status === 200)) {
        throw new Error("Unable to Edit Symbol Protection");
      }

      const updatedSymbolProtection = data;
      handleSymbolProtectionAction(updatedSymbolProtection);
      showToast('success', `Symbol Protection successfully updated`);
    } catch(error) {
      if(!error.message) {
        showToast('error', `Unable to update Symbol Protection`);
      }
      showToast('error', error.message);
    }
  }

  const handleChangeParagraphProtectionStatus = async (e) => {
    try {
      e.preventDefault();
      const newStatus = currentParagraphProtection.status === "on" ? "off" : "on";
      const { data, status } = await axios.put(`/api/mod-tools/paragraph-protection/${currentParagraphProtection.id}`, {
        status: newStatus,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`
        }
      }).then(res => res).catch(error => {
        console.log(error.response);
        return error.response;
      });

      if(!(status === 204 || status === 201 || status === 200)) {
        throw new Error("Unable to Edit Paragraph Protection");
      }

      const updatedParagraphProtection = data;
      handleParagraphProtectionAction(updatedParagraphProtection);
      showToast('success', `Paragraph Protection successfully updated`);
    } catch(error) {
      if(!error.message) {
        showToast('error', `Unable to update Paragraph Protection`);
      }
      showToast('error', error.message);
    }
  }

  return (
    <>
      <div className="relative min-h-screen max-h-screen md:flex bg-gray-900">
        <Topbar onToggleMenu={handleToggler} isToggled={ isToggled } />
        <Sidebar user={ user } isToggled={ isToggled } />
        <div className="relative w-full h-full overflow-auto max-h-screen">
          <div className="px-9 py-28 md:py-20">
          <div className="mb-10">
              <h1 className="text-2xl text-gray-200 font-bold">Mod Tools</h1>
              <h6 className="font-semibold text-gray-400">Tools to help you keep your chat under control (or away from being toxic).</h6>
            </div>
            <div className="py-4 px-2 text-white text-right font-bold">
              5 Moderation Tools
            </div>
            <div className="flex mb-10">
              <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="flex flex-col justify-between rounded-lg p-5 text-white hover:shadow-xl bg-gray-800 border border-gray-800">
                  <div className="flex flex-col justify-between md:flex-row">
                    <div>
                      <div className="text-white font-bold text-lg">Word Protection</div>
                      <div className="text-gray-500">Prevent users from using obnoxious language in your chat (or just the words you don't like).</div>
                    </div>
                  </div>
                  <div className="pt-4 rounded-b-lg text-white flex flex-row justify-end md:justify-start">
                    <button className="text-gray-400 hover:text-gray-500 px-3 transition-all duration-500" onClick={handleChangeWordProtectionStatus}>
                      {
                        currentWordProtection.status === "on" ?
                          <FontAwesomeIcon className="h-5 w-5 inline-block text-green-600" icon={faToggleOn}></FontAwesomeIcon>
                        :
                          <FontAwesomeIcon className="h-5 w-5 inline-block text-gray-600" icon={faToggleOff}></FontAwesomeIcon>
                      }
                    </button>
                    <button onClick={handleEditWordSlideOver} className="text-blue-400 hover:text-blue-500 px-3 transition-all">
                      <FontAwesomeIcon className="h-5 w-5 inline-block" icon={faPen}></FontAwesomeIcon>
                    </button>
                  </div>
                </div>
                <div className="flex flex-col justify-between rounded-lg p-5 text-white hover:shadow-xl bg-gray-800 border border-gray-800">
                  <div className="flex flex-col justify-between md:flex-row">
                    <div>
                      <div className="text-white font-bold text-lg">Link Protection</div>
                      <div className="text-gray-500">Prevent users from posting links.</div>
                    </div>
                  </div>
                  <div className="pt-4 rounded-b-lg text-white flex flex-row justify-end md:justify-start">
                    <button className="text-gray-400 hover:text-gray-500 px-3 transition-all duration-500" onClick={handleChangeLinkProtectionStatus}>
                      {
                        currentLinkProtection.status === "on" ?
                          <FontAwesomeIcon className="h-5 w-5 inline-block text-green-600" icon={faToggleOn}></FontAwesomeIcon>
                        :
                          <FontAwesomeIcon className="h-5 w-5 inline-block text-gray-600" icon={faToggleOff}></FontAwesomeIcon>
                      }
                    </button>
                    <button onClick={handleEditLinkSlideOver} className="text-blue-400 hover:text-blue-500 px-3 transition-all">
                      <FontAwesomeIcon className="h-5 w-5 inline-block" icon={faPen}></FontAwesomeIcon>
                    </button>
                  </div>
                </div>
                <div className="flex flex-col justify-between rounded-lg p-5 text-white hover:shadow-xl bg-gray-800 border border-gray-800">
                  <div className="flex flex-col justify-between md:flex-row">
                    <div>
                      <div className="text-white font-bold text-lg">Caps Protection</div>
                      <div className="text-gray-500">Prevent users from using too many capitalized letters in chat.</div>
                    </div>
                  </div>
                  <div className="pt-4 rounded-b-lg text-white flex flex-row justify-end md:justify-start">
                    <button className="text-gray-400 hover:text-gray-500 px-3 transition-all duration-500" onClick={handleChangeCapsProtectionStatus}>
                      {
                        currentCapsProtection.status === "on" ?
                          <FontAwesomeIcon className="h-5 w-5 inline-block text-green-600" icon={faToggleOn}></FontAwesomeIcon>
                        :
                          <FontAwesomeIcon className="h-5 w-5 inline-block text-gray-600" icon={faToggleOff}></FontAwesomeIcon>
                      }
                    </button>
                    <button onClick={handleEditCapsSlideOver} className="text-blue-400 hover:text-blue-500 px-3 transition-all">
                      <FontAwesomeIcon className="h-5 w-5 inline-block" icon={faPen}></FontAwesomeIcon>
                    </button>
                  </div>
                </div>
                <div className="flex flex-col justify-between rounded-lg p-5 text-white hover:shadow-xl bg-gray-800 border border-gray-800">
                  <div className="flex flex-col justify-between md:flex-row">
                    <div>
                      <div className="text-white font-bold text-lg">Symbol Protection</div>
                      <div className="text-gray-500">Prevent users from using too many symbols in chat.</div>
                    </div>
                  </div>
                  <div className="pt-4 rounded-b-lg text-white flex flex-row justify-end md:justify-start">
                    <button className="text-gray-400 hover:text-gray-500 px-3 transition-all duration-500" onClick={handleChangeSymbolProtectionStatus}>
                      {
                        currentSymbolProtection.status === "on" ?
                          <FontAwesomeIcon className="h-5 w-5 inline-block text-green-600" icon={faToggleOn}></FontAwesomeIcon>
                        :
                          <FontAwesomeIcon className="h-5 w-5 inline-block text-gray-600" icon={faToggleOff}></FontAwesomeIcon>
                      }
                    </button>
                    <button onClick={handleEditSymbolSlideOver} className="text-blue-400 hover:text-blue-500 px-3 transition-all">
                      <FontAwesomeIcon className="h-5 w-5 inline-block" icon={faPen}></FontAwesomeIcon>
                    </button>
                  </div>
                </div>
                <div className="flex flex-col justify-between rounded-lg p-5 text-white hover:shadow-xl bg-gray-800 border border-gray-800">
                  <div className="flex flex-col justify-between md:flex-row">
                    <div>
                      <div className="text-white font-bold text-lg">Paragraph Protection</div>
                      <div className="text-gray-500">Prevent users from writing long texts in chat.</div>
                    </div>
                  </div>
                  <div className="pt-4 rounded-b-lg text-white flex flex-row justify-end md:justify-start">
                    <button className="text-gray-400 hover:text-gray-500 px-3 transition-all duration-500" onClick={handleChangeParagraphProtectionStatus}>
                      {
                        currentParagraphProtection.status === "on" ?
                          <FontAwesomeIcon className="h-5 w-5 inline-block text-green-600" icon={faToggleOn}></FontAwesomeIcon>
                        :
                          <FontAwesomeIcon className="h-5 w-5 inline-block text-gray-600" icon={faToggleOff}></FontAwesomeIcon>
                      }
                    </button>
                    <button onClick={handleEditParagraphSlideOver} className="text-blue-400 hover:text-blue-500 px-3 transition-all">
                      <FontAwesomeIcon className="h-5 w-5 inline-block" icon={faPen}></FontAwesomeIcon>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
      <EditCapsProtectionForm onToggleSlider={handleEditCapsSlideOver} isSlided={isCapsSlided} showToast={showToast} access_token={access_token} user={user} capsProtection={currentCapsProtection} handleAction={handleCapsProtectionAction}/>
      <EditSymbolProtectionForm onToggleSlider={handleEditSymbolSlideOver} isSlided={isSymbolSlided} showToast={showToast} access_token={access_token} user={user} symbolProtection={currentSymbolProtection} handleAction={handleSymbolProtectionAction}/>
      <EditParagraphProtectionForm onToggleSlider={handleEditParagraphSlideOver} isSlided={isParagraphSlided} showToast={showToast} access_token={access_token} user={user} paragraphProtection={currentParagraphProtection} handleAction={handleParagraphProtectionAction}/>
      <EditWordProtectionForm onToggleSlider={handleEditWordSlideOver} isSlided={isWordSlided} showToast={showToast} access_token={access_token} user={user} wordProtection={currentWordProtection} handleAction={handleWordProtectionAction}/>
      <EditLinkProtectionForm onToggleSlider={handleEditLinkSlideOver} isSlided={isLinkSlided} showToast={showToast} access_token={access_token} user={user} linkProtection={currentLinkProtection} handleAction={handleLinkProtectionAction}/>
    </>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;
  const { cookies } = req;
  const { access_token } = cookies;
  const user = await getUser(context);
  const wordProtection = await getWordProtection(context);
  const linkProtection = await getLinkProtection(context);
  const symbolProtection = await getSymbolProtection(context);
  const paragraphProtection = await getParagraphProtection(context);
  const capsProtection = await getCapsProtection(context);

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
      wordProtection,
      linkProtection,
      symbolProtection,
      paragraphProtection,
      capsProtection,
      access_token,
    }
  }
}

export default Dashboard;