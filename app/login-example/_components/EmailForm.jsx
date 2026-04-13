"use client";
import React from "react";
/**
 * Props for the EmailForm component.
 * @typedef {Object} EmailFormProps
 * @property {string} email - The current email address entered by the user.
 * @property {import("react").Dispatch<import("react").SetStateAction<string>>} setEmail - State setter function to update the email input value.
 * @property {boolean} isLoading - Indicates whether an OTP request is currently in progress. Disables the input and submit button, and shows a loading spinner.
 * @property {string|null} error - An error message to display if the OTP request fails or validation encounters an issue.
 * @property {number} countdown - The number of seconds remaining before the user is permitted to request another OTP. Changes the button text to show the remaining time.
 * @property {import("react").FormEventHandler<HTMLFormElement>} handleRequestOTP - The callback function triggered upon form submission to initiate the OTP request.
 */

/**
 * Renders the initial email input form for the OTP authentication flow.
 *
 * This component provides a styled email input field allowing users to submit their work email
 * to request a One-Time Password (OTP). It visually manages loading states, displays inline
 * error messages, and enforces a cooldown period via a countdown timer to prevent request spamming.
 *
 * @param {EmailFormProps} props - The component props.
 * @returns {import("react").ReactElement} The rendered email input form component.
 */

export default function EmailForm({
  email,
  setEmail,
  isLoading,
  error,
  countdown,
  handleRequestOTP,
}) {
  return (
    <form
      onSubmit={handleRequestOTP}
      className="w-full space-y-4 sm:space-y-5 animate-in fade-in zoom-in-95 duration-300"
    >
      <div className="relative">
        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block mb-1 sm:mb-1.5 ml-1">
          Work Email
        </label>
        <input
          type="email"
          required
          disabled={isLoading}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="employee@mekari.com"
          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 sm:px-4 sm:py-3 text-sm text-gray-900 outline-none focus:border-[#0062C6] focus:ring-1 focus:ring-[#0062C6] transition-all disabled:opacity-50"
        />
      </div>

      {error && (
        <div className="text-[11px] sm:text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded px-3 py-2 text-center">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || countdown > 0}
        className="w-full py-2.5 sm:py-3 bg-[#0062C6] text-white text-[11px] sm:text-xs font-black uppercase tracking-wider rounded-lg hover:bg-[#004e9e] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center h-[40px] sm:h-[44px]"
      >
        {isLoading ? (
          <svg
            className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : countdown > 0 ? (
          `Wait ${countdown}s`
        ) : (
          "Send OTP"
        )}
      </button>
    </form>
  );
}
