import crypto from "crypto";
import FormLink from "../models/form.model.js";
import FormResponse from "../models/formResponse.model.js";
import userModel from "../models/user.model.js";

/**
 * @desc Generate a unique form link
 * @route POST /api/form/generate
 */
export const generateFormLink = async (req, res) => {
  try {
    // 🔁 Reset all users
    await userModel.updateMany({}, {
      $set: {
        password: null,
        firstLogin: true,
        formSubmitted: false
      }
    });

    // 🔑 Generate new link
    const linkId = crypto.randomBytes(16).toString("hex");
    const newLink = await FormLink.create({ linkId });

    res.status(201).json({
      success: true,
      message: "Form link generated successfully. All users have been reset.",
      link: `http:/localhost:5000/form/${linkId}`,
      linkId: newLink.linkId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * @desc Get form structure if link is valid & not used
 * @route GET /api/form/:linkId
 */
export const getFormStructure = async (req, res) => {
  try {
    const { linkId } = req.params;

    const link = await FormLink.findOne({ linkId });

    if (!link) {
      return res.status(404).json({ success: false, message: "Invalid form link" });
    }

    if (link.isUsed) {
      return res.status(400).json({ success: false, message: "Form already submitted" });
    }

    // Send structure (or frontend can hardcode structure too)
    res.json({
      success: true,
      structure: {
        fields: ["headquarters", "division", "group", "position"]
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * @desc Submit the form response
 * @route POST /api/form/:linkId/submit
 */
export const submitForm = async (req, res) => {
  try {
    const { linkId } = req.params;
    const { headquarters, division, group, position } = req.body;

    const link = await FormLink.findOne({ linkId });

    if (!link) {
      return res.status(404).json({ success: false, message: "Invalid form link" });
    }

    if (link.isUsed) {
      return res.status(400).json({ success: false, message: "Form already submitted" });
    }

        const userEmail = req.user.email;

    // Save response
    const response = await FormResponse.create({
      linkId,
      headquarters,
      division,
      group,
      position,
      email: userEmail,
    });

    // Mark link as used
    link.isUsed = true;
    link.usedAt = new Date();
    await link.save();

    res.status(201).json({ success: true, message: "Form submitted successfully", response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * @desc Get all submitted form responses
 * @route GET /api/form/responses/all
 */
export const getAllResponses = async (req, res) => {
  try {
    const responses = await FormResponse.find().sort({ submittedAt: -1 });
    res.json({ success: true, responses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * @desc Delete a form response and its associated link
 * @route DELETE /api/form/responses/:id
 */
export const deleteResponse = async (req, res) => {
  try {
    const { id } = req.params;

    const response = await FormResponse.findById(id);
    if (!response) {
      return res.status(404).json({ success: false, message: "Response not found" });
    }

    // Delete response
    await FormResponse.findByIdAndDelete(id);

    // Delete associated link
    await FormLink.findOneAndDelete({ linkId: response.linkId });

    res.json({ success: true, message: "Response and link deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const sendFormInvites = async (req, res) => {
  try {
    const { subject, formLink } = req.body;

    if (!subject || !formLink) {
      return res.status(400).json({ error: "Subject and form link are required." });
    }

    const users = await User.find({ email: /@(outlook|hotmail)\.com$/i });

    if (!users.length) {
      return res.status(404).json({ error: "No Outlook users found." });
    }

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

    res.json({ message: `Emails sent to ${users.length} Outlook users successfully.` });
  } catch (error) {
    console.error("Email sending error:", error);
    res.status(500).json({ error: "Failed to send emails." });
  }
};