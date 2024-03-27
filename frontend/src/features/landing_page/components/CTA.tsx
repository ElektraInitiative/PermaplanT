// TODO: determine what kind of CTA this is and change accordingly

const CTA = () => {
  return (
    <section className="body-font text-gray-600">
      <div className="container mx-auto flex flex-wrap items-center py-24">
        <div className="pr-0 md:w-full md:pr-16 lg:w-1/2 lg:pr-0">
          <h1 className="title-font text-3xl font-medium text-gray-900">
            Slow-carb next level shoindcgoitch ethical authentic, poko scenester
          </h1>
          <p className="mt-4 leading-relaxed">
            Poke slow-carb mixtape knausgaard, typewriter street art gentrify hammock starladder
            roathse. Craies vegan tousled etsy austin.
          </p>
        </div>
        <div className="mt-10 flex w-full flex-col rounded-lg bg-gray-100 p-8 md:ml-auto md:mt-0 md:w-full lg:w-1/2 dark:bg-neutral-300-dark">
          <h2 className="title-font mb-5 text-lg font-medium text-gray-900">Sign Up</h2>
          <div className="relative mb-4">
            <label htmlFor="full-name" className="text-sm leading-7 text-gray-600">
              Full Name
            </label>
            <input
              type="text"
              id="full-name"
              name="full-name"
              className="w-full rounded border border-gray-300 bg-white px-3 py-1 text-base leading-8 text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>
          <div className="relative mb-4">
            <label htmlFor="email" className="text-sm leading-7 text-gray-600">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full rounded border border-gray-300 bg-white px-3 py-1 text-base leading-8 text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>
          <button className="rounded border-0 bg-primary-500 px-8 py-2 text-lg text-primary-50 hover:bg-primary-600 focus:outline-none dark:bg-primary-300 dark:text-primary-700 dark:hover:bg-primary-200">
            Button
          </button>
          <p className="mt-3 text-xs text-gray-500">
            Literally you probably havent heard of them jean shorts.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
