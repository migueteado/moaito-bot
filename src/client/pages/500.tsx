function Custom500() {
  return (
    <div className="flex items-center min-h-screen min-w-full">
      <div className="container mx-auto">
        <h4 className="font-extrabold text-gray-400">Error 500</h4>
        <h1 className="py-6 text-2xl font-bold text-gray-700 border-b-2">Woops! you found a hole...</h1>
        <p className="py-6 text-lg">It looks like an error interrupted your action, please try again or <a className="text-indigo-500 font-semibold hover:text-indigo-700" href="/help">Look for Help</a>.</p>
      </div>
    </div>
  );
}

export default Custom500;