import { useState } from "react";
import { getSource } from "../../../lib/obs-source";
import useSocket from "../../../hooks/useSocket";

function Alert({ source }) {
  const [events, setEvents] = useState([]);
  
  const socket = useSocket('events', event => {
    setEvents(events => [...events, event]);
  });

  return (
    <>
      
    </>
  );
}

export async function getServerSideProps(context) {
  const source = getSource(context);

  if(!source) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  return {
    props: {
      source, 
    },
  };
}

export default Alert;
