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
  if (player.paymentDone) {
    return "Payment done";
  }
  if (player.paymentClaimed) {
    return "Claimed by user";
  }
  return "Pending verification";
}

function paymentTone(player: ExternalRegistration) {
  if (player.paymentDone) {
    return "bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-400/30";
  }
  if (player.paymentClaimed) {
    return "bg-yellow-400/15 text-yellow-100 ring-1 ring-yellow-300/30";
  }
  return "bg-white/10 text-white/70 ring-1 ring-white/10";
}

function statusActions(player: ExternalRegistration) {
  if (player.paymentDone) {
    return [{ key: "pending", label: "Mark pending" }];
  }
  if (player.paymentClaimed) {
    return [
      { key: "paid", label: "Mark paid" },
      { key: "pending", label: "Reset" }
    ];
  }
  return [
    { key: "claimed", label: "Mark claimed" },
    { key: "paid", label: "Mark paid" }
  ];
}

function formatDate(value?: string | null) {
  if (!value) {
    return "Not available";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function filterPlayers(players: ExternalRegistration[], search: string, paymentFilter: string) {
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
        player.sabhaLike
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query));

    const matchesPayment =
      paymentFilter === "all" ||
      (paymentFilter === "paid" && player.paymentDone) ||
      (paymentFilter === "claimed" && player.paymentClaimed && !player.paymentDone) ||
      (paymentFilter === "pending" && !player.paymentClaimed && !player.paymentDone);

    return matchesSearch && matchesPayment;
  });
}

export default function ExternalAdminConsole() {
  const [credentials, setCredentials] = useState<AdminCredentials>({
    username: "admin",
    password: "nimda"
  });
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);
  const [status, setStatus] = useState("Sign in to review external registrations.");
  const [registrations, setRegistrations] = useState<ExternalRegistration[]>([]);
  const [paymentUpdatingId, setPaymentUpdatingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");

  const filteredRegistrations = useMemo(
    () => filterPlayers(registrations, search, paymentFilter),
    [registrations, search, paymentFilter]
  );

  const summary = useMemo(
    () => ({
      total: filteredRegistrations.length,
      paid: filteredRegistrations.filter((player) => player.paymentDone).length,
      claimed: filteredRegistrations.filter((player) => player.paymentClaimed && !player.paymentDone).length,
      pending: filteredRegistrations.filter((player) => !player.paymentClaimed && !player.paymentDone).length
    }),
    [filteredRegistrations]
  );

  async function fetchRegistrations(activeCredentials: AdminCredentials) {
    if (!apiBaseUrl()) {
      setStatus("Set NEXT_PUBLIC_API_BASE_URL to your Render backend URL before using the admin panel.");
      return;
    }

    setLoadingRegistrations(true);
    setStatus("Loading external registrations...");

    try {
      const response = await fetch(`${apiBaseUrl()}/api/admin/external-registrations?limit=200`, {
        headers: {
          "X-Admin-Username": activeCredentials.username,
          "X-Admin-Password": activeCredentials.password
        },
        cache: "no-store"
      });

      if (response.status === 401) {
        throw new Error("Admin username or password is incorrect.");
      }
      if (!response.ok) {
        throw new Error("Could not load external registrations.");
      }

      const data = (await response.json()) as ExternalRegistration[];
      setRegistrations(data);
      setStatus(`${data.length} external registration(s) loaded.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not load external registrations.");
    } finally {
      setLoadingRegistrations(false);
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const stored = window.sessionStorage.getItem(ADMIN_STORAGE_KEY);
    if (!stored) {
      return;
    }

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
      setStatus("Set NEXT_PUBLIC_API_BASE_URL to your Render backend URL before using the admin panel.");
      return;
    }

    setLoginLoading(true);
    setStatus("Checking admin login...");

    try {
      const response = await fetch(`${apiBaseUrl()}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials)
      });

      if (response.status === 401) {
        throw new Error("Admin username or password is incorrect.");
      }
      if (!response.ok) {
        throw new Error("Admin login failed.");
      }

      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(credentials));
      }

      setLoggedIn(true);
      await fetchRegistrations(credentials);
    } catch (error) {
      setLoggedIn(false);
      setStatus(error instanceof Error ? error.message : "Admin login failed.");
    } finally {
      setLoginLoading(false);
    }
  }

  function logout() {
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(ADMIN_STORAGE_KEY);
    }
    setLoggedIn(false);
    setRegistrations([]);
    setStatus("Admin logged out.");
  }

  async function updatePayment(player: ExternalRegistration, targetState: "paid" | "claimed" | "pending") {
    setPaymentUpdatingId(player.id);
    setStatus(`Updating ${player.fullName}...`);

    const payloadByState = {
      paid: {
        paymentClaimed: true,
        paymentDone: true
      },
      claimed: {
        paymentClaimed: true,
        paymentDone: false
      },
      pending: {
        paymentClaimed: false,
        paymentDone: false,
        paymentReferenceNumber: ""
      }
    };

    try {
      const response = await fetch(`${apiBaseUrl()}/api/admin/external-registrations/${player.id}/payment`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Username": credentials.username,
          "X-Admin-Password": credentials.password
        },
        body: JSON.stringify(payloadByState[targetState])
      });

      if (response.status === 401) {
        throw new Error("Admin session expired. Please sign in again.");
      }
      if (!response.ok) {
        throw new Error("Could not update payment status.");
      }

      const updated = (await response.json()) as ExternalRegistration;
      setRegistrations((current) =>
        current.map((entry) => (entry.id === updated.id ? updated : entry))
      );
      setStatus(
        targetState === "paid"
          ? `${player.fullName} marked as payment done.`
          : targetState === "claimed"
            ? `${player.fullName} marked as claimed by user.`
            : `${player.fullName} moved back to payment pending.`
      );
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not update payment status.");
    } finally {
      setPaymentUpdatingId(null);
    }
  }

  async function fetchWhatsAppText() {
    const response = await fetch(`${apiBaseUrl()}/api/admin/external-registrations/whatsapp?limit=200`, {
      headers: {
        "X-Admin-Username": credentials.username,
        "X-Admin-Password": credentials.password
      },
      cache: "no-store"
    });

    if (response.status === 401) {
      throw new Error("Admin session expired. Please sign in again.");
    }
    if (!response.ok) {
      throw new Error("Could not build WhatsApp export.");
    }

    return response.text();
  }

  async function copyWhatsApp() {
    try {
      const text = await fetchWhatsAppText();
      await navigator.clipboard.writeText(text);
      setStatus("WhatsApp summary copied.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not copy WhatsApp summary.");
    }
  }

  async function openWhatsApp() {
    try {
      const text = await fetchWhatsAppText();
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
      setStatus("WhatsApp export opened in a new tab.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not open WhatsApp export.");
    }
  }

  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,195,31,0.12),transparent_34%),linear-gradient(180deg,rgba(24,24,24,0.98),rgba(10,10,10,0.98))]">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),transparent_35%,rgba(225,29,42,0.08)_100%)]" />

      <div className="relative mx-auto grid max-w-[1280px] gap-8 px-5 py-14 md:px-10 lg:grid-cols-[0.9fr,1.1fr] lg:px-16">
        <div className="grid content-start gap-6">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.28em] text-white/70">
            External admin
          </span>
          <div className="grid gap-4">
            <h1 className="font-anton text-[42px] uppercase leading-[0.92] tracking-[1px] text-white md:text-[62px]">
              Season control room
            </h1>
            <p className="max-w-[560px] text-[15px] leading-7 text-white/70 md:text-[16px]">
              Sign in with the external admin credentials to review outside registrations, confirm
              payments, and export the latest player list without leaving the APL theme.
            </p>
          </div>

          <div className="grid gap-3 rounded-[28px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_22px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl">
            <div className="grid gap-1">
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-apl-yellow">
                Admin access
              </span>
              <p className="m-0 text-sm leading-6 text-white/65">
                Use <span className="font-semibold text-white">admin</span> and{" "}
                <span className="font-semibold text-white">nimda</span> unless you override the
                secondary admin env vars on Spring Boot.
              </p>
            </div>

            {!loggedIn ? (
              <form className="grid gap-4" onSubmit={handleLogin}>
                <label className="grid gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/55">
                    Username
                  </span>
                  <input
                    className="h-12 rounded-2xl border border-white/10 bg-black/35 px-4 text-sm text-white outline-none transition focus:border-apl-yellow"
                    value={credentials.username}
                    onChange={(event) =>
                      setCredentials((current) => ({ ...current, username: event.target.value }))
                    }
                    placeholder="admin"
                    required
                  />
                </label>
                <label className="grid gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/55">
                    Password
                  </span>
                  <input
                    type="password"
                    className="h-12 rounded-2xl border border-white/10 bg-black/35 px-4 text-sm text-white outline-none transition focus:border-apl-yellow"
                    value={credentials.password}
                    onChange={(event) =>
                      setCredentials((current) => ({ ...current, password: event.target.value }))
                    }
                    placeholder="nimda"
                    required
                  />
                </label>
                <button
                  type="submit"
                  className="h-12 rounded-2xl bg-apl-red px-5 font-anton text-[14px] uppercase tracking-[0.2em] text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={loginLoading}
                >
                  {loginLoading ? "Checking..." : "Open admin"}
                </button>
              </form>
            ) : (
              <div className="grid gap-4">
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                  <div className="grid gap-1">
                    <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-apl-yellow">
                      Signed in
                    </span>
                    <strong className="text-sm text-white">{credentials.username}</strong>
                  </div>
                  <button
                    type="button"
                    className="rounded-full border border-white/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.24em] text-white/65 transition hover:border-white/25 hover:text-white"
                    onClick={logout}
                  >
                    Logout
                  </button>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    className="h-12 rounded-2xl border border-white/10 bg-white/5 px-4 font-mono text-[11px] uppercase tracking-[0.22em] text-white/75 transition hover:border-apl-yellow hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={() => void fetchRegistrations(credentials)}
                    disabled={loadingRegistrations}
                  >
                    {loadingRegistrations ? "Refreshing..." : "Refresh list"}
                  </button>
                  <button
                    type="button"
                    className="h-12 rounded-2xl border border-white/10 bg-white/5 px-4 font-mono text-[11px] uppercase tracking-[0.22em] text-white/75 transition hover:border-apl-yellow hover:text-white"
                    onClick={() => void copyWhatsApp()}
                  >
                    Copy WhatsApp
                  </button>
                  <button
                    type="button"
                    className="h-12 rounded-2xl bg-apl-yellow px-4 font-anton text-[13px] uppercase tracking-[0.16em] text-apl-ink transition hover:bg-yellow-300 sm:col-span-2"
                    onClick={() => void openWhatsApp()}
                  >
                    Open WhatsApp
                  </button>
                </div>
              </div>
            )}

            <p className="m-0 text-sm leading-6 text-white/60">{status}</p>
          </div>
        </div>

        <div className="grid content-start gap-5">
          <div className="grid gap-3 sm:grid-cols-4">
            {[
              { label: "Players", value: summary.total, tone: "text-white" },
              { label: "Paid", value: summary.paid, tone: "text-emerald-200" },
              { label: "Claimed", value: summary.claimed, tone: "text-yellow-100" },
              { label: "Pending", value: summary.pending, tone: "text-white/75" }
            ].map((item) => (
              <article
                key={item.label}
                className="grid gap-2 rounded-[24px] border border-white/10 bg-white/[0.045] p-4 shadow-[0_18px_45px_rgba(0,0,0,0.22)]"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-white/45">
                  {item.label}
                </span>
                <strong className={`font-anton text-[34px] leading-none ${item.tone}`}>
                  {item.value}
                </strong>
              </article>
            ))}
          </div>

          <div className="grid gap-3 rounded-[28px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_22px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl">
            <div className="grid gap-3 md:grid-cols-[1fr,auto] md:items-end">
              <label className="grid gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/55">
                  Search player / reference
                </span>
                <input
                  className="h-12 rounded-2xl border border-white/10 bg-black/35 px-4 text-sm text-white outline-none transition focus:border-apl-yellow"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Harshil, Divyang, phone..."
                  disabled={!loggedIn}
                />
              </label>

              <div className="flex flex-wrap gap-2">
                {[
                  { key: "all", label: "All" },
                  { key: "pending", label: "Pending" },
                  { key: "claimed", label: "Claimed" },
                  { key: "paid", label: "Paid" }
                ].map((option) => (
                  <button
                    key={option.key}
                    type="button"
                    className={`rounded-full px-4 py-2 font-mono text-[10px] uppercase tracking-[0.24em] transition ${
                      paymentFilter === option.key
                        ? "border border-apl-yellow bg-apl-yellow/15 text-apl-yellow"
                        : "border border-white/10 bg-white/[0.03] text-white/60 hover:text-white"
                    }`}
                    onClick={() => setPaymentFilter(option.key)}
                    disabled={!loggedIn}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              {!loggedIn ? (
                <div className="rounded-[24px] border border-dashed border-white/10 bg-black/20 px-5 py-12 text-center text-sm text-white/55">
                  Sign in to load the external registration list.
                </div>
              ) : filteredRegistrations.length === 0 ? (
                <div className="rounded-[24px] border border-dashed border-white/10 bg-black/20 px-5 py-12 text-center text-sm text-white/55">
                  No external registrations match the current filters.
                </div>
              ) : (
                filteredRegistrations.map((player) => (
                  <article
                    key={player.id}
                    className="grid gap-4 rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-5 md:grid-cols-[1fr,auto]"
                  >
                    <div className="grid gap-3">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="grid gap-1">
                          <strong className="font-anton text-[28px] uppercase tracking-[0.03em] text-white">
                            {player.fullName}
                          </strong>
                          <span className="text-sm text-white/60">
                            {player.phone} · {player.referenceName}
                          </span>
                        </div>
                        <span className={`rounded-full px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] ${paymentTone(player)}`}>
                          {paymentLabel(player)}
                        </span>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border border-white/8 bg-black/20 p-4 text-sm text-white/70">
                          <p className="m-0 font-mono text-[10px] uppercase tracking-[0.24em] text-white/45">
                            Cricket
                          </p>
                          <p className="mt-2 mb-1">Role: {player.playingRole}</p>
                          <p className="m-0">Batting / Bowling: {player.battingStyle} / {player.bowlingStyle}</p>
                        </div>
                        <div className="rounded-2xl border border-white/8 bg-black/20 p-4 text-sm text-white/70">
                          <p className="m-0 font-mono text-[10px] uppercase tracking-[0.24em] text-white/45">
                            Sabha
                          </p>
                          <p className="mt-2 mb-1">Field of Study: {player.fieldOfStudy}</p>
                          <p className="m-0">Focus: {player.sabhaLike}</p>
                        </div>
                      </div>

                      <div className="grid gap-2 text-sm text-white/60">
                        <span>Created: {formatDate(player.createdAt)}</span>
                        {player.paymentReferenceNumber ? (
                          <span>UPI Ref: {player.paymentReferenceNumber}</span>
                        ) : null}
                        {player.otherTopics ? <span>Other Topics: {player.otherTopics}</span> : null}
                        <span>Sync: {player.syncStatus || "EXTERNAL_ONLY"}</span>
                      </div>

                      {player.imageUrls.length > 0 ? (
                        <div className="flex flex-wrap gap-3">
                          {player.imageUrls.slice(0, 3).map((imageUrl, index) => (
                            <a
                              key={`${player.id}-image-${index}`}
                              href={imageUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="overflow-hidden rounded-2xl border border-white/10"
                            >
                              <img
                                src={imageUrl}
                                alt={`${player.fullName} upload ${index + 1}`}
                                className="h-16 w-16 object-cover"
                              />
                            </a>
                          ))}
                        </div>
                      ) : null}
                    </div>

                    <div className="grid gap-3 md:min-w-[190px] md:justify-items-end">
                      <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/45">
                        Payment actions
                      </span>
                      {statusActions(player).map((action) => (
                        <button
                          key={action.key}
                          type="button"
                          className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-semibold text-white transition hover:border-apl-yellow hover:text-apl-yellow disabled:cursor-not-allowed disabled:opacity-60"
                          disabled={paymentUpdatingId === player.id}
                          onClick={() => void updatePayment(player, action.key as "paid" | "claimed" | "pending")}
                        >
                          {paymentUpdatingId === player.id ? "Saving..." : action.label}
                        </button>
                      ))}
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
