const BlogOverview = () => {
  return (
    <section className="body-font overflow-hidden">
      <div className="container mx-auto py-24">
        <div className="-m-12 flex flex-wrap">
          <div className="flex flex-col items-start p-12 md:w-1/2">
            <h2 className="title-font mt-4 mb-4 text-2xl font-medium sm:text-3xl">
              Roof party normcore before they sold out, cornhole vape
            </h2>
            <p className="mb-8 leading-relaxed">
              Live-edge letterpress cliche, salvia fanny pack humblebrag narwhal portland. VHS man
              braid palo santo hoodie brunch trust fund. Bitters hashtag waistcoat fashion axe chia
              unicorn. Plaid fixie chambray 90s, slow-carb etsy tumeric. Cray pug you probably
              havent heard of them hexagon kickstarter craft beer pork chic.
            </p>
            <div className="mb-4 mt-auto flex w-full flex-wrap items-center border-b-2 border-neutral-100 pb-4">
              <span className="mr-3 ml-auto inline-flex items-center text-sm leading-none">
                04.04.2023
              </span>
            </div>
            <a className="inline-flex items-center">
              <img
                alt="blog"
                src="/gallery_images/permaplant_illustration_12.svg"
                className="h-12 w-12 flex-shrink-0 rounded-full object-cover object-center"
              />
              <span className="flex flex-grow flex-col pl-4">
                <span className="title-font font-medium text-primary-500 dark:text-primary-300">
                  Holden Caulfield
                </span>
                <span className="mt-0.5 text-xs tracking-widest text-neutral-400">
                  UI DEVELOPER
                </span>
              </span>
            </a>
          </div>
          <div className="flex flex-col items-start p-12 md:w-1/2">
            <h2 className="title-font mt-4 mb-4 text-2xl font-medium sm:text-3xl">
              Pinterest DIY dreamcatcher gentrify single-origin coffee
            </h2>
            <p className="mb-8 leading-relaxed">
              Live-edge letterpress cliche, salvia fanny pack humblebrag narwhal portland. VHS man
              braid palo santo hoodie brunch trust fund. Bitters hashtag waistcoat fashion axe chia
              unicorn. Plaid fixie chambray 90s, slow-carb etsy tumeric.
            </p>
            <div className="mb-4 mt-auto flex w-full flex-wrap items-center border-b-2 border-neutral-100 pb-4">
              <span className="ml-auto mr-3 inline-flex items-center text-sm leading-none text-neutral-600">
                06.04.2023
              </span>
            </div>
            <a className="inline-flex items-center">
              <img
                alt="blog"
                src="/gallery_images/permaplant_illustration_12.svg"
                className="h-12 w-12 flex-shrink-0 rounded-full object-cover object-center"
              />
              <span className="flex flex-grow flex-col pl-4">
                <span className="title-font font-medium text-primary-500 dark:text-primary-300">
                  Alper Kamu
                </span>
                <span className="mt-0.5 text-xs tracking-widest text-neutral-400">DESIGNER</span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogOverview;
