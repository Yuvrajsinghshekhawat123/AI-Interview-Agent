import { User } from "../02-models/01-userModel.js";
import { Session } from "../02-models/02-session.js";
import argon2 from "argon2";
import admin from "../06-utils/firebaseAdmin.js";
import {
  setAccessTokenCookies,
  setRefreshTokenCookie,
} from "../06-utils/token.js";

import { openai } from "../06-utils/openRouter.js";
import { extractTextFromPDF } from "../06-utils/pdfParser.js";
import { Interview } from "../02-models/03-interview.js";
import {
  GenerateQuestionsMessagesPrompt,
  SubmitAnsMessagesPrompt,
} from "../06-utils/Prompts.js";

export async function Login(req, res) {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // ✅ Verify Firebase token
    const decoded = await admin.auth().verifyIdToken(token);

    // ✅ Create or find user
    let user = await User.findOne({ email: decoded.email });

    if (!user) {
      user = await User.create({
        name: decoded.name,
        email: decoded.email,
        firebaseUid: decoded.uid,
      });
    }

    // ✅ Create tokens
    const access_Token = setAccessTokenCookies(res, { userId: user._id });
    const refresh_Token = setRefreshTokenCookie(res, { userId: user._id });

    // ✅ Hash refresh token
    const hashedRefreshToken = await argon2.hash(refresh_Token);

    const userAgent = req.headers["user-agent"] || null;

    // ✅ Store session
    await Session.create({
      userId: user._id,
      refreshTokenHash: hashedRefreshToken, // FIXED
      userAgent,
      clientIp: req.clientIp,
    });

    // ✅ Send response
    return res.status(200).json({
      success: true,
      message: "Login successful",
      user,
    });
  } catch (err) {
    console.error(err);

    return res.status(401).json({
      success: false,
      message: "Invalid Firebase token",
    });
  }
}

// userDeatils
export async function userDetails(req, res) {
  try {
    const user = await User.findOne({ _id: req.userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User details",
      user,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

// loggout
export async function logout(req, res) {
  try {
    const userAgent = req.headers["user-agent"] || null;
    await Session.deleteMany({
      userId: req.userId,
      userAgent,
      clientIp: req.clientIp,
    });

    res.clearCookie("access_Token");
    res.clearCookie("refresh_Token");
    res.status(201).json({ success: true, message: "User logut successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

// reusume analises
export async function analysisResume(req, res) {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const buffer = file.buffer;
    if (buffer.length > 2 * 1024 * 1024) {
      return res.status(400).json({ message: "File too large" });
    }

    // ✅ Extract text
    const uint8Array = new Uint8Array(buffer);
    const resumeText = await extractTextFromPDF(uint8Array);
    const trimmedText = resumeText.slice(0, 3000);

    // 🔹 Send to AI
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
Extract structured data from resume.

Return ONLY JSON in this format:

{
  "role": "string",
  "experience": "string",
  "projects": ["project1", "project2"],
  "skills": ["skill1", "skill2"]
}

Do not add anything else.
Do not explain.
`,
        },
        {
          role: "user",
          content: trimmedText,
        },
      ],
      max_tokens: 500, // 🔥 control cost
    });

    const raw = response.choices[0].message.content;

    // convert string → JSON
    const parsed = JSON.parse(raw);

    return res.json({
      role: parsed.role,
      experience: parsed.experience,
      projects: parsed.projects,
      skills: parsed.skills,
      resumeText, // optional
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}
4;

// generate Questions
export async function generateQuestions(req, res) {
  try {
    const user = await User.findOne({ _id: req.userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    const { role, experience, mode, resumeText, projects, skills } = req.body;
    
    if (!role || !experience || !mode) {
      return res.status(400).json({
        success: false,
        message: "Role, experience, and mode are required",
      });
    }

    if (user.credits < 50) {
      return res.status(400).json({
        success: false,
        message: "Insufficient credits,Minimum 50 credits required",
      });
    }

    const projectText =
      Array.isArray(projects) && projects.length ? projects.join(", ") : "None";
    const skillsText =
      Array.isArray(skills) && skills.length ? skills.join(", ") : "None";
    const safeResume = resumeText?.trim() || "None";

    const userPrompt = `
        Role: ${role}
        Experience: ${experience}
        InterviewMode: ${mode}
        Projects: ${projectText}
        Skills: ${skillsText}
        Resume: ${safeResume}
        `;

    // 🔹 Send to AI
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: GenerateQuestionsMessagesPrompt(userPrompt),
      max_tokens: 500,
    });

    const questions = response.choices[0].message.content
      .split("\n")
      .map((q) =>
        q
          .replace(/^\d+[\).\-\s]*/, "")
          .replace(/^-\s*/, "")
          .trim(),
      )
      .filter((q) => q.length > 0);

    if (!questions || questions.length === 0) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate questions",
      });
    }

    // now questions are genrated so minus the user credits
    user.credits -= 50;
    await user.save();

    // now create the interview
    const interview = await Interview.create({
      userId: user._id,
      role,
      experience,
      mode,
      resumeText: safeResume,
      questions: questions.map((q, index) => ({
        question: q,
        difficulty: index < 2 ? "easy" : index < 4 ? "medium" : "hard",
        timelimit: index < 2 ? 60 : index < 4 ? 90 : 120,
      })),
    });

    return res.json({
      success: true,
      interviewId: interview._id,
      creditsLeft: user.credits,
      userName: user.name,
      questions: interview.questions,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while generating questions",
    });
  }
}

// if user refreseh the page then gernate questions store in reduc vaninsh , so create api which


export async function submitAnswer(req, res) {
  try {
    const { interviewId, questionIndex, answer, timeTaken } = req.body;
    const interview = await Interview.findById(interviewId);
    const question = interview.questions[questionIndex];

    // if no answer
    if (!answer) {
      question.score = 0;
      question.feedback = "You did not provide an answer.";
      question.answer = "";
      await interview.save();

      return res
        .status(400)
        .json({ success: false, message: "You did not provide an answer." });
    }

    // if time execced
    if (timeTaken > question.timelimit) {
      question.score = 0;
      question.feedback = "You exceeded the time limit for this question.";
      question.answer = answer;
      await interview.save();

      return res.status(400).json({
        success: false,
        message: "You exceeded the time limit for this question.",
      });
    }

    // now find the score of ans using ai
    // 🔹 Send to AI
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: SubmitAnsMessagesPrompt(question, answer),
      max_tokens: 500,
    });

    const content = response.choices[0].message.content;

    const parsed = JSON.parse(content);
     

     // now store it in qustion talbe
    question.answer = answer;
    question.confidence = parsed.confidence;
    question.communication = parsed.communication;
    question.correctness = parsed.relevance;
    question.score = parsed.finalScore;
    question.feedback = parsed.feedback;
    await interview.save();



    return res.json({
      success: true,
      message: parsed.feedback,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while submitting the answer",
    });

  }
}




// final report
export async function finishInterview(req,res) {
  try {

    const {interviewId} = req.body;
    const interview=await Interview.findById(interviewId);

    if(!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }


    
    const totalQuestions=interview.questions.length;
    let totalScore = 0;
    let totalConfidence = 0;
    let totalCommunication = 0;
    let totalCorrectness = 0;

    interview.questions.forEach((question) => {
      totalScore += question.score || 0;
      totalConfidence += question.confidence || 0;
      totalCommunication += question.communication || 0;
      totalCorrectness += question.correctness || 0;
    });


    // now find eah one avrage
    const averageFinalScore = totalQuestions ? totalScore / totalQuestions : 0;
    const averageConfidence = totalQuestions ? totalConfidence / totalQuestions : 0;
    const averageCommunication = totalQuestions ? totalCommunication / totalQuestions : 0;
    const averageCorrectness = totalQuestions ? totalCorrectness / totalQuestions : 0;


    interview.finalScore=averageFinalScore;
    interview.status="completed"
    await interview.save();


  return res.status(200).json({
  finalScore: Number(averageFinalScore.toFixed(1)),
  confidence: Number(averageConfidence.toFixed(1)),
  communication: Number(averageCommunication.toFixed(1)),
  correctness: Number(averageCorrectness.toFixed(1)),

  questionWiseScore: interview.questions.map((q) => ({
    question: q.question,
    score: q.score || 0,
    feedback: q.feedback || "",
    confidence: q.confidence || 0,
    communication: q.communication || 0,
    correctness: q.correctness || 0,
  })),
});


  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while finishing the interview",
    });
  }

}
