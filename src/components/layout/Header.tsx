import React from 'react';
import { FaBars, FaBell, FaUser, FaSearch } from 'react-icons/fa';

interface HeaderProps {
  toggleSidebar?: () => void;
  title?: string;
}

const Header: React.FC<HeaderProps> = ({
  toggleSidebar,
  title = 'URL Insight',
}) => {
  return (
    <header className="bg-white shadow-sm px-4 py-2 flex items-center justify-between">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="text-gray-600 p-2 rounded-md hover:bg-gray-100 lg:hidden"
          aria-label="Toggle sidebar"
        >
          <FaBars className="h-5 w-5" />
        </button>
        <h1 className="ml-4 text-xl font-semibold text-gray-800">{title}</h1>
      </div>

      <div className="flex items-center">
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="Search..."
            className="bg-gray-100 px-4 py-2 pr-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FaSearch className="absolute right-3 top-2.5 text-gray-500" />
        </div>

        <button className="ml-4 p-2 text-gray-600 hover:text-gray-800 relative">
          <FaBell className="h-5 w-5" />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
        </button>

        <div className="ml-4 relative">
          <button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500">
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
              <FaUser className="h-4 w-4" />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
