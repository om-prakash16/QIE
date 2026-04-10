/**
 * API Client
 * Central binding for all backend service calls.
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem("auth_token");
    const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "API Request Failed");
    }

    return response.json();
}

// API module bindings
export const api = {
    auth: {
        login: (wallet: string, signature: string) => fetchWithAuth("/auth/wallet-login", { method: "POST", body: JSON.stringify({ wallet, signature }) }),
        me: () => fetchWithAuth("/auth/me")
    },
    profile: {
        getSchema: () => fetchWithAuth("/profile/schema"),
        get: () => fetchWithAuth("/profile"),
        update: (data: any) => fetchWithAuth("/profile/update", { method: "POST", body: JSON.stringify(data) }),
        uploadFile: (formData: FormData) => fetchWithAuth("/profile/upload-file", { method: "POST", body: formData, headers: { "Content-Type": "multipart/form-data" } })
    },
    ai: {
        analyze: (data: any) => fetchWithAuth("/ai/analyze-profile", { method: "POST", body: JSON.stringify({ profile_data: data }) }),
        getScores: (userId?: string) => fetchWithAuth(`/ai/scores${userId ? `?user_id=${userId}` : ""}`),
        recommendSkills: () => fetchWithAuth("/ai/recommend-skills", { method: "POST" })
    },
    company: {
        create: (data: any) => fetchWithAuth("/company/create", { method: "POST", body: JSON.stringify(data) }),
        get: () => fetchWithAuth("/company/profile"),
        invite: (email: string, role: string) => fetchWithAuth("/company/invite-member", { method: "POST", body: JSON.stringify({ email, role }) }),
        getTeam: () => fetchWithAuth("/company/team")
    },
    jobs: {
        create: (data: any) => fetchWithAuth("/jobs/create", { method: "POST", body: JSON.stringify(data) }),
        list: () => fetchWithAuth("/jobs/list"),
        details: (id: string) => fetchWithAuth(`/jobs/details/${id}`),
        apply: (jobId: string) => fetchWithAuth("/jobs/apply", { method: "POST", body: JSON.stringify({ job_id: jobId }) })
    },
    applications: {
        user: () => fetchWithAuth("/applications/user"),
        company: (id: string) => fetchWithAuth(`/applications/company?company_id=${id}`),
        updateStatus: (id: string, status: string) => fetchWithAuth("/applications/status", { method: "PATCH", body: JSON.stringify({ application_id: id, status }) })
    },
    nft: {
        mintProfile: () => fetchWithAuth("/nft/mint-profile", { method: "POST" }),
        updateMetadata: (cid: string) => fetchWithAuth("/nft/update-metadata", { method: "POST", body: JSON.stringify({ cid }) }),
        list: () => fetchWithAuth("/nft/user-nfts")
    },
    search: {
        candidates: (params: string) => fetchWithAuth(`/search/candidates?${params}`),
        jobs: (params: string) => fetchWithAuth(`/search/jobs?${params}`)
    },
    notifications: {
        get: () => fetchWithAuth("/notifications"),
        read: (id: string) => fetchWithAuth(`/notifications/read?id=${id}`, { method: "PATCH" })
    },
    activity: {
        user: (limit = 20) => fetchWithAuth(`/activity/user?limit=${limit}`),
        company: (limit = 20) => fetchWithAuth(`/activity/company?limit=${limit}`),
        admin: (limit = 50) => fetchWithAuth(`/activity/admin?limit=${limit}`),
        record: (data: any) => fetchWithAuth("/activity/record", { method: "POST", body: JSON.stringify(data) }),
    },
    analytics: {
        user: () => fetchWithAuth("/analytics/user"),
        company: () => fetchWithAuth("/analytics/company"),
        admin: () => fetchWithAuth("/analytics/admin"),
    },
    insights: {
        user: () => fetchWithAuth("/analytics/insights/user"),
        company: () => fetchWithAuth("/analytics/insights/company"),
        admin: () => fetchWithAuth("/analytics/insights/admin"),
    },
    sync: {
        profile: () => fetchWithAuth("/sync/profile", { method: "POST" }),
        status: () => fetchWithAuth("/sync/status"),
        retry: (type: string) => fetchWithAuth("/sync/retry", { method: "POST", body: JSON.stringify({ entity_type: type }) })
    },
    admin: {
        getUsers: () => fetchWithAuth("/admin/users"),
        updateUser: (wallet: string, data: any) => fetchWithAuth(`/admin/users/${wallet}`, { method: "PATCH", body: JSON.stringify(data) }),
        getSchema: () => fetchWithAuth("/admin/schema"),
        createSchema: (data: any) => fetchWithAuth("/admin/schema", { method: "POST", body: JSON.stringify(data) }),
        updateSchema: (id: string, data: any) => fetchWithAuth(`/admin/schema/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
        deleteSchema: (id: string) => fetchWithAuth(`/admin/schema/${id}`, { method: "DELETE" }),
        getFeatures: () => fetchWithAuth("/admin/features"),
        updateFeature: (data: any) => fetchWithAuth("/admin/features/update", { method: "POST", body: JSON.stringify(data) }),
        getSettings: () => fetchWithAuth("/admin/settings"),
        getCompanies: () => fetchWithAuth("/admin/companies"),
        verifyCompany: (id: string) => fetchWithAuth(`/admin/companies/${id}/verify`, { method: "PATCH" }),
        deleteCompany: (id: string) => fetchWithAuth(`/admin/companies/${id}`, { method: "DELETE" }),
        getAllJobs: () => fetchWithAuth("/admin/all-jobs"),
        deleteJob: (id: string) => fetchWithAuth(`/admin/jobs/${id}`, { method: "DELETE" }),
        getAllApplications: () => fetchWithAuth("/admin/all-applications")
    },
    cms: {
        all: () => fetchWithAuth("/cms"),
        section: (section: string) => fetchWithAuth(`/cms/${section}`),
        update: (data: any) => fetchWithAuth("/cms/update", { method: "PATCH", body: JSON.stringify(data) }),
        delete: (section: string, key: string) => fetchWithAuth(`/cms/${section}/${key}`, { method: "DELETE" })
    },
    career: {
        getGoals: () => fetchWithAuth("/career/goals"),
        createGoal: (data: any) => fetchWithAuth("/career/goals", { method: "POST", body: JSON.stringify(data) }),
        addTask: (data: any) => fetchWithAuth("/career/tasks", { method: "POST", body: JSON.stringify(data) }),
    },
    identity: {
        getTimeline: (userId: string) => fetchWithAuth(`/connections/timeline/${userId}`),
        requestConnection: (targetUserId: string) => fetchWithAuth("/connections/request", { method: "POST", body: JSON.stringify({ target_user_id: targetUserId }) }),
        getConnections: () => fetchWithAuth("/connections/list"),
    },
    interview: {
        generate: (jobId: string, count: number = 10) => fetchWithAuth("/ai/generate-interview-questions", { method: "POST", body: JSON.stringify({ job_id: jobId, count }) }),
        get: (jobId?: string) => fetchWithAuth(`/ai/interview-questions${jobId ? `?job_id=${jobId}` : ""}`),
    },
    chat: {
        getRooms: () => fetchWithAuth("/chat/rooms"),
        getHistory: (roomId: string) => fetchWithAuth(`/chat/history/${roomId}`),
    }
};
