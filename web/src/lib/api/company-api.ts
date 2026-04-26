/**
 * Company / Recruiter API Module
 * All endpoints accessible by company-role users.
 */

import { fetchWithAuth } from "./api-client";

export const companyApi = {
    profile: {
        create: (data: any) =>
            fetchWithAuth("/company/create", {
                method: "POST",
                body: JSON.stringify(data),
            }),
        get: () => fetchWithAuth("/company/profile"),
    },
    team: {
        invite: (email: string, role: string) =>
            fetchWithAuth("/company/invite-member", {
                method: "POST",
                body: JSON.stringify({ email, role }),
            }),
        getTeam: () => fetchWithAuth("/company/team"),
    },
    jobs: {
        create: (data: any) =>
            fetchWithAuth("/jobs/create", {
                method: "POST",
                body: JSON.stringify(data),
            }),
        listCompanyJobs: (companyId: string) =>
            fetchWithAuth(`/jobs/company-metrics/${companyId}`),
        discovery: (jobId: string) =>
            fetchWithAuth(`/jobs/${jobId}/discovery`),
    },
    applications: {
        company: (id: string, jobId?: string) =>
            fetchWithAuth(
                `/jobs/company/${id}${jobId ? `?job_id=${jobId}` : ""}`
            ),
        updateStatus: (id: string, status: string) =>
            fetchWithAuth("/applications/status", {
                method: "PATCH",
                body: JSON.stringify({ application_id: id, status }),
            }),
    },
    activity: {
        company: (limit = 20) =>
            fetchWithAuth(`/activity/company?limit=${limit}`),
    },
    analytics: {
        company: () => fetchWithAuth("/analytics/company"),
    },
    insights: {
        company: () => fetchWithAuth("/analytics/insights/company"),
    },
    enterprise: {
        listKeys: (companyId: string) => fetchWithAuth(`/company/api-keys?company_id=${companyId}`),
        createKey: (companyId: string, label: string, scopes?: string[]) =>
            fetchWithAuth(`/company/api-keys?company_id=${companyId}`, {
                method: "POST",
                body: JSON.stringify({ label, scopes }),
            }),
        revokeKey: (companyId: string, keyId: string) =>
            fetchWithAuth(`/company/api-keys/${keyId}?company_id=${companyId}`, {
                method: "DELETE",
            }),
    },
};
