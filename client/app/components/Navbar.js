"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-white shadow-lg backdrop-blur-lg">
      <div className="flex justify-between items-center px-4 sm:px-8 lg:px-16 py-4">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <Image
            src="/busify-logo.svg"
            alt="DriveNow Logo"
            width={40}
            height={40}
          />
          <span className="text-2xl font-bold text-orange-600">DriveNow</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="#"
            onClick={closeMenu}
            className="hover:text-orange-600 transition-colors duration-300"
          >
            Home
          </Link>
          <Link
            href="#about"
            onClick={closeMenu}
            className="hover:text-orange-600 transition-colors duration-300"
          >
            About
          </Link>
          <Link
            href="#services"
            onClick={closeMenu}
            className="hover:text-orange-600 transition-colors duration-300"
          >
            Services
          </Link>
          <Link
            href="#contact"
            onClick={closeMenu}
            className="hover:text-orange-600 transition-colors duration-300"
          >
            Contact
          </Link>
          <Link
            href="/login"
            className="bg-orange-500 text-white px-4 py-2 rounded-xl hover:bg-orange-600 transition duration-300"
          >
            Get Started
          </Link>
        </nav>

        {/* Mobile Hamburger */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 rounded-md text-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden px-6 pt-2 pb-4 bg-white space-y-4 transition-all duration-300 ease-in-out ${
          isOpen ? "block" : "hidden"
        }`}
      >
        <Link
          href="#"
          onClick={closeMenu}
          className="block hover:text-orange-600"
        >
          Home
        </Link>
        <Link
          href="#about"
          onClick={closeMenu}
          className="block hover:text-orange-600"
        >
          About
        </Link>
        <Link
          href="#services"
          onClick={closeMenu}
          className="block hover:text-orange-600"
        >
          Services
        </Link>
        <Link
          href="#contact"
          onClick={closeMenu}
          className="block hover:text-orange-600"
        >
          Contact
        </Link>
        <Link
          href="/login"
          onClick={closeMenu}
          className="inline-block w-full text-center bg-orange-500 text-white px-4 py-2 rounded-xl hover:bg-orange-600 transition"
        >
          Get Started
        </Link>
      </div>
    </header>
  );
}
