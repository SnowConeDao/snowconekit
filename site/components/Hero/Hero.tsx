import { Box } from 'components/Box/Box';
import NextImage from 'next/image';
import React from 'react';
import {
  heroWrapper,
  MODAL_SIZE,
  modalWrapper,
  PHONE_SIZE,
  phoneWrapper,
} from './Hero.css';

export function Hero() {
  return (
    <Box marginTop={{ md: '12', xs: '8' }} position="relative">
      <Box
        position="absolute"
        style={{
          borderRadius: '100%',
          filter: 'blur(150px)',
          height: '80%',
          left: '50%',
          top: '50%',
          transform: 'translate3d(-50%, -50%, 0)',
          width: '50vw',
          zIndex: '1',
        }}
      />
      <Box marginX="auto" position="relative" style={{ zIndex: '2' }}>
        <Box className={heroWrapper}>
          <Box className={modalWrapper}>
            <NextImage
              height={MODAL_SIZE.height}
              src="/ScHeroModal.png"
              width={MODAL_SIZE.width}
            />
          </Box>
          <Box className={phoneWrapper}>
            <NextImage
              height={PHONE_SIZE.height}
              src="/ScHeroMobile.png"
              width={PHONE_SIZE.width}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
