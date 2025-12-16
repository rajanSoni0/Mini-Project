import { useState } from 'react';

const StressReliefModal = ({ onClose }) => {
  const [activeActivity, setActiveActivity] = useState(null);
  const [breathCount, setBreathCount] = useState(0);
  const [isBreathing, setIsBreathing] = useState(false);

  const startBreathingExercise = () => {
    setActiveActivity('breathing');
    setIsBreathing(true);
    setBreathCount(0);

    let count = 0;
    const interval = setInterval(() => {
      count++;
      setBreathCount(count);
      if (count >= 5) {
        clearInterval(interval);
        setIsBreathing(false);
      }
    }, 4000);
  };

  const mindfulnessPrompts = [
    "Take 3 deep breaths and notice how your body feels",
    "Name 5 things you can see right now",
    "What are 3 things you're grateful for today?",
    "Place your hand on your heart and feel it beating",
    "Remember: This feeling is temporary, and you are strong"
  ];

  return (
    <div data-testid="stress-relief-modal" className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Take a Moment for Yourself</h2>
            <button
              data-testid="close-modal-button"
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-purple-100 mt-2">Try one of these activities to help manage stress</p>
        </div>

        {/* Content */}
        <div className="p-6">
          {!activeActivity ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Breathing Exercise */}
              <button
                data-testid="breathing-exercise-button"
                onClick={startBreathingExercise}
                className="bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 p-6 rounded-xl text-left transition-all transform hover:scale-[1.02] border border-blue-200"
              >
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Breathing Exercise</h3>
                <p className="text-sm text-gray-600">Guided breathing to calm your mind</p>
              </button>

              {/* Mindfulness Prompts */}
              <button
                data-testid="mindfulness-prompts-button"
                onClick={() => setActiveActivity('mindfulness')}
                className="bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 p-6 rounded-xl text-left transition-all transform hover:scale-[1.02] border border-green-200"
              >
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Mindfulness Prompts</h3>
                <p className="text-sm text-gray-600">Simple exercises to ground yourself</p>
              </button>

              {/* Positive Affirmations */}
              <button
                data-testid="affirmations-button"
                onClick={() => setActiveActivity('affirmations')}
                className="bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 p-6 rounded-xl text-left transition-all transform hover:scale-[1.02] border border-purple-200"
              >
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Positive Affirmations</h3>
                <p className="text-sm text-gray-600">Uplifting messages for your wellbeing</p>
              </button>

              {/* Mood Tracker */}
              <button
                data-testid="mood-tracker-button"
                onClick={() => setActiveActivity('mood')}
                className="bg-gradient-to-br from-pink-50 to-pink-100 hover:from-pink-100 hover:to-pink-200 p-6 rounded-xl text-left transition-all transform hover:scale-[1.02] border border-pink-200"
              >
                <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Mood Tracker</h3>
                <p className="text-sm text-gray-600">Reflect on your emotional state</p>
              </button>
            </div>
          ) : activeActivity === 'breathing' ? (
            <div className="text-center py-12">
              <div className="w-40 h-40 mx-auto mb-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center breathing-circle">
                <span className="text-white text-4xl font-bold">{breathCount}/5</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {isBreathing ? 'Breathe with the circle' : 'Great job!'}
              </h3>
              <p className="text-gray-600 mb-6">
                {isBreathing ? 'Inhale as it expands, exhale as it contracts' : 'You completed 5 breathing cycles'}
              </p>
              {!isBreathing && (
                <button
                  onClick={() => setActiveActivity(null)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                >
                  Try Another Activity
                </button>
              )}
            </div>
          ) : activeActivity === 'mindfulness' ? (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Mindfulness Prompts</h3>
              {mindfulnessPrompts.map((prompt, index) => (
                <div key={index} className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                  <p className="text-gray-700 font-medium">{prompt}</p>
                </div>
              ))}
              <button
                onClick={() => setActiveActivity(null)}
                className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
              >
                Back to Activities
              </button>
            </div>
          ) : activeActivity === 'affirmations' ? (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Positive Affirmations</h3>
              {[
                "I am worthy of love and respect",
                "I choose to focus on what I can control",
                "I am doing my best, and that is enough",
                "This too shall pass",
                "I am stronger than my challenges"
              ].map((affirmation, index) => (
                <div key={index} className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200 text-center">
                  <p className="text-gray-800 font-semibold text-lg">{affirmation}</p>
                </div>
              ))}
              <button
                onClick={() => setActiveActivity(null)}
                className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
              >
                Back to Activities
              </button>
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-bold text-gray-800 mb-4">How are you feeling right now?</h3>
              <div className="grid grid-cols-5 gap-4 max-w-md mx-auto mb-6">
                {['😢', '😟', '😐', '🙂', '😊'].map((emoji, index) => (
                  <button
                    key={index}
                    className="text-5xl hover:scale-125 transition-transform"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <p className="text-gray-600 mb-6">Track your mood to understand patterns</p>
              <button
                onClick={() => setActiveActivity(null)}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
              >
                Back to Activities
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StressReliefModal;