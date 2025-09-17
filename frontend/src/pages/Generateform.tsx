import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import "react-toastify/dist/ReactToastify.css";

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

        // 🔹 Extract formId from the URL
        const extractedFormId = formLinkFromBackend.split("/").pop() || "";
        setFormId(extractedFormId);

        // 🔹 Save both in localStorage
        localStorage.setItem("formLink", formLinkFromBackend);
        localStorage.setItem("formId", extractedFormId);

        toast.success(
          "✅ Form link generated successfully! You will be logged out now."
        );

        // 🔹 Logout user immediately after generating form link
        setTimeout(() => {
          logout(); // Use AuthContext logout method for proper cleanup
        }, 2000); // Give user time to see the success message
      } else {
        toast.error("❌ Failed to generate form link");
      }
    } catch {
      toast.error("❌ Error generating form link");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Send Invites
  const sendFormInvites = async () => {
    if (!formLink) {
      toast.error("⚠️ Please generate the link first!");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(
        "https://survey-pro-44pf.onrender.com/api/form/send-invites",
        {
          formLink,
        }
      );
      if (res.data.message) toast.success(res.data.message);
      else toast.error("❌ Failed to send invites");
    } catch {
      toast.error("❌ Error sending invites");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Delete Form/Link
  const deleteForm = async () => {
    if (!formId) {
      toast.error("⚠️ No form available to delete");
      return;
    }

    const confirmed = window.confirm(
      "⚠️ Are you sure you want to delete this form?"
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

        // Remove from localStorage
        localStorage.removeItem("formLink");
        localStorage.removeItem("formId");

        toast.success(res.data.message || "✅ Form deleted successfully!");
      } else {
        toast.error("❌ Failed to delete form");
      }
    } catch {
      toast.error("❌ Error deleting form");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-3xl w-full max-w-2xl p-8">
        <h1 className="text-3xl font-extrabold text-center text-green-700 mb-6 drop-shadow-md">
          Form Manager
        </h1>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <button
            onClick={generateFormLink}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition duration-300 disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate Link"}
          </button>
          <button
            onClick={sendFormInvites}
            disabled={!formLink || loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition duration-300 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Invites"}
          </button>
          <button
            onClick={deleteForm}
            disabled={!formLink || loading}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition duration-300 disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete Form"}
          </button>
        </div>

        {/* Generated Form Link */}
        {formLink && (
          <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-xl">
            <p className="font-semibold text-green-700">Generated Form Link:</p>
            <a
              href={formLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline break-all"
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
