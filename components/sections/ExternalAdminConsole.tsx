"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type AdminCredentials = {
  username: string;
  password: string;
};

type ExternalRegistration = {
  id: string;
  sourceSystem: string;
  fullName: string;
  phone: string;
  fieldOfStudy: string;
  battingStyle: string;
  bowlingStyle: string;
  referenceName: string;
  playingRole: string;
  sabhaLike: string;
  otherTopics?: string | null;
  imageUrls: string[];
  createdAt: string;
  paymentClaimed: boolean;
  paymentReferenceNumber?: string | null;
  paymentClaimedAt?: string | null;
  paymentDone: boolean;
  paymentMarkedAt?: string | null;
  adminNotes?: string | null;
  syncStatus?: string | null;
};

const ADMIN_STORAGE_KEY = "apl-external-admin";

function apiBaseUrl() {
  return (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");
}

function paymentLabel(player: ExternalRegistration) {
  if (player.paymentDone) return "Paid";
  if (player.paymentClaimed) return "Claimed";
  return "Pending";
}

function paymentDot(player: ExternalRegistration) {
  if (player.paymentDone) return "bg-emerald-400";
  if (player.paymentClaimed) return "bg-yellow-400";
  return "bg-white/30";
}

function paymentBadge(player: ExternalRegistration) {
  if (player.paymentDone)
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
  if (player.paymentClaimed)
    return "border-yellow-400/30 bg-yellow-400/10 text-yellow-200";
  return "border-white/10 bg-white/5 text-white/50";
}

function statusActions(player: ExternalRegistration) {
  if (player.paymentDone) return [{ key: "pending", label: "↩ Reset" }];
  if (player.paymentClaimed)
    return [
      { key: "paid", label: "✓ Confirm paid" },
      { key: "pending", label: "↩ Reset" },
    ];
  return [
    { key: "claimed", label: "⚑ Mark claimed" },
    { key: "paid", label: "✓ Mark paid" },
  ];
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/* ─── WhatsApp Reminder Deep Link ────────────────────────────────────────── */

function buildWhatsAppReminderUrl(player: ExternalRegistration) {
  /* Sanitize phone: strip non-digits, ensure country code */
  let digits = player.phone.replace(/\D/g, "");
  if (digits.length === 10) digits = `91${digits}`; /* default India +91 */
  if (!digits.startsWith("91") && digits.length < 12) digits = `91${digits}`;

  const reminderText = [
    `🏏 *APL Season 03 — Reminder*`,
    ``,
    `Hey *${player.fullName}*! 👋`,
    ``,
    `This is a friendly reminder regarding your APL Season 3 registration.`,
    `💰 Please complete your registration payment to secure your spot in Season 03.`,
    ``,
    `📅 Opening: *06·06·2026*`,
    `📍 Venue: *AKSHAR ARENA*`,
    ``,
    `Feel free to reach out if you have any questions!`,
    `— APL Admin Team`,
  ].join("\n");

  return `https://wa.me/${digits}?text=${encodeURIComponent(reminderText)}`;
}

function filterPlayers(
  players: ExternalRegistration[],
  search: string,
  paymentFilter: string,
) {
  const query = search.trim().toLowerCase();
  return players.filter((player) => {
    const matchesSearch =
      query.length === 0 ||
      [
        player.fullName,
        player.phone,
        player.referenceName,
        player.fieldOfStudy,
        player.playingRole,
        player.sabhaLike,
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query));
    const matchesPayment =
      paymentFilter === "all" ||
      (paymentFilter === "paid" && player.paymentDone) ||
      (paymentFilter === "claimed" &&
        player.paymentClaimed &&
        !player.paymentDone) ||
      (paymentFilter === "pending" &&
        !player.paymentClaimed &&
        !player.paymentDone);
    return matchesSearch && matchesPayment;
  });
}

/* ─── Player Card ────────────────────────────────────────────────────────── */

function PlayerCard({
  player,
  updating,
  onAction,
}: {
  player: ExternalRegistration;
  updating: boolean;
  onAction: (key: "paid" | "claimed" | "pending") => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="group border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent transition-all hover:border-white/[0.14]">
      {/* ── Top row: always visible ── */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left sm:gap-4 sm:px-5 sm:py-4"
      >
        {/* Avatar circle */}
        {player.imageUrls.length > 0 ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={player.imageUrls[0]}
            alt={player.fullName}
            className="h-10 w-10 shrink-0 rounded-full border border-white/10 object-cover sm:h-12 sm:w-12"
          />
        ) : (
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-apl-yellow/15 font-anton text-sm text-apl-yellow sm:h-12 sm:w-12 sm:text-base">
            {player.fullName.charAt(0)}
          </div>
        )}

        {/* Name + meta */}
        <div className="min-w-0 flex-1">
          <p className="truncate font-anton text-[16px] uppercase leading-tight tracking-wide text-white sm:text-[18px]">
            {player.fullName}
          </p>
          <p className="mt-0.5 truncate font-mono text-[10px] tracking-[1px] text-white/40 sm:text-[11px]">
            {player.phone} · {player.playingRole}
          </p>
        </div>

        {/* Payment badge */}
        <span
          className={`shrink-0 rounded-full border px-2.5 py-1 font-mono text-[9px] font-semibold uppercase tracking-[1.5px] sm:px-3 sm:text-[10px] ${paymentBadge(player)}`}
        >
          <span
            className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${paymentDot(player)}`}
          />
          {paymentLabel(player)}
        </span>

        {/* Chevron */}
        <svg
          className={`h-4 w-4 shrink-0 text-white/25 transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* ── Expanded details ── */}
      {expanded && (
        <div className="border-t border-white/[0.06] px-4 pb-4 pt-3 sm:px-5 sm:pb-5">
          {/* Info grid */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <InfoBlock label="Cricket Profile">
              <InfoRow k="Role" v={player.playingRole} />
              <InfoRow k="Batting" v={player.battingStyle} />
              <InfoRow k="Bowling" v={player.bowlingStyle} />
            </InfoBlock>
            <InfoBlock label="Sabha & Study">
              <InfoRow k="Field" v={player.fieldOfStudy} />
              <InfoRow k="Focus" v={player.sabhaLike} />
              {player.otherTopics && (
                <InfoRow k="Other" v={player.otherTopics} />
              )}
            </InfoBlock>
            <InfoBlock label="Registration">
              <InfoRow k="Ref" v={player.referenceName} />
              <InfoRow k="Date" v={formatDate(player.createdAt)} />
              {player.paymentReferenceNumber && (
                <InfoRow k="UPI Ref" v={player.paymentReferenceNumber} />
              )}
              <InfoRow k="Sync" v={player.syncStatus || "EXTERNAL_ONLY"} />
            </InfoBlock>
          </div>

          {/* Photo thumbnails */}
          {player.imageUrls.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {player.imageUrls.slice(0, 3).map((url, i) => (
                <a
                  key={`${player.id}-img-${i}`}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="overflow-hidden border border-white/10 transition hover:border-apl-yellow/40"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`${player.fullName} ${i + 1}`}
                    className="h-14 w-14 object-cover sm:h-16 sm:w-16"
                  />
                </a>
              ))}
            </div>
          )}

          {/* Payment actions + WhatsApp reminder */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {statusActions(player).map((action) => (
              <button
                key={action.key}
                type="button"
                disabled={updating}
                onClick={() =>
                  onAction(action.key as "paid" | "claimed" | "pending")
                }
                className="border border-white/10 bg-white/[0.04] px-4 py-2 font-mono text-[10px] uppercase tracking-[1.5px] text-white/70 transition hover:border-apl-yellow/50 hover:text-apl-yellow disabled:opacity-40 sm:text-[11px]"
              >
                {updating ? "Saving…" : action.label}
              </button>
            ))}

            {/* ── WhatsApp Reminder button ── */}
            <a
              href={buildWhatsAppReminderUrl(player)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 border border-emerald-500/25 bg-emerald-500/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[1.5px] text-emerald-300 transition hover:border-emerald-400/50 hover:bg-emerald-500/20 hover:text-emerald-200 sm:text-[11px]"
            >
              <svg
                className="h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Reminder
            </a>
          </div>
        </div>
      )}
    </article>
  );
}

function InfoBlock({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-white/[0.06] bg-black/20 p-3">
      <p className="mb-2 font-mono text-[9px] uppercase tracking-[2px] text-apl-yellow/70">
        {label}
      </p>
      <div className="grid gap-1">{children}</div>
    </div>
  );
}

function InfoRow({ k, v }: { k: string; v: string }) {
  return (
    <p className="m-0 text-[12px] leading-relaxed text-white/60 sm:text-[13px]">
      <span className="text-white/35">{k}:</span>{" "}
      <span className="text-white/75">{v}</span>
    </p>
  );
}

/* ─── Main Console ───────────────────────────────────────────────────────── */

export default function ExternalAdminConsole() {
  const [credentials, setCredentials] = useState<AdminCredentials>({
    username: "",
    password: "",
  });
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);
  const [status, setStatus] = useState(
    "Sign in to review external registrations.",
  );
  const [registrations, setRegistrations] = useState<ExternalRegistration[]>(
    [],
  );
  const [paymentUpdatingId, setPaymentUpdatingId] = useState<string | null>(
    null,
  );
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");

  const filteredRegistrations = useMemo(
    () => filterPlayers(registrations, search, paymentFilter),
    [registrations, search, paymentFilter],
  );

  const summary = useMemo(
    () => ({
      total: filteredRegistrations.length,
      paid: filteredRegistrations.filter((p) => p.paymentDone).length,
      claimed: filteredRegistrations.filter(
        (p) => p.paymentClaimed && !p.paymentDone,
      ).length,
      pending: filteredRegistrations.filter(
        (p) => !p.paymentClaimed && !p.paymentDone,
      ).length,
    }),
    [filteredRegistrations],
  );

  /* ── API helpers (unchanged logic) ── */

  async function fetchRegistrations(creds: AdminCredentials) {
    if (!apiBaseUrl()) {
      setStatus(
        "Set NEXT_PUBLIC_API_BASE_URL to your Render backend URL before using the admin panel.",
      );
      return;
    }
    setLoadingRegistrations(true);
    setStatus("Loading external registrations…");
    try {
      const res = await fetch(
        `${apiBaseUrl()}/api/admin/external-registrations?limit=200`,
        {
          headers: {
            "X-Admin-Username": creds.username,
            "X-Admin-Password": creds.password,
          },
          cache: "no-store",
        },
      );
      if (res.status === 401)
        throw new Error("Admin username or password is incorrect.");
      if (!res.ok) throw new Error("Could not load external registrations.");
      const data = (await res.json()) as ExternalRegistration[];
      setRegistrations(data);
      setStatus(`${data.length} registration(s) loaded.`);
    } catch (err) {
      setStatus(
        err instanceof Error
          ? err.message
          : "Could not load external registrations.",
      );
    } finally {
      setLoadingRegistrations(false);
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.sessionStorage.getItem(ADMIN_STORAGE_KEY);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as AdminCredentials;
      if (parsed.username && parsed.password) {
        setCredentials(parsed);
        setLoggedIn(true);
        void fetchRegistrations(parsed);
      }
    } catch {
      window.sessionStorage.removeItem(ADMIN_STORAGE_KEY);
    }
  }, []);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!apiBaseUrl()) {
      setStatus(
        "Set NEXT_PUBLIC_API_BASE_URL to your Render backend URL before using the admin panel.",
      );
      return;
    }
    setLoginLoading(true);
    setStatus("Checking admin login…");
    try {
      const res = await fetch(`${apiBaseUrl()}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      if (res.status === 401)
        throw new Error("Admin username or password is incorrect.");
      if (!res.ok) throw new Error("Admin login failed.");
      if (typeof window !== "undefined")
        window.sessionStorage.setItem(
          ADMIN_STORAGE_KEY,
          JSON.stringify(credentials),
        );
      setLoggedIn(true);
      await fetchRegistrations(credentials);
    } catch (err) {
      setLoggedIn(false);
      setStatus(err instanceof Error ? err.message : "Admin login failed.");
    } finally {
      setLoginLoading(false);
    }
  }

  function logout() {
    if (typeof window !== "undefined")
      window.sessionStorage.removeItem(ADMIN_STORAGE_KEY);
    setLoggedIn(false);
    setRegistrations([]);
    setStatus("Admin logged out.");
  }

  async function updatePayment(
    player: ExternalRegistration,
    targetState: "paid" | "claimed" | "pending",
  ) {
    setPaymentUpdatingId(player.id);
    setStatus(`Updating ${player.fullName}…`);
    const payloadByState = {
      paid: { paymentClaimed: true, paymentDone: true },
      claimed: { paymentClaimed: true, paymentDone: false },
      pending: {
        paymentClaimed: false,
        paymentDone: false,
        paymentReferenceNumber: "",
      },
    };
    try {
      const res = await fetch(
        `${apiBaseUrl()}/api/admin/external-registrations/${player.id}/payment`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "X-Admin-Username": credentials.username,
            "X-Admin-Password": credentials.password,
          },
          body: JSON.stringify(payloadByState[targetState]),
        },
      );
      if (res.status === 401)
        throw new Error("Admin session expired. Please sign in again.");
      if (!res.ok) throw new Error("Could not update payment status.");
      const updated = (await res.json()) as ExternalRegistration;
      setRegistrations((cur) =>
        cur.map((e) => (e.id === updated.id ? updated : e)),
      );
      setStatus(
        targetState === "paid"
          ? `${player.fullName} — payment confirmed.`
          : targetState === "claimed"
            ? `${player.fullName} — marked claimed.`
            : `${player.fullName} — reset to pending.`,
      );
    } catch (err) {
      setStatus(
        err instanceof Error ? err.message : "Could not update payment status.",
      );
    } finally {
      setPaymentUpdatingId(null);
    }
  }

  async function fetchWhatsAppText() {
    const res = await fetch(
      `${apiBaseUrl()}/api/admin/external-registrations/whatsapp?limit=200`,
      {
        headers: {
          "X-Admin-Username": credentials.username,
          "X-Admin-Password": credentials.password,
        },
        cache: "no-store",
      },
    );
    if (res.status === 401) throw new Error("Admin session expired.");
    if (!res.ok) throw new Error("Could not build WhatsApp export.");
    return res.text();
  }

  async function copyWhatsApp() {
    try {
      const t = await fetchWhatsAppText();
      await navigator.clipboard.writeText(t);
      setStatus("WhatsApp summary copied.");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Could not copy.");
    }
  }

  async function openWhatsApp() {
    try {
      const t = await fetchWhatsAppText();
      window.open(
        `https://wa.me/?text=${encodeURIComponent(t)}`,
        "_blank",
        "noopener,noreferrer",
      );
      setStatus("WhatsApp opened.");
    } catch (err) {
      setStatus(
        err instanceof Error ? err.message : "Could not open WhatsApp.",
      );
    }
  }

  /* ── Filters config ── */
  const FILTERS = [
    { key: "all", label: "All", count: summary.total },
    { key: "paid", label: "Paid", count: summary.paid },
    { key: "claimed", label: "Claimed", count: summary.claimed },
    { key: "pending", label: "Pending", count: summary.pending },
  ];

  /* ════════════════════════════════════════════════════════════════════════ */
  /*  RENDER                                                                 */
  /* ════════════════════════════════════════════════════════════════════════ */

  return (
    <section className="relative min-h-[80vh] overflow-hidden border-t border-white/[0.06]">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,195,31,0.10),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(225,29,42,0.06),transparent_55%)]" />

      <div className="relative mx-auto max-w-[1100px] px-4 py-8 sm:px-6 md:px-10 md:py-12 lg:px-14">
        {/* ── Page header ── */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="mb-2 inline-block font-mono text-[9px] uppercase tracking-[3px] text-apl-yellow/80">
              // ADMIN · SEASON 03
            </span>
            <h1 className="font-anton text-[36px] uppercase leading-[0.9] tracking-[1px] text-white sm:text-[48px] md:text-[56px]">
              Control
              <br />
              <span className="text-apl-yellow">Room.</span>
            </h1>
          </div>

          {/* Status pill */}
          <p className="max-w-[380px] border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 font-mono text-[10px] leading-relaxed tracking-[0.5px] text-white/50 sm:text-[11px]">
            {status}
          </p>
        </div>

        {/* ── Login or Toolbar ── */}
        {!loggedIn ? (
          <div className="mx-auto max-w-[400px]">
            <div className="border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8">
              <p className="mb-1 font-mono text-[10px] uppercase tracking-[2.5px] text-apl-yellow">
                Admin access
              </p>
              <p className="mb-6 text-[13px] leading-relaxed text-white/50">
                Sign in with your external admin credentials.
              </p>
              <form className="grid gap-4" onSubmit={handleLogin}>
                <label className="grid gap-1.5">
                  <span className="font-mono text-[9px] uppercase tracking-[2px] text-white/40">
                    Username
                  </span>
                  <input
                    className="h-11 border border-white/10 bg-black/40 px-4 text-sm text-white outline-none transition focus:border-apl-yellow"
                    value={credentials.username}
                    onChange={(e) =>
                      setCredentials((c) => ({
                        ...c,
                        username: e.target.value,
                      }))
                    }
                    placeholder="Username"
                    required
                  />
                </label>
                <label className="grid gap-1.5">
                  <span className="font-mono text-[9px] uppercase tracking-[2px] text-white/40">
                    Password
                  </span>
                  <input
                    type="password"
                    className="h-11 border border-white/10 bg-black/40 px-4 text-sm text-white outline-none transition focus:border-apl-yellow"
                    value={credentials.password}
                    onChange={(e) =>
                      setCredentials((c) => ({
                        ...c,
                        password: e.target.value,
                      }))
                    }
                    placeholder="***"
                    required
                  />
                </label>
                <button
                  type="submit"
                  disabled={loginLoading}
                  className="shimmer relative h-11 overflow-hidden bg-apl-yellow font-anton text-[14px] uppercase tracking-[2px] text-apl-ink transition hover:brightness-110 disabled:opacity-50"
                >
                  {loginLoading ? "Checking…" : "Open Admin →"}
                </button>
              </form>
            </div>
          </div>
        ) : (
          <>
            {/* ── Toolbar ── */}
            <div className="mb-6 flex flex-wrap items-center gap-2 border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 sm:gap-3 sm:px-4">
              <span className="mr-auto font-mono text-[10px] tracking-[1px] text-white/35">
                <span className="text-apl-yellow">{credentials.username}</span>
              </span>
              <ToolbarBtn
                onClick={() => void fetchRegistrations(credentials)}
                disabled={loadingRegistrations}
              >
                {loadingRegistrations ? "↻ Loading…" : "↻ Refresh"}
              </ToolbarBtn>
              <ToolbarBtn onClick={() => void copyWhatsApp()}>
                📋 Copy WA
              </ToolbarBtn>
              <ToolbarBtn onClick={() => void openWhatsApp()} accent>
                💬 WhatsApp
              </ToolbarBtn>
              <ToolbarBtn onClick={logout} danger>
                Logout
              </ToolbarBtn>
            </div>

            {/* ── Stat cards ── */}
            <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
              {[
                { label: "Total", value: summary.total, color: "text-white" },
                {
                  label: "Paid",
                  value: summary.paid,
                  color: "text-emerald-400",
                },
                {
                  label: "Claimed",
                  value: summary.claimed,
                  color: "text-yellow-300",
                },
                {
                  label: "Pending",
                  value: summary.pending,
                  color: "text-white/40",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="border border-white/[0.06] bg-white/[0.02] px-4 py-3 sm:py-4"
                >
                  <p className="font-mono text-[8px] uppercase tracking-[2px] text-white/30 sm:text-[9px]">
                    {s.label}
                  </p>
                  <p
                    className={`mt-1 font-anton text-[28px] leading-none sm:text-[34px] ${s.color}`}
                  >
                    {s.value}
                  </p>
                </div>
              ))}
            </div>

            {/* ── Search + Filter bar ── */}
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <svg
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  className="h-10 w-full border border-white/[0.08] bg-black/30 pl-10 pr-4 font-mono text-[12px] text-white outline-none transition placeholder:text-white/20 focus:border-apl-yellow/50"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name, phone, reference…"
                />
              </div>
              <div className="flex gap-1.5">
                {FILTERS.map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setPaymentFilter(f.key)}
                    className={`px-3 py-2 font-mono text-[9px] uppercase tracking-[1.5px] transition sm:text-[10px] ${
                      paymentFilter === f.key
                        ? "border border-apl-yellow/40 bg-apl-yellow/10 text-apl-yellow"
                        : "border border-white/[0.06] text-white/40 hover:text-white/60"
                    }`}
                  >
                    {f.label}
                    <span className="ml-1 opacity-60">{f.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* ── Player list ── */}
            <div className="grid gap-2">
              {filteredRegistrations.length === 0 ? (
                <div className="border border-dashed border-white/[0.08] py-16 text-center">
                  <p className="font-mono text-[11px] tracking-[1px] text-white/30">
                    {registrations.length === 0
                      ? "No registrations loaded yet."
                      : "No players match your filters."}
                  </p>
                </div>
              ) : (
                filteredRegistrations.map((player) => (
                  <PlayerCard
                    key={player.id}
                    player={player}
                    updating={paymentUpdatingId === player.id}
                    onAction={(key) => void updatePayment(player, key)}
                  />
                ))
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

/* ── Toolbar Button helper ───────────────────────────────────────────────── */

function ToolbarBtn({
  children,
  onClick,
  disabled,
  accent,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  accent?: boolean;
  danger?: boolean;
}) {
  const base =
    "px-3 py-1.5 font-mono text-[9px] uppercase tracking-[1.5px] transition disabled:opacity-40 sm:text-[10px]";
  const tone = danger
    ? "border border-red-500/20 text-red-400/70 hover:border-red-500/40 hover:text-red-400"
    : accent
      ? "bg-apl-yellow/15 text-apl-yellow border border-apl-yellow/20 hover:bg-apl-yellow/25"
      : "border border-white/[0.08] text-white/50 hover:text-white/70 hover:border-white/15";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${tone}`}
    >
      {children}
    </button>
  );
}
