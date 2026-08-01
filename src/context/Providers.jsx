"use client";

import { SavedJobsProvider } from "./SavedJobsContext";
import { AuthProvider } from "./AuthContext";

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <SavedJobsProvider>
        {children}
      </SavedJobsProvider>
    </AuthProvider>
  );
}
