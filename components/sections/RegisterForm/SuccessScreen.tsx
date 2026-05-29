"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { APL_SEASON } from "@/lib/constants";

type PaymentClaimState = {
  paymentClaimed: boolean;
  paymentReferenceNumber: string | null;
  paymentDone: boolean;
};

const paymentConfig = {
  upiId: process.env.NEXT_PUBLIC_UPI_ID || "sondagarchirag01-2@okicici",
  payeeName: process.env.NEXT_PUBLIC_UPI_PAYEE_NAME || "CHIRAG RATILAL SONDAGAR",
  amount: process.env.NEXT_PUBLIC_UPI_AMOUNT || "500",
  notePrefix: process.env.NEXT_PUBLIC_UPI_NOTE_PREFIX || `${APL_SEASON.leagueShort} Reg`
};

const upiNoteLimit = 50;

function normalizePhone(value: string) {
  let digits = String(value || "").replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    digits = digits.slice(2);
  }
  if (digits.length === 11 && digits.startsWith("0")) {
    digits = digits.slice(1);
  }
  return digits;
}

function compactText(value: string, maxLength: number) {
  return String(value || "")
    .replace(/[^a-zA-Z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength)
    .trim();
}

function paymentAmount(options: { compact?: boolean } = {}) {
  const parsedAmount = Number(paymentConfig.amount);
  if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
    return options.compact ? "1" : "1.00";
  }
  const fixedAmount = parsedAmount.toFixed(2);
  return options.compact ? fixedAmount.replace(/\.00$/, "") : fixedAmount;
}

function buildPaymentNote(fullName: string, phone: string) {
  const prefix = compactText(paymentConfig.notePrefix, 12);
  const playerName = compactText(fullName, 24);
  const mobile = compactText(normalizePhone(phone), 12);
  return compactText([prefix, playerName, mobile].filter(Boolean).join(" "), upiNoteLimit);
}

function encodeUpiValue(value: string) {
  return encodeURIComponent(value).replace(/[!'()*]/g, (char) =>
    `%${char.charCodeAt(0).toString(16).toUpperCase()}`
  );
}

function buildUpiUri(fullName: string, phone: string, options: { minimal?: boolean } = {}) {
  const params: Record<string, string> = {
    pa: paymentConfig.upiId,
    pn: paymentConfig.payeeName,
    am: paymentAmount({ compact: options.minimal }),
    cu: "INR"
  };

  if (!options.minimal) {
    params.tn = buildPaymentNote(fullName, phone);
  }

  const query = Object.entries(params)
    .map(([key, value]) => `${key}=${encodeUpiValue(value)}`)
    .join("&");

  return `upi://pay?${query}`;
}

function apiBaseUrl() {
  return (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");
}

export function SuccessScreen({
  registrationId,
  phone,
  fullName,
  initialPaymentClaimed,
  initialPaymentReferenceNumber,
  initialPaymentDone
}: {
  registrationId: string;
  phone: string;
  fullName: string;
  initialPaymentClaimed: boolean;
  initialPaymentReferenceNumber: string | null;
  initialPaymentDone: boolean;
}) {
  const [paymentState, setPaymentState] = useState<PaymentClaimState>({
    paymentClaimed: initialPaymentClaimed,
    paymentReferenceNumber: initialPaymentReferenceNumber,
    paymentDone: initialPaymentDone
  });
  const [paymentStatus, setPaymentStatus] = useState(
    "Now complete the UPI payment using the details below."
  );
  const [paymentAppOpened, setPaymentAppOpened] = useState(false);
  const [paymentReturnPromptVisible, setPaymentReturnPromptVisible] = useState(false);
  const [paymentReferenceNumber, setPaymentReferenceNumber] = useState(
    initialPaymentReferenceNumber || ""
  );
  const [paymentClaimLoading, setPaymentClaimLoading] = useState(false);

  const paymentNote = buildPaymentNote(fullName, phone);
  const upiOpenAppUri = buildUpiUri(fullName, phone, { minimal: true });
  const upiQrUri = buildUpiUri(fullName, phone);
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiQrUri)}`;

  useEffect(() => {
    if (!paymentAppOpened || paymentState.paymentClaimed || paymentState.paymentDone) {
      return undefined;
    }

    const showReturnPrompt = () => {
      if (document.visibilityState === "visible") {
        setPaymentReturnPromptVisible(true);
        setPaymentStatus("Welcome back. If the payment is complete, confirm it below for admin verification.");
      }
    };

    document.addEventListener("visibilitychange", showReturnPrompt);
    window.addEventListener("focus", showReturnPrompt);

    return () => {
      document.removeEventListener("visibilitychange", showReturnPrompt);
      window.removeEventListener("focus", showReturnPrompt);
    };
  }, [paymentAppOpened, paymentState.paymentClaimed, paymentState.paymentDone]);

  async function copyPaymentText(value: string, message: string) {
    try {
      await navigator.clipboard.writeText(value);
      setPaymentStatus(message);
    } catch {
      setPaymentStatus("Could not copy. Please copy it manually.");
    }
  }

  function markPaymentAppOpened() {
    setPaymentAppOpened(true);
    setPaymentReturnPromptVisible(false);
    setPaymentStatus("Opening your UPI app. After payment, return here and confirm completion.");
  }

  async function claimPaymentCompleted() {
    if (!registrationId) {
      setPaymentStatus("Registration ID is missing. Please contact the organizer.");
      return;
    }

    if (!apiBaseUrl()) {
      setPaymentStatus("Backend API is not connected. Set NEXT_PUBLIC_API_BASE_URL and redeploy.");
      return;
    }

    setPaymentClaimLoading(true);
    setPaymentStatus("Saving your payment confirmation...");

    try {
      const response = await fetch(`https://probodham-cricket-registration.onrender.com/api/external-registrations/${registrationId}/payment-claim`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          mobileNumber: phone,
          paymentReferenceNumber: paymentReferenceNumber.trim()
        })
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        const fieldMessage = payload?.fields ? Object.values(payload.fields).join(" ") : "";
        throw new Error(fieldMessage || payload?.message || payload?.error || "Could not save payment confirmation.");
      }

      setPaymentState({
        paymentClaimed: Boolean(payload.paymentClaimed),
        paymentReferenceNumber: payload.paymentReferenceNumber || null,
        paymentDone: Boolean(payload.paymentDone)
      });
      setPaymentReturnPromptVisible(false);
      setPaymentStatus("Payment confirmation saved. The admin will verify it in the external dashboard.");
    } catch (error) {
      setPaymentStatus(error instanceof Error ? error.message : "Could not save payment confirmation.");
    } finally {
      setPaymentClaimLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-apl-page px-6 py-16 text-white md:py-20">
      <div
        className="mb-10 grid h-28 w-28 animate-apl-pop place-items-center rounded-full bg-apl-yellow"
        style={{
          boxShadow:
            "0 0 0 5px var(--apl-ink), 0 0 0 7px var(--apl-yellow), 0 0 90px rgba(255,195,31,0.4)"
        }}
      >
        <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden>
          <path
            d="M14 28l10 10 18-20"
            stroke="#0a0a0a"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <p className="mb-3 font-mono text-[11px] tracking-[3px] text-apl-yellow">// YOU&apos;RE IN</p>
      <h1 className="text-center font-anton text-[60px] uppercase leading-[0.82] md:text-[88px]">
        WELCOME TO
        <br />
        <span className="text-apl-yellow">SEASON {APL_SEASON.number}.</span>
      </h1>
      <p className="mt-6 max-w-[360px] text-center font-sans text-[15px] leading-[1.7] text-white/55">
        Confirmation sent to <strong className="font-sans text-white">{phone}</strong>. See you at{" "}
        <strong className="font-sans text-apl-yellow">{APL_SEASON.venue}</strong>.
      </p>

      <div className="mt-10 grid w-full max-w-[440px] grid-cols-2 gap-2">
        <div className="border border-white/[0.07] bg-apl-surface py-6 text-center">
          <p className="font-anton text-[30px] leading-none text-apl-yellow">{APL_SEASON.opening}</p>
          <p className="mt-1.5 font-mono text-[8px] tracking-[2px] text-white/35">OPENING DAY</p>
        </div>
        <div className="border border-white/[0.07] bg-apl-surface py-6 text-center">
          <p className="font-anton text-[30px] leading-none text-apl-yellow">#{APL_SEASON.leagueShort}{parseInt(APL_SEASON.number, 10)}</p>
          <p className="mt-1.5 font-mono text-[8px] tracking-[2px] text-white/35">YOUR HASHTAG</p>
        </div>
      </div>

      <section className="mt-10 grid w-full max-w-[460px] gap-4 rounded-[28px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.03))] p-4 shadow-[0_24px_70px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:gap-5 sm:p-6">
        <div className="grid gap-2">
          <span className="font-mono text-[10px] tracking-[2.5px] text-apl-yellow">PAYMENT NEXT STEP</span>
          <h2 className="font-anton text-[28px] uppercase leading-[0.92] text-white sm:text-[34px] md:text-[42px]">
            Pay Rs. {paymentAmount()} via UPI
          </h2>
          <p className="m-0 text-[13px] leading-6 text-white/60 sm:text-[14px] sm:leading-7">
            Scan the QR code first for the most reliable payment flow. You can also copy the UPI ID,
            copy the payment note, or try opening a UPI app directly.
          </p>
        </div>

        <div className="grid place-items-center gap-3 rounded-[20px] border border-apl-yellow/15 bg-black/25 px-4 py-6 text-center sm:px-5">
          <img
            src={qrCodeUrl}
            alt="UPI payment QR code"
            className="h-auto w-full max-w-[180px] rounded-[18px] border-[8px] border-white bg-white"
          />
          <strong className="font-anton text-[22px] uppercase tracking-[0.04em] text-white sm:text-[24px]">
            Scan QR to pay
          </strong>
          <small className="max-w-[320px] text-[12px] leading-6 tracking-[0.08em] text-white/45">
            Best option for GPay, PhonePe, Paytm, Amazon Pay, CRED UPI, and other UPI apps.
          </small>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="grid gap-2 rounded-[20px] border border-white/[0.08] bg-black/25 p-4">
            <span className="font-mono text-[9px] tracking-[2px] text-white/35">UPI ID</span>
            <strong className="break-all text-[15px] leading-6 text-white">{paymentConfig.upiId}</strong>
          </div>
          <div className="grid gap-2 rounded-[20px] border border-white/[0.08] bg-black/25 p-4">
            <span className="font-mono text-[9px] tracking-[2px] text-white/35">PAYEE NAME</span>
            <strong className="text-[15px] leading-6 text-white">{paymentConfig.payeeName}</strong>
          </div>
          <div className="grid gap-2 rounded-[20px] border border-apl-yellow/15 bg-[linear-gradient(180deg,rgba(255,195,31,0.06),rgba(255,255,255,0.02))] p-4 sm:col-span-2">
            <span className="font-mono text-[9px] tracking-[2px] text-apl-yellow">REGISTERED PLAYER NOTE</span>
            <strong className="text-[16px] leading-7 text-white">{paymentNote}</strong>
            <small className="text-[12px] leading-6 text-white/50">
              This note includes the registered player name so the payment is easier to identify.
            </small>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => void copyPaymentText(paymentConfig.upiId, "UPI ID copied.")}
            className="flex min-h-[52px] items-center justify-center rounded-[20px] border border-white/[0.14] px-4 py-3 font-mono text-[10px] tracking-[2px] text-white/75 transition hover:border-apl-yellow hover:text-apl-yellow"
          >
            COPY UPI ID
          </button>
          <button
            type="button"
            onClick={() => void copyPaymentText(paymentNote, "Payment note copied.")}
            className="flex min-h-[52px] items-center justify-center rounded-[20px] border border-white/[0.14] px-4 py-3 font-mono text-[10px] tracking-[2px] text-white/75 transition hover:border-apl-yellow hover:text-apl-yellow"
          >
            COPY NOTE
          </button>
          <a
            href={upiOpenAppUri}
            onClick={markPaymentAppOpened}
            className="flex min-h-[52px] items-center justify-center rounded-[20px] bg-apl-red px-4 py-3 text-center font-anton text-[14px] tracking-[2px] text-white transition hover:bg-red-600"
          >
            OPEN UPI APP
          </a>
        </div>

        <div className="grid gap-3 rounded-[24px] border border-white/[0.08] bg-black/20 p-5">
          <span className="font-mono text-[10px] tracking-[2.5px] text-apl-yellow">
            {paymentState.paymentClaimed ? "PAYMENT CLAIMED" : "AFTER PAYMENT"}
          </span>
          <strong className="font-anton text-[22px] uppercase leading-[1.02] text-white sm:text-[26px]">
            {paymentState.paymentClaimed
              ? "Your payment confirmation is saved"
              : paymentReturnPromptVisible
                ? "Did you complete the payment?"
                : "Come back here after paying"}
          </strong>
          <p className="m-0 text-[14px] leading-7 text-white/60">
            {paymentState.paymentClaimed
              ? "The admin will verify this against the received UPI payment."
              : "This does not verify money automatically. It tells the admin that you completed payment so they can check and mark it done."}
          </p>

          {!paymentState.paymentClaimed && (
            <>
              <label className="grid gap-2">
                <span className="font-mono text-[9px] tracking-[2px] text-white/35">
                  UPI REF / UTR NUMBER OPTIONAL
                </span>
                <input
                  value={paymentReferenceNumber}
                  maxLength={80}
                  onChange={(event) => setPaymentReferenceNumber(event.target.value)}
                  placeholder="Example: 123456789012"
                  className="rounded-[18px] border border-white/[0.12] bg-black/35 px-4 py-3 text-sm text-white outline-none transition focus:border-apl-yellow"
                />
              </label>
              <button
                type="button"
                onClick={() => void claimPaymentCompleted()}
                disabled={paymentClaimLoading}
                className="rounded-[20px] bg-apl-yellow px-5 py-4 font-anton text-[14px] tracking-[2px] text-apl-ink transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {paymentClaimLoading ? "SAVING..." : "I HAVE COMPLETED PAYMENT"}
              </button>
            </>
          )}

          {paymentState.paymentReferenceNumber && (
            <small className="text-[12px] tracking-[1.4px] text-apl-yellow">
              SAVED UPI REF: {paymentState.paymentReferenceNumber}
            </small>
          )}
        </div>

        <p className="m-0 text-center font-mono text-[9px] leading-6 tracking-[1.8px] text-white/35">
          {paymentStatus}
        </p>
      </section>

      <Link
        href="/"
        className="mt-12 border border-white/20 px-10 py-4 font-mono text-[11px] tracking-[2.5px] text-white transition hover:border-white/40"
      >
        BACK TO HOME
      </Link>
    </div>
  );
}
