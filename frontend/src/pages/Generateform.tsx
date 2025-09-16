import React, { useState } from "react";
import axios from "axios";

const GenerateForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [formLink, setFormLink] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateFormLink = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await axios.post("http://localhost:5000/api/form/generate");

      if (res.data.success) {
        setFormLink(res.data.link);
        setMessage(res.data.message);
      } else {
        setError("Failed to generate form link");
      }
    } catch (err) {
      setError("Something went wrong while generating the form link");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (formLink) {
      navigator.clipboard.writeText(formLink);
      setMessage("Link copied to clipboard!");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-lg p-6 bg-white rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6 text-green-700">
          Generate Form Link
        </h1>

        {/* Generate Button */}
        <div className="flex justify-center mb-4">
          <button
            onClick={generateFormLink}
            disabled={loading}
            className={`px-6 py-2 text-white font-medium rounded-lg transition ${
              loading
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Generating..." : "Generate Link"}
          </button>
        </div>

        {/* Success / Error Message */}
        {message && (
          <p className="text-green-600 text-center mb-4">{message}</p>
        )}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* Display Form Link */}
        {formLink && (
          <div className="mt-4">
            <div className="flex items-center justify-between border rounded-lg p-3 bg-gray-100">
              <a
                href={formLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline truncate"
              >
                {formLink}
              </a>
              <button
                onClick={copyToClipboard}
                className="ml-3 px-3 py-1 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition"
              >
                Copy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateForm;
