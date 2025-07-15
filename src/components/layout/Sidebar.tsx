import React from 'react';
import {
  FaHome,
  FaLink,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  // Navigation items
  const navItems = [
    { icon: <FaHome />, text: 'Dashboard', path: '/dashboard' },
    { icon: <FaLink />, text: 'URLs', path: '/urls' },
    { icon: <FaChartBar />, text: 'Analytics', path: '/analytics' },
    { icon: <FaCog />, text: 'Settings', path: '/settings' },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-30 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 border-b">
          <div className="flex items-center justify-center">
            <h2 className="text-xl font-bold text-blue-600">URL Insight</h2>
          </div>
        </div>

        <nav className="mt-5">
          <ul>
            {navItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className="flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                >
                  <span className="mr-3 text-gray-600">{item.icon}</span>
                  <span>{item.text}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t">
          <button className="flex items-center px-6 py-3 text-gray-700 hover:text-red-600 w-full">
            <FaSignOutAlt className="mr-3" />
            <span>Log out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
