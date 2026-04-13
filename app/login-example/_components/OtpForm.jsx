"use client";
import React from "react";
/**
 * Props for the OtpForm component.
 * @typedef {Object} OtpFormProps
 * @property {string} email - The email address to which the OTP was sent. Displayed in the UI for confirmation.
 * @property {string} otp - The current 6-digit security code entered by the user.
 * @property {import("react").Dispatch<import("react").SetStateAction<string>>} setOtp - State setter function to update the OTP value. The component automatically strips non-numeric characters before setting.
 * @property {boolean} isLoading - Indicates whether a network request (verification or resend) is in progress. Disables inputs and shows a loading spinner on the submit button.
 * @property {string|null} error - An error message to display if OTP verification fails or encounters an issue.
 * @property {number} countdown - The number of seconds remaining before the user is allowed to request a new OTP.
 * @property {import("react").FormEventHandler<HTMLFormElement>} handleVerifyOTP - The callback function triggered upon form submission to verify the entered OTP.
 * @property {import("react").MouseEventHandler<HTMLButtonElement>} handleRequestOTP - The callback function triggered to resend a new OTP. Disabled while `countdown` is greater than 0.
 * @property {import("react").MouseEventHandler<HTMLButtonElement>} onBackToEmail - The callback function triggered to return the user to the initial email input step.
 */

/**
 * Renders the One-Time Password (OTP) verification form.
 *
 * This component provides a user-friendly interface for entering a 6-digit security code.
 * It handles numeric-only input filtering, displays validation or server errors, and manages
 * the UI states for loading and resend countdowns. It also offers navigation back to the 
 * previous email input step.
 *
 * @param {OtpFormProps} props - The component props.
 * @returns {import("react").ReactElement} The rendered OTP form component.
 */

export default function OtpForm({
  email,
  otp,
  setOtp,
  isLoading,
  error,
  countdown,
  handleVerifyOTP,
  handleRequestOTP,
  onBackToEmail,
}) {
  return (
    <form
      onSubmit={handleVerifyOTP}
      className="w-full space-y-4 sm:space-y-5 animate-in slide-in-from-right-4 fade-in duration-300"
    >
      <div className="text-center mb-4 sm:mb-6">
        <p className="text-[13px] sm:text-sm text-gray-500">
          We sent a 6-digit code to
        </p>
        <p className="text-[13px] sm:text-sm font-bold text-[#0062C6] mt-0.5 break-all">
          {email}
        </p>
      </div>

      <div className="relative">
        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block mb-1 sm:mb-1.5 ml-1 text-center">
          Enter Security Code
        </label>
        <input
          type="text"
          required
          maxLength={6}
          disabled={isLoading}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          placeholder="• • • • • •"
          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 sm:px-4 sm:py-3 text-xl sm:text-2xl tracking-[0.4em] sm:tracking-[0.5em] text-center text-gray-900 outline-none focus:border-[#0062C6] focus:ring-1 focus:ring-[#0062C6] transition-all disabled:opacity-50 font-mono"
        />
      </div>

      {error && (
        <div className="text-[11px] sm:text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded px-3 py-2 text-center animate-in shake">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || otp.length < 6}
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
        ) : (
          "Verify & Sign In"
        )}
      </button>

      <div className="text-center pt-1 sm:pt-2">
        <button
          type="button"
          onClick={handleRequestOTP}
          disabled={countdown > 0 || isLoading}
          className="text-[11px] sm:text-xs font-medium text-gray-500 hover:text-[#0062C6] transition-colors disabled:opacity-50 disabled:hover:text-gray-500"
        >
          {countdown > 0
            ? `Resend available in ${countdown}s`
            : "Didn't receive a code? Resend"}
        </button>
      </div>

      <div className="text-center mt-1 sm:mt-2">
        <button
          type="button"
          onClick={onBackToEmail}
          className="text-[11px] sm:text-xs font-medium text-[#0062C6]/80 hover:text-[#0062C6] transition-colors"
        >
          ← Use a different email
        </button>
      </div>
    </form>
  );
}
