// InterviewHistory.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdHistory,
  MdWork,
  MdCode,
  MdPerson,
  MdCheckCircle,
  MdPending,
  MdAnalytics,
  MdTrendingUp,
  MdCalendarToday,
  MdTimer,
  MdStar,
  MdChevronRight,
  MdRefresh,
  MdError,
} from "react-icons/md";

import { formatDistanceToNow, format } from "date-fns";
import { useInterviewHistory } from "../../03-features/01-user/03-hook/08-useInterviewHistory";
import { useDispatch } from "react-redux";
import { resetGeneratedQuestions } from "../../00-app/03-questionsSlice";
import { useNavigate } from "react-router-dom";

export const InterviewHistory = () => {
  const [filter, setFilter] = useState("all");
  const [modeFilter, setModeFilter] = useState("all");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    data: response,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useInterviewHistory();

  // Extract interviews from the response data
  const interviews = response?.data || [];

  console.log("Interviews data:", interviews);
  console.log("Total interviews:", interviews.length);

  // Filter interviews
  const filteredInterviews = interviews.filter((interview) => {
    if (filter !== "all" && interview.status?.toLowerCase() !== filter)
      return false;
    if (modeFilter !== "all") {
      if (modeFilter === "HR" && interview.mode !== "HR Interview")
        return false;
      if (
        modeFilter === "Technical" &&
        interview.mode !== "Technical Interview"
      )
        return false;
    }
    return true;
  });

  // Calculate statistics
  const totalInterviews = interviews.length;
  const completedCount = interviews.filter(
    (i) => i.status === "completed",
  ).length;
  const averageScore = interviews.length
    ? (
        interviews.reduce((sum, i) => sum + (i.finalScore || 0), 0) /
        interviews.length
      ).toFixed(1)
    : 0;
  const technicalCount = interviews.filter(
    (i) => i.mode === "Technical Interview",
  ).length;

  // Get score color
  const getScoreColor = (score) => {
    if (score >= 7) return "text-green-500";
    if (score >= 5) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreBg = (score) => {
    if (score >= 7) return "bg-green-500/20";
    if (score >= 5) return "bg-yellow-500/20";
    return "bg-red-500/20";
  };

  const getStatusIcon = (status) => {
    return status === "completed" ? (
      <MdCheckCircle className="text-green-500" />
    ) : (
      <MdPending className="text-yellow-500" />
    );
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0F1E] via-[#0F1629] to-[#0A0F1E] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-[#00D4FF]/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-[#00FFB3] border-r-[#00D4FF] border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-4 border-t-transparent border-r-[#00FFB3] border-b-[#00D4FF] border-l-transparent rounded-full animate-spin animation-delay-300"></div>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-white mb-2">
              Loading Interview History
            </h2>
            <p className="text-gray-400">Fetching your interview data...</p>
            <div className="flex justify-center gap-2 mt-4">
              <div
                className="w-2 h-2 bg-[#00FFB3] rounded-full animate-bounce"
                style={{ animationDelay: "0s" }}
              ></div>
              <div
                className="w-2 h-2 bg-[#00FFB3] rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-2 h-2 bg-[#00FFB3] rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              ></div>
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
        <div className="text-center max-w-md bg-gradient-to-br from-[#0F1629]/80 to-[#0A0F1E]/80 backdrop-blur-xl rounded-2xl p-8 border border-red-500/30">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <MdError className="text-red-500 text-3xl" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Failed to Load History
          </h3>
          <p className="text-gray-400 mb-6">
            {error.message || "An error occurred"}
          </p>
          <button
            onClick={() => refetch()}
            className="px-6 py-2 bg-gradient-to-r from-[#00D4FF] to-[#00FFB3] rounded-lg font-semibold text-[#0A0F1E] hover:shadow-lg transition-all flex items-center gap-2 mx-auto"
          >
            <MdRefresh className={isFetching ? "animate-spin" : ""} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0F1E] via-[#0F1629] to-[#0A0F1E]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
          <div className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-4">
        {/* Back Button - Add this */}
        <button
          onClick={() => navigate(-1)} // Go back to previous page
          className="p-2 bg-[#0F1629]/80 rounded-lg border border-[#00D4FF]/20 hover:border-[#00FFB3]/50 transition-all group"
          aria-label="Go back  "
        >
          <svg 
            className="w-5 h-5 text-[#00D4FF] group-hover:text-[#00FFB3] transition-colors cursor-pointer" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-[#00D4FF] via-[#00FFB3] to-[#00D4FF] bg-clip-text text-transparent">
            Interview History
          </h1>
          <p className="text-[#00D4FF]/60 mt-2">
            Track your interview performance over time
          </p>
        </motion.div>
      </div>

      {/* Refresh Button */}
      <button
        onClick={() => refetch()}
        disabled={isFetching}
        className="p-2 bg-[#0F1629]/80 rounded-lg border border-[#00D4FF]/20 hover:border-[#00FFB3]/50 transition-all"
      >
        <MdRefresh
          className={`text-[#00D4FF] text-xl ${isFetching ? "animate-spin" : ""}`}
        />
      </button>
    </div>
    

        {/* Stats Summary */}
        {totalInterviews > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
          >
            <div className="bg-gradient-to-br from-[#0F1629]/80 to-[#0A0F1E]/80 rounded-2xl p-4 border border-[#00D4FF]/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Interviews</p>
                  <p className="text-3xl font-bold text-[#00FFB3]">
                    {totalInterviews}
                  </p>
                </div>
                <MdHistory className="text-[#00FFB3] text-3xl opacity-50" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#0F1629]/80 to-[#0A0F1E]/80 rounded-2xl p-4 border border-[#00D4FF]/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Completed</p>
                  <p className="text-3xl font-bold text-green-500">
                    {completedCount}
                  </p>
                </div>
                <MdCheckCircle className="text-green-500 text-3xl opacity-50" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#0F1629]/80 to-[#0A0F1E]/80 rounded-2xl p-4 border border-[#00D4FF]/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Average Score</p>
                  <p className="text-3xl font-bold text-[#00D4FF]">
                    {averageScore}
                  </p>
                </div>
                <MdAnalytics className="text-[#00D4FF] text-3xl opacity-50" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#0F1629]/80 to-[#0A0F1E]/80 rounded-2xl p-4 border border-[#00D4FF]/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Technical Interviews</p>
                  <p className="text-3xl font-bold text-[#FFD93D]">
                    {technicalCount}
                  </p>
                </div>
                <MdCode className="text-[#FFD93D] text-3xl opacity-50" />
              </div>
            </div>
          </motion.div>
        )}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-3 mb-8 justify-center"
        >
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              filter === "all"
                ? "bg-gradient-to-r from-[#00D4FF] to-[#00FFB3] text-[#0A0F1E]"
                : "bg-[#0F1629]/80 text-gray-400 hover:text-white border border-[#00D4FF]/20"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              filter === "completed"
                ? "bg-gradient-to-r from-[#00D4FF] to-[#00FFB3] text-[#0A0F1E]"
                : "bg-[#0F1629]/80 text-gray-400 hover:text-white border border-[#00D4FF]/20"
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setFilter("incompleted")}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              filter === "incompleted"
                ? "bg-gradient-to-r from-[#00D4FF] to-[#00FFB3] text-[#0A0F1E]"
                : "bg-[#0F1629]/80 text-gray-400 hover:text-white border border-[#00D4FF]/20"
            }`}
          >
            Incompleted
          </button>

          <div className="w-px h-8 bg-gray-700 mx-2"></div>

          <button
            onClick={() => setModeFilter("all")}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              modeFilter === "all"
                ? "bg-gradient-to-r from-[#00D4FF] to-[#00FFB3] text-[#0A0F1E]"
                : "bg-[#0F1629]/80 text-gray-400 hover:text-white border border-[#00D4FF]/20"
            }`}
          >
            All Modes
          </button>
          <button
            onClick={() => setModeFilter("HR")}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              modeFilter === "HR"
                ? "bg-gradient-to-r from-[#00D4FF] to-[#00FFB3] text-[#0A0F1E]"
                : "bg-[#0F1629]/80 text-gray-400 hover:text-white border border-[#00D4FF]/20"
            }`}
          >
            <MdPerson className="inline mr-1" /> HR Interview
          </button>
          <button
            onClick={() => setModeFilter("Technical")}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              modeFilter === "Technical"
                ? "bg-gradient-to-r from-[#00D4FF] to-[#00FFB3] text-[#0A0F1E]"
                : "bg-[#0F1629]/80 text-gray-400 hover:text-white border border-[#00D4FF]/20"
            }`}
          >
            <MdCode className="inline mr-1" /> Technical Interview
          </button>
        </motion.div>

        {/* Interview Cards Grid */}
        {filteredInterviews.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gray-700/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <MdHistory className="text-5xl text-gray-500" />
            </div>
            <p className="text-gray-400 text-lg">No interviews found</p>
            <p className="text-gray-500 text-sm mt-2">
              Try changing your filters
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnimatePresence>
              {filteredInterviews.map((interview, index) => (
                <motion.div
                  key={interview.interviewId || interview._id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative"
                >
                  <div className="relative bg-gradient-to-br from-[#0F1629]/80 to-[#0A0F1E]/80 backdrop-blur-xl rounded-2xl border border-[#00D4FF]/20 overflow-hidden hover:border-[#00FFB3]/50 transition-all duration-300">
                    {/* Header with gradient bar */}
                    <div
                      className={`h-1 w-full ${
                        interview.status === "completed"
                          ? "bg-gradient-to-r from-green-500 to-[#00FFB3]"
                          : "bg-gradient-to-r from-yellow-500 to-orange-500"
                      }`}
                    ></div>

                    <div className="p-6">
                      {/* Top row */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              interview.mode === "Technical Interview"
                                ? "bg-[#00D4FF]/20"
                                : "bg-[#00FFB3]/20"
                            }`}
                          >
                            {interview.mode === "Technical Interview" ? (
                              <MdCode className="text-[#00D4FF] text-2xl" />
                            ) : (
                              <MdPerson className="text-[#00FFB3] text-2xl" />
                            )}
                          </div>
                          <div>
                            <h3 className="text-white font-semibold text-lg">
                              {interview.role || "N/A"}
                            </h3>
                            <p className="text-gray-400 text-sm">
                              {interview.mode || "N/A"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {getStatusIcon(interview.status || "incompleted")}
                          <span
                            className={`text-xs font-medium ${
                              interview.status === "completed"
                                ? "text-green-500"
                                : "text-yellow-500"
                            }`}
                          >
                            {interview.status || "Incompleted"}
                          </span>
                        </div>
                      </div>

                      {/* Score Section */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <MdStar className="text-yellow-500" />
                          <span className="text-gray-400">Final Score</span>
                        </div>
                        <div
                          className={`px-3 py-1 rounded-lg ${getScoreBg(interview.finalScore || 0)}`}
                        >
                          <span
                            className={`text-2xl font-bold ${getScoreColor(interview.finalScore || 0)}`}
                          >
                            {(interview.finalScore || 0).toFixed(1)}
                          </span>
                          <span className="text-gray-400 text-sm"> / 10</span>
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <MdWork className="text-gray-500" />
                          <span className="text-gray-400">Experience:</span>
                          <span className="text-white">
                            {interview.experience || "N/A"} years
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MdTimer className="text-gray-500" />
                          <span className="text-gray-400">Questions:</span>
                          <span className="text-white">
                            {interview.questions?.length ||
                              interview.statistics?.totalQuestions ||
                              0}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MdCalendarToday className="text-gray-500" />
                          <span className="text-gray-400">Date:</span>
                          <span className="text-white">
                            {interview.createdAt
                              ? format(
                                  new Date(interview.createdAt),
                                  "MMM dd, yyyy",
                                )
                              : "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MdTrendingUp className="text-gray-500" />
                          <span className="text-gray-400">Time ago:</span>
                          <span className="text-white">
                            {interview.createdAt
                              ? formatDistanceToNow(
                                  new Date(interview.createdAt),
                                  { addSuffix: true },
                                )
                              : "N/A"}
                          </span>
                        </div>
                      </div>

                      {/* Skills Tags */}
                      <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-700/50">
                        <span className="text-xs text-gray-500">
                          Performance:
                        </span>
                        <div className="flex gap-2">
                          <span className="text-xs px-2 py-1 bg-[#00D4FF]/10 rounded-full text-[#00D4FF]">
                            Score {(interview.finalScore || 0).toFixed(1)}
                          </span>
                          <span className="text-xs px-2 py-1 bg-[#00FFB3]/10 rounded-full text-[#00FFB3]">
                            {interview.mode === "Technical Interview"
                              ? "Technical"
                              : interview.mode === "HR Interview"
                                ? "HR"
                                : "Interview"}
                          </span>
                        </div>
                      </div>

                      {/* View Details Button */}
                      <button
                        onClick={() => {
                          dispatch(resetGeneratedQuestions());
                          navigate("/user/interview/report", {
                            state: {
                              interviewId: interview.interviewId,
                            },
                          });
                        }}
                        className="w-full mt-4 px-4 py-2 bg-[#00D4FF]/10 rounded-lg text-[#00D4FF] font-medium text-sm transition-all hover:bg-[#00D4FF]/20 cursor-pointer"
                      >
                        View Details <MdChevronRight className="inline ml-1" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Empty State */}
        {totalInterviews === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="w-32 h-32 bg-gradient-to-br from-[#0F1629] to-[#0A0F1E] rounded-full flex items-center justify-center mx-auto mb-6 border border-[#00D4FF]/30">
              <MdHistory className="text-5xl text-[#00D4FF]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              No Interviews Yet
            </h3>
            <p className="text-gray-400 mb-6">
              Start your first interview to see your history here
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-gradient-to-r from-[#00D4FF] to-[#00FFB3] rounded-xl font-semibold text-[#0A0F1E] hover:shadow-lg transition-all"
            >
              Start New Interview
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
export default InterviewHistory;
