import { FaUserTie } from "react-icons/fa";
import { BsMic } from "react-icons/bs";
import { FiBarChart2 } from "react-icons/fi";
import { LuUpload } from "react-icons/lu";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRef } from "react";
import { toast } from "react-toastify";
import { useAnalyzeResume } from "../../03-features/01-user/03-hook/04-useAnalyze";
import { useGenerateQuestions } from "../../03-features/01-user/03-hook/05-useGenerateQuestions";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../00-app/01-userSlice";

export default function InterviewSetup() {
 const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  
  const fileInputRef = useRef();
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [interviewtype, setInterviewtype] = useState("Technical Interview");
  const [fileName, setFileName] = useState(null);
  const [resumeAanalysisData, setResumeAanalysisData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { mutate } = useAnalyzeResume();
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // ✅ Only PDF allowed
    if (file.type !== "application/pdf") {
      toast.error("Only upload pdf");
      return;
    }

    setFileName(file.name);

    setIsAnalyzing(true);
    const formData = new FormData();
    formData.append("resume", file); // 👈 key name should match backend
    mutate(formData, {
      onSuccess: (data) => {
        setResumeAanalysisData(data);
        setIsAnalyzing(false);
        setRole(data.role);
        console.log(data);
      },
      onError: (err) => {
        setIsAnalyzing(false);
        setFileName("");
        toast.error(err.response?.data?.message || "Something went wrong");
      },
    });
  };

  const handleClick = () => {
    fileInputRef.current.click(); // 🔥 open file picker
  };


  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const { mutate: generateQuestionsMutate } = useGenerateQuestions();
  const handleGenerateQuestions = () => {
    setIsGeneratingQuestions(true);
    generateQuestionsMutate({ role, experience, mode:interviewtype, resumeText: resumeAanalysisData?.resumeText, projects: resumeAanalysisData?.projects,skills: resumeAanalysisData?.skills }, {
      onSuccess: (data) => {
         dispatch(updateUser({ credits: data.creditsLeft }));
        setIsGeneratingQuestions(false);
      },
      onError: (err) => {
        setIsGeneratingQuestions(false);
        setFileName("");
        toast.error(err.response?.data?.message || "Something went wrong");
      }
    });
  };

  const items = [
    { icon: <FaUserTie />, text: "Choose Role & Experience" },
    { icon: <BsMic />, text: "Smart Voice Interview" },
    { icon: <FiBarChart2 />, text: "Performance Analytics" },
  ];
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      {/* Main Container */}
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden grid md:grid-cols-2">
        {/* LEFT SIDE */}
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9 }}
          className="bg-green-100 p-8 flex flex-col justify-center"
        >
          <h2 className="text-2xl font-bold text-gray-800">
            Start Your AI Interview
          </h2>
          <p className="text-gray-600 mt-3 text-sm">
            Practice real interview scenarios powered by AI. Improve
            communication, technical skills, and confidence.
          </p>

          {/* Features */}
          <div className="mt-6 space-y-3">
            {items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: index * 0.2, // 🔥 stagger effect
                  duration: 0.5,
                  ease: "easeOut",
                }}
                className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm"
              >
                <span className="text-green-600">{item.icon}</span>
                <span className="text-sm">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT SIDE */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9 }}
          className="p-8"
        >
          <h2 className="text-xl font-semibold mb-6">Interview Setup</h2>

          {/* Input */}
          <input
            type="text"
            value={role}
            onChange={(e) => {
              const value = e.target.value;

              if (/^[a-zA-Z\s]*$/.test(value)) {
                setRole(value);
              }
            }}
            placeholder="Enter Role (e.g Full Stack Developer)"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <input
            type="text"
            value={experience}
            onChange={(e) => {
              const value = e.target.value;
               if(/^[0-9]*$/.test(value))setExperience(value);
            }}
            placeholder="Experience (e.g. 2 years)"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {/* Select */}
          <select
            value={interviewtype} // 🔥 bind state
            onChange={(e) => setInterviewtype(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
          >
            <option>Technical Interview</option>
            <option>HR Interview</option>
          </select>

          {/* Upload Box */}
          {isAnalyzing ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center"
            >
              <div className="w-8 h-8 border-4 border-green-400 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="pb-3">Analyzing your resume...</p>
            </motion.div>
          ) : !resumeAanalysisData ? (
            <div
              onClick={handleClick}
              className="group border-2 border-dashed border-green-400 rounded-lg p-6 text-center mb-4 cursor-pointer hover:bg-green-50 transition"
            >
              <LuUpload className="mx-auto text-green-600 mb-2" size={28} />
              
                <p className="text-sm text-gray-600">
                  {fileName
                    ? fileName
                    : "Click to upload your resume to auto-fill the fields (optional)."}
                </p>
              

              {/* Hidden Input */}
              <input
                type="file"
                accept="application/pdf" // 🔥 restrict to PDF
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          ) : (
            // ✅ DATA RECEIVED → HIDE INPUT BOX
            <div className="border border-green-400 bg-green-50 rounded-lg p-4 mb-4">

  <h2 className="font-semibold text-gray-800 mb-3">
    Resume Analysis Result
  </h2>

  {/* Scroll Container */}
  <div className="max-h-48 overflow-y-auto pr-2">

    {/* Projects */}
    <div className="mb-4">
      <h3 className="font-medium mb-1">Projects:</h3>
      <ul className="list-disc ml-5 text-sm text-gray-700">
        {resumeAanalysisData.projects.map((project, index) => (
          <li key={index}>{project}</li>
        ))}
      </ul>
    </div>

    {/* Skills */}
    <div>
      <h3 className="font-medium mb-1">Skills:</h3>
      <div className="flex flex-wrap gap-2">
        {resumeAanalysisData.skills.map((skill, index) => (
          <span
            key={index}
            className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>

  </div>
</div>
          )}

          {/* Button */}
          <motion.button
            onClick={handleGenerateQuestions} 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer w-full bg-gray-800 text-white py-3 rounded-full hover:bg-black transition disabled:cursor-not-allowed disabled:opacity-30" disabled={(fileName && !resumeAanalysisData) || isGeneratingQuestions}>
            {isGeneratingQuestions ? "Generating Questions..." : "Start Interview"}
          </motion.button>  
        </motion.div>
      </div>
    </div>
  );
}
