import { faQuestion, faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

function QuestionTooltip({ content }) {
  const [shown, setShown] = useState(false);

  const handleTooltip = (e) => {
    e.preventDefault();
    setShown(!shown);
  }

  return (
    <>
    <div className="inline-block relative px-2">
      <button className="text-xs text-gray-500" onMouseEnter={handleTooltip} onMouseLeave={handleTooltip} onClick={e => e.preventDefault()}>
        <FontAwesomeIcon className="inline-block" icon={faQuestionCircle}></FontAwesomeIcon>
      </button>
      <div className={shown ? "text-xs absolute z-10 w-36 left-full -top-1 bg-gray-600 rounded-lg p-2 shadow-lg text-center" : "hidden"}>
        <span>{content}</span>
        <div className="absolute bg-gray-600 h-3 w-3 transform rotate-45 top-2 -left-1"></div>
      </div>
    </div>
    </>
  );
}

export default QuestionTooltip;