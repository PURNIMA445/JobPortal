"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { validateInvite, acceptInvite } from "@/lib/services/company.service";
import useAuth from "@/hooks/useAuth";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { BASE_URL } from "@/lib/apiClient";

export default function JoinCompanyPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const router = useRouter();
    const { isLoggedIn, profile } = useAuth();
    
    const [inviteData, setInviteData] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [accepting, setAccepting] = useState(false);

    useEffect(() => {
        if (!token) {
            setError("Invalid invite link.");
            setLoading(false);
            return;
        }

        async function fetchInvite() {
            try {
                const data = await validateInvite(token);
                setInviteData(data);
            } catch (err) {
                setError(err.message || "This invite is invalid or has expired.");
            } finally {
                setLoading(false);
            }
        }
        fetchInvite();
    }, [token]);

    const handleAccept = async () => {
        if (!isLoggedIn) {
            setError("Please login first to accept this invite.");
            return;
        }

        try {
            setAccepting(true);
            await acceptInvite(token);
            router.push("/dashboard/recruiter");
        } catch (err) {
            setError(err.message || "Failed to accept invite. Make sure you are logged in with the correct email account.");
        } finally {
            setAccepting(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            setAccepting(true);
            setError("");
            
            const result = await signInWithPopup(auth, googleProvider);
            const idToken = await result.user.getIdToken();
            
            const res = await fetch(`${BASE_URL}/api/auth/firebase`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ 
                idToken: idToken,
                allowCreate: true,
                role: "RECRUITER"
              }),
            });

            if (!res.ok) {
                const rawText = await res.text();
                let parsedMessage = rawText;
                try {
                    const parsed = JSON.parse(rawText);
                    parsedMessage = parsed.message || parsed.error || JSON.stringify(parsed);
                } catch {}
                throw new Error(parsedMessage || "Authentication failed");
            }

            const data = await res.json();
            
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role || "RECRUITER");
            localStorage.setItem("userId", data.userId || "");
            document.cookie = `token=${data.token}; path=/; max-age=86400`;
            
            // Now accept the invite
            await acceptInvite(token);
            
            router.push("/dashboard/recruiter");
        } catch (err) {
            setError(err.message || "Failed to sign in and accept invite.");
            setAccepting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-red-100 text-center">
                    <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                        ❌
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Invite Error</h2>
                    <p className="text-red-600 mb-6">{error}</p>
                    <button onClick={() => router.push("/")} className="w-full py-3 bg-[#7A8B6A] hover:bg-[#687A5D] text-white font-medium rounded-xl transition-all shadow-sm">Return Home</button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center">
                <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                    🏢
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Join {inviteData?.companyName}</h2>
                <p className="text-gray-600 mb-6">
                    You have been invited to join the team on Smart Job Portal.
                </p>
                
                {!isLoggedIn ? (
                    <div className="space-y-4">
                        <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
                            Please continue with Google to accept the invitation. If you don't have an account, one will be created for you.
                        </p>
                        <button 
                            onClick={handleGoogleSignIn} 
                            disabled={accepting}
                            className="w-full py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-xl transition-all shadow-sm text-base flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            {accepting ? "Signing in..." : "Continue with Google"}
                        </button>
                    </div>
                ) : (
                    <button 
                        onClick={handleAccept} 
                        disabled={accepting}
                        className="w-full py-3 bg-[#7A8B6A] hover:bg-[#687A5D] text-white font-medium rounded-xl transition-all shadow-sm text-base disabled:opacity-50"
                    >
                        {accepting ? "Accepting..." : "Accept Invitation"}
                    </button>
                )}
            </div>
        </div>
    );
}
