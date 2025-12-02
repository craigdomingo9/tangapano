function StudentHeroText() {
  return (
    <div className="flex flex-col items-start justify-start z-40 font-sans pb-12 pt-10 sm:pt-20 text-center sm:text-left w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-[2.05rem] sm:text-[2.75rem] md:text-[3.15rem] font-bold text-white tracking-tight mb-6 drop-shadow-sm leading-[1.1] md:leading-none">
        Find your home <br className="hidden sm:block" /> away from home.
      </h1>
      <p className="text-white/90 text-[0.95rem] sm:text-[1.15rem] font-medium max-w-lg leading-relaxed sm:leading-6">
        Secure, affordable, and comfortable student accommodation near your
        campus. Verified listings only.
      </p>
    </div>
  );
}

export default StudentHeroText;
