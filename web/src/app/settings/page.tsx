import { redirect } from "next/navigation"

// Legacy route — consolidated under /user/settings per industry standards
export default function SettingsRedirect() {
    redirect("/user/settings")
}
