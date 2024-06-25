import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QuizQuestion from './components/QuizQuestion';
import Results from './components/Results';
import Navigation from './components/Navigation';
import './App.css';

interface IAnswer {
  option: string;
  text: string;
}

interface IQuestion {
  questiontext: string;
  answers: IAnswer[];
  correctAnswer: IAnswer[]; // Always an array
  skillTested: string;
  isMultipleAnswers: boolean;
}

const App: React.FC = () => {
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<IAnswer[][]>([]); // Array of answer arrays
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('https://quizapp.bitmetrix.io/questions');
        setQuestions(response.data.map((q: any) => q.questionBData));
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();

    const savedScore = localStorage.getItem('quizScore');
    const savedIndex = localStorage.getItem('currentQuestionIndex');
    const savedAnswers = localStorage.getItem('userAnswers');


    if (savedScore) {
      setScore(parseInt(savedScore, 10));
    }
    if (savedIndex) {
      setCurrentQuestionIndex(parseInt(savedIndex, 10));
    }
    if (savedAnswers) {
      setUserAnswers(JSON.parse(savedAnswers));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) { 
      localStorage.setItem('quizScore', score.toString());
      localStorage.setItem('currentQuestionIndex', currentQuestionIndex.toString());
      localStorage.setItem('userAnswers', JSON.stringify(userAnswers));
    }
  }, [score, currentQuestionIndex, userAnswers, loading]);

  const handleAnswer = (answer: IAnswer[]) => {
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestionIndex] = answer;
    setUserAnswers(newUserAnswers);
  };

  const handleSubmit = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const userAnswer = userAnswers[currentQuestionIndex];

    if (userAnswer) {
      const isCorrect = currentQuestion.isMultipleAnswers
        ? currentQuestion.correctAnswer.length === userAnswer.length &&
          currentQuestion.correctAnswer.every(answer =>
            userAnswer.some(userAns => userAns.option === answer.option)
          )
        : currentQuestion.correctAnswer.some(answer =>
            userAnswer.some(userAns => userAns.option === answer.option)
          );

      if (isCorrect) {
        setScore(prevScore => prevScore + 1);
      }

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setShowResults(true);
      }
    }
  };

  const navigateQuestion = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (direction === 'next' && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setScore(0);
    setShowResults(false);
    localStorage.removeItem('quizScore');
    localStorage.removeItem('currentQuestionIndex');
    localStorage.removeItem('userAnswers');
  };

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="app">
      <Navigation
        currentQuestion={currentQuestionIndex + 1}
        totalQuestions={questions.length}
        onViewResults={() => setShowResults(true)}
      />
      {showResults ? (
        <Results
          score={score}
          totalQuestions={questions.length}
          onClose={() => setShowResults(false)}
          onReset={resetQuiz}
        />
      ) : (
        questions.length > 0 && (
          <QuizQuestion
            question={questions[currentQuestionIndex]}
            userAnswer={userAnswers[currentQuestionIndex]}
            onAnswer={handleAnswer}
            onSubmit={handleSubmit}
            onNavigate={navigateQuestion}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={questions.length}
          />
        )
      )}
    </div>
  );
};

export default App;
