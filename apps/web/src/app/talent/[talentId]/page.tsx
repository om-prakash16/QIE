"use client"

import { use } from "react"

import { useQuery } from "@tanstack/react-query"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PublicProfileHeader } from "@/components/features/user/profile/public-profile-header"
import { OverviewTab } from "@/components/features/user/profile/tabs/overview-tab"
import { SkillsTab } from "@/components/features/user/profile/tabs/skills-tab"
import { ExperienceTab } from "@/components/features/user/profile/tabs/experience-tab"
import { EducationTab } from "@/components/features/user/profile/tabs/education-tab"
import { ProjectsTab } from "@/components/features/user/profile/tabs/projects-tab"
import { GithubTab } from "@/components/features/user/profile/tabs/github-tab"
import { LeetcodeTab } from "@/components/features/user/profile/tabs/leetcode-tab"
import { USER_PROFILE, UserProfile } from "@/lib/mock-api/user-profile"
import { TALENT_DATA } from "@/lib/mock-api/talent"
import { Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { notFound } from "next/navigation"

// Mock fetch function that simulates getting a specific user by ID
const fetchTalentProfileById = async (id: string): Promise<UserProfile | null> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600))

    // Find basic info from the talent list
    const basicUser = TALENT_DATA.find(u => u.id === id)

    if (!basicUser) return null

    // Merge rich profile data with the specific user's basic info
    // This allows us to use the detailed structure of USER_PROFILE but customizable basic details
    return {
        ...USER_PROFILE,
        basic: {
            ...USER_PROFILE.basic,
            firstName: basicUser.name.split(" ")[0],
            lastName: basicUser.name.split(" ").slice(1).join(" "),
            title: basicUser.title, // Use title from Talent
            location: basicUser.location,
            avatar: basicUser.avatar,
            experienceLevel: basicUser.experienceLevel, // Use experienceLevel
            completion: basicUser.completion // Use completion
        }
    }
}

export default function TalentProfilePage({ params }: { params: Promise<{ talentId: string }> }) {
    const { talentId } = use(params)
    const { data: userProfile, isLoading, isError } = useQuery({
        queryKey: ["talentProfile", talentId],
        queryFn: () => fetchTalentProfileById(talentId),
    })

    if (isLoading) {
        return (
            <div className="flex h-[calc(100vh-200px)] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!userProfile) {
        return notFound()
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-12 pt-8 px-4">
            <div>
                <Link href="/talent">
                    <Button variant="ghost" size="sm" className="mb-4 pl-0 hover:pl-0 hover:bg-transparent text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Talent
                    </Button>
                </Link>
                <PublicProfileHeader user={userProfile.basic} />
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
                <div className="overflow-x-auto pb-2 scrollbar-hide">
                    <TabsList className="w-full justify-start h-auto p-1 bg-transparent border-b rounded-none gap-2">
                        <TabsTrigger value="overview" className="rounded-full px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-none border border-transparent data-[state=active]:border-primary">Overview</TabsTrigger>
                        <TabsTrigger value="skills" className="rounded-full px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-none border border-transparent data-[state=active]:border-primary">Skills</TabsTrigger>
                        <TabsTrigger value="experience" className="rounded-full px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-none border border-transparent data-[state=active]:border-primary">Experience</TabsTrigger>
                        <TabsTrigger value="education" className="rounded-full px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-none border border-transparent data-[state=active]:border-primary">Education</TabsTrigger>
                        <TabsTrigger value="projects" className="rounded-full px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-none border border-transparent data-[state=active]:border-primary">Projects</TabsTrigger>
                        <TabsTrigger value="github" className="rounded-full px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-none border border-transparent data-[state=active]:border-primary">GitHub</TabsTrigger>
                        <TabsTrigger value="leetcode" className="rounded-full px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-none border border-transparent data-[state=active]:border-primary">LeetCode</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="overview" className="animate-in fade-in-50 duration-300">
                    <OverviewTab data={userProfile} />
                </TabsContent>
                <TabsContent value="skills" className="animate-in fade-in-50 duration-300">
                    <SkillsTab data={userProfile} />
                </TabsContent>
                <TabsContent value="experience" className="animate-in fade-in-50 duration-300">
                    <ExperienceTab data={userProfile} />
                </TabsContent>
                <TabsContent value="education" className="animate-in fade-in-50 duration-300">
                    <EducationTab data={userProfile} />
                </TabsContent>
                <TabsContent value="projects" className="animate-in fade-in-50 duration-300">
                    <ProjectsTab data={userProfile} />
                </TabsContent>
                <TabsContent value="github" className="animate-in fade-in-50 duration-300">
                    <GithubTab data={userProfile} />
                </TabsContent>
                <TabsContent value="leetcode" className="animate-in fade-in-50 duration-300">
                    <LeetcodeTab data={userProfile} />
                </TabsContent>
            </Tabs>
        </div>
    )
}
