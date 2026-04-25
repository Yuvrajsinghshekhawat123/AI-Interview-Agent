import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';

import { useFinishInterview } from '../../../03-features/01-user/03-hook/07-useFinishInterview';
import { InterviewAnalytics } from './child';
import { useLocation } from 'react-router-dom';

export const InterviewReport = () => {
  
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  // Method 1: Get from state (passed during navigation)
  const stateData = location.state;
  const interviewIdFromState = stateData?.interviewId;
  
  const { mutate: interviewReport, isPending } = useFinishInterview();
  const generatedQuestions = useSelector((state) => state.generatedQuestions.generatedQuestions);

   


  const fetchReport = () => {
    setIsLoading(true);
    setError(null);
    
    interviewReport(
      { interviewId: generatedQuestions?.interviewId || interviewIdFromState },
      {
        onSuccess: (response) => {
          console.log(response);
          console.log("Report data received:", response);
          setData(response);
          setIsLoading(false);
        },
        onError: (error) => {
          
          console.error("Error fetching report:", error);
          setError(error?.response?.data?.message || "Failed to load interview report");
          setIsLoading(false);
          console.error("Error fetching report:", error);
        },
        onSettled: () => {
          // Optional: Additional cleanup
        }
      }
    );
  };

  useEffect(() => {
    
    if (generatedQuestions?.interviewId || interviewIdFromState) {
      fetchReport();
    } else {
      setIsLoading(false);
      setError("No interview data found");
    }
  }, []);

  // Loading State
  if (isLoading || isPending) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0F1E] via-[#0F1629] to-[#0A0F1E] flex items-center justify-center">
        <div className="text-center">
          {/* Animated Loading Spinner */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-[#00D4FF]/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-[#00FFB3] border-r-[#00D4FF] border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-4 border-t-transparent border-r-[#00FFB3] border-b-[#00D4FF] border-l-transparent rounded-full animate-spin animation-delay-300"></div>
          </div>
          
          {/* Loading Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-white mb-2">Generating Your Report</h2>
            <p className="text-gray-400">Analyzing your interview performance...</p>
            
            {/* Animated dots */}
            <div className="flex justify-center gap-2 mt-4">
              <div className="w-2 h-2 bg-[#00FFB3] rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-2 h-2 bg-[#00FFB3] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-[#00FFB3] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0F1E] via-[#0F1629] to-[#0A0F1E] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-gradient-to-br from-[#0F1629]/80 to-[#0A0F1E]/80 backdrop-blur-xl rounded-2xl p-8 border border-red-500/30 text-center"
        >
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Failed to Load Report</h3>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={fetchReport}
            className="px-6 py-2 bg-gradient-to-r from-[#00D4FF] to-[#00FFB3] rounded-lg font-semibold text-[#0A0F1E] hover:shadow-lg transition-all"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  // No Data State
  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0F1E] via-[#0F1629] to-[#0A0F1E] flex items-center justify-center">
        <p className="text-gray-400">No report data available</p>
      </div>
    );
  }

  // Transform data for the analytics component
  const analyticsData = {
    overallScore: data.finalScore,
    skills: {
      confidence: data.confidence,
      communication: data.communication,
      correctness: data.correctness,
    },
    questionWiseScore: data.questionWiseScore,
    performanceTrend: data.questionWiseScore.map((q, index) => ({
      question: `Q${index + 1}`,
      score: q.score,
    })),
    skillData: [
      { skill: 'Confidence', value: data.confidence, fullMark: 10, color: '#00D4FF' },
      { skill: 'Communication', value: data.communication, fullMark: 10, color: '#00FFB3' },
      { skill: 'Correctness', value: data.correctness, fullMark: 10, color: '#FFD93D' },
    ],
    questionBreakdown: data.questionWiseScore.map((q, index) => ({
      id: index + 1,
      question: q.question,
      feedback: q.feedback,
      score: q.score,
      confidence: q.confidence,
      communication: q.communication,
      correctness: q.correctness,
    })),
  };

  // Pass the data to your analytics component
  return <InterviewAnalytics interviewData={analyticsData} />;

};