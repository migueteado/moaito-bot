import 'tailwindcss/tailwind.css'
import Head from 'next/head'
import { ToastContainer } from 'react-toastify'
import '../styles.css'
import 'react-toastify/dist/ReactToastify.css';
import NProgress from 'nprogress';
import { Router } from 'next/router';
import axios from 'axios';

NProgress.configure({ ease: 'ease', speed: 500 });
NProgress.configure({ trickleSpeed: 800 });
NProgress.configure({ showSpinner: false });
NProgress.configure({ parent: '#__next' });
NProgress.configure({
  template: '<div class="bar z-50 bg-purple-500" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
});

const contextClass = {
  success: "bg-green-600",
  error: "bg-red-600",
  info: "bg-gray-600",
  warning: "bg-yellow-600",
  default: "bg-indigo-600",
  dark: "bg-white-600 font-gray-300",
};

export default function MyApp({ Component, pageProps }) {
  Router.events.on("routeChangeStart", (url) => {
    if(!(typeof window === 'undefined')) {
      NProgress.start();
      NProgress.set(0.4);
    }
  });

  Router.events.on("routeChangeComplete", (url) => {
    if(!(typeof window === 'undefined')) {
      NProgress.done();
    }
  });

  axios.interceptors.request.use((config) => {
    if(!(typeof window === 'undefined')) {
      NProgress.start();
      NProgress.set(0.4);
    }
    return config;
  }, (error) => {
    if(!(typeof window === 'undefined')) {
      NProgress.done();
    }
    return Promise.reject(error);
  });

  axios.interceptors.response.use((response) => {
    if(!(typeof window === 'undefined')) {
      NProgress.done();
    }
    return response;
  }, (error) => {
    if(!(typeof window === 'undefined')) {
      NProgress.done();
    }
    return Promise.reject(error);
  });

  return (
    <>
      <Head>
        <title>Moaito Bot: the new twitch experience</title>
      </Head>
      <Component {...pageProps} />
      <ToastContainer
      toastClassName={({ type }) => contextClass[type || "default"] + 
        " relative flex py-2 px-3 min-h-10 rounded-lg justify-between overflow-hidden cursor-pointer"
      }
      bodyClassName={() => "font-white font-semibold block"}
      position="bottom-center"
      autoClose={10000}
    />
    </>
  );
}
