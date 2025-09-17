import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import "react-toastify/dist/ReactToastify.css";
import { Link as LinkIcon, Send, Trash2, ClipboardList } from "lucide-react";

const GenerateForm: React.FC = () => {
  const { logout } = useAuth();
  const [formLink, setFormLink] = useState<string | null>(null);
  const [formId, setFormId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Load saved formId & formLink from localStorage on mount
  useEffect(() => {
    const savedFormId = localStorage.getItem("formId");
    const savedFormLink = localStorage.getItem("formLink");
    if (savedFormId) setFormId(savedFormId);
    if (savedFormLink) setFormLink(savedFormLink);
  }, []);

  // // 🔹 Generate new form link
  const generateFormLink = async () => {
    const confirmed = window.confirm(
      "⚠️ Are you sure? Generating a new link will reset all users!"
    );
    if (!confirmed) return;

    try {
      setLoading(true);
      const res = await axios.post(
        "https://survey-pro-44pf.onrender.com/api/form/generate",
        {}
      );
      if (res.data.success) {
        const formLinkFromBackend = res.data.link;
        setFormLink(formLinkFromBackend);

        // Extract formId from link
        const extractedFormId = formLinkFromBackend.split("/").pop() || "";
        setFormId(extractedFormId);

        // Save both in localStorage
        localStorage.setItem("formLink", formLinkFromBackend);
        localStorage.setItem("formId", extractedFormId);

        toast.success(
          "✅ Form link generated successfully! You will be logged out now."
        );

        // Logout user after success
        setTimeout(() => {
          logout();
        }, 2000);
      } else {
        toast.error("❌ Failed to generate form link");
      }
    } catch {
      toast.error("❌ Error generating form link");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Send form invites
  const sendFormInvites = async () => {
    if (!formLink) {
      toast.error("⚠️ Please generate the link first!");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(
        "https://survey-pro-44pf.onrender.com/api/form/send-invites",
        { formLink }
      );
      if (res.data.message) toast.success(res.data.message);
      else toast.error("❌ Failed to send invites");
    } catch {
      toast.error("❌ Error sending invites");
    } finally {
      setLoading(false);
    }
  };

  const deleteForm = async () => {
    if (!formId) {
      toast.error("⚠️ No form available to delete");
      return;
    }

    const confirmed = window.confirm(
      "⚠️ Are you sure you want to delete this form response and its link?"
    );
    if (!confirmed) return;

    try {
      setLoading(true);

      const res = await axios.delete(
        `https://survey-pro-44pf.onrender.com/api/form/responses/${formId}`
      );

      if (res.data.success) {
        setFormLink(null);
        setFormId(null);
        localStorage.removeItem("formLink");
        localStorage.removeItem("formId");

        toast.success(
          res.data.message || "✅ Form response and link deleted successfully!"
        );
      } else {
        toast.error("❌ Failed to delete form");
      }
    } catch (err: any) {
      console.error("❌ Delete Error:", err);
      toast.error(err.response?.data?.message || "❌ Error deleting form");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-sky-50 to-sky-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-3xl w-full max-w-2xl p-8">
        {/* Title */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <ClipboardList className="w-8 h-8 text-sky-700" />
          <h1 className="text-3xl font-extrabold text-center text-sky-700 drop-shadow-md">
            Form Manager
          </h1>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <button
            onClick={generateFormLink}
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition duration-300 disabled:opacity-50"
          >
            <LinkIcon className="w-5 h-5" />
            {loading ? "Generating..." : "Generate Link"}
          </button>

          <button
            onClick={sendFormInvites}
            disabled={!formLink || loading}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition duration-300 disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
            {loading ? "Sending..." : "Send Invites"}
          </button>

          <button
            onClick={deleteForm}
            disabled={!formLink || loading}
            className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition duration-300 disabled:opacity-50"
          >
            <Trash2 className="w-5 h-5" />
            {loading ? "Deleting..." : "Delete Form"}
          </button>
        </div>

        {/* Generated Form Link */}
        {formLink && (
          <div className="bg-sky-50 border-l-4 border-sky-600 p-4 rounded-xl">
            <p className="font-semibold text-sky-700">Generated Form Link:</p>
            <a
              href={formLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline break-all flex items-center gap-1"
            >
              {formLink}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateForm;
