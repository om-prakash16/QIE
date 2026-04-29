/**
 * User / Candidate API Module
 * All endpoints accessible by regular users (candidates).
 */

import { fetchWithAuth } from "./api-client";

export const userApi = {
    profile: {
        getSchema: () => fetchWithAuth("/profile/schema"),
        get: () => fetchWithAuth("/profile"),
        update: (data: any) =>
            fetchWithAuth("/profile/update", {
                method: "POST",
                body: JSON.stringify(data),
            }),
        uploadFile: (formData: FormData) =>
            fetchWithAuth("/profile/upload-file", {
                method: "POST",
                body: formData,
                headers: { "Content-Type": "multipart/form-data" },
            }),
    },
    settings: {
        get: () => fetchWithAuth("/profile/settings"),
        update: (data: any) =>
            fetchWithAuth("/profile/settings/update", {
                method: "PATCH",
                body: JSON.stringify(data),
            }),
    },
    skills: {
        get: (userId?: string) =>
            fetchWithAuth(`/profile/skills${userId ? `?user_id=${userId}` : ""}`),
        add: (data: any) =>
            fetchWithAuth("/profile/skills", {
                method: "POST",
                body: JSON.stringify(data),
            }),
        requestVerification: (skillId: string) =>
            fetchWithAuth(`/profile/skills/${skillId}/verify`, { method: "POST" }),
    },
    portfolio: {
        get: (userId?: string) =>
            fetchWithAuth(`/profile/portfolio${userId ? `?user_id=${userId}` : ""}`),
    },
    ai: {
        analyze: (data: any) =>
            fetchWithAuth("/ai/analyze-profile", {
                method: "POST",
                body: JSON.stringify({ profile_data: data }),
            }),
        getScores: (userId?: string) =>
            fetchWithAuth(`/ai/scores${userId ? `?user_id=${userId}` : ""}`),
        recommendSkills: () =>
            fetchWithAuth("/ai/recommend-skills", { method: "POST" }),
    },
    jobs: {
        list: () => fetchWithAuth("/jobs/list"),
        details: (id: string) => fetchWithAuth(`/jobs/details/${id}`),
        apply: (jobId: string) =>
            fetchWithAuth("/jobs/apply", {
                method: "POST",
                body: JSON.stringify({ job_id: jobId }),
            }),
        save: (jobId: string) =>
            fetchWithAuth("/jobs/save", {
                method: "POST",
                body: JSON.stringify({ job_id: jobId }),
            }),
        unsave: (jobId: string) =>
            fetchWithAuth(`/jobs/unsave/${jobId}`, { method: "DELETE" }),
        getSaved: () => fetchWithAuth("/jobs/saved"),
        submitAssessment: (id: string, data: any) =>
            fetchWithAuth(`/jobs/applications/${id}/submit-assessment`, {
                method: "PATCH",
                body: JSON.stringify(data),
            }),
    },
    applications: {
        user: () => fetchWithAuth("/applications/user"),
    },
    nft: {
        mintProfile: () => fetchWithAuth("/nft/mint-profile", { method: "POST" }),
        updateMetadata: (cid: string) =>
            fetchWithAuth("/nft/update-metadata", {
                method: "POST",
                body: JSON.stringify({ cid }),
            }),
        list: () => fetchWithAuth("/nft/user-nfts"),
    },
    notifications: {
        get: () => fetchWithAuth("/notifications/list"),
        read: (id: string) =>
            fetchWithAuth(`/notifications/${id}/read`, { method: "PATCH" }),
    },
    activity: {
        user: (limit = 20) => fetchWithAuth(`/activity/user?limit=${limit}`),
        record: (data: any) =>
            fetchWithAuth("/activity/record", {
                method: "POST",
                body: JSON.stringify(data),
            }),
    },
    analytics: {
        user: () => fetchWithAuth("/analytics/user"),
    },
    insights: {
        user: () => fetchWithAuth("/analytics/insights/user"),
    },
    sync: {
        profile: () => fetchWithAuth("/sync/profile", { method: "POST" }),
        status: () => fetchWithAuth("/sync/status"),
        retry: (type: string) =>
            fetchWithAuth("/sync/retry", {
                method: "POST",
                body: JSON.stringify({ entity_type: type }),
            }),
    },
    career: {
        getGoals: () => fetchWithAuth("/career/goals"),
        createGoal: (data: any) =>
            fetchWithAuth("/career/goals", {
                method: "POST",
                body: JSON.stringify(data),
            }),
        addTask: (data: any) =>
            fetchWithAuth("/career/tasks", {
                method: "POST",
                body: JSON.stringify(data),
            }),
    },
    identity: {
        getTimeline: (userId: string) =>
            fetchWithAuth(`/connections/timeline/${userId}`),
        requestConnection: (targetUserId: string) =>
            fetchWithAuth("/connections/request", {
                method: "POST",
                body: JSON.stringify({ target_user_id: targetUserId }),
            }),
        getConnections: () => fetchWithAuth("/connections/list"),
        submit: (data: { id_type: string; document_url: string }) =>
            fetchWithAuth("/profile/identity/submit", {
                method: "POST",
                body: JSON.stringify(data),
            }),
        getStatus: (userId?: string) =>
            fetchWithAuth(
                `/profile/identity/status${userId ? `?user_id=${userId}` : ""}`
            ),
    },
    interview: {
        generate: (jobId: string, count: number = 10) =>
            fetchWithAuth("/ai/generate-interview-questions", {
                method: "POST",
                body: JSON.stringify({ job_id: jobId, count }),
            }),
        get: (jobId?: string) =>
            fetchWithAuth(
                `/ai/interview-questions${jobId ? `?job_id=${jobId}` : ""}`
            ),
    },
    chat: {
        getRooms: () => fetchWithAuth("/chat/rooms"),
        getHistory: (roomId: string) =>
            fetchWithAuth(`/chat/history/${roomId}`),
    },
    skillGraph: {
        // Taxonomy
        taxonomy: (category?: string, page = 1) =>
            fetchWithAuth(`/skills/taxonomy?page=${page}${category ? `&category=${category}` : ""}`),
        searchTaxonomy: (q: string) =>
            fetchWithAuth(`/skills/taxonomy/search?q=${encodeURIComponent(q)}`),
        // User Skill Graph
        getMySkills: () => fetchWithAuth("/skills/me"),
        getUserSkills: (userId: string) => fetchWithAuth(`/skills/user/${userId}`),
        addSkill: (data: { skill_id: string; proficiency_level?: string; years_experience?: number; is_primary?: boolean }) =>
            fetchWithAuth("/skills/me", { method: "POST", body: JSON.stringify(data) }),
        updateSkill: (nodeId: string, data: any) =>
            fetchWithAuth(`/skills/me/${nodeId}`, { method: "PUT", body: JSON.stringify(data) }),
        removeSkill: (nodeId: string) =>
            fetchWithAuth(`/skills/me/${nodeId}`, { method: "DELETE" }),
        bulkAddSkills: (skills: any[]) =>
            fetchWithAuth("/skills/me/bulk", { method: "POST", body: JSON.stringify({ skills }) }),
        // Graph Intelligence
        getRelated: (skill: string, depth = 2) =>
            fetchWithAuth(`/skills/graph/related?skill=${encodeURIComponent(skill)}&depth=${depth}`),
        expandJob: (jobId: string, depth = 2) =>
            fetchWithAuth(`/skills/graph/expand-job/${jobId}?depth=${depth}`),
        matchToJob: (candidateSkills: string[], requiredSkills: string[]) =>
            fetchWithAuth("/skills/graph/match", { method: "POST", body: JSON.stringify({ candidate_skills: candidateSkills, required_skills: requiredSkills }) }),
        getGaps: (jobId: string) =>
            fetchWithAuth(`/skills/graph/gaps?job_id=${jobId}`),
        // AI Extraction
        extractFromResume: (resumeText: string) =>
            fetchWithAuth("/skills/extract/resume", { method: "POST", body: JSON.stringify({ resume_text: resumeText }) }),
        extractFromGitHub: (username: string) =>
            fetchWithAuth("/skills/extract/github", { method: "POST", body: JSON.stringify({ github_username: username }) }),
        confirmExtracted: (confirmedSkills: any[]) =>
            fetchWithAuth("/skills/extract/confirm", { method: "POST", body: JSON.stringify({ confirmed_skills: confirmedSkills }) }),
        // Endorsements
        endorseSkill: (data: { user_skill_node_id: string; relationship?: string; comment?: string }) =>
            fetchWithAuth("/skills/endorse", { method: "POST", body: JSON.stringify(data) }),
    },
    projects: {
        list: () => fetchWithAuth("/projects/me"),
        create: (data: any) => fetchWithAuth("/projects/me", { method: "POST", body: JSON.stringify(data) }),
        update: (id: string, data: any) => fetchWithAuth(`/projects/me/${id}`, { method: "PUT", body: JSON.stringify(data) }),
        delete: (id: string) => fetchWithAuth(`/projects/me/${id}`, { method: "DELETE" }),
        linkSkills: (projectId: string, data: { skill_ids: string[]; usage_context?: string; contribution_weight?: number }) =>
            fetchWithAuth(`/projects/me/${projectId}/link-skills`, { method: "POST", body: JSON.stringify(data) }),
        analyzeGitHub: (url: string) => fetchWithAuth(`/projects/github/analyze?url=${encodeURIComponent(url)}`),
    },
};
