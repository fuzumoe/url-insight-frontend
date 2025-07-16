import React, { useState } from 'react';
import { Container, Flex, Box, Footer, Sidebar, Header } from '..';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box className="min-h-screen flex flex-col bg-gray-50">
      <Header toggleSidebar={toggleSidebar} />
      <Flex className="flex-grow">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <Box
          as="main"
          className="flex-grow p-4 transition-all duration-300 lg:ml-64"
        >
          <Container>{children}</Container>
        </Box>
      </Flex>
      <Footer />
    </Box>
  );
};

export default MainLayout;
