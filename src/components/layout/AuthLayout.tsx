import React from 'react';
import Footer from '../shell/Footer';
import Stack from '../containers/Stack';
import { Box, Container, Flex, Typography } from '..';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <Box background="gray-50" className="min-h-screen flex flex-col">
      <Flex
        direction="column"
        justify="center"
        align="center"
        className="flex-grow px-3 sm:px-4 py-8 sm:py-12"
      >
        <Container size="sm">
          <Flex direction="column" align="center" className="w-full">
            <Stack
              spacing="md"
              align="center"
              className="text-center mb-6 sm:mb-8"
            >
              <Typography
                variant="h3"
                as="h1"
                className="font-bold text-blue-600 text-2xl sm:text-3xl"
              >
                URL Insight
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                Website Analysis Platform
              </Typography>
            </Stack>
            <Box
              padding="lg"
              background="white"
              shadow="lg"
              rounded="lg"
              className="w-full"
            >
              {children}
            </Box>
          </Flex>
        </Container>
      </Flex>
      <Footer />
    </Box>
  );
};

export default AuthLayout;
