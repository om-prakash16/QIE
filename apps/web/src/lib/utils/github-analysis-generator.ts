import { GithubRepo } from "../mock-api/github-data";
import { GithubAnalysisReport } from "../mock-api/github-analysis";

export const generateAnalysisReport = (repos: GithubRepo[]): GithubAnalysisReport => {
    // 1. Calculate Language Frequency
    const langMap: Record<string, number> = {};
    let totalStars = 0;

    repos.forEach(repo => {
        if (repo.language && repo.language !== "Unknown") {
            langMap[repo.language] = (langMap[repo.language] || 0) + 1;
        }
        totalStars += repo.stars;
    });

    const topLangs = Object.entries(langMap)
        .sort(([, a], [, b]) => b - a)
        .map(([lang]) => lang);

    const primaryLang = topLangs[0] || "Generalist";
    const secondaryLang = topLangs[1];

    // 2. Determine Role Fit
    let role = "Software Engineer";
    if (primaryLang === "TypeScript" || primaryLang === "JavaScript") {
        role = secondaryLang === "Python" || secondaryLang === "Go" ? "Full-Stack Engineer" : "Frontend Engineer";
    } else if (primaryLang === "Python") {
        role = "Backend / AI Engineer";
    } else if (primaryLang === "Go" || primaryLang === "Rust") {
        role = "Systems Engineer";
    } else if (primaryLang === "Swift" || primaryLang === "Kotlin") {
        role = "Mobile Engineer";
    }

    // 3. Generate Executive Summary
    const summary = `A productive ${role} with a strong focus on ${primaryLang}${secondaryLang ? ` and ${secondaryLang}` : ''}. The portfolio demonstrates consistent activity with ${repos.length} repositories and ${totalStars} total stars, indicating ${totalStars > 100 ? "high community engagement" : "a growing presence"}. Projects range from experimental prototypes to likely production-grade tools.`;

    // 4. Generate Strengths
    const strengths = topLangs.slice(0, 5).map(lang =>
        lang === "TypeScript" ? "Modern Web Architecture (TypeScript, React)" :
            lang === "Python" ? "Data Processing & Scripting (Python)" :
                lang === "Go" ? "High-Performance Backend Systems (Go)" :
                    lang === "Rust" ? "Systems Programming (Rust)" :
                        `${lang} Development`
    );

    if (totalStars > 500) strengths.push("Open Source Community Leadership");

    return {
        executiveSummary: summary,
        technicalStrengths: strengths,
        architectureSignals: [
            {
                label: "Primary Stack",
                value: primaryLang,
                description: `Dominant language across ${langMap[primaryLang] || 0} repositories.`
            },
            {
                label: "Versatility",
                value: topLangs.length > 3 ? "Polyglot" : "Specialist",
                description: topLangs.length > 3 ? "Evidence of adaptability across multiple ecosystems." : "Deep focus on a core technology stack."
            },
            {
                label: "Activity",
                value: "Consistent",
                description: `Steady output of ${repos.length} projects over time.`
            }
        ],
        roleFit: {
            bestFitRole: role,
            seniority: totalStars > 1000 ? "Senior / Staff" : repos.length > 20 ? "Mid-Senior" : "Junior-Mid",
            environment: "Fast-paced startups or Product-focused teams."
        },
        notableProjects: [], // We can fill this if needed, but UI doesn't strictly use it yet
        growthRecommendations: [
            `Deepen expertise in ${primaryLang} advanced patterns to reach expert status.`,
            secondaryLang ? `Formalize ${secondaryLang} projects into a cohesive full-stack portfolio.` : `Explore a complementary language like Python or Go to broaden backend chops.`,
            "Document architectural decisions in READMEs to showcase system design skills."
        ]
    };
}
