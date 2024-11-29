import React from 'react';

interface GameAreaProps {
  leftPosition: number;
  rightPosition: number;
  onLeftClick: () => void;
  onRightClick: () => void;
}

export const GameArea: React.FC<GameAreaProps> = ({
  leftPosition,
  rightPosition,
  onLeftClick,
  onRightClick,
}) => {
  return (
    <div className="flex h-screen w-full">
      <div
        className="h-full transition-all duration-300 cursor-pointer"
        style={{ width: `${leftPosition}%`, backgroundColor: '#ef4444' }}
        onClick={onLeftClick}
      />
      <div
        className="h-full transition-all duration-300 cursor-pointer"
        style={{ width: `${100 - leftPosition}%`, backgroundColor: '#3b82f6' }}
        onClick={onRightClick}
      />
    </div>
  );
};