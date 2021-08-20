function Custom404() {
  return (
    <div className="flex items-center min-h-screen min-w-full bg-gray-900">
      <div className="container mx-auto px-5">
        <h4 className="font-extrabold text-gray-200">Error 404</h4>
        <h1 className="py-6 text-2xl font-bold text-gray-400 border-b-2 border-gray-800">Not everyone that is wandering is lost, but you certainly are...</h1>
        <p className="py-6 text-lg text-gray-400">We couldn't find the page you were looking for, but we can show you the way to our <a className="text-green-500 font-semibold hover:text-green-700" href="/">Home</a>.</p>
      </div>
    </div>
  );
}

export default Custom404;