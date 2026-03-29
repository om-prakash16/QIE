import EscrowButton from "@/components/features/bounty/EscrowButton";
import { Badge } from "@/components/ui/badge";

const MOCK_BOUNTIES = [
    { id: "bty_1", title: "Refactor Rust Anchor Contract", employer: "0xDefi...", reward: 2.5, skill: "Rust" },
    { id: "bty_2", title: "Build Next.js Landing Page", employer: "0xWeb3...", reward: 0.8, skill: "React" },
    { id: "bty_3", title: "Write Pytest Suite for FastAPI", employer: "0xAiLabs...", reward: 1.2, skill: "Python" }
]

export default function BountyBoard() {
  return (
    <div className="container mx-auto py-12 px-4 mt-16">
      <div className="max-w-5xl mx-auto">
        
        <div className="mb-10 text-center">
            <h1 className="text-5xl font-bold font-heading">Decentralized Micro-Jobs</h1>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                Employers lock SOL in a trustless smart contract. Freelancers complete the tasks to instantly trigger algorithmic payouts. Zero platform fees.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOCK_BOUNTIES.map(bounty => (
                <div key={bounty.id} className="p-6 border rounded-2xl shadow-sm space-y-4 hover:shadow-md transition-shadow bg-card">
                    <div className="flex justify-between items-start">
                        <Badge variant="secondary">{bounty.skill}</Badge>
                        <span className="text-sm font-mono text-muted-foreground">{bounty.employer}</span>
                    </div>
                    <h3 className="text-lg font-semibold">{bounty.title}</h3>
                    <div className="pt-4 border-t">
                        <EscrowButton amount={bounty.reward} bountyId={bounty.id} />
                    </div>
                </div>
            ))}
        </div>

      </div>
    </div>
  );
}
