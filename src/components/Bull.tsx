import React from 'react';

interface BullProps {
  position: number;
  isFlipped?: boolean;
}

export const Bull: React.FC<BullProps> = ({ position, isFlipped = false }) => {
  return (
    <div
      className="absolute transition-all duration-300"
      style={{
        left: `${isFlipped ? 90 - position : position+7}%`,
        transform: `translate(${isFlipped ? '0%' : '-100%'}, -50%) ${isFlipped ? 'scaleX(-1)' : ''}`,
        top: '50%',
      }}
    >
      <img
        src="/images/bull.png" // Path to your PNG file
        alt="Bull"
        className="drop-shadow-lg"
        width="500" // Adjust size as needed
        height="500" // Adjust size as needed
      />

    </div>
  );
};