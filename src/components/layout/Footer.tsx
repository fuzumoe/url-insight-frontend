import React from 'react';
import { Container, Flex, Box } from './';
import Typography from '../common/Typography';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  return (
    <Box
      background="white"
      shadow="md"
      padding="lg"
      className={`mt-auto ${className}`}
    >
      <Container>
        <Flex
          direction="column"
          justify="between"
          align="center"
          className="md:flex-row"
        >
          <Box className="mb-4 md:mb-0">
            <Typography variant="body2" className="text-gray-600">
              © {new Date().getFullYear()} URL Insight. All rights reserved.
            </Typography>
          </Box>

          <Flex gap="md" className="flex-wrap">
            <a
              href="#"
              className="text-gray-500 hover:text-blue-600 transition-colors"
            >
              <Typography variant="body2">Privacy Policy</Typography>
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-blue-600 transition-colors"
            >
              <Typography variant="body2">Terms of Service</Typography>
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-blue-600 transition-colors"
            >
              <Typography variant="body2">Contact Us</Typography>
            </a>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};

export default Footer;
