import React from 'react';
import { Animated } from 'react-native';


const HEADER_HEIGHT = 300;

const AnimatedHeader = ({headerHeight, children }) => {
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          overflow: 'hidden',
          height: HEADER_HEIGHT,
          backgroundColor: '#ECB04D',
        },
        { transform: [{ translateY: headerHeight }] },
      ]}
    >
      {children}
    </Animated.View>
  );
};

export default AnimatedHeader;