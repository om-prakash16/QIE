import { redirect } from "next/navigation"

// Legacy route — consolidated under /user/applications per industry standards
export default function ApplicationsRedirect() {
    redirect("/user/applications")
}
