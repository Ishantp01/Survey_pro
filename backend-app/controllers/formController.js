import Form from "../models/Form.js";
import FormResponse from "../models/FormResponse.js";
import crypto from "crypto";
import userModel from "../models/user.model.js";
import { sendEmail } from "../utils/email.util.js";

// Generate new form link and reset users
export const generateFormLink = async (req, res) => {
  try {
    // Reset all users so they can re-submit
    await userModel.updateMany(
      {},
      {
        $set: {
          password: null, // must be >= 8 chars (default password)
          firstLogin: true,
          formSubmitted: false,
        },
      }
    );

    // Deactivate old form links
    await Form.updateMany({}, { $set: { active: false } });

    // Generate new unique form link
    const linkId = crypto.randomBytes(16).toString("hex");
    const link = `${process.env.FRONTEND_URL || "http://localhost:5173"}/form/${linkId}`;

    const newForm = new Form({ link, active: true });
    await newForm.save();

    // Respond
    res.status(201).json({
      success: true,
      message: "Form link generated successfully. All users have been reset.",
      link,
      linkId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const getAllResponses = async (req, res) => {
  try {
    const responses = await FormResponse.find().sort({ submittedAt: -1 });
    res.json({ success: true, responses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
// Submit form response
export const submitFormResponse = async (req, res) => {
  try {
    const { department, team, group, position, timeSlots, clientDate, clientTime } = req.body;
    const email = req.user.email; // from token

    const activeForm = await Form.findOne({ active: true });
    if (!activeForm) return res.status(400).json({ success: false, message: "No active form" });

    // Prevent duplicate submissions
    const existingResponse = await FormResponse.findOne({ formId: activeForm._id, email });
    if (existingResponse) {
      return res.status(400).json({ success: false, message: "You have already submitted this form." });
    }

    const response = new FormResponse({
      formId: activeForm._id,
      email,
      department,
      team,
      group,
      position,
      timeSlots, // array of {timeRange, task1, task2}
      clientDate, // save client date
      clientTime, // save client time
    });

    await response.save();

    res.json({ success: true, message: "Response saved successfully", response });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error submitting response", error: err.message });
  }
};
// Get all responses for a form
export const getResponses = async (req, res) => {
  try {
    const { formId } = req.params;
    const { startDate, endDate } = req.query;

    let filter = { formId };
    if (startDate && endDate) {
      filter.submittedAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const responses = await FormResponse.find(filter);
    res.json({ success: true, responses });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching responses", error: err.message });
  }
};

export const getResponsesByDate = async (req, res) => {
  try {
    const { date } = req.query; // expecting YYYY-MM-DD

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date is required in YYYY-MM-DD format",
      });
    }

    // 🆕 Filter using clientDate instead of createdAt
    const responses = await FormResponse.find({ clientDate: date });

    res.json({
      success: true,
      count: responses.length,
      responses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


export const sendFormInvites = async (req, res) => {
  try {
    const { formLink } = req.body;

    if (!formLink) {
      return res.status(400).json({ error: "Form link is required." });
    }

    // 🔹 Hardcoded test email list
    const testEmails = [
      "iammsk@learning-crew.com",
      "hsjang@learning-crew.com",
      "ejjung@learning-crew.com",
      "janehwang@learning-crew.com",
      "jaeeun0211@learning-crew.com",
      "siddhantdubey867@gmail.com",
      "sparshsahu8435@gmail.com",
    ];

    // Static subject
    const subject =
      "[회의·보고 문화 개선 프로젝트] 업무시간 활용 조사 참여 안내";

    // Email template
    const emailHtmlTemplate = (userEmail) => `
      <div style="font-family:Arial, sans-serif; line-height:1.6; color:#333;">
        <p>안녕하십니까.<br>
        [회의·보고 문화 개선 프로젝트] 진행하고 있는 러닝크루 컨설팅 이채윤입니다.</p>

        <p>해당 프로젝트의 일환으로 업무시간 활용 조사를 실시하오니, 참여 부탁드립니다.</p>

        <p><b>III. 참여 방법 및 계정 정보</b><br>
        <a href="${formLink}" style="color:#33658A;">[참여 링크]</a><br>
        <b>ID:</b> ${userEmail}<br>
        <b>PW:</b> qwe1234 (최초 로그인 후 변경 가능)</p>
      </div>
    `;

    // 🔹 Send emails in parallel
    await Promise.all(
      testEmails.map((email) =>
        sendEmail(
          email,
          subject,
          `조사에 참여해 주시기 바랍니다.\n\n참여 링크: ${formLink}\nID: ${email}\nPW: qwe1234`,
          emailHtmlTemplate(email)
        )
      )
    );

    res.json({
      message: `Test emails sent to ${testEmails.length} recipients.`,
    });
  } catch (error) {
    console.error("Email sending error:", error);
    res.status(500).json({ error: "Failed to send test emails." });
  }
};
/*
export const sendFormInvites = async (req, res) => {
  try {
    const { formLink } = req.body;

    if (!formLink) {
      return res.status(400).json({ error: "Form link is required." });
    }

    // Find all Outlook or Hotmail users
    const users = await userModel.find({ email: /@(outlook|hotmail)\.com$/i });

    if (!users.length) {
      return res.status(404).json({ error: "No Outlook users found." });
    }

    // Static subject
    const subject =
      "[회의·보고 문화 개선 프로젝트] 업무시간 활용 조사 참여 안내";

    // HTML Email Template
    const emailHtmlTemplate = (userEmail) => `
      <div style="font-family:Arial, sans-serif; line-height:1.6; color:#333;">
        <p>안녕하십니까.<br>
        [회의·보고 문화 개선 프로젝트] 진행하고 있는 러닝크루 컨설팅 이채윤입니다.</p>

        <p>해당 프로젝트의 일환으로 업무시간 활용 조사를 실시하오니, 참여 부탁드립니다.<br>
        본 조사는 9월 9일~12일 1차 설문의 후속 과업으로, 실제 업무 활동과 설문 결과를 연계 분석하기 위해 진행됩니다.</p>

        <h3 style="color:#0E1C36;">[조사 개요]</h3>
        <p><b>I. 조사 목적</b><br>
        - 근무시간 중 회의·보고 활동 비중 및 업무 패턴 파악<br>
        - 조직별 업무시간 활용 현황 분석<br>
        - 회의·보고 효율화 개선안 도출을 위한 데이터 수집</p>

        <p><b>II. 조사 기간</b><br>
        2025년 9월 18일(목) ~ 10월 2일(목), 총 10영업일</p>

        <p><b>III. 참여 방법 및 계정 정보</b><br>
        <a href="${formLink}" style="color:#33658A;">[참여 링크]</a><br>
        <b>ID:</b> ${userEmail}<br>
        <b>PW:</b> qwe1234 (최초 로그인 후 변경 가능)</p>

        <p><b>IV. 기록 방식</b><br>
        - 시간대별로 제시된 업무 유형 선택(동일 시간대 복수 업무 수행시 최대 2개 업무 선택)</p>

        <p><b>V. 개인정보 보호</b><br>
        - 개인 응답은 조직 단위(본부/실/그룹)로만 집계<br>
        - 개인 식별 목적으로 사용하지 않음(주관 부서에 개인별 정보 미제공)</p>

        <p>여러분의 참여가 실질적인 불필요한 업무를 줄여,<br>
        더욱 중요한 업무를 위한 시간을 확보하고 효율적인 근무 문화를 만드는 데 중요한 역할을 하게 됩니다.<br>
        조사 기간 동안 매일 빠짐없이 참여해 주시기를 부탁드립니다.</p>

        <p>러닝크루 컨설팅 이채윤 드림.</p>
        <hr style="border:none; border-top:1px solid #ccc; margin:20px 0;">
        <p style="font-size: 13px; color: #666;">
        문의처:<br>
        Learning Crew Performance Consulting Team<br>
        이채윤 상무<br>
        <a href="mailto:lcy@learning-crew.com">lcy@learning-crew.com</a>
        </p>
      </div>
    `;

    await Promise.all(
      users.map((user) =>
        sendEmail(
          user.email,
          subject,
          `조사에 참여해 주시기 바랍니다.\n\n참여 링크: ${formLink}\nID: ${user.email}\nPW: qwe1234`,
          emailHtmlTemplate(user.email)
        )
      )
    );

    res.json({
      message: `Emails sent to ${users.length} Outlook users successfully.`,
    });
  } catch (error) {
    console.error("Email sending error:", error);
    res.status(500).json({ error: "Failed to send emails." });
  }
};
*/
