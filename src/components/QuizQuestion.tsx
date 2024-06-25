import React, { useState } from 'react';

interface IAnswer {
  option: string;
  text: string;
}

interface IQuestion {
  questiontext: string;
  answers: IAnswer[];
  correctAnswer: IAnswer[];
  skillTested: string;
  isMultipleAnswers: boolean;
}

interface Props {
  question: IQuestion;
  userAnswer: IAnswer[] | undefined; 
  onAnswer: (answer: IAnswer[]) => void; 
  onSubmit: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  currentQuestionIndex: number;
  totalQuestions: number;
}

const QuizQuestion: React.FC<Props> = ({
  question,
  userAnswer,
  onAnswer,
  onSubmit,
  onNavigate,
  currentQuestionIndex,
  totalQuestions
}) => {
  const [showFeedback, setShowFeedback] = useState(false);

  const handleAnswerChange = (selectedAnswer: IAnswer) => {
    if (question.isMultipleAnswers) {
      const currentAnswers = userAnswer || [];
      const updatedAnswers = currentAnswers.some(a => a.option === selectedAnswer.option)
        ? currentAnswers.filter(a => a.option !== selectedAnswer.option)
        : [...currentAnswers, selectedAnswer];
      onAnswer(updatedAnswers);
    } else {
      onAnswer([selectedAnswer]); 
    }
  };

  const handleCheckAnswer = () => {
    setShowFeedback(prevShowFeedback => !prevShowFeedback);
  };

  const handleSubmit = () => {
    onSubmit();
    setShowFeedback(false);
  };

  const isCorrectAnswer = (answer: IAnswer) => {
    return question.correctAnswer.some(a => a.option === answer.option);
  };

  const isUserAnswerCorrect = () => {
    if (!userAnswer) return false;
    const userAnswerArray = userAnswer;

    if (question.isMultipleAnswers) {
      return question.correctAnswer.length === userAnswerArray.length &&
        question.correctAnswer.every(answer =>
          userAnswerArray.some(userAns => userAns.option === answer.option)
        );
    } else {
      return question.correctAnswer.some(answer =>
        userAnswerArray.some(userAns => userAns.option === answer.option)
      );
    }
  };

  return (
    <div >
      <div className="quiz-question">{question.questiontext}</div>
      <div className="answers">
        {question.answers.map(answer => (
          <label key={answer.option} className={`answer ${showFeedback && isCorrectAnswer(answer) ? 'correct' : ''}`}>
            <input
              type={question.isMultipleAnswers ? 'checkbox' : 'radio'}
              name="answer"
              checked={Array.isArray(userAnswer)
                ? userAnswer.some((a: IAnswer) => a.option === answer.option)
                : false} // Default to false if userAnswer is not an array
              onChange={() => handleAnswerChange(answer)}
            />
            {answer.text}
          </label>
        ))}
      </div>
      <div className="actions">
        <button
          onClick={() => onNavigate('prev')}
          disabled={currentQuestionIndex === 0}
          className="nav-button prev"
        >
          Previous
        </button>
        <button onClick={handleCheckAnswer} className="action-button check">Check Answer</button>
        <button onClick={handleSubmit} className="action-button submit">Submit</button>
        <button
          onClick={() => onNavigate('next')}
          disabled={currentQuestionIndex === totalQuestions - 1}
          className="nav-button next"
        >
          Next
        </button>
      </div>
      {showFeedback && (
        <div className="feedback">
          <p className={isUserAnswerCorrect() ? 'correct-feedback' : 'incorrect-feedback'}>
            {isUserAnswerCorrect() ? 'Correct!' : 'Incorrect.'}
          </p>
          <p>Correct answer(s): {question.correctAnswer.map(a => a.text).join(', ')}</p>
        </div>
      )}
    </div>
  );
};

export default QuizQuestion;
