import React from "react";
import { useEffect } from "react";
import { useMemo } from "react";
import { useState } from "react";
import { useRef } from "react";
import {
  MdKeyboardVoice,
  MdStop,
  MdCheckCircle,
  MdTimer,
  MdSmartToy,
  MdAutoAwesome,
} from "react-icons/md";

import { MdPsychology } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  markProcessed,
  resetGeneratedQuestions,
} from "../../00-app/03-questionsSlice";
import { toast } from "react-toastify";
import { useSubmitAnswers } from "../../03-features/01-user/03-hook/06-useSubmitAnswers";
import { replace, useNavigate } from "react-router-dom";

const getSpeechRecognition = () => {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
};

export const Interview2 = () => {
  const recognitionRef = useRef(null);
  const silenceTimeoutRef = useRef(null);
  const audioContextRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const [answer, setAnswer] = useState("");
  const [interimText, setInterimText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isIntro, setIsIntro] = useState(true);

  const [questionIndex, setQuestionIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [aiMessage, setAiMessage] = useState("");
  const [showAiMessage, setShowAiMessage] = useState(false);
  const [aiResponses, setAiResponses] = useState({});
  const navigate = useNavigate();
  const [speechReady, setSpeechReady] = useState(false);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [pauseStartTime, setPauseStartTime] = useState(0);

  const [showEndConfirm, setShowEndConfirm] = useState(false);

  const hasSubmittedRef = useRef(false);
  const generatedQuestions = useSelector(
    (state) => state.generatedQuestions.generatedQuestions,
  );
  const processedIds = useSelector(
    (state) => state.generatedQuestions.processed,
  );
  const dispatch = useDispatch();

  const questions = generatedQuestions?.questions || [];

  const currentQuestion = questions[questionIndex]?.question || "";

  const user = useSelector((state) => state.user.user);

  const name = user?.name || "Candidate";

  //Store start time (when question loads)
  useEffect(() => {
    if (secondsLeft !== 60 && secondsLeft % 2 === 0) {
      dispatch(markProcessed({ id: questionIndex, time: secondsLeft }));
    }
  }, [secondsLeft]);

  useEffect(() => {
    if (processedIds.length > 0) {
      setQuestionIndex(processedIds[processedIds.length - 1]["id"]);
      setSecondsLeft(processedIds[processedIds.length - 1]["time"]);
    }
  }, []);

  const speechSupported = useMemo(() => {
    return !!getSpeechRecognition();
  }, []);

  // Timer effect
  useEffect(() => {
    // Pause timer when AI speaking
    if (isAISpeaking) return;

    if (secondsLeft === 0 && !hasSubmittedRef.current) {
      hasSubmittedRef.current = true;

      if (isRecording) stopRecording();

      // Set empty answer if nothing provided
      if (!answer.trim() && !interimText.trim()) {
        setAnswer("No answer provided");
      }

      submitAnswer();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, isAISpeaking, answer, interimText, isRecording]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }

      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Get microphone audio level

  const startRecording = async () => {
    setAudioLevel(0);

    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
    }

    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) {
      toast.error(
        "Speech recognition is not available in this browser. You can still type your answer.",
      );
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    let lastSpeechTime = Date.now();
    let silenceCheckInterval = null;

    recognition.onstart = () => {
      setIsRecording(true);

      silenceCheckInterval = setInterval(() => {
        const timeSinceLastSpeech = Date.now() - lastSpeechTime;
        if (timeSinceLastSpeech > 2500 && isRecording) {
          console.log("Silence detected, stopping recording...");
          stopRecording();
        }
      }, 500);
    };

    recognition.onresult = (event) => {
      let finalTranscript = "";
      let liveTranscript = "";

      if (event.results.length > 0) {
        lastSpeechTime = Date.now();
      }

      for (
        let index = event.resultIndex;
        index < event.results.length;
        index += 1
      ) {
        const transcript = event.results[index][0].transcript;
        if (event.results[index].isFinal) {
          finalTranscript += transcript;
        } else {
          liveTranscript += transcript;
        }
      }

      if (finalTranscript) {
        setAnswer((text) =>
          `${text}${text ? " " : ""}${finalTranscript.trim()}`.trim(),
        );
      }
      setInterimText(liveTranscript.trim());
    };

    recognition.onerror = (event) => {
      if (event.error === "not-allowed") {
        toast.error(
          "Microphone permission was blocked. Please allow microphone access.",
        );
      } else if (event.error === "no-speech") {
        toast.error("No speech detected. Please try again.");
      } else {
        toast.error("Could not keep listening. Please try again.");
      }
      setIsRecording(false);
      if (silenceCheckInterval) clearInterval(silenceCheckInterval);
    };

    recognition.onend = () => {
      setIsRecording(false);
      setInterimText("");
      setAudioLevel(0);
      if (silenceCheckInterval) clearInterval(silenceCheckInterval);
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.error("Error stopping recognition:", err);
      }
    }
    setIsRecording(false);
    setInterimText("");
    setAudioLevel(0);
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Simulate AI thinking and speaking after user submits answer
  const showAIThinking = () => {
    setIsAISpeaking(true);
    setShowAiMessage(true);
    setAiMessage("🤔 Analyzing your answer...");
  };

  const showAIResponse = (responseText) => {
    if (questionIndex + 1 >= questions.length) {
      // End interview
      setShowAiMessage(true);
      setAiMessage(`🤖 ${responseText}`);

      speakText(responseText, () => {
        // This runs AFTER speech finishes
      });

      speakText("Interview completed! Thank you!", () => {
        setTimeout(() => {
          setShowAiMessage(false);
          setIsAISpeaking(false);
          toast.success("🎉 Interview completed! Thank you!");
          navigate("/user/interview/report", { replace: true });
          
        }, 1000);

        setAiMessage("🎉 Interview completed! Thank you!");
      });
    } else {
      setShowAiMessage(true);
      setAiMessage(`🤖 ${responseText}`);

      speakText(responseText, () => {
        // This runs AFTER speech finishes
        setShowAiMessage(false);
        setAiMessage("");
        setIsAISpeaking(false);

        // Move to next question
        setSecondsLeft(60);
        setQuestionIndex((prev) => prev + 1);
        setAnswer("");
        setInterimText("");
        hasSubmittedRef.current = false;
      });
    }
  };

  // submit the answer and check usig api
  const { mutate: submitAnswers } = useSubmitAnswers();

  const submitAnswer = () => {
    setIsSubmitting(true);
    stopRecording();

    // ✅ Show thinking immediately
    showAIThinking();

    if (questionIndex < questions.length) {
      submitAnswers(
        {
          interviewId: generatedQuestions.interviewId,
          questionIndex,
          answer,
          timeTaken: secondsLeft,
        },
        {
          onSuccess: (data) => {
            const feedback = data?.message || "No feedback received";

            hasSubmittedRef.current = false; // ✅ RESET
            setAnswer("");
            setInterimText("");
            // ✅ Show real backend response
            showAIResponse(feedback);
          },

          onError: (err) => {
            if (
              err.response?.data?.message === "You did not provide an answer."
            ) {
              let message =
                "You did not provide an answer. Moving to next question.";
              if (questionIndex + 1 >= questions.length) {
                message = "You did not provide an answer.";
              }
              // Reset states
              setIsSubmitting(false);
              setIsAISpeaking(false);

              // Show error message
              setAiMessage(`⚠️ ${message}`);
              setShowAiMessage(true);

              // Speak and move to next question
              speakText(message, () => {
                setTimeout(() => {
                  setShowAiMessage(false);
                  setAiMessage("");

                  // Check if last question
                  if (questionIndex + 1 >= questions.length) {
                    // End interview

                    setAiMessage("🎉 Interview completed! Thank you!");
                    setShowAiMessage(true);

                    speakText("Interview completed! Thank you!", () => {
                      setTimeout(() => {
                        setShowAiMessage(false);
                        setIsAISpeaking(false);
                        toast.success("🎉 Interview completed! Thank you!");
                        navigate("/user/interview/report", { replace: true });
                         
                      }, 1000);
                    });
                  } else {
                    // Move to next question
                    setSecondsLeft(60);
                    setQuestionIndex((prev) => prev + 1);
                    setAnswer("");
                    setInterimText("");
                    hasSubmittedRef.current = false;
                  }
                }, 500);
              });
            } else {
              if (err.response?.data?.message) {
                toast.warning(err.response?.data?.message);
              } else {
                toast.error("Something went wrong");
              }

              setIsAISpeaking(false);
              setIsSubmitting(false);
            }
          },

          onSettled: () => {
            setIsSubmitting(false);
          },
        },
      );
    }
  };

  // Call this function whenever you want the AI to speak
  // Example: speakText("What is your name?");ddddddddddddddddddddddddddddddddddddd

  const speakText = (text, onComplete = null) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();

      setTimeout(() => {
        const fixedText = "So, " + text;

        const utterance = new SpeechSynthesisUtterance(fixedText);
        utterance.rate = 0.9;
        utterance.onstart = () => setIsAISpeaking(true);
        utterance.onend = () => {
          setIsAISpeaking(false);
          if (onComplete) onComplete(); // ✅ Call callback when speech ends
        };

        window.speechSynthesis.speak(utterance);
      }, 100);
    }
  };

  useEffect(() => {
    if (currentQuestion) {
      let introText = "";

      if (isIntro && questionIndex === 0) {
        introText = `Hi ${name}, it's great to meet you today. I hope you're feeling confident and ready. I'll be asking you a few questions and evaluating your responses along the way. 
    Just answer naturally and take your time. Let's begin.........`;
        setIsIntro(false);
      }

      const fullText = `${introText}${currentQuestion}`;

      // Delay before speaking
      const timer = setTimeout(() => {
        speakText(fullText);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [questionIndex]);

  // Modified end interview function with confirmation
  const confirmEndInterview = () => {
    setShowEndConfirm(true);
  };

  // End interview function
  const endInterview = () => {
    // Stop any ongoing recording
    if (isRecording) {
      stopRecording();
    }

    // Cancel any ongoing speech
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    // Show confirmation toast
    toast.info("Interview ended by user", {
      autoClose: 2000,
    });

    // Navigate to home page
    navigate("/user/interview/report", { replace: true });

    // Reset Redux state
    

    // Clean up audio context if exists
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }

    // Clean up media stream
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }

    // Clear any timeouts
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
    }
  };

  const progress = ((questionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0F1E] via-[#0F1629] to-[#0A0F1E]">
      <main className="min-h-screen text-white flex items-center justify-center p-4">
        <div className="w-full max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-5xl font-bold bg-gradient-to-r from-[#00D4FF] via-[#00FFB3] to-[#00D4FF] bg-clip-text text-transparent">
              AI Smart Interview
            </h1>
            <p className="text-[#00D4FF]/60 mt-2">
              Practice with real-time AI feedback
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT PANEL - Questions Progress */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-1 space-y-6"
            >
              {/* AI Status Card */}
              <div
                className={`bg-gradient-to-br from-[#0F1629]/80 to-[#0A0F1E]/80 backdrop-blur-xl rounded-2xl p-6 border border-[#00D4FF]/20 shadow-xl ${isAISpeaking ? "min-h-70" : "h-50"}`}
              >
                <div className="flex items-center gap-2 mb-4">
                  <MdSmartToy className="text-[#00FFB3] text-xl" />
                  <h3 className="text-[#00D4FF] font-semibold">
                    AI Interviewer
                  </h3>
                </div>

                {/* AI Speaking Indicator */}
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div
                    className={`relative ${isAISpeaking ? "animate-pulse" : ""}`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full bg-gradient-to-r from-[#00D4FF] to-[#00FFB3] flex items-center justify-center ${
                        isAISpeaking
                          ? "shadow-[0_0_20px_rgba(0,255,179,0.5)]"
                          : ""
                      }`}
                    >
                      <MdAutoAwesome className="text-[#0A0F1E] text-2xl" />
                    </div>
                    {isAISpeaking && (
                      <>
                        <div className="absolute inset-0 rounded-full border-2 border-[#00FFB3] animate-ping"></div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-blink"></div>
                      </>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Status</p>
                    <p
                      className={`font-semibold ${isAISpeaking ? "text-[#00FFB3]" : "text-gray-300"}`}
                    >
                      {isAISpeaking ? "Speaking..." : "Listening"}
                    </p>
                  </div>
                </div>

                {/* AI Message Bubble */}
                <AnimatePresence>
                  {showAiMessage && !!aiMessage && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 10 }}
                      className="mt-4 p-3 bg-[#00FFB3]/10 rounded-lg border border-[#00FFB3]/30"
                    >
                      <div className="flex items-start gap-2">
                        <MdSmartToy className="text-[#00FFB3] text-lg mt-0.5" />
                        <p className="text-sm text-gray-200">{aiMessage}</p>
                      </div>
                      {/* Speech animation dots */}
                      {isAISpeaking && (
                        <div className="flex gap-1 mt-2 ml-6">
                          <div className="w-1.5 h-1.5 bg-[#00FFB3] rounded-full animate-wave1"></div>
                          <div className="w-1.5 h-1.5 bg-[#00FFB3] rounded-full animate-wave2"></div>
                          <div className="w-1.5 h-1.5 bg-[#00FFB3] rounded-full animate-wave3"></div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Progress Card */}
              <div className="bg-gradient-to-br from-[#0F1629]/80 to-[#0A0F1E]/80 backdrop-blur-xl rounded-2xl p-6 pb-10 border border-[#00D4FF]/20 shadow-xl">
                {/* Header with AI indicator */}
                <div className="flex items-center gap-2 mb-4">
                  <MdTimer
                    className={`text-xl ${isAISpeaking ? "text-[#00FFB3] animate-pulse" : "text-[#00FFB3]"}`}
                  />
                  <h3
                    className={`font-semibold ${isAISpeaking ? "text-[#00FFB3]" : "text-[#00D4FF]"}`}
                  >
                    Interview Progress
                  </h3>
                  {isAISpeaking && (
                    <span className="ml-auto text-xs px-2 py-1 bg-[#00FFB3]/20 rounded-full text-[#00FFB3]">
                      AI Processing
                    </span>
                  )}
                </div>

                {/* Circular Timer */}
                <div
                  className={`relative w-32 h-32 mx-auto mb-4 ${isAISpeaking ? "opacity-40" : "opacity-100"}`}
                >
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                      className="text-[#00D4FF]/10"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray={351.86}
                      strokeDashoffset={351.86 * (1 - secondsLeft / 60)}
                      className={`transition-all duration-1000 ease-linear ${
                        secondsLeft <= 10 ? "text-red-500" : "text-[#00FFB3]"
                      }`}
                    />
                  </svg>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <span
                        className={`text-3xl font-bold ${secondsLeft <= 10 ? "text-red-500 animate-pulse" : "text-white"}`}
                      >
                        {secondsLeft}
                      </span>
                      <span className="text-xs text-gray-400 block">
                        {isAISpeaking ? "paused" : "seconds"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar Section - moved outside the circular timer div */}
                <div className="space-y-2 w-full mt-4">
                  <div className="flex justify-between items-center gap-2 text-sm w-full">
                    <span className="text-gray-400">Questions Completed</span>
                    <span className={`font-semibold text-[#00FFB3]`}>
                      {questionIndex + 1}/{questions.length}
                    </span>
                  </div>
                  <div className="w-full bg-[#00D4FF]/10 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="bg-gradient-to-r from-[#00D4FF] to-[#00FFB3] h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </div>

              {/* Tips Card */}
              <div className="bg-gradient-to-br from-[#0F1629]/60 to-[#0A0F1E]/60 backdrop-blur-xl rounded-2xl p-6 border border-[#00D4FF]/20">
                <h4 className="text-[#00D4FF] font-semibold mb-3">
                  Interview Tips
                </h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-[#00FFB3]">•</span>
                    Speak clearly and concisely
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#00FFB3]">•</span>
                    Take your time to think
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#00FFB3]">•</span>
                    Recording auto-stops after silence
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#00FFB3]">•</span>
                    AI provides feedback after each answer
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* RIGHT PANEL - Interview Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Question Card */}
              <div className="bg-gradient-to-br from-[#0F1629]/80 to-[#0A0F1E]/80 backdrop-blur-xl rounded-2xl p-6 border border-[#00D4FF]/20 shadow-xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-[#00FFB3] font-medium px-3 py-1 bg-[#00FFB3]/10 rounded-full">
                    Question {questionIndex + 1}
                  </span>
                  <span className="text-xs text-gray-500">
                    {questions.length - questionIndex - 1} remaining
                  </span>
                </div>
                <p className="text-xl leading-relaxed text-gray-100">
                  {currentQuestion}
                </p>
              </div>

              {/* Answer Box */}
              <div
                className={`relative bg-gradient-to-br from-[#0F1629]/80 to-[#0A0F1E]/80 backdrop-blur-xl rounded-2xl border-2 transition-all duration-300 ${
                  isRecording
                    ? "border-[#00FFB3] shadow-[0_0_20px_rgba(0,255,179,0.3)]"
                    : "border-[#00D4FF]/20"
                }`}
              >
                <div className="p-4">
                  <textarea
                    value={
                      interimText
                        ? `${answer}${answer ? " " : ""}${interimText}`
                        : answer
                    }
                    onChange={(e) => setAnswer(e.target.value)}
                    rows="6"
                    className="w-full bg-transparent outline-none resize-none text-white placeholder-gray-500 font-medium leading-relaxed"
                    placeholder="Type or speak your answer..."
                    disabled={isAISpeaking}
                  />
                </div>

                {/* Recording Indicator & Audio Wave */}
                <AnimatePresence>
                  {isRecording && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute bottom-3 left-4 right-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1 items-end h-6">
                          {[...Array(5)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="w-1 bg-gradient-to-t from-[#00D4FF] to-[#00FFB3] rounded-full"
                              animate={{
                                height: isRecording
                                  ? [8, 16 + audioLevel / 10, 8]
                                  : 8,
                              }}
                              transition={{
                                duration: 0.3,
                                repeat: Infinity,
                                delay: i * 0.1,
                              }}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-[#00FFB3]">
                          {interimText || "Listening..."}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <div className="w-1.5 h-3 bg-[#00FFB3] rounded-full animate-wave1"></div>
                        <div className="w-1.5 h-5 bg-[#00FFB3] rounded-full animate-wave2"></div>
                        <div className="w-1.5 h-2 bg-[#00FFB3] rounded-full animate-wave3"></div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Action Buttons */}
              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-center gap-4"
              >
                {/* Record Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleRecording}
                  disabled={secondsLeft === 0 || isAISpeaking}
                  className={`relative group p-5 rounded-full text-2xl transition-all duration-300 ${
                    isRecording
                      ? "bg-red-600 hover:bg-red-700 shadow-red-500/50 shadow-lg"
                      : "bg-gradient-to-r from-[#00D4FF] to-[#00FFB3] hover:from-[#00D4FF]/80 hover:to-[#00FFB3]/80 shadow-[#00FFB3]/30 shadow-lg"
                  } ${secondsLeft === 0 || isAISpeaking ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {isRecording ? <MdStop /> : <MdKeyboardVoice />}

                  {/* Tooltip */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                    <div className="bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg border border-gray-700">
                      {isRecording ? "Stop recording" : "Start recording"}
                      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45 border-l border-t border-gray-700"></div>
                    </div>
                  </div>
                </motion.button>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={submitAnswer}
                  disabled={
                    isSubmitting ||
                    (!answer.trim() && !interimText.trim()) ||
                    isAISpeaking
                  }
                  className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                    isSubmitting ||
                    (!answer.trim() && !interimText.trim()) ||
                    isAISpeaking
                      ? "bg-gray-600 cursor-not-allowed opacity-50"
                      : "bg-gradient-to-r from-[#00D4FF] to-[#00FFB3] hover:from-[#00D4FF]/90 hover:to-[#00FFB3]/90 text-[#0A0F1E] shadow-[#00FFB3]/30 shadow-lg"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#0A0F1E] border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <MdCheckCircle />
                      Submit Answer
                    </>
                  )}
                </motion.button>

                {/* End Interview Button - ADD THIS */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={confirmEndInterview}
                  disabled={isAISpeaking || isSubmitting}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                    isAISpeaking || isSubmitting
                      ? "bg-gray-600 cursor-not-allowed opacity-50"
                      : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-red-500/30 shadow-lg"
                  }`}
                >
                  <MdStop />
                  End Interview
                </motion.button>
              </motion.div>

              {/* Status Text */}
              <motion.div
                animate={{ opacity: isRecording ? 1 : 0.7 }}
                className="text-center"
              >
                <p
                  className={`text-sm transition-all duration-300 ${
                    isRecording
                      ? "text-[#00FFB3] animate-pulse"
                      : isAISpeaking
                        ? "text-[#00D4FF]"
                        : "text-gray-400"
                  }`}
                >
                  {isAISpeaking
                    ? "🤖 AI is analyzing your answer..."
                    : isRecording
                      ? "🎙️ Recording your response... (Auto-stops after 2.5 seconds of silence)"
                      : speechSupported
                        ? "🎤 Click the microphone to start speaking"
                        : "🔇 Speech recognition not supported in this browser"}
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {showEndConfirm && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEndConfirm(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
            >
              <div className="bg-gradient-to-br from-[#0F1629] to-[#0A0F1E] rounded-2xl p-6 border border-red-500/30 shadow-xl">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MdStop className="text-red-500 text-3xl" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    End Interview?
                  </h3>
                  <p className="text-gray-400">
                    Are you sure you want to end the interview early? Your
                    progress will not be saved.
                  </p>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowEndConfirm(false)}
                    className="flex-1 px-4 py-2 rounded-xl bg-gray-700/50 hover:bg-gray-700 text-white font-semibold transition-all"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={endInterview}
                    className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold transition-all shadow-red-500/30 shadow-lg"
                  >
                    End Interview
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes wave1 {
          0%,
          100% {
            height: 0.75rem;
          }
          50% {
            height: 1.5rem;
          }
        }

        @keyframes wave2 {
          0%,
          100% {
            height: 1rem;
          }
          50% {
            height: 2rem;
          }
        }

        @keyframes wave3 {
          0%,
          100% {
            height: 0.5rem;
          }
          50% {
            height: 1.25rem;
          }
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        .animate-wave1 {
          animation: wave1 1s ease-in-out infinite;
        }

        .animate-wave2 {
          animation: wave2 1s ease-in-out infinite 0.2s;
        }

        .animate-wave3 {
          animation: wave3 1s ease-in-out infinite 0.4s;
        }

        .animate-blink {
          animation: blink 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
