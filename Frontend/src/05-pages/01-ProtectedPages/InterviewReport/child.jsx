import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
  Area,
  ComposedChart,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdTrendingUp,
  MdTrendingDown,
  MdStar,
  MdStarBorder,
  MdPsychology,
  MdChat,
  MdCheckCircle,
  MdWarning,
  MdEmojiEvents,
  MdAnalytics,
  MdSpeed,
  MdGrain,
} from "react-icons/md";
import { MdArrowBack } from "react-icons/md";
import { useNavigate } from "react-router-dom";
 

export const InterviewAnalytics = ({ interviewData }) => {
    const navigate = useNavigate();
  // Safely extract data with fallbacks
  const performanceData = interviewData?.performanceTrend || [];
  const skillData = interviewData?.skillData || [];
  const questionBreakdown = interviewData?.questionBreakdown || [];
  const overallScore = interviewData?.overallScore || 0;

  // Add loading state check
  if (!interviewData || questionBreakdown.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0F1E] via-[#0F1629] to-[#0A0F1E] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-[#00D4FF]/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-[#00FFB3] border-r-[#00D4FF] border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-400">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  // Colors for charts
  const COLORS = [
    "#00D4FF",
    "#00FFB3",
    "#FF6B6B",
    "#FFD93D",
    "#6C5CE7",
    "#FF9F43",
  ];

  // Calculate statistics safely
  const averageScore =
    performanceData.length > 0
      ? (
          performanceData.reduce((sum, item) => sum + (item.score || 0), 0) /
          performanceData.length
        ).toFixed(1)
      : overallScore || 0;

  const totalQuestions = performanceData.length;
  const improvementNeeded =
    averageScore < 5 ? (((5 - averageScore) / 5) * 100).toFixed(0) : 0;
  const topSkill =
    skillData.length > 0
      ? [...skillData].sort((a, b) => b.value - a.value)[0]
      : null;
  const lowestSkill =
    skillData.length > 0
      ? [...skillData].sort((a, b) => a.value - b.value)[0]
      : null;

  // Progress bar component
  const ProgressBar = ({
    value,
    max = 10,
    color = "#00FFB3",
    label,
    showValue = true,
  }) => {
    const percentage = ((value || 0) / max) * 100;
    return (
      <div className="mb-3">
        {label && (
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-300">{label}</span>
            {showValue && (
              <span className="text-sm text-gray-400">
                {(value || 0).toFixed(1)}/{max}
              </span>
            )}
          </div>
        )}
        <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute h-full rounded-full"
            style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
          />
        </div>
      </div>
    );
  };

  // Circular progress component
  const CircularProgress = ({
    value,
    max = 10,
    size = 120,
    color = "#00FFB3",
  }) => {
    const percentage = ((value || 0) / max) * 100;
    const radius = (size - 10) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#2D3748"
            strokeWidth="8"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-white">
            {(value || 0).toFixed(1)}
          </span>
          <span className="text-xs text-gray-400">/{max}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0F1E] via-[#0F1629] to-[#0A0F1E] p-8">
      <div className="max-w-7xl mx-auto ">
        {/* Header with animated background and Back Button */}
        <div className="relative mb-8">
          {/* Back Button with MdArrowBack icon */}
          <button
            onClick={() => navigate(-1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 p-2 bg-[#0F1629]/80 rounded-lg border border-[#00D4FF]/20 hover:border-[#00FFB3]/50 hover:bg-[#00D4FF]/10 transition-all group z-10"
            aria-label="Go back"
          >
            <MdArrowBack className="text-[#00D4FF] text-xl group-hover:text-[#00FFB3] transition-colors" />
          </button>

          {/* Header Content */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center relative"
          >
            <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-[#00D4FF]/20 via-[#00FFB3]/20 to-[#00D4FF]/20 rounded-full"></div>

            <h1 className="text-5xl font-bold bg-gradient-to-r from-[#00D4FF] via-[#00FFB3] to-[#00D4FF] bg-clip-text text-transparent relative">
              Interview Analytics Dashboard
            </h1>
            <p className="text-[#00D4FF]/60 mt-2">
              AI-powered performance insights
            </p>
          </motion.div>
        </div>

        {/* Stats Cards Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        >
          <div className="bg-gradient-to-br from-[#0F1629]/80 to-[#0A0F1E]/80 backdrop-blur-xl rounded-2xl p-4 border border-[#00D4FF]/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Average Score</p>
                <p className="text-3xl font-bold text-[#00FFB3]">
                  {averageScore}
                </p>
                <p className="text-xs text-gray-500">out of 10</p>
              </div>
              <div className="w-12 h-12 bg-[#00FFB3]/20 rounded-full flex items-center justify-center">
                <MdAnalytics className="text-[#00FFB3] text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#0F1629]/80 to-[#0A0F1E]/80 backdrop-blur-xl rounded-2xl p-4 border border-[#00D4FF]/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Questions Completed</p>
                <p className="text-3xl font-bold text-[#00D4FF]">
                  {totalQuestions}
                </p>
                <p className="text-xs text-gray-500">total questions</p>
              </div>
              <div className="w-12 h-12 bg-[#00D4FF]/20 rounded-full flex items-center justify-center">
                <MdCheckCircle className="text-[#00D4FF] text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#0F1629]/80 to-[#0A0F1E]/80 backdrop-blur-xl rounded-2xl p-4 border border-[#00D4FF]/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Top Skill</p>
                <p className="text-xl font-bold text-[#FFD93D]">
                  {topSkill?.skill || "N/A"}
                </p>
                <p className="text-xs text-gray-500">
                  {topSkill?.value || 0}/10 score
                </p>
              </div>
              <div className="w-12 h-12 bg-[#FFD93D]/20 rounded-full flex items-center justify-center">
                <MdEmojiEvents className="text-[#FFD93D] text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#0F1629]/80 to-[#0A0F1E]/80 backdrop-blur-xl rounded-2xl p-4 border border-[#00D4FF]/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Area to Improve</p>
                <p className="text-xl font-bold text-[#FF6B6B]">
                  {lowestSkill?.skill || "N/A"}
                </p>
                <p className="text-xs text-gray-500">
                  {lowestSkill?.value || 0}/10 score
                </p>
              </div>
              <div className="w-12 h-12 bg-[#FF6B6B]/20 rounded-full flex items-center justify-center">
                <MdWarning className="text-[#FF6B6B] text-2xl" />
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Overall Performance Card with Circular Progress */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 bg-gradient-to-br from-[#0F1629]/80 to-[#0A0F1E]/80 backdrop-blur-xl rounded-2xl p-6 border border-[#00D4FF]/20"
          >
            <h3 className="text-[#00D4FF] font-semibold mb-4 flex items-center gap-2">
              <MdSpeed className="text-[#00FFB3]" />
              Overall Performance
            </h3>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <CircularProgress
                  value={parseFloat(averageScore)}
                  max={10}
                  color="#00FFB3"
                />
              </div>
              <div className="mb-4">
                <ProgressBar
                  value={parseFloat(averageScore)}
                  max={10}
                  color="#00FFB3"
                  showValue={false}
                />
              </div>
              <div
                className={`rounded-lg p-4 ${improvementNeeded > 50 ? "bg-red-500/20" : improvementNeeded > 30 ? "bg-yellow-500/20" : "bg-green-500/20"}`}
              >
                <p
                  className={`font-semibold ${improvementNeeded > 50 ? "text-red-500" : improvementNeeded > 30 ? "text-yellow-500" : "text-green-500"}`}
                >
                  {improvementNeeded > 50
                    ? "⚠️ Significant improvement required"
                    : improvementNeeded > 30
                      ? "📈 Moderate improvement needed"
                      : "🎯 Excellent performance!"}
                </p>
                <p className="text-sm text-gray-300 mt-1">
                  {improvementNeeded > 50
                    ? "Focus on clarity and confidence in your responses."
                    : improvementNeeded > 30
                      ? "Good progress! Keep practicing for better results."
                      : "Outstanding! Maintain this level of excellence."}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Performance Trend with Area Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-gradient-to-br from-[#0F1629]/80 to-[#0A0F1E]/80 backdrop-blur-xl rounded-2xl p-6 border border-[#00D4FF]/20"
          >
            <h3 className="text-[#00D4FF] font-semibold mb-4 flex items-center gap-2">
              <MdTrendingUp className="text-[#00FFB3]" />
              Performance Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={performanceData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00FFB3" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00FFB3" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
                <XAxis dataKey="question" stroke="#888" />
                <YAxis domain={[0, 10]} stroke="#888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0F1629",
                    border: "1px solid #00D4FF",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#00D4FF" }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#00FFB3"
                  fill="url(#colorScore)"
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#00FFB3"
                  strokeWidth={3}
                  dot={{ fill: "#00D4FF", strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Skill Evaluation with Progress Bars */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-gradient-to-br from-[#0F1629]/80 to-[#0A0F1E]/80 backdrop-blur-xl rounded-2xl p-6 border border-[#00D4FF]/20"
          >
            <h3 className="text-[#00D4FF] font-semibold mb-4 flex items-center gap-2">
              <MdPsychology className="text-[#00FFB3]" />
              Skill Evaluation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skillData.map((skill, index) => (
                <div key={index} className="p-3 bg-[#00D4FF]/5 rounded-lg">
                  <ProgressBar
                    label={skill.skill}
                    value={skill.value}
                    max={10}
                    color={skill.color}
                  />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Radar Chart for Visual Skills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-[#0F1629]/80 to-[#0A0F1E]/80 backdrop-blur-xl rounded-2xl p-6 border border-[#00D4FF]/20"
          >
            <h3 className="text-[#00D4FF] font-semibold mb-4 flex items-center gap-2">
              <MdGrain className="text-[#00FFB3]" />
              Skills Radar
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={skillData}>
                <PolarGrid stroke="#2D3748" />
                <PolarAngleAxis
                  dataKey="skill"
                  stroke="#00D4FF"
                  tick={{ fill: "#00D4FF", fontSize: 10 }}
                />
                <PolarRadiusAxis domain={[0, 10]} stroke="#888" />
                <Radar
                  name="Your Score"
                  dataKey="value"
                  stroke="#00FFB3"
                  fill="#00FFB3"
                  fillOpacity={0.3}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Question Breakdown Section - FIXED: Removed strengths and improvements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 space-y-4"
        >
          <h3 className="text-[#00D4FF] font-semibold text-xl flex items-center gap-2">
            <MdChat className="text-[#00FFB3]" />
            Question Breakdown
          </h3>

          <AnimatePresence>
            {questionBreakdown.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-[#0F1629]/80 to-[#0A0F1E]/80 backdrop-blur-xl rounded-2xl p-6 border border-[#00D4FF]/20 hover:border-[#00FFB3]/50 transition-all duration-300"
              >
                <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#00FFB3]/20 flex items-center justify-center">
                      <span className="text-[#00FFB3] font-bold">
                        {item.id}
                      </span>
                    </div>
                    <h4 className="text-[#00FFB3] font-semibold">
                      Question {item.id}
                    </h4>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-sm">Score:</span>
                      <span className="text-[#00FFB3] font-bold">
                        {item.score}/10
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-white mb-4 leading-relaxed">
                  {item.question}
                </p>

                {/* Skill breakdown for this question */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                  <div className="bg-[#00D4FF]/5 rounded-lg p-3">
                    <p className="text-[#00D4FF] text-xs font-semibold mb-1">
                      Confidence
                    </p>
                    <ProgressBar
                      value={item.confidence || 0}
                      max={10}
                      color="#00D4FF"
                      showValue={true}
                    />
                  </div>
                  <div className="bg-[#00FFB3]/5 rounded-lg p-3">
                    <p className="text-[#00FFB3] text-xs font-semibold mb-1">
                      Communication
                    </p>
                    <ProgressBar
                      value={item.communication || 0}
                      max={10}
                      color="#00FFB3"
                      showValue={true}
                    />
                  </div>
                  <div className="bg-[#FFD93D]/5 rounded-lg p-3">
                    <p className="text-[#FFD93D] text-xs font-semibold mb-1">
                      Correctness
                    </p>
                    <ProgressBar
                      value={item.correctness || 0}
                      max={10}
                      color="#FFD93D"
                      showValue={true}
                    />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-[#00FFB3]/10 to-transparent rounded-lg p-4 border-l-4 border-[#00FFB3]">
                  <p className="text-[#00FFB3] text-sm font-semibold mb-1 flex items-center gap-2">
                    <MdPsychology className="text-[#00FFB3]" />
                    AI Feedback
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    {item.feedback || "No feedback available"}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Recommendation Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 bg-gradient-to-r from-[#00D4FF]/10 to-[#00FFB3]/10 backdrop-blur-xl rounded-2xl p-6 border border-[#00D4FF]/30"
        >
          <h3 className="text-[#00D4FF] font-semibold text-xl mb-3 flex items-center gap-2">
            <MdPsychology className="text-[#00FFB3]" />
            AI Recommendations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-[#0F1629]/50 rounded-lg">
              <p className="text-[#FFD93D] font-semibold mb-1">
                📚 Practice More
              </p>
              <p className="text-sm text-gray-300">
                Focus on structured responses using STAR method
              </p>
            </div>
            <div className="p-3 bg-[#0F1629]/50 rounded-lg">
              <p className="text-[#FFD93D] font-semibold mb-1">
                🎯 Be Specific
              </p>
              <p className="text-sm text-gray-300">
                Include concrete examples and metrics in answers
              </p>
            </div>
            <div className="p-3 bg-[#0F1629]/50 rounded-lg">
              <p className="text-[#FFD93D] font-semibold mb-1">
                🗣️ Improve Clarity
              </p>
              <p className="text-sm text-gray-300">
                Speak slowly and organize thoughts before answering
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default InterviewAnalytics;
