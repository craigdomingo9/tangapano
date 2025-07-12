import Link from "next/link"


function Header() {
  return (
    <div className="flex justify-center sticky z-50 top-0 p-4 h-24 text-white">
      <div className="flex items-center justify-between w-full max-w-3xl px-1">
        <div>
          <Link href={"/"} className="text-2xl font-bold">TangaPano</Link>
          <p className="text-sm font-light">Secure your accommodation now!</p>
        </div>
        <div>
          <div>
            <Link href={"/login"} className="underline underline-offset-2">Login</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
