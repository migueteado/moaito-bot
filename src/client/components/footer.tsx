import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faTwitch, faTwitter, faFacebook } from '@fortawesome/free-brands-svg-icons';
import Link from 'next/link';

function Footer() {
  return (
    <div className="min-w-full bg-gray-900 border-t border-gray-800 pb-10">
      <div className="flex justify-center items-center py-4 px-6">
        <div className="flex flex-col text-center md:flex-row space-y-4 md:space-y-0 md:space-x-8 text-gray-400 font-semibold">
          <Link href="/about">
            <a className="hover:text-white" href="">About</a>
          </Link>
          <a className="hover:text-white" href="https://blog.itsmoaito.com/">Blog</a>
          <Link href="/help">
            <a className="hover:text-white" href="">Help Center</a>
          </Link>
        </div>
      </div>
      <div className="flex items-center justify-center py-2">
        <div className="flex flex-row space-x-8 text-gray-600 text-xl">
          
          <a className="hover:text-gray-200 transition-all" target="_blank" href="https://www.twitch.tv/moaitotv">
            <FontAwesomeIcon icon={faTwitch}></FontAwesomeIcon>
          </a>
          <a className="hover:text-gray-200 transition-all" target="_blank" href="https://twitter.com/moaitodev">
            <FontAwesomeIcon icon={faTwitter}></FontAwesomeIcon>
          </a>
          <a className="hover:text-gray-200 transition-all" target="_blank" href="https://www.instagram.com/itsmoaito/">
            <FontAwesomeIcon icon={faInstagram}></FontAwesomeIcon>
          </a>
          <a className="hover:text-gray-200 transition-all" target="_blank" href="https://www.facebook.com/itsmoaito">
            <FontAwesomeIcon icon={faFacebook}></FontAwesomeIcon>
          </a>
        </div>
      </div>
      <div className="flex items-center justify-center py-2">
        <div className="font-semibold text-gray-600">
          <a className="hover:text-gray-200 transition-all" href="https://itsmoaito.com/">Made with ❤️ by MoaitoDev</a>
        </div>
      </div>
    </div>
  );
}

export default Footer;