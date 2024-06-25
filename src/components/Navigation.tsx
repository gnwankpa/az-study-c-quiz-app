import React from 'react';

interface Props {
  currentQuestion: number;
  totalQuestions: number;
  onViewResults: () => void;
}

const Navigation: React.FC<Props> = ({ currentQuestion, totalQuestions, onViewResults }) => {
  return (
    <nav className="navigation">
      <span>Question {currentQuestion} of {totalQuestions}</span>
      <button onClick={onViewResults}>View Results</button>
    </nav>
  );
};

export default Navigation;