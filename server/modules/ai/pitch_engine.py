import os
from typing import Optional, Dict
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate

class PitchEngine:
    """
    AI Career Pitch Engine
    
    Generates a full, structured startup pitch for the AI Career Operating System.
    Includes methods to generate or refine individual sections and compile a full pitch.
    """

    def __init__(self):
        self.api_key = os.getenv("GOOGLE_API_KEY")
        self.llm = (
            ChatGoogleGenerativeAI(
                temperature=0.7, google_api_key=self.api_key, model="gemini-1.5-flash"
            )
            if self.api_key
            else None
        )
        self.context = {
            "product_name": "Best Hiring Tool"
        }

    async def _refine_or_generate(self, existing_text: Optional[str], default_content: str, section_name: str) -> str:
        """
        Uses Gemini to refine the pitch section based on existing user input.
        """
        if not self.llm:
            return default_content

        prompt = PromptTemplate(
            template="""You are a world-class startup pitch coach. 
            Refine the following {section_name} section for a hiring platform called 'Best Hiring Tool'.
            
            Base Content:
            {default_content}
            
            User's Specific Context/Input:
            {existing_text}
            
            Make it professional, punchy, and high-impact. Return only the refined text.
            """,
            input_variables=["section_name", "default_content", "existing_text"],
        )

        try:
            formatted_prompt = prompt.format(
                section_name=section_name,
                default_content=default_content,
                existing_text=existing_text or "No specific context provided."
            )
            response = self.llm.invoke(formatted_prompt)
            return response.content.strip()
        except Exception as e:
            print(f"Pitch Refinement Error: {e}")
            return default_content

    async def generate_problem(self, existing_text: Optional[str] = None) -> str:
        content = (
            "1️⃣ PROBLEM\n"
            "---------------------------------\n"
            "“Hiring is broken because we trust resumes, not real skills.”\n\n"
            "👨‍💻 Candidates Problems:\n"
            "- ATS rejection due to keyword mismatch\n"
            "- No proof of real skills before the interview stage\n\n"
            "🏢 Companies Problems:\n"
            "- Too many irrelevant/fake applications\n"
            "- Bad hires increase cost and reduce team velocity\n\n"
            "🧑‍💼 Recruiters Problems:\n"
            "- Manual resume filtering is time-consuming and subjective\n"
            "- Biased or inefficient decisions\n\n"
            "“The real problem is the absence of a trusted skill verification layer in hiring.”"
        )
        return await self._refine_or_generate(existing_text, content, "Problem")

    async def generate_idea(self, existing_text: Optional[str] = None) -> str:
        content = (
            "2️⃣ IDEA\n"
            "---------------------------------\n"
            "“We convert resume-based hiring into skill-based verified hiring.”\n\n"
            "- AI-based skill validation to measure real capability\n"
            "- Replace resumes with verified skill profiles\n"
            "- Skill-first matching instead of keyword heuristics"
        )
        return await self._refine_or_generate(existing_text, content, "Idea")

    async def generate_solution(self, existing_text: Optional[str] = None) -> str:
        content = (
            "3️⃣ SOLUTION\n"
            "---------------------------------\n"
            "“We analyze real work → generate Proof Score → match jobs → verify candidates.”\n\n"
            "🔍 Pipeline:\n"
            "1. AI project analysis: Analyzes code, repos, and work samples.\n"
            "2. Proof Score: Generates a dynamic trust score based on skill depth.\n"
            "3. Job matching: Maps candidates to jobs using semantic skill intelligence.\n"
            "4. AI interview questions: Auto-generates personalized questions based on real work.\n"
            "5. Verification: Anti-cheating layer to ensure authenticity.\n\n"
            "⚡ Formula:\n"
            "AI → Proof Score → Match → Questions → Hire"
        )
        return await self._refine_or_generate(existing_text, content, "Solution")

    async def generate_features(self, existing_text: Optional[str] = None) -> str:
        content = (
            "4️⃣ FEATURES\n"
            "---------------------------------\n"
            "🔹 Core (Hiring Engine):\n"
            "1. AI Skill Analysis\n"
            "2. Proof Score\n"
            "3. Smart Job Matching\n"
            "4. AI Interview Questions\n"
            "5. GitHub Verification\n\n"
            "🔹 Advanced (Big Vision):\n"
            "1. Career Planning\n"
            "2. Skill Gap Analysis\n"
            "3. Public/Private Profiles\n"
            "4. Community & Learning\n"
            "5. Blockchain Verification\n\n"
            "“5 core + 5 advanced = full system.”"
        )
        return await self._refine_or_generate(existing_text, content, "Features")

    async def generate_flow(self, existing_text: Optional[str] = None) -> str:
        content = (
            "5️⃣ FLOW\n"
            "---------------------------------\n"
            "“From profile to hiring decision in seconds.”\n\n"
            "Steps:\n"
            "Profile → AI Analysis → Proof Score → Job Match → Questions → Hiring"
        )
        return await self._refine_or_generate(existing_text, content, "Flow")

    async def generate_impact_vision(self, existing_text: Optional[str] = None) -> str:
        content = (
            "6️⃣ IMPACT + VISION\n"
            "---------------------------------\n"
            "🎯 Impact:\n"
            "- Candidates → Get a fair chance based on real skills\n"
            "- Companies → Hire better, faster, and with confidence\n"
            "- Recruiters → Save hours of manual filtering\n\n"
            "“This is not just a hiring tool — it’s a Career Operating System.”"
        )
        return await self._refine_or_generate(existing_text, content, "Impact & Vision")

    async def generate_final(self, existing_text: Optional[str] = None) -> str:
        content = (
            "7️⃣ FINAL LINE + MEMORY\n"
            "---------------------------------\n"
            "🔥 Final Line:\n"
            "“Hiring should not be based on keywords…\n"
            "it should be based on proof.”\n\n"
            "🧠 Memory Hack:\n"
            "P I S F F V\n"
            "Problem\n"
            "Idea\n"
            "Solution\n"
            "Features\n"
            "Flow\n"
            "Vision"
        )
        return await self._refine_or_generate(existing_text, content, "Closing")

    async def generate_full_pitch(self, existing_sections: Optional[Dict[str, str]] = None) -> Dict[str, str]:
        """
        Compiles the complete pitch, allowing selective inclusion of existing texts.
        """
        e = existing_sections or {}
        
        problem = await self.generate_problem(e.get("problem"))
        idea = await self.generate_idea(e.get("idea"))
        solution = await self.generate_solution(e.get("solution"))
        features = await self.generate_features(e.get("features"))
        flow = await self.generate_flow(e.get("flow"))
        impact_vision = await self.generate_impact_vision(e.get("impact_vision"))
        final = await self.generate_final(e.get("final"))

        full_pitch_text = "\n\n=================================\n\n".join([
            problem, idea, solution, features, flow, impact_vision, final
        ])

        return {
            "problem": problem,
            "idea": idea,
            "solution": solution,
            "features": features,
            "flow": flow,
            "impact_vision": impact_vision,
            "final": final,
            "full_pitch": full_pitch_text
        }

    async def export_as_markdown(self, filename: str = "pitch_deck_script.md", existing_sections: Optional[Dict] = None):
        """
        Exports the entire generated pitch into a cleanly formatted markdown file.
        """
        pitch_data = await self.generate_full_pitch(existing_sections)
        with open(filename, "w", encoding="utf-8") as f:
            f.write("# AI Career Operating System — Pitch Script\n\n")
            f.write(pitch_data["full_pitch"])
        return filename


# ==========================================
# CLI Usage Example
# ==========================================
if __name__ == "__main__":
    import json
    
    engine = PitchEngine()
    
    # Generate the payload
    pitch_data = engine.generate_full_pitch()
    
    # Save the markdown export
    output_file = engine.export_as_markdown()
    print(f"✅ Marked down script exported to: {output_file}")
    
    # Print a JSON summary showing it meets the output spec
    print("\n📦 Structured Output (JSON Example):")
    print(json.dumps({k: v[:50] + "..." for k, v in pitch_data.items() if k != 'full_pitch'}, indent=2))


pitch_engine = PitchEngine()
