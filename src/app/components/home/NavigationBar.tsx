// @ts-nocheck

"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ChevronDown,
  LogOut,
  Settings,
  LayoutDashboard,
  GraduationCap,
  Shield,
  Building2,
  FileText,
  BookOpen,
  Loader2,
  ClipboardList,
  Newspaper,
  FileQuestion,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import Cookies from "js-cookie";
import Image from "next/image";
import { logoutCPD, loginWithGoogle } from "@/lib/features/auth/auth-slice";
import type { AppDispatch, RootState } from "@/lib/store";

/* ── safe storage helpers ──────────────────────────────────────────── */
const safeGet = (key: string, def = "") => {
  if (typeof window === "undefined") return def;
  try {
    return localStorage.getItem(key) || def;
  } catch {
    return def;
  }
};
const safeGetJSON = <T,>(key: string, def: T): T => {
  if (typeof window === "undefined") return def;
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : def;
  } catch {
    return def;
  }
};

/* ── role helpers ──────────────────────────────────────────────────── */
const getStoredUser = () => {
  let cookieUser = null;
  try {
    const c = Cookies.get("cpd_user");
    if (c) cookieUser = JSON.parse(c);
  } catch {}
  let lsUser = null;
  try {
    const l = safeGet("cpd_user");
    if (l) lsUser = JSON.parse(l);
  } catch {}
  const crossCtx = safeGetJSON("cross_system_context", null);
  return { cookieUser, lsUser, crossCtx };
};

const resolveRole = (redux: any): string => {
  if (redux?.cpd_role) return redux.cpd_role;
  const { cookieUser, lsUser, crossCtx } = getStoredUser();
  return cookieUser?.cpd_role || lsUser?.cpd_role || crossCtx?.cpd_role || "LEARNER";
};

const dashboardPath = (role?: string) => {
  const map: Record<string, string> = {
    SYSTEM_ADMIN: "/dashboard/system-admin",
    INSTITUTION_ADMIN: "/dashboard/institution-admin",
    CONTENT_CREATOR: "/dashboard/content-creator",
    INSTRUCTOR: "/dashboard/instructor",
    LEARNER: "/dashboard/learner/learning/courses",
  };
  return map[role || "LEARNER"] || "/dashboard/learner/learning/courses";
};

const roleLabel = (role?: string) =>
  ({
    SYSTEM_ADMIN: "System Admin",
    INSTITUTION_ADMIN: "Institution Admin",
    CONTENT_CREATOR: "Content Creator",
    INSTRUCTOR: "Instructor",
    LEARNER: "Learner",
  }[role || "LEARNER"] || "Learner");

const roleIcon = (role?: string) =>
  ({
    SYSTEM_ADMIN: Shield,
    INSTITUTION_ADMIN: Building2,
    CONTENT_CREATOR: FileText,
    INSTRUCTOR: GraduationCap,
    LEARNER: BookOpen,
  }[role || "LEARNER"] || BookOpen);

/* ── Google login button ───────────────────────────────────────────── */
function HomeGoogleLoginButton({ onSuccess }: { onSuccess?: () => void }) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const onSuccessHandler = async (cred: any) => {
    if (!cred.credential) {
      toast.error("Google login failed");
      return;
    }
    setBusy(true);
    try {
      const res = await dispatch(loginWithGoogle(cred.credential)).unwrap();
      toast.success(`Welcome ${res.user.first_name}!`);
      if (onSuccess) onSuccess();
      setTimeout(() => {
        window.location.href = dashboardPath(res.user.cpd_role);
      }, 500);
    } catch (e: any) {
      toast.error(e || "Google login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative w-full">
      {busy && (
        <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-10 rounded-lg">
          <Loader2 className="w-5 h-5 animate-spin" style={{ color: "#2D6A4F" }} />
        </div>
      )}
      <GoogleLogin
        onSuccess={onSuccessHandler}
        onError={() => toast.error("Google login failed")}
        type="standard"
        theme="outline"
        size="large"
        text="continue_with"
        shape="rectangular"
        logo_alignment="left"
        width="100%"
      />
    </div>
  );
}

// ── Dropdown Menu Component for Desktop ──────────────────────────────
interface DropdownItem {
  label: string;
  href: string;
  icon: React.ElementType;
  desc: string;
}

interface DesktopDropdownProps {
  items: DropdownItem[];
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement>;
}

function DesktopDropdown({ items, isOpen, onClose, triggerRef }: DesktopDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX - 120,
      });
    }
  }, [isOpen, triggerRef]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose, triggerRef]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed z-50 w-80 bg-white rounded-xl shadow-xl overflow-hidden"
          style={{
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            border: "1px solid rgba(45,106,79,0.12)",
          }}
        >
          {/* Header accent */}
          <div
            className="h-1 w-full"
            style={{ background: "linear-gradient(90deg, #2D6A4F 0%, #74C69D 100%)" }}
          />

          <div className="p-2">
            <div className="px-3 py-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary/60">
                Publications
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Explore our latest research and guidelines
              </p>
            </div>

            <div className="border-t border-slate-100 my-1" />

            {items.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Link
                  key={idx}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-start gap-3 px-3 py-3 rounded-lg transition-all duration-150 group hover:bg-primary/5"
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors group-hover:bg-primary/10"
                    style={{ backgroundColor: "rgba(45,106,79,0.08)" }}
                  >
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-800 group-hover:text-primary transition-colors">
                        {item.label}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary transition-all group-hover:translate-x-0.5" />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                </Link>
              );
            })}

            <div className="border-t border-slate-100 my-1" />

            <div className="px-3 py-2">
              <div
                className="text-[10px] text-center text-slate-400"
                style={{ fontSize: "9px" }}
              >
                Latest updates from Rwanda Health
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Mobile Accordion Component for Publications ──────────────────────
interface MobileAccordionProps {
  items: DropdownItem[];
  isOpen: boolean;
  onToggle: () => void;
}

function MobileAccordion({ items, isOpen, onToggle }: MobileAccordionProps) {
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full py-3 px-2 text-sm font-semibold transition-colors"
        style={{ color: "#1E2F5E" }}
      >
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          <span>Publications</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          style={{ color: "#717182" }}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pl-6 pr-2 pb-3 space-y-1">
              {items.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={idx}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-primary/5"
                    onClick={() => onToggle()}
                  >
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-primary/10">
                      <Icon className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-700">{item.label}</div>
                      <div className="text-[10px] text-slate-400">{item.desc}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main Navbar Component ───────────────────────────────────────────
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [showGoogleLogin, setShowGoogleLogin] = useState(false);
  const [openPublicationsDropdown, setOpenPublicationsDropdown] = useState(false);
  const [mobilePublicationsOpen, setMobilePublicationsOpen] = useState(false);
  const publicationsTriggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const googlePopupRef = useRef<HTMLDivElement>(null);

  const { user: reduxUser, isAuthenticated } = useSelector((s: RootState) => s.cpdAuth);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const pathname = usePathname();

  const [role, setRole] = useState("LEARNER");
  const [actualUser, setActualUser] = useState<any>(null);
  const [ready, setReady] = useState(false);

  // Publications dropdown items
  const publicationItems: DropdownItem[] = [
    {
      label: "Articles",
      href: "/articles",
      icon: FileText,
      desc: "Research & clinical articles",
    },
    {
      label: "Protocols",
      href: "/protocols",
      icon: ClipboardList,
      desc: "Updated health protocols",
    },
    {
      label: "Guidelines",
      href: "/guidelines",
      icon: BookOpen,
      desc: "Health practice guidelines",
    },
  ];

  // Resolve user + role from Redux first, then cookies/localStorage as fallback
  useEffect(() => {
    const r = resolveRole(reduxUser);
    setRole(r);
    const { cookieUser, lsUser } = getStoredUser();
    setActualUser(reduxUser || cookieUser || lsUser);
    setReady(true);
  }, [reduxUser]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Handle clicks outside for dropdowns
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenu(false);
      }
      if (
        showGoogleLogin &&
        googlePopupRef.current &&
        !googlePopupRef.current.contains(e.target as Node)
      ) {
        setShowGoogleLogin(false);
      }
      if (
        openPublicationsDropdown &&
        publicationsTriggerRef.current &&
        !publicationsTriggerRef.current.contains(e.target as Node)
      ) {
        setOpenPublicationsDropdown(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [showGoogleLogin, openPublicationsDropdown]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    setUserMenu(false);
    try {
      await dispatch(logoutCPD()).unwrap();
      localStorage.clear();
      Cookies.remove("cpd_access_token");
      Cookies.remove("cpd_user");
      toast.success("Signed out successfully");
      router.push("/");
    } catch {
      toast.error("Logout failed");
    }
  };

  const authenticated = isAuthenticated && !!actualUser;
  const RoleIcon = roleIcon(role);

  // Desktop navigation links (excluding Publications which has dropdown)
  const mainNavLinks = [
    { label: "How It Works", href: "#how-it-works" },
    { label: "Courses", href: "#courses" },
    { label: "Categories", href: "#categories" },
    { label: "Institutions", href: "#institutions" },
    { label: "Testimonials", href: "#testimonials" },
  ];

  return (
    <nav
      className="sticky top-0 z-50 bg-white"
      style={{
        borderBottom: scrolled ? "1px solid rgba(30,47,94,0.09)" : "1px solid transparent",
        boxShadow: scrolled ? "0 2px 20px -4px rgba(45,106,79,0.08)" : "none",
        transition: "all 0.3s ease",
      }}
    >
      {/* Thin green top accent */}
      <div
        style={{
          height: "3px",
          background: "linear-gradient(90deg, #2D6A4F 0%, #74C69D 50%, #2D6A4F 100%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0">
        <div className="flex items-center justify-between h-14">
          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="flex items-center">
            <Image src="/CPDLogo.png" alt="Rwanda Health CPDS  Logo" width={250} height={50} className="object-contain" />
          </div>
          </Link>

          {/* ── Desktop nav links ── */}
          <div className="hidden md:flex items-center gap-6">
            {mainNavLinks.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="cpd-nav-link text-xs font-semibold transition-colors hover:text-primary"
                style={{ color: "#1E2F5E" }}
              >
                {label}
              </a>
            ))}

            {/* Publications Dropdown Trigger */}
            <div className="relative" ref={publicationsTriggerRef}>
              <button
                onClick={() => setOpenPublicationsDropdown(!openPublicationsDropdown)}
                onMouseEnter={() => setOpenPublicationsDropdown(true)}
                className="flex items-center gap-1 text-xs font-semibold transition-colors hover:text-primary py-1"
                style={{ color: openPublicationsDropdown ? "#2D6A4F" : "#1E2F5E" }}
              >
                Publications
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-200 ${
                    openPublicationsDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              <DesktopDropdown
                items={publicationItems}
                isOpen={openPublicationsDropdown}
                onClose={() => setOpenPublicationsDropdown(false)}
                triggerRef={publicationsTriggerRef}
              />
            </div>
          </div>

          {/* ── Desktop right CTAs ── */}
          <div className="hidden md:flex items-center gap-3">
            {ready && authenticated ? (
              /* ── Authenticated: user avatar + dropdown ── */
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setUserMenu(!userMenu)}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold transition-all"
                  style={{
                    border: "1.5px solid rgba(45,106,79,0.18)",
                    color: "#2D6A4F",
                    background: userMenu ? "rgba(45,106,79,0.06)" : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!userMenu)
                      (e.currentTarget as HTMLElement).style.background =
                        "rgba(45,106,79,0.04)";
                  }}
                  onMouseLeave={(e) => {
                    if (!userMenu)
                      (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  <div
                    className="cpd-avatar flex-shrink-0"
                    style={{ width: "1.5rem", height: "1.5rem", fontSize: "0.5625rem" }}
                  >
                    {actualUser?.first_name?.[0]}
                    {actualUser?.last_name?.[0]}
                  </div>
                  <span className="max-w-[90px] truncate">
                    {actualUser?.first_name || "Account"}
                  </span>
                  <ChevronDown
                    className={`w-3 h-3 transition-transform ${
                      userMenu ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {userMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-52 bg-white z-50 overflow-hidden"
                      style={{
                        border: "1px solid rgba(30,47,94,0.09)",
                        boxShadow: "0 12px 32px -8px rgba(0,0,0,0.14)",
                      }}
                    >
                      <div style={{ height: "2px", background: "#2D6A4F" }} />

                      <div
                        className="p-3"
                        style={{ borderBottom: "1px solid rgba(30,47,94,0.07)" }}
                      >
                        <div className="text-[11px] font-bold" style={{ color: "#1E2F5E" }}>
                          {actualUser?.first_name} {actualUser?.last_name}
                        </div>
                        <div
                          className="text-[10px] flex items-center gap-1 mt-0.5"
                          style={{ color: "#717182" }}
                        >
                          <RoleIcon className="w-3 h-3" />
                          {roleLabel(role)}
                        </div>
                      </div>

                      {[
                        {
                          icon: LayoutDashboard,
                          label: "Dashboard",
                          href: dashboardPath(role),
                        },
                        { icon: Settings, label: "Settings", href: "/dashboard/settings" },
                      ].map(({ icon: Icon, label, href }) => (
                        <Link
                          key={label}
                          href={href}
                          onClick={() => setUserMenu(false)}
                          className="flex items-center gap-2.5 px-3 py-2.5 text-xs transition-colors"
                          style={{ color: "#1E2F5E" }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.background =
                              "rgba(45,106,79,0.05)";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.background =
                              "transparent";
                          }}
                        >
                          <Icon className="w-3.5 h-3.5" style={{ color: "#2D6A4F" }} />
                          <span className="font-medium">{label}</span>
                        </Link>
                      ))}

                      <div style={{ borderTop: "1px solid rgba(30,47,94,0.07)" }}>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2.5 px-3 py-2.5 text-xs w-full text-left transition-colors"
                          style={{ color: "#E76F51" }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.background =
                              "rgba(231,111,81,0.05)";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.background =
                              "transparent";
                          }}
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span className="font-medium">Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : ready ? (
              /* ── Not authenticated: Login button + Google popup ── */
              <div className="flex items-center gap-2">
                {/* Standard Login Button */}
                <Link
                  href="/login"
                  className="px-4 py-2 text-xs font-semibold transition-all"
                  style={{
                    color: "#2D6A4F",
                    border: "1.5px solid rgba(45,106,79,0.35)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "#2D6A4F";
                    (e.currentTarget as HTMLElement).style.color = "#fff";
                    (e.currentTarget as HTMLElement).style.borderColor = "#2D6A4F";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                    (e.currentTarget as HTMLElement).style.color = "#2D6A4F";
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "rgba(45,106,79,0.35)";
                  }}
                >
                  Sign In
                </Link>

                {/* Google Login Dropdown Button */}
                <div className="relative" ref={googlePopupRef}>
                  <button
                    onClick={() => setShowGoogleLogin(!showGoogleLogin)}
                    className="px-4 py-2 text-xs font-semibold transition-all flex items-center gap-2"
                    style={{
                      color: "#ffffff",
                      background: "#2D6A4F",
                      border: "1.5px solid #2D6A4F",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "#1f4d37";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "#2D6A4F";
                    }}
                  >
                    Google Sign In
                    <ChevronDown
                      className={`w-3 h-3 transition-transform ${
                        showGoogleLogin ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {showGoogleLogin && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-80 bg-white z-50 overflow-hidden rounded-xl"
                        style={{
                          border: "1px solid rgba(30,47,94,0.09)",
                          boxShadow: "0 12px 32px -8px rgba(0,0,0,0.14)",
                        }}
                      >
                        <div style={{ height: "2px", background: "#2D6A4F" }} />

                        <div className="p-4">
                          <div className="text-center mb-3">
                            <h3 className="text-sm font-bold" style={{ color: "#1E2F5E" }}>
                              Welcome Back
                            </h3>
                            <p className="text-[10px] mt-1" style={{ color: "#717182" }}>
                              Sign in to continue your learning journey
                            </p>
                          </div>

                          <HomeGoogleLoginButton onSuccess={() => setShowGoogleLogin(false)} />

                          <div className="relative my-3">
                            <div className="absolute inset-0 flex items-center">
                              <div
                                className="w-full border-t"
                                style={{ borderColor: "rgba(30,47,94,0.08)" }}
                              />
                            </div>
                            <div className="relative flex justify-center text-[9px]">
                              <span className="px-2 bg-white" style={{ color: "#717182" }}>
                                New here?
                              </span>
                            </div>
                          </div>

                          <Link
                            href="/register"
                            className="block text-center text-[11px] font-semibold py-1.5 transition-colors w-full rounded-lg"
                            style={{ color: "#2D6A4F" }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLElement).style.background =
                                "rgba(45,106,79,0.05)";
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLElement).style.background =
                                "transparent";
                            }}
                          >
                            Create an account →
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : null}
          </div>

          {/* ── Mobile hamburger ── */}
          <button
            className="md:hidden p-2 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ color: "#1E2F5E" }}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden"
            style={{ borderTop: "1px solid rgba(30,47,94,0.07)", background: "#fff" }}
          >
            <div className="px-5 py-5 space-y-1">
              {mainNavLinks.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="flex items-center h-10 text-sm font-semibold px-2 transition-colors"
                  style={{ color: "#1E2F5E" }}
                  onClick={() => setMobileOpen(false)}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "#2D6A4F";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "#1E2F5E";
                  }}
                >
                  {label}
                </a>
              ))}

              {/* Mobile Publications Accordion */}
              <MobileAccordion
                items={publicationItems}
                isOpen={mobilePublicationsOpen}
                onToggle={() => setMobilePublicationsOpen(!mobilePublicationsOpen)}
              />

              <div
                className="flex flex-col gap-2 pt-4 mt-2"
                style={{ borderTop: "1px solid rgba(30,47,94,0.07)" }}
              >
                {authenticated ? (
                  <>
                    <Link
                      href={dashboardPath(role)}
                      className="py-2.5 text-sm font-bold text-center text-white transition-colors"
                      style={{ background: "#2D6A4F" }}
                      onClick={() => setMobileOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="py-2.5 text-sm font-semibold text-center transition-colors"
                      style={{ color: "#E76F51", border: "1.5px solid #E76F51" }}
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <div className="space-y-3">
                    <Link
                      href="/login"
                      className="block py-2.5 text-sm font-bold text-center text-white transition-colors"
                      style={{ background: "#2D6A4F" }}
                      onClick={() => setMobileOpen(false)}
                    >
                      Sign In
                    </Link>

                    <div
                      className="p-3 rounded-lg"
                      style={{
                        background: "#F8F9FA",
                        border: "1px solid rgba(45,106,79,0.1)",
                      }}
                    >
                      <p className="text-[10px] text-center mb-2" style={{ color: "#717182" }}>
                        Or sign in with Google
                      </p>
                      <HomeGoogleLoginButton onSuccess={() => setMobileOpen(false)} />
                    </div>

                    <Link
                      href="/register"
                      className="block py-2.5 text-sm font-bold text-center transition-colors"
                      style={{
                        color: "#2D6A4F",
                        border: "1.5px solid rgba(45,106,79,0.35)",
                      }}
                      onClick={() => setMobileOpen(false)}
                    >
                      Create an Account
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;




