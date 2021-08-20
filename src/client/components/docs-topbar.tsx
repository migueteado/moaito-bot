
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

function DocsTopbar({ onToggleMenu, isToggled }) {

  const handleToggler = (e) => {
    e.preventDefault();
    onToggleMenu(!isToggled);
  }

  return (
    <div className="fixed flex justify-between items-center bg-gray-900 text-gray-200 w-full border-b border-gray-800 py-6 px-6 md:hidden z-10">
      <div className="text-xl font-extrabold text-white align-middle">
        <a href="/">MoaitoDocs</a>
      </div>
      <div className="text-green-400 font-semibold hover:text-green-300 transition-all">
        <button onClick={handleToggler}>
          {
            isToggled ? 
            <FontAwesomeIcon className="inline-block" icon={faTimes}></FontAwesomeIcon>
            :
            <FontAwesomeIcon className="inline-block" icon={faBars}></FontAwesomeIcon>
          }
        </button>
      </div>
    </div>
  );
}

export default DocsTopbar;