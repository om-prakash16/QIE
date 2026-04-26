"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { ProfileHeader } from "@/components/features/profile/profile-header"
import { OverviewTab } from "@/features/user/profile/tabs/overview-tab"
import { BasicInfoTab } from "@/features/user/profile/tabs/basic-info-tab"
import { SkillsTab } from "@/features/user/profile/tabs/skills-tab"
import { ExperienceTab } from "@/features/user/profile/tabs/experience-tab"
import { EducationTab } from "@/features/user/profile/tabs/education-tab"
import { ProjectsTab } from "@/features/user/profile/tabs/projects-tab"
import { GithubTab } from "@/features/user/profile/tabs/github-tab"
import { LeetcodeTab } from "@/features/user/profile/tabs/leetcode-tab"
import { ApplicationsTab } from "@/features/user/profile/tabs/applications-tab"
import { SettingsTab } from "@/features/user/profile/tabs/settings-tab"
import { DynamicProfileForm } from "@/components/features/profile/DynamicProfileForm"
import { UserProfile, Skill, Experience, Education, Project } from "@/types/profile"
import { userApi } from "@/lib/api/user-api"

import { Loader2, Edit, Save, X, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/context/auth-context"
import { toast } from "sonner"

// Fetch user profile using userApi (relational data aggregation)
const fetchUserProfile = async (): Promise<UserProfile> => {
    const response = await userApi.profile.get()
    
    if (!response || !response.profile) {
        throw new Error("Failed to load profile data")
    }

    const data = response
    const p = data.profile
    
    const nameParts = (p.full_name || "New User").split(" ")
    const firstName = nameParts[0]
    const lastName = nameParts.slice(1).join(" ") || ""

    // Map relational DB structure to frontend Profile structure
    return {
        id: p.user_id,
        basic: {
            firstName,
            lastName,
            email: p.email || "",
            phone: p.phone || "",
            bio: p.bio || "Add your bio...",
            location: p.location || "Remote",
            title: p.headline || "Developer",
            avatar: p.avatar_url || "",
            completion: p.completion_percent || 0,
            experienceLevel: p.experience_level || "Junior",
            jobType: p.job_type || "Full-time",
            languages: p.languages || [],
            joinDate: p.created_at ? new Date(p.created_at).toLocaleDateString() : ""
        },
        skills: (data.skills || []).map((s: any) => ({
            name: s.name,
            level: s.proficiency || "Intermediate",
            category: s.category,
            is_verified: s.verified
        })),
        experience: (data.experiences || []).map((e: any) => ({
            id: e.id,
            role: e.role,
            company: e.company_name,
            type: (e.type || "Full-time") as "Full-time" | "Part-time" | "Contract" | "Freelance",
            startDate: e.start_date,
            endDate: e.end_date || "Present",
            description: e.description
        })),
        education: (data.education || []).map((e: any) => ({
            id: e.id,
            institution: e.institution,
            degree: e.degree,
            year: e.end_date ? new Date(e.end_date).getFullYear().toString() : "",
            fieldOfStudy: e.field_of_study
        })),
        projects: (data.projects || []).map((p: any) => ({
            id: p.id,
            title: p.title,
            description: p.description,
            stack: p.stack || [],
            link: p.project_url,
            github: p.github_url
        })),
        github: { username: p.github_handle || "", repos: [] },
        leetcode: { username: "", totalSolved: 0, easy: 0, medium: 0, hard: 0, ranking: 0 },
        applications: [],
        settings: { 
            notifications: true, 
            visibility: p.visibility === "private" ? "Private" : "Public", 
            theme: "system" 
        },
        ai_scores: data.ai_scores
    }
}

export default function ProfilePage() {
    const { user } = useAuth()
    const [profileData, setProfileData] = useState<UserProfile | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const { data: userProfile, isLoading, refetch } = useQuery({
        queryKey: ["userProfile", user?.id],
        queryFn: fetchUserProfile,
        enabled: !!user?.id
    })

    // Sync query data to local state for editing
    if (userProfile && !profileData && !isLoading) {
        setProfileData(userProfile)
    }

    const handleSave = async () => {
        if (!user || !profileData) return
        
        setIsSaving(true)
        try {
            // Map frontend structure back to relational backend format
            const updatePayload = {
                profile: {
                    full_name: `${profileData.basic.firstName} ${profileData.basic.lastName}`,
                    bio: profileData.basic.bio,
                    location: profileData.basic.location,
                    headline: profileData.basic.title,
                    experience_level: profileData.basic.experienceLevel,
                    job_type: profileData.basic.jobType,
                    languages: profileData.basic.languages,
                    visibility: profileData.settings.visibility.toLowerCase()
                },
                skills: profileData.skills.map(s => ({
                    name: s.name,
                    proficiency: s.level,
                    category: s.category
                })),
                experiences: profileData.experience.map(e => ({
                    company_name: e.company,
                    role: e.role,
                    description: e.description,
                    start_date: e.startDate,
                    end_date: e.endDate === "Present" ? null : e.endDate
                })),
                projects: profileData.projects.map(p => ({
                    title: p.title,
                    description: p.description,
                    stack: p.stack,
                    project_url: p.link,
                    github_url: p.github
                })),
                education: profileData.education.map(e => ({
                    institution: e.institution,
                    degree: e.degree,
                    field_of_study: e.fieldOfStudy,
                    end_date: e.year // Approximation
                }))
            }

            const response = await userApi.profile.update(updatePayload)

            if (response.status === "error") throw new Error(response.message)
            
            toast.success("Profile synchronized with network!")
            setIsEditing(false)
            refetch() 
        } catch (error: any) {
            toast.error(`Sync failed: ${error.message}`)
        } finally {
            setIsSaving(false)
        }
    }

    // --- Handlers for Basic Info & Settings ---
    const handleUpdateBasicInfo = (field: string, value: string) => {
        if (!profileData) return
        setProfileData({
            ...profileData,
            basic: { ...profileData.basic, [field]: value }
        })
    }

    const handleUpdateSettings = (field: string, value: any) => {
        if (!profileData) return
        setProfileData({
            ...profileData,
            settings: { ...profileData.settings, [field]: value }
        })
    }

    // --- Handlers for Skills ---
    const handleAddSkill = (newSkill: Skill) => {
        if (!profileData) return
        setProfileData({
            ...profileData,
            skills: [...profileData.skills, newSkill]
        })
    }

    const handleDeleteSkill = (skillName: string) => {
        if (!profileData) return
        setProfileData({
            ...profileData,
            skills: profileData.skills.filter((s: any) => s.name !== skillName)
        })
    }

    // --- Handlers for Experience ---
    const handleAddExperience = () => {
        if (!profileData) return
        const newExp = {
            id: Math.random().toString(),
            role: "New Role",
            company: "New Company",
            logo: "",
            type: "Full-time",
            startDate: "2024",
            endDate: "Present",
            description: "Description..."
        }
        setProfileData({
            ...profileData,
            experience: [newExp, ...profileData.experience]
        })
    }

    const handleDeleteExperience = (id: string) => {
        if (!profileData) return
        setProfileData({
            ...profileData,
            experience: profileData.experience.filter((e: any) => e.id !== id)
        })
    }

    const handleUpdateExperience = (id: string, field: string, value: string) => {
        if (!profileData) return
        setProfileData({
            ...profileData,
            experience: profileData.experience.map((e: any) =>
                e.id === id ? { ...e, [field]: value } : e
            )
        })
    }

    // --- Handlers for Education ---
    const handleAddEducation = () => {
        if (!profileData) return
        const newEdu = {
            id: Math.random().toString(),
            institution: "New Institution",
            degree: "New Degree",
            year: "2024",
            grade: "A"
        }
        setProfileData({
            ...profileData,
            education: [newEdu, ...profileData.education]
        })
    }

    const handleDeleteEducation = (id: string) => {
        if (!profileData) return
        setProfileData({
            ...profileData,
            education: profileData.education.filter((e: any) => e.id !== id)
        })
    }

    const handleUpdateEducation = (id: string, field: string, value: string) => {
        if (!profileData) return
        setProfileData({
            ...profileData,
            education: profileData.education.map((e: any) =>
                e.id === id ? { ...e, [field]: value } : e
            )
        })
    }

    // --- Handlers for Projects ---
    const handleAddProject = () => {
        if (!profileData) return
        const newProj = {
            id: Math.random().toString(),
            title: "New Project",
            description: "Description...",
            stack: ["React"],
            link: "#",
            github: "#"
        }
        setProfileData({
            ...profileData,
            projects: [newProj, ...profileData.projects]
        })
    }

    const handleDeleteProject = (id: string) => {
        if (!profileData) return
        setProfileData({
            ...profileData,
            projects: profileData.projects.filter((p: any) => p.id !== id)
        })
    }

    const handleUpdateProject = (id: string, field: string, value: string) => {
        if (!profileData) return

        let processedValue: any = value
        if (field === "stack") {
            processedValue = value.split(",").map(s => s.trim()).filter(s => s.length > 0)
        }

        setProfileData({
            ...profileData,
            projects: profileData.projects.map((p: any) =>
                p.id === id ? { ...p, [field]: processedValue } : p
            )
        })
    }

    const handleUpdateGitHubUsername = (username: string) => {
        if (!profileData) return
        setProfileData({
            ...profileData,
            github: {
                ...profileData.github,
                username
            }
        })
    }


    const handleUpdateAvatar = (url: string) => {
        if (!profileData) return
        setProfileData({
            ...profileData,
            basic: {
                ...profileData.basic,
                avatar: url
            }
        })
    }

    const [isSaving, setIsSaving] = useState(false)

    const EditAction = () => (
        !isEditing ? (
            <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="bg-background">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
            </Button>
        ) : (
            <div className="flex gap-2">
                <Button onClick={handleSave} variant="default" size="sm" disabled={isSaving}>
                    {isSaving ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4 mr-2" />
                            Save
                        </>
                    )}
                </Button>
                <Button onClick={() => setIsEditing(false)} variant="ghost" size="sm" disabled={isSaving}>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                </Button>
            </div>
        )
    )

    if (isLoading || !userProfile) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    const activeData = profileData || userProfile

    return (
        <div className="space-y-12 max-w-7xl mx-auto pb-24 pt-16 px-4 md:px-8 relative overflow-hidden">
            <ProfileHeader
                user={activeData.basic}
                profileId={activeData.id}
                isEditing={isEditing}
                onUpdateAvatar={handleUpdateAvatar}
                action={<div className="hidden md:block"><EditAction /></div>}
            />

            {/* Mobile Edit Button - Visible only on small screens */}
            <div className="md:hidden">
                <div className="w-full">
                    <EditAction />
                </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-10">
                <div className="overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] glass p-2 rounded-[2rem] border-white/5">
                    <TabsList className="w-full justify-start h-auto p-1 bg-transparent border-none gap-2">
                        {[
                            { value: "overview", label: "Overview" },
                            { value: "basic", label: "Identity" },
                            { value: "skills", label: "Architecture" },
                            { value: "experience", label: "Proof of Work" },
                            { value: "education", label: "Credentials" },
                            { value: "projects", label: "Ledger" },
                            { value: "github", label: "Source" },
                            { value: "applications", label: "Nexus" },
                            { value: "matrix", label: "Matrix Profile", icon: Sparkles },
                            { value: "settings", label: "Protocol" }
                        ].map((tab) => (
                            <TabsTrigger 
                                key={tab.value} 
                                value={tab.value} 
                                className="rounded-2xl px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-none border border-transparent data-[state=active]:border-primary/20 hover:text-primary"
                            >
                                {tab.icon && <tab.icon className="w-3.5 h-3.5 mr-2" />}
                                {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                <div className="min-h-[600px]">
                    <TabsContent value="overview" className="animate-in fade-in-50 duration-500">
                        <OverviewTab data={activeData} isEditing={isEditing} onUpdateBio={(bio) => handleUpdateBasicInfo('bio', bio)} />
                    </TabsContent>
                    <TabsContent value="basic" className="animate-in fade-in-50 duration-500">
                        <BasicInfoTab data={activeData} isEditing={isEditing} onUpdate={handleUpdateBasicInfo} />
                    </TabsContent>
                    <TabsContent value="skills" className="animate-in fade-in-50 duration-500">
                        <SkillsTab
                            data={activeData}
                            isEditing={isEditing}
                            onAddSkill={handleAddSkill}
                            onDeleteSkill={handleDeleteSkill}
                        />
                    </TabsContent>
                    <TabsContent value="experience" className="animate-in fade-in-50 duration-500">
                        <ExperienceTab
                            data={activeData}
                            isEditing={isEditing}
                            onAdd={handleAddExperience}
                            onDelete={handleDeleteExperience}
                            onUpdate={handleUpdateExperience}
                        />
                    </TabsContent>
                    <TabsContent value="education" className="animate-in fade-in-50 duration-500">
                        <EducationTab
                            data={activeData}
                            isEditing={isEditing}
                            onAdd={handleAddEducation}
                            onDelete={handleDeleteEducation}
                            onUpdate={handleUpdateEducation}
                        />
                    </TabsContent>
                    <TabsContent value="projects" className="animate-in fade-in-50 duration-500">
                        <ProjectsTab
                            data={activeData}
                            isEditing={isEditing}
                            onAdd={handleAddProject}
                            onDelete={handleDeleteProject}
                            onUpdate={handleUpdateProject}
                        />
                    </TabsContent>
                    <TabsContent value="github" className="animate-in fade-in-50 duration-500">
                        <GithubTab
                            data={activeData}
                            isEditing={isEditing}
                            onUpdate={handleUpdateGitHubUsername}
                        />
                    </TabsContent>
                    <TabsContent value="applications" className="animate-in fade-in-50 duration-500">
                        <ApplicationsTab data={activeData} />
                    </TabsContent>
                    <TabsContent value="matrix" className="animate-in fade-in-50 duration-500">
                        <div className="glass rounded-[3rem] p-8 md:p-16 border-white/5 shadow-2xl">
                             <DynamicProfileForm />
                        </div>
                    </TabsContent>
                    <TabsContent value="settings" className="animate-in fade-in-50 duration-500">
                        <SettingsTab data={activeData} onUpdateSettings={handleUpdateSettings} />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    )
    // NOTE: This large replacement might fail if I'm not careful. I'll just replace the relevant parts.
    // I need to:
    // 1. Insert `profileData` state.
    // 2. Insert handlers.
    // 3. Update the JSX to use `activeData` and pass props.

}
