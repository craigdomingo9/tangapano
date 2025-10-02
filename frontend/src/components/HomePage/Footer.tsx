"use client";

function Footer() {
  const date = new Date();
  const year = date.getFullYear();

  return (
    <div>
      <hr />
      <div className="flex justify-center w-full">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © {year}{" "}
          <a href={window.location.origin} className="hover:underline">
            TangaPano
          </a>
          . All Rights Reserved.
        </p>
      </div>
    </div>
  );
}

export default Footer;
