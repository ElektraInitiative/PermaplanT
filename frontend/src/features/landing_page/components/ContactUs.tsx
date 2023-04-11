import { useState } from 'react';

const ContactUs = () => {
  const [message, setMessage] = useState('');
  const email = 'office@permaplant.net';

  return (
    <section className="body-font relative w-full">
      <div className="container mx-auto py-24">
        <div className="mb-12 flex flex-col text-center">
          <h1 className="title-font mb-4 text-2xl font-medium sm:text-3xl">Contact Us</h1>
          <p className="mx-auto text-base leading-relaxed lg:w-2/3">
            Whatever cardigan tote bag tumblr hexagon brooklyn asymmetrical gentrify.
          </p>
        </div>
        <div className="mx-auto w-full">
          <div className="-m-2 flex flex-wrap">
            <div className="w-full p-2">
              <div className="relative">
                <label htmlFor="message" className="text-sm leading-7 text-gray-600">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  className="h-32 w-full resize-none rounded border border-gray-300 bg-gray-100 bg-opacity-50 py-1 px-3 text-base leading-6 text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                ></textarea>
              </div>
            </div>
            <div className="w-full p-2">
              <a
                href={`mailto:${email}?subject=first%20contact&body=${encodeURIComponent(message)}`}
              >
                <button className="mx-auto flex rounded border-0 bg-primary-500 py-2 px-8 text-primary-50 hover:bg-primary-600 focus:outline-none dark:bg-primary-300 dark:text-primary-700 dark:hover:bg-primary-200">
                  Compose email
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
