import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (

    <>
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to Campus Connect</h1>
          <p className="text-lg mb-8">
            Connect with your campus community, discover events, and stay engaged.
          </p>
          <Link href={"/auth/sign-up"} className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100">
            Join Now
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center mb-8">Features</h2>
          <div className="flex flex-wrap justify-center">
            <div className="w-full sm:w-1/2 lg:w-1/4 p-4">
              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="mb-4">
                  {/* Icon */}
                  <svg className="w-12 h-12 mx-auto text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m-6 0h6m6-7a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Event Management</h3>
                <p className="text-gray-700">Easily organize and participate in campus events.</p>
              </div>
            </div>
           
            <div className="w-full sm:w-1/2 lg:w-1/4 p-4">
              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="mb-4">
                  {/* Icon */}
                  <svg className="w-12 h-12 mx-auto text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-4.418 0-8 2.015-8 4.5S7.582 17 12 17s8-2.015 8-4.5S16.418 8 12 8zm0-4c-1.5 0-2.815 1.79-3.452 4.002A5.988 5.988 0 0112 8c1.372 0 2.636-.383 3.452-1.002C14.815 5.79 13.5 4 12 4z" /></svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Community Building</h3>
                <p className="text-gray-700">Foster a sense of community on campus.</p>
              </div>
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/4 p-4">
              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="mb-4">
                  {/* Icon */}
                  <svg className="w-12 h-12 mx-auto text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 12c1.656 0 3-1.344 3-3s-1.344-3-3-3-3 1.344-3 3 1.344 3 3 3zm-9 8h3.879l-1.772-3.545a1.5 1.5 0 112.686-1.326l1.772 3.545H18.22l1.772-3.545a1.5 1.5 0 112.686 1.326L18.12 20H21v2H3v-2z" /></svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Resource Sharing</h3>
                <p className="text-gray-700">Access and share academic resources easily.</p>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Call-to-Action Section */}
      <section className="py-16 bg-blue-500 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-4">Get Started with Campus Connect</h2>
          <p className="text-lg mb-8">Join now and start exploring all that Campus Connect has to offer.</p>
          <Link href={"/auth/sign-up"} className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100">
            Sign Up Today
          </Link>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="py-8 bg-gray-800 text-white text-center">
        <div className="container mx-auto px-4">
          <div className="flex justify-center space-x-6 mb-4">
            <a href="#" className="text-white hover:text-gray-400">About</a>
            <a href="#" className="text-white hover:text-gray-400">Contact</a>
            <a href="#" className="text-white hover:text-gray-400">Privacy Policy</a>
          </div>
          <p>© 2024 Campus Connect. All rights reserved.</p>
        </div>
      </footer>
    </div>
    </>
  );
}
