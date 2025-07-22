import React from "react";
import { Scale } from "lucide-react";

const WelcomeScreen = () => (
  <div className="flex-1 flex items-center justify-center p-8">
    <div className="text-center max-w-2xl">
      <div className="mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Scale className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to{" "}
          <span className="bg-gradient-to-r from-blue-600 to-purple-700 bg-clip-text text-transparent">
            LawBridge
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Your professional legal AI assistant for document analysis and
          consultation
        </p>
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
        <p className="text-sm text-amber-800">
          <strong>Important:</strong> This is for informational purposes only
          and does not constitute legal advice.
        </p>
      </div>
      <div className="text-sm text-gray-500">
        Start by typing your legal question below
      </div>
    </div>
  </div>
);

export default WelcomeScreen; 