import React from 'react';
import {
  FaHome,
  FaLink,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Stack, Box, Flex, Button, Typography } from '..';
import { useAuth, useToast } from '../../hooks';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { logout, loading } = useAuth();
  const { addToast } = useToast();

  const navItems = [
    { icon: <FaHome />, text: 'Dashboard', path: '/dashboard' },
    { icon: <FaLink />, text: 'URLs', path: '/urls' },
    { icon: <FaChartBar />, text: 'Analytics', path: '/analytics' },
    { icon: <FaCog />, text: 'Settings', path: '/settings' },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      addToast({
        message: 'You have been logged out successfully',
        variant: 'success',
      });
    } catch (error) {
      console.error('Logout failed:', error);
      addToast({
        message: 'Logout failed, but you have been logged out locally',
        variant: 'warning',
      });
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <Box
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <Box
        as="aside"
        background="white"
        shadow="lg"
        className={`fixed top-0 left-0 h-full w-64 transform transition-transform duration-300 ease-in-out z-30 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header */}
        <Box padding="lg" className="border-b">
          <Flex justify="center" align="center">
            <Typography
              variant="h4"
              as="h2"
              className="text-xl font-bold text-blue-600"
            >
              URL Insight
            </Typography>
          </Flex>
        </Box>

        {/* Navigation */}
        <Box as="nav" padding="none" className="mt-5">
          <Stack spacing="none">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <Box className="mr-3 text-gray-600">{item.icon}</Box>
                <Typography variant="body1">{item.text}</Typography>
              </Link>
            ))}
          </Stack>
        </Box>

        {/* Logout Button */}
        <Box className="absolute bottom-0 w-full border-t" padding="lg">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleLogout}
            fullWidth
            isLoading={loading}
            className="justify-start text-gray-700 hover:text-red-600"
          >
            <Flex align="center" gap="sm">
              <FaSignOutAlt />
              <Typography variant="body2">Log out</Typography>
            </Flex>
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default Sidebar;
