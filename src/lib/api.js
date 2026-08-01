// ─── API Barrel File ────────────────────────────────────────────────────────────
// This file re-exports all modular services. We recommend importing directly 
// from the specific services in `@/lib/services/` for better code splitting.

export * from './apiClient';
export * from './services/auth.service';
export * from './services/candidate.service';
export * from './services/recruiter.service';
export * from './services/company.service';
export * from './services/job.service';
export * from './services/application.service';
export * from './services/notification.service';
export * from './services/admin.service';
export * from './services/common.service';