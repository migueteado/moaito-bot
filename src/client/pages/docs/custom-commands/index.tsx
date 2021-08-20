import Footer from '../../../components/footer';
import DocsSidebar from '../../../components/docs-sidebar';
import DocsTopbar from "../../../components/docs-topbar";
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faToggleOff, faToggleOn, faPlus, faPen } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

function DocsCustomCommands() {
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
              <h1 className="font-bold text-4xl text-left text-gray-200 mb-8">Custom Commands</h1>
            </div>
            <div className="mb-20">
              <h5 className="font-bold text-2xl text-left text-gray-200">Creating a Custom Command</h5>
              <h6 className="font-semibold text-lg text-gray-400 mb-8">Learn how to create your own custom commands</h6>
              <p className="text-white">
                1. In your <Link href="/dashboard/chatbot/custom-commands"><a className="text-green-500 font-semibold hover:text-green-700">Custom Commands Tab</a></Link> open the Create Command Window by Clicking on the <FontAwesomeIcon className="w-5 h-5 mx-2 text-green-500" icon={faPlus}></FontAwesomeIcon> button in the lower right corner of your screen.
                <br />
                2. Fill the fields with the information of your preference.
                <br />
              </p>
                <div className="text-white rounded-lg bg-gray-900 border border-gray-800 my-4 gap-x-2 gap-y-6">
                  <div className="py-4 px-4 bg-gray-800 text-gray-200 font-semibold">
                    Custom Command Form field fescription
                  </div>
                  <div className="py-4 px-4">
                    <div className="text-pink-600 font-bold">Command (required)</div>
                    <div className="mb-4">Is a text field that can only contain alphanumeric characters except for the required exclamation sign (!) at the begining. No whitespaces allowed.</div>
                    <div className="text-pink-600 font-bold">Command Type</div>
                    <div className="mb-4">Is a select field with 3 possible options: 
                      <br />
                      <span className="font-bold">Simple:</span> Can only have one Response.
                      <br />
                      <span className="font-bold">Variant:</span> Can have many different Responses from where the bot will randomly pick one each time it reacts to the command.
                      <br />
                      <span className="font-bold">Chain:</span> Can have a Response that consists of many separated messages in the given order.
                    </div>
                    <div className="text-pink-600 font-bold">User Level</div>
                    <div className="mb-4">Is a select field, it determines the type of user that is allowed to trigger the command in chat.</div>
                    <div className="text-pink-600 font-bold">Description (required)</div>
                    <div className="mb-4">Is a brief description used to understand what your command does.</div>
                    <div className="text-pink-600 font-bold">Response (required)</div>
                    <div className="mb-4">Is the response MoaitoBot will provide when the command is triggered. It can be mor ethan one depending on the Command Type you chose</div>
                    <div className="text-pink-600 font-bold">Global Cooldown</div>
                    <div className="mb-4">Is the time in seconds that has to pass for the command to be available for triggering again, by default is 0</div>
                    <div className="text-pink-600 font-bold">User Cooldown</div>
                    <div className="mb-4">Is the time in seconds that a user has to wait to be able to trigger the command again.</div>
                    <div className="text-pink-600 font-bold">Aliases</div>
                    <div className="mb-4">Other ways to call this command. For example if your command is !greeting another way to call it could be !hello.</div>
                    <div className="text-pink-600 font-bold">Keywords</div>
                    <div className="mb-4">Special words that when detected in your chat would trigger the command. For example if your command if !greeting probably the word "hello" could trigger it too.</div>
                  </div>
                </div>
              <p className="text-white">
                3. Save the information.
                <br />
                4. Enjoy your new Custom Command!
              </p>
            </div>
            <div className="mb-20">
              <h5 className="font-bold text-2xl text-left text-gray-200">Enabling / Disabling your Custom Commands</h5>
              <h6 className="font-semibold text-lg text-gray-400 mb-8">Learn how to pause your custom commands</h6>
              <p className="text-white">To Enable / Disable your custom command you have to go to your <Link href="/dashboard/chatbot/custom-commands"><a className="text-green-500 font-semibold hover:text-green-700">Custom Commands Tab</a></Link> inside your Dashboard and clicking the <FontAwesomeIcon className="w-5 h-5 text-gray-400 ml-2" icon={faToggleOn}></FontAwesomeIcon> / <FontAwesomeIcon className="w-5 h-5 text-gray-400 mr-2" icon={faToggleOff}></FontAwesomeIcon> in the card of the custom command you want to enable / disable. It will be updated showing a notification.</p>
            </div>
            <div className="mb-20">
              <h1 className="font-bold text-2xl text-left text-gray-200">Editing your existing Custom Commmands</h1>
              <h6 className="font-semibold text-lg text-gray-400 mb-8">Learn how to make changes to your custom commands</h6>
              <p className="text-white">To edit your Custom Command go to your <Link href="/dashboard/chatbot/custom-commands"><a className="text-green-500 font-semibold hover:text-green-700">Custom Commands Tab</a></Link> and click the <FontAwesomeIcon className="w-5 h-5 mx-2 text-blue-600" icon={faPen}></FontAwesomeIcon> in the card of the custom command you want to edit. It will open the Edit Command Window similarly to what we describe above in the Create Command Window (see above). Make the changes you want and Save them.</p>
            </div>
            <div className="mb-20">
              <h1 className="font-bold text-2xl text-left text-gray-200">Deleting your existing Custom Commmands</h1>
              <h6 className="font-semibold text-lg text-gray-400 mb-8">Learn how to remove your custom commands</h6>
              <p className="text-white">Deleting your custom command is as easy going to your <Link href="/dashboard/chatbot/custom-commands"><a className="text-green-500 font-semibold hover:text-green-700">Custom Commands Tab</a></Link> inside your Dashboard and clicking the <FontAwesomeIcon className="w-5 h-5 mx-2 text-red-600" icon={faTrash}></FontAwesomeIcon> in the card of the custom command you want to delete. It will be deleted showing a notification.</p>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}

export default DocsCustomCommands;