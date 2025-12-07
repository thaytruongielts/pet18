import React, { useState, useMemo } from 'react';
import { parseTextToSegments, RAW_TEXT } from './constants';
import AudioPlayer from './components/AudioPlayer';
import FillBlankItem from './components/FillBlankItem';
import { UserAnswers, GradingResult, GradingStatus } from './types';
import { gradeAnswersWithGemini } from './services/geminiService';
import { Loader2, Send, RotateCcw, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [answers, setAnswers] = useState<UserAnswers>({});
  const [gradingStatus, setGradingStatus] = useState<GradingStatus>(GradingStatus.IDLE);
  const [results, setResults] = useState<GradingResult>({});
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const segments = useMemo(() => parseTextToSegments(RAW_TEXT), []);
  const totalQuestions = 50;

  const handleInputChange = (id: number, val: string) => {
    if (gradingStatus === GradingStatus.DONE) return;
    setAnswers(prev => ({ ...prev, [id]: val }));
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to clear all answers and try again?")) {
      setAnswers({});
      setResults({});
      setGradingStatus(GradingStatus.IDLE);
      setErrorMsg(null);
      window.scrollTo(0, 0);
    }
  };

  const getCorrectCount = () => Object.values(results).filter(Boolean).length;

  const calculateScore = () => {
    const correctCount = getCorrectCount();
    return (correctCount * 10) / totalQuestions;
  };

  const handleSubmit = async () => {
    setGradingStatus(GradingStatus.GRADING);
    setErrorMsg(null);

    try {
      const gradingResults = await gradeAnswersWithGemini(answers);
      setResults(gradingResults);
      setGradingStatus(GradingStatus.DONE);
      // Scroll to top to see score
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Failed to grade answers. Please check your internet connection or API Key configuration.");
      setGradingStatus(GradingStatus.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      <AudioPlayer />

      <main className="max-w-4xl mx-auto px-4 py-8 pb-32">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">PET Listening Part 3: Fill in the Blanks</h1>
          <p className="text-gray-600 mb-4">
            Listen to the audio and fill in the missing words in the numbered spaces. 
            There are <strong>{totalQuestions}</strong> questions.
          </p>
          
          {gradingStatus === GradingStatus.DONE && (
            <div className="mt-6 p-4 bg-indigo-50 border border-indigo-100 rounded-lg flex flex-col items-center animate-fade-in">
              <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">Your Score</span>
              <div className="text-5xl font-bold text-indigo-900 my-2">
                {calculateScore().toFixed(1)} <span className="text-2xl text-indigo-400">/ 10</span>
              </div>
              <div className="flex gap-4 mt-2 text-sm">
                <span className="text-green-700 font-medium bg-green-100 px-2 py-1 rounded">Correct: {getCorrectCount()}</span>
                <span className="text-red-700 font-medium bg-red-100 px-2 py-1 rounded">Incorrect: {totalQuestions - getCorrectCount()}</span>
              </div>
              <p className="text-sm text-indigo-700 mt-2">
                {calculateScore() >= 7 ? "Great job!" : "Keep practicing!"}
              </p>
            </div>
          )}

          {gradingStatus === GradingStatus.ERROR && (
             <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
               <AlertCircle className="w-5 h-5 flex-shrink-0" />
               <p>{errorMsg}</p>
             </div>
          )}
        </div>

        {/* Question Text Area */}
        <div className="bg-white rounded-xl shadow-lg p-8 leading-loose text-lg text-justify border border-gray-200">
            {segments.map((part, index) => {
              if (part.isBlank && part.id) {
                return (
                  <FillBlankItem
                    key={`blank-${part.id}`}
                    id={part.id}
                    value={answers[part.id] || ''}
                    onChange={handleInputChange}
                    isGraded={gradingStatus === GradingStatus.DONE}
                    isCorrect={results[part.id]}
                  />
                );
              }
              return <span key={`text-${index}`} className="text-gray-700">{part.text}</span>;
            })}
        </div>
      </main>

      {/* Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-4 z-40">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="text-sm text-gray-500 hidden sm:block">
            {Object.keys(answers).length} / {totalQuestions} Answered
          </div>

          <div className="flex gap-4 w-full sm:w-auto justify-end">
            {gradingStatus === GradingStatus.DONE ? (
              <button
                onClick={handleReset}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all w-full sm:w-auto"
              >
                <RotateCcw className="w-4 h-4" />
                Try Again
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={gradingStatus === GradingStatus.GRADING}
                className={`
                  flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-semibold text-white shadow-md transition-all w-full sm:w-auto
                  ${gradingStatus === GradingStatus.GRADING 
                    ? 'bg-indigo-400 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg active:scale-95'
                  }
                `}
              >
                {gradingStatus === GradingStatus.GRADING ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Grading...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Answers
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;