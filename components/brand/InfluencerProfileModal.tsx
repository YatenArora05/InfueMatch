"use client";

import React, { useEffect, useState } from "react";
import {
  X,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Youtube,
  Facebook,
  Twitter,
  DollarSign,
  Calendar,
  MessageSquare,
} from "lucide-react";
import axios from "axios";
import { generateAvatarSvg, svgToDataUrl } from "@/lib/utils";

interface InfluencerProfileModalProps {
  influencerId: string;
  isOpen: boolean;
  onClose: () => void;
}

const surface = "bg-[#0d0d20]";
const borderAccent = "border-[#3b82f6]/45";
const labelCaps = "text-[10px] font-semibold uppercase tracking-[0.14em] text-[#93c5fd]";

function formatDob(dob: string) {
  if (!dob) return "";
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return dob;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function InfluencerProfileModal({
  influencerId,
  isOpen,
  onClose,
}: InfluencerProfileModalProps) {
  const [influencer, setInfluencer] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isContacting, setIsContacting] = useState(false);
  const [contactMessage, setContactMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isReporting, setIsReporting] = useState(false);
  const [reportMessage, setReportMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (isOpen && influencerId) {
      fetchInfluencerProfile();
    }
  }, [isOpen, influencerId]);

  const fetchInfluencerProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/influencers/${influencerId}`);
      if (response.data?.influencer) {
        setInfluencer(response.data.influencer);
      }
    } catch (error) {
      console.error("Error fetching influencer profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReportInfluencer = async () => {
    if (!influencerId) return;

    setIsReporting(true);
    setReportMessage(null);

    try {
      const response = await axios.post(`/api/influencers/${influencerId}/report`);

      if (response.status === 200) {
        const { reportCount, isBlocked, message } = response.data || {};

        setInfluencer((prev: any) => ({
          ...prev,
          reportCount: reportCount ?? prev?.reportCount ?? 0,
          isBlocked: typeof isBlocked === "boolean" ? isBlocked : prev?.isBlocked,
        }));

        setReportMessage({
          type: "success",
          text: message || "Influencer reported successfully",
        });
      }
    } catch (error: any) {
      console.error("Error reporting influencer:", error);
      setReportMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to report influencer. Please try again.",
      });
    } finally {
      setIsReporting(false);
    }
  };

  const firstName = influencer?.details?.firstName || "";
  const lastName = influencer?.details?.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim() || influencer?.name || "";
  const email = influencer?.email || "";
  const phone = influencer?.details?.phone || "";
  const city = influencer?.details?.city || "";
  const state = influencer?.details?.state || "";
  const zip = influencer?.details?.zip || "";
  const bio = influencer?.details?.bio || "";
  const estimatedRate = influencer?.details?.estimatedRate || "";
  const niche: string[] = influencer?.details?.niche || [];
  const dob = influencer?.details?.dob || "";
  const profilePic = influencer?.details?.profilePic || null;
  const reportCount: number = influencer?.reportCount ?? 0;

  const socials = influencer?.details?.socials || {};
  const instagram = socials.instagram || {};
  const youtube = socials.youtube || {};
  const facebook = socials.facebook || {};
  const twitter = socials.twitter || {};

  const handleContactInfluencer = async () => {
    if (!email) {
      setContactMessage({ type: "error", text: "Influencer email not available" });
      return;
    }

    setIsContacting(true);
    setContactMessage(null);

    try {
      const brandUserId = localStorage.getItem("userId");
      if (!brandUserId) {
        setContactMessage({ type: "error", text: "Please log in to contact influencers" });
        setIsContacting(false);
        return;
      }

      const response = await axios.post("/api/brand/contact-influencer", {
        influencerId,
        brandUserId,
      });

      if (response.status === 200) {
        setContactMessage({
          type: "success",
          text: "Email sent successfully! The influencer will receive a notification.",
        });
      }
    } catch (error: any) {
      console.error("Error contacting influencer:", error);
      setContactMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to send email. Please try again.",
      });
    } finally {
      setIsContacting(false);
    }
  };

  if (!isOpen) return null;

  const avatarUrl = profilePic
    ? profilePic
    : svgToDataUrl(generateAvatarSvg(fullName));

  const location =
    [city, state, zip].filter(Boolean).join(", ") || "Not specified";

  const rateBadge =
    estimatedRate && String(estimatedRate).trim() !== "Not specified"
      ? String(estimatedRate).trim().startsWith("$")
        ? `${String(estimatedRate).trim()} Rate`
        : `$${String(estimatedRate).trim()} Rate`
      : null;

  const subtitleNiche =
    niche.length > 0 ? niche.join(" · ") : "Creator";
  const subtitle = `Influencer · ${subtitleNiche}`;

  const hasSocials =
    instagram.username ||
    youtube.channel ||
    facebook.username ||
    twitter.username;

  const closeBtnClass =
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#3b82f6]/30 bg-[#060d24]/80 text-[#93c5fd] backdrop-blur-sm transition-colors hover:border-[#3b82f6]/60 hover:bg-[#0d0d20]/90 hover:text-white";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-[#3b82f6]/35 bg-[#0a0a18] shadow-[0_0_0_1px_rgba(59,130,246,0.12),0_24px_80px_rgba(15,23,42,0.85),0_0_60px_rgba(37,99,235,0.18)] animate-in slide-in-from-bottom-4 duration-300"
        role="dialog"
        aria-modal="true"
        aria-labelledby="influencer-profile-title"
      >
        {loading ? (
          <>
            <button
              type="button"
              onClick={onClose}
              className={`absolute right-4 top-4 z-20 ${closeBtnClass}`}
              aria-label="Close"
            >
              <X size={20} strokeWidth={2} />
            </button>
            <div className="flex flex-col items-center justify-center py-24">
              <div className="mb-4 h-12 w-12 animate-spin rounded-full border-2 border-[#3b82f6] border-t-transparent" />
              <p className="text-sm font-medium text-[#93c5fd]">Loading profile…</p>
            </div>
          </>
        ) : influencer ? (
          <>
            {/* Hero */}
            <div className="relative shrink-0 overflow-hidden rounded-t-2xl">
              <div
                className="absolute inset-0 bg-gradient-to-b from-[#060d24] via-[#0c1a3d] to-[#2563eb]"
                aria-hidden
              />
              <div
                className="absolute -left-24 -top-28 h-56 w-56 rounded-full bg-[#3b82f6]/30 blur-3xl"
                aria-hidden
              />
              <div
                className="absolute -right-20 top-8 h-64 w-64 rounded-full bg-[#93c5fd]/20 blur-3xl"
                aria-hidden
              />
              <div
                className="absolute bottom-0 left-1/3 h-40 w-40 -translate-x-1/2 rounded-full bg-[#2563eb]/25 blur-2xl"
                aria-hidden
              />

              <div className="relative z-10 px-5 pb-6 pt-5">
                <div className="mb-5 flex items-start justify-between gap-3">
                  {rateBadge ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#3b82f6]/50 bg-[#060d24]/70 px-3 py-1.5 text-xs font-semibold text-white shadow-[0_0_20px_rgba(59,130,246,0.25)] backdrop-blur-sm">
                      <DollarSign className="h-3.5 w-3.5 text-[#93c5fd]" strokeWidth={2.5} />
                      {rateBadge}
                    </span>
                  ) : (
                    <span />
                  )}
                  <button
                    type="button"
                    onClick={onClose}
                    className={closeBtnClass}
                    aria-label="Close"
                  >
                    <X size={20} strokeWidth={2} />
                  </button>
                </div>

                <div className="flex gap-4">
                  <div
                    className="h-[72px] w-[72px] shrink-0 overflow-hidden rounded-2xl border-2 border-[#3b82f6]/50 shadow-[0_0_24px_rgba(59,130,246,0.45)]"
                  >
                    <img
                      src={avatarUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <h2
                      id="influencer-profile-title"
                      className="text-xl font-bold leading-tight tracking-tight text-white sm:text-2xl"
                    >
                      {fullName}
                    </h2>
                    <p className="mt-1.5 text-sm leading-snug text-[#93c5fd]/95">
                      {subtitle}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {niche.map((n: string, idx: number) => (
                    <span
                      key={`${n}-${idx}`}
                      className="rounded-full border border-[#3b82f6]/55 bg-[#060d24]/50 px-2.5 py-1 text-xs font-semibold text-[#93c5fd]"
                    >
                      {n}
                    </span>
                  ))}
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/50 bg-[#060d24]/50 px-2.5 py-1 text-xs font-semibold text-emerald-300/95">
                    Reports: {reportCount}
                    {influencer?.isBlocked ? (
                      <span className="text-amber-200">(Blocked)</span>
                    ) : null}
                  </span>
                </div>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-28 pt-4">
              {bio ? (
                <div
                  className={`mb-6 rounded-xl border ${borderAccent} ${surface} px-4 py-3.5`}
                >
                  <p className="text-sm italic leading-relaxed text-[#9ca3af]">{bio}</p>
                </div>
              ) : (
                <div
                  className={`mb-6 rounded-xl border ${borderAccent} ${surface} px-4 py-3.5`}
                >
                  <p className="text-sm italic text-[#6b7280]">No bio provided yet.</p>
                </div>
              )}

              <p className={`mb-3 ${labelCaps}`}>Contact info</p>
              <div className="mb-8 grid grid-cols-2 gap-3">
                <ContactCell
                  icon={<Mail className="h-4 w-4 text-[#3b82f6]" strokeWidth={2} />}
                  label="Email"
                  value={email || "Not specified"}
                />
                <ContactCell
                  icon={<Phone className="h-4 w-4 text-[#3b82f6]" strokeWidth={2} />}
                  label="Phone"
                  value={phone || "Not specified"}
                />
                <ContactCell
                  icon={<MapPin className="h-4 w-4 text-[#3b82f6]" strokeWidth={2} />}
                  label="Location"
                  value={location}
                />
                <ContactCell
                  icon={<Calendar className="h-4 w-4 text-[#3b82f6]" strokeWidth={2} />}
                  label="Date of birth"
                  value={dob ? formatDob(dob) : "Not specified"}
                />
              </div>

              {hasSocials ? (
                <>
                  <p className={`mb-3 ${labelCaps}`}>Social media</p>
                  <div className="grid grid-cols-2 gap-3">
                    {instagram.username ? (
                      <SocialCell
                        tint="from-pink-600/35 to-[#0d0d20]"
                        icon={<Instagram className="h-5 w-5 text-pink-400" />}
                        label="Instagram"
                        handle={`@${instagram.username}`}
                        metric={instagram.followers ? `${instagram.followers} followers` : undefined}
                      />
                    ) : null}
                    {youtube.channel ? (
                      <SocialCell
                        tint="from-red-600/40 to-[#0d0d20]"
                        icon={<Youtube className="h-5 w-5 text-red-500" />}
                        label="YouTube"
                        handle={youtube.channel}
                        metric={
                          youtube.subscribers
                            ? `${youtube.subscribers} subscribers`
                            : undefined
                        }
                      />
                    ) : null}
                    {facebook.username ? (
                      <SocialCell
                        tint="from-blue-600/35 to-[#0d0d20]"
                        icon={<Facebook className="h-5 w-5 text-blue-400" />}
                        label="Facebook"
                        handle={facebook.username}
                        metric={
                          facebook.followers ? `${facebook.followers} followers` : undefined
                        }
                      />
                    ) : null}
                    {twitter.username ? (
                      <SocialCell
                        tint="from-sky-600/35 to-[#0d0d20]"
                        icon={<Twitter className="h-5 w-5 text-sky-400" />}
                        label="Twitter"
                        handle={`@${twitter.username}`}
                        metric={
                          twitter.followers ? `${twitter.followers} followers` : undefined
                        }
                      />
                    ) : null}
                  </div>
                </>
              ) : null}
            </div>

            <div className="absolute bottom-0 left-0 right-0 border-t border-[#3b82f6]/20 bg-[#0a0a18]/95 px-5 py-4 backdrop-blur-md">
              {(contactMessage || reportMessage) && (
                <div className="mb-3 space-y-2">
                  {contactMessage && (
                    <div
                      className={`rounded-lg px-3 py-2 text-center text-xs font-semibold ${
                        contactMessage.type === "success"
                          ? "border border-emerald-500/35 bg-emerald-500/10 text-emerald-300"
                          : "border border-red-500/35 bg-red-500/10 text-red-300"
                      }`}
                    >
                      {contactMessage.text}
                    </div>
                  )}
                  {reportMessage && (
                    <div
                      className={`rounded-lg px-3 py-2 text-center text-xs font-semibold ${
                        reportMessage.type === "success"
                          ? "border border-amber-500/35 bg-amber-500/10 text-amber-200"
                          : "border border-red-500/35 bg-red-500/10 text-red-300"
                      }`}
                    >
                      {reportMessage.text}
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                <div className="min-w-0 flex-1 rounded-xl bg-gradient-to-r from-[#3b82f6] via-[#2563eb] to-[#1d4ed8] p-[1.5px]">
                  <button
                    type="button"
                    onClick={handleContactInfluencer}
                    disabled={isContacting || !email}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-[#0a0a18] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#0d0d20] disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    <MessageSquare className="h-4 w-4 shrink-0 text-[#93c5fd]" />
                    {isContacting ? "Sending…" : "Contact the Influencer"}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleReportInfluencer}
                  disabled={isReporting}
                  className="h-12 shrink-0 rounded-xl border border-[#3b82f6]/35 bg-transparent px-4 text-sm font-semibold text-[#93c5fd] transition-colors hover:border-[#93c5fd]/50 hover:bg-[#0d0d20]/80 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isReporting ? "…" : "Report"}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="relative py-20 text-center">
            <button
              type="button"
              onClick={onClose}
              className={`absolute right-4 top-4 ${closeBtnClass}`}
              aria-label="Close"
            >
              <X size={20} strokeWidth={2} />
            </button>
            <p className="text-sm font-medium text-[#93c5fd]">Failed to load profile</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ContactCell({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div
      className={`flex gap-3 rounded-xl border ${borderAccent} ${surface} p-3`}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#3b82f6]/30 bg-[#0a0a18]">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className={`${labelCaps} mb-0.5 normal-case tracking-normal text-[#93c5fd]/80`}>
          {label}
        </p>
        <p className="break-words text-sm font-semibold leading-snug text-white">{value}</p>
      </div>
    </div>
  );
}

function SocialCell({
  icon,
  label,
  handle,
  metric,
  tint,
}: {
  icon: React.ReactNode;
  label: string;
  handle: string;
  metric?: string;
  tint: string;
}) {
  return (
    <div className={`flex gap-3 rounded-xl border ${borderAccent} ${surface} p-3`}>
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${tint} border border-white/5`}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className={`${labelCaps} mb-0.5 normal-case tracking-normal text-[#93c5fd]/80`}>
          {label}
        </p>
        <p className="truncate text-sm font-semibold text-white">{handle}</p>
        {metric ? <p className="mt-0.5 truncate text-xs text-[#9ca3af]">{metric}</p> : null}
      </div>
    </div>
  );
}
