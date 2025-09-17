import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import "react-toastify/dist/ReactToastify.css";
import { apiFetch } from "../utils/api";

const GenerateForm: React.FC = () => {
  const { logout } = useAuth();
  const [formLink, setFormLink] = useState<string | null>(null);
  const [formId, setFormId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setError(null);
      const res = await apiFetch("/api/form/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const formLinkFromBackend = data.link;
        setFormLink(formLinkFromBackend);

        const extractedFormId = formLinkFromBackend.split("/").pop() || "";
        setFormId(extractedFormId);

        localStorage.setItem("formLink", formLinkFromBackend);
        localStorage.setItem("formId", extractedFormId);
        localStorage.setItem("linkId", extractedFormId); // For Home.tsx

        toast.success(
          "✅ Form link generated successfully! You will be logged out now."
        );

        setTimeout(() => {
          logout();
        }, 2000);
      } else {
        setError(data.message || "Failed to generate form link");
        toast.error("❌ Failed to generate form link");
      }
    } catch (err) {
      console.error("Error generating form link:", err);
      setError("Error generating form link");
      toast.error("❌ Error generating form link");
    } finally {
      setLoading(false);
    }
  };

  const sendFormInvites = async () => {
    if (!formLink) {
      toast.error("⚠️ Please generate the link first!");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await apiFetch("/api/form/send-invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formLink }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message || "✅ Invites sent successfully!");
      } else {
        setError(data.message || "Failed to send invites");
        toast.error("❌ Failed to send invites");
      }
    } catch (err) {
      console.error("Error sending invites:", err);
      setError("Error sending invites");
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
      "⚠️ Are you sure you want to delete this form?"
    );
    if (!confirmed) return;

    try {
      setLoading(true);
      setError(null);
      const res = await apiFetch(`/api/form/responses/${formId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFormLink(null);
        setFormId(null);

        localStorage.removeItem("formLink");
        localStorage.removeItem("formId");
        localStorage.removeItem("linkId");

        toast.success(data.message || "✅ Form deleted successfully!");
      } else {
        setError(data.message || "Failed to delete form");
        toast.error("❌ Failed to delete form");
      }
    } catch (err) {
      console.error("Error deleting form:", err);
      setError("Error deleting form");
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

        {error && (
          <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-xl mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

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
