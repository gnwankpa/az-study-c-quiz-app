import React from 'react';

interface Props {
  score: number;
  totalQuestions: number;
  onClose: () => void;
  onReset: () => void;
}

const Results: React.FC<Props> = ({ score, totalQuestions, onClose, onReset }) => {
  const percentage = (score / totalQuestions) * 100;
  const isPassing = percentage >= 80;

  return (
    <div className="results">
      <h2>Quiz Results</h2>
      <p>You scored {score} out of {totalQuestions}</p>
      <p className={isPassing ? 'passing-score' : 'failing-score'}>
        Percentage: {percentage.toFixed(2)}%
      </p>
      <p>{isPassing ? 'Congratulations! You passed!' : 'Keep practicing to improve your score.'}</p>
      <button onClick={onClose}>Close</button>
      <button onClick={onReset}>Restart Quiz</button>
    </div>
  );
};

export default Results;