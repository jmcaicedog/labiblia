import React from "react";
import { FaBookBible } from "react-icons/fa6";
import { FaGear } from "react-icons/fa6";
import Image from "next/image";
import logo from "../assets/logo.png";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Navbar = () => {
  const { push } = useRouter();
  return (
    <div className="sticky top-0 z-50 flex items-center justify-between bg-palorosa px-4 py-4 border-b-2  shadow-lg mb-5">
      <div className="">
        <button onClick={() => push("/")}>
          <FaBookBible className="w-7 h-7 text-cafe" />
        </button>
      </div>
      <div className="">
        <div className="">
          <Link href="/">
            <Image src={logo} className="w-20" alt="Mi Roca Logo" />
          </Link>
        </div>
      </div>

      <div className="w-10 h-10 text-cafe flex items-center justify-center">
        <button onClick={() => push("/login")}>
          <FaGear className="text-[28px]" />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
