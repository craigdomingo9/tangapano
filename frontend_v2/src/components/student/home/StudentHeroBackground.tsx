import React from "react";

function StudentHeroBackground() {
  return (
    <div className="bg-crimson dark:bg-red-900 h-[520px] sm:h-[480px] w-full absolute top-0 left-0 rounded-b-[3rem] shadow-lg overflow-hidden transition-colors duration-300">
      <div className="absolute inset-0 opacity-10"></div>
      <div className="absolute inset-0 bg-linear-to-b from-black/10 to-transparent"></div>
    </div>
  );
}

export default StudentHeroBackground;
