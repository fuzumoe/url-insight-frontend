import React from 'react';
import { FaBars, FaBell, FaUser, FaSearch } from 'react-icons/fa';
import { Box, Flex } from './';
import Typography from '../common/Typography';
import Button from '../common/Button';

interface HeaderProps {
  toggleSidebar?: () => void;
  title?: string;
}

const Header: React.FC<HeaderProps> = ({
  toggleSidebar,
  title = 'URL Insight',
}) => {
  return (
    <header className="sticky top-0 z-40">
      <Box background="white" shadow="sm" padding="sm">
        <Flex justify="between" align="center">
          {/* Left side - Toggle button and title */}
          <Flex align="center" gap="md">
            <Button
              variant="secondary"
              size="sm"
              onClick={toggleSidebar}
              className="lg:hidden"
              aria-label="Toggle sidebar"
            >
              <FaBars className="h-4 w-4" />
            </Button>
            <Typography
              variant="h4"
              as="h1"
              className="text-xl font-semibold text-gray-800"
            >
              {title}
            </Typography>
          </Flex>

          {/* Right side - Search, notifications, user */}
          <Flex align="center" gap="md">
            {/* Search input - hidden on mobile */}
            <Box className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search..."
                className="bg-gray-100 px-4 py-2 pr-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FaSearch className="absolute right-3 top-2.5 text-gray-500" />
            </Box>

            {/* Notifications button */}
            <Button
              variant="secondary"
              size="sm"
              className="relative"
              aria-label="Notifications"
            >
              <FaBell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 block h-2 w-2 rounded-full bg-red-500"></span>
            </Button>

            {/* User profile button */}
            <Button
              variant="secondary"
              size="sm"
              className="rounded-full p-2"
              aria-label="User menu"
            >
              <Box
                background="blue-50"
                rounded="full"
                className="h-6 w-6 bg-blue-500 flex items-center justify-center text-white"
              >
                <FaUser className="h-3 w-3" />
              </Box>
            </Button>
          </Flex>
        </Flex>
      </Box>
    </header>
  );
};

export default Header;
