import { 
    ActionGetResponse, 
    ActionPostResponse, 
    ActionPostRequest,
    ACTIONS_CORS_HEADERS, 
    createPostResponse 
} from "@solana/actions"
import { 
    Connection, 
    PublicKey, 
    Transaction, 
    SystemProgram, 
    clusterApiUrl 
} from "@solana/web3.js"
import { supabase } from "@/lib/supabaseClient"

export const GET = async (req: Request, { params }: { params: { id: string } }) => {
    try {
        const jobId = params.id
        const { data: job, error } = await supabase
            .from('jobs')
            .select('*')
            .eq('id', jobId)
            .single()

        if (error || !job) {
            return new Response("Job protocol not found", { status: 404, headers: ACTIONS_CORS_HEADERS })
        }

        const payload: ActionGetResponse = {
            icon: "https://skillsutra.vercel.app/og-image.png", // Placeholder
            title: `Apply: ${job.title}`,
            description: `Verify your skills and apply for the ${job.title} position at ${job.company_name} directly from Twitter.`,
            label: "Apply Now",
            links: {
                actions: [
                    {
                        label: "Verify & Apply",
                        href: `/api/actions/jobs/${jobId}`,
                    }
                ]
            }
        }

        return Response.json(payload, { headers: ACTIONS_CORS_HEADERS })
    } catch (err) {
        return new Response("Internal configuration error", { status: 500, headers: ACTIONS_CORS_HEADERS })
    }
}

export const OPTIONS = GET;

export const POST = async (req: Request, { params }: { params: { id: string } }) => {
    try {
        const jobId = params.id
        const body: ActionPostRequest = await req.json()

        let account: PublicKey
        try {
            account = new PublicKey(body.account)
        } catch (err) {
            return new Response("Invalid account format", { status: 400, headers: ACTIONS_CORS_HEADERS })
        }

        const connection = new Connection(clusterApiUrl("devnet"))
        
        // --- Transaction logic would go here ---
        // For the hackathon MVP, we'll create a simple 'memo' or transfer to show the link
        // In production, this would call the 'apply_for_job' instruction on our Anchor program
        
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: account,
                toPubkey: account, // Self-transfer as proof of intent for now
                lamports: 0,
            })
        )

        transaction.feePayer = account
        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash

        const payload: ActionPostResponse = await createPostResponse({
            fields: {
                transaction,
                message: `Application for '${jobId}' submitted to Skillsutra Network.`,
            },
        })

        return Response.json(payload, { headers: ACTIONS_CORS_HEADERS })
    } catch (err) {
        return new Response("Transmission failure", { status: 500, headers: ACTIONS_CORS_HEADERS })
    }
}
