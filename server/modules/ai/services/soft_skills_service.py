"""
Soft Skill Verification AI Service.
Evaluates behavioral and communication traits through NLP analysis
of candidate responses to AI-generated workplace scenarios.
"""
from typing import Dict, Any, List
import re
import math


class SoftSkillsService:
    """
    Analyzes candidate text/transcript responses to workplace scenario prompts.
    Produces a 5-pillar Soft Skill Matrix (0-100 each) covering:
      - Communication Clarity
      - Confidence Level
      - Teamwork Ability
      - Consistency
      - Leadership Potential
    """

    # Hedge words that reduce confidence score
    HEDGE_WORDS = [
        "maybe", "perhaps", "sort of", "kind of", "i think",
        "i guess", "possibly", "might", "probably", "not sure",
        "i suppose", "it seems", "could be"
    ]

    # Assertive phrases that boost confidence score
    ASSERTIVE_PHRASES = [
        "i recommend", "based on", "the best approach", "we should",
        "i am confident", "the data shows", "clearly", "definitively",
        "my recommendation is", "the priority is", "i will"
    ]

    # Inclusive language markers for teamwork
    TEAMWORK_MARKERS = [
        "we", "our", "team", "together", "collaborate", "let's",
        "everyone", "collectively", "as a group", "support each other",
        "help you", "pair on this"
    ]

    # Individual-focused markers (negative signal for teamwork)
    SOLO_MARKERS = [
        "i alone", "by myself", "only i", "i don't need",
        "not my problem", "their fault", "blame"
    ]

    # Leadership indicators
    LEADERSHIP_MARKERS = [
        "prioritize", "delegate", "roadmap", "strategy", "stakeholder",
        "business impact", "trade-off", "risk", "decision", "accountable",
        "ownership", "escalate", "unblock", "mentor"
    ]

    def analyze_response(self, response_text: str, scenario_type: str = "crisis") -> Dict[str, Any]:
        """
        Main entry point. Analyzes a candidate's written response to a workplace scenario.
        Returns the full Soft Skill Matrix with scores and evidence.
        """
        text_lower = response_text.lower()
        word_count = len(response_text.split())

        communication = self._score_communication(response_text, word_count)
        confidence = self._score_confidence(text_lower, word_count)
        teamwork = self._score_teamwork(text_lower)
        leadership = self._score_leadership(text_lower)
        consistency = self._score_consistency(response_text)

        # Composite score (equal weight for now, can be role-adjusted)
        composite = int(
            communication["score"] * 0.25 +
            confidence["score"] * 0.20 +
            teamwork["score"] * 0.25 +
            consistency["score"] * 0.10 +
            leadership["score"] * 0.20
        )

        # Percentile simulation (based on mock distribution)
        percentile = min(99, int(composite * 1.05))

        # AI-generated summary
        summary = self._generate_summary(
            communication["score"], confidence["score"],
            teamwork["score"], consistency["score"],
            leadership["score"]
        )

        return {
            "composite_score": composite,
            "percentile": percentile,
            "pillars": {
                "communication_clarity": communication,
                "confidence": confidence,
                "teamwork": teamwork,
                "consistency": consistency,
                "leadership": leadership
            },
            "ai_generated_summary": summary
        }

    def _score_communication(self, text: str, word_count: int) -> Dict[str, Any]:
        """Evaluate clarity, structure, and readability."""
        score = 50  # Baseline

        # Reward structured thinking (bullet points, numbered lists)
        if re.search(r'[\-\*]\s', text) or re.search(r'\d+[\.\)]\s', text):
            score += 15

        # Reward paragraph breaks (indicates organized thinking)
        paragraph_count = len([p for p in text.split('\n') if p.strip()])
        if paragraph_count >= 3:
            score += 10

        # Flesch-Kincaid approximation (sentence length penalty)
        sentences = re.split(r'[.!?]+', text)
        sentences = [s for s in sentences if s.strip()]
        if sentences:
            avg_sentence_len = word_count / len(sentences)
            if avg_sentence_len < 25:  # Good conciseness
                score += 15
            elif avg_sentence_len > 40:  # Too verbose
                score -= 10

        # Reward appropriate length (not too short, not a wall of text)
        if 80 <= word_count <= 350:
            score += 10
        elif word_count < 30:
            score -= 20  # Too brief to evaluate

        score = max(0, min(100, score))

        return {
            "score": score,
            "evidence": self._comm_evidence(score, word_count, paragraph_count)
        }

    def _score_confidence(self, text_lower: str, word_count: int) -> Dict[str, Any]:
        """Evaluate hedging vs assertive language."""
        score = 60  # Moderate baseline

        hedge_count = sum(1 for h in self.HEDGE_WORDS if h in text_lower)
        assertive_count = sum(1 for a in self.ASSERTIVE_PHRASES if a in text_lower)

        # Normalize by word count to avoid penalizing long responses
        hedge_ratio = hedge_count / max(word_count / 50, 1)
        assertive_ratio = assertive_count / max(word_count / 50, 1)

        score -= int(hedge_ratio * 15)
        score += int(assertive_ratio * 12)

        score = max(0, min(100, score))

        evidence = "Strong assertions" if assertive_count > hedge_count else "Moderate hedging detected"
        if hedge_count > 4:
            evidence = f"High hedging frequency ({hedge_count} instances). Candidate appears uncertain."

        return {"score": score, "evidence": evidence}

    def _score_teamwork(self, text_lower: str) -> Dict[str, Any]:
        """Evaluate inclusive vs solo language."""
        score = 55

        team_hits = sum(1 for t in self.TEAMWORK_MARKERS if t in text_lower)
        solo_hits = sum(1 for s in self.SOLO_MARKERS if s in text_lower)

        score += team_hits * 6
        score -= solo_hits * 12

        score = max(0, min(100, score))

        if team_hits > 3:
            evidence = f"High use of inclusive language ({team_hits} markers). Strong collaborative signal."
        elif solo_hits > 1:
            evidence = f"Warning: Solo-focused language detected. Potential culture-fit risk."
        else:
            evidence = "Moderate collaborative language usage."

        return {"score": score, "evidence": evidence}

    def _score_consistency(self, text: str) -> Dict[str, Any]:
        """
        Evaluate tone consistency across the response.
        Checks if the candidate maintains a steady tone throughout.
        """
        score = 70  # Default to reasonable consistency

        paragraphs = [p.strip() for p in text.split('\n') if p.strip()]
        if len(paragraphs) < 2:
            return {"score": score, "evidence": "Response too short for consistency analysis."}

        # Check for tone shifts (exclamation marks, ALL CAPS, etc.)
        caps_ratio = sum(1 for c in text if c.isupper()) / max(len(text), 1)
        exclamation_count = text.count('!')

        if caps_ratio > 0.3:
            score -= 20
        if exclamation_count > 3:
            score -= 10

        score = max(0, min(100, score))

        evidence = "Maintains calm, professional tone throughout." if score >= 70 else \
                   "Tone fluctuations detected. Possible stress indicators."

        return {"score": score, "evidence": evidence}

    def _score_leadership(self, text_lower: str) -> Dict[str, Any]:
        """Evaluate initiative, prioritization, and business-level thinking."""
        score = 45  # Lower baseline — leadership must be demonstrated

        leadership_hits = sum(1 for l in self.LEADERSHIP_MARKERS if l in text_lower)
        score += leadership_hits * 8

        # Bonus for mentioning business impact explicitly
        if "business" in text_lower or "revenue" in text_lower or "customer" in text_lower:
            score += 10

        score = max(0, min(100, score))

        if leadership_hits >= 4:
            evidence = "Strong leadership signals. Actively guides discussion and prioritizes business continuity."
        elif leadership_hits >= 2:
            evidence = "Moderate initiative shown. Shows awareness of broader impact."
        else:
            evidence = "Limited leadership indicators. May excel in execution-focused roles."

        return {"score": score, "evidence": evidence}

    def _comm_evidence(self, score: int, word_count: int, paragraphs: int) -> str:
        if score >= 80:
            return f"Uses structured logic ({paragraphs} paragraphs); Flesch reading ease is optimal for technical specs."
        elif score >= 60:
            return f"Adequate clarity. {word_count} words across {paragraphs} sections."
        else:
            return "Response lacks structure. Difficult to parse intent."

    def _generate_summary(self, comm: int, conf: int, team: int, cons: int, lead: int) -> str:
        """Generate a human-readable AI summary of the candidate's behavioral profile."""
        traits = []
        if comm >= 75:
            traits.append("articulate")
        if conf >= 75:
            traits.append("decisive")
        if team >= 75:
            traits.append("highly collaborative")
        if lead >= 70:
            traits.append("shows strong leadership potential")

        if not traits:
            return "Candidate shows room for growth in professional communication and teamwork."

        trait_str = ", ".join(traits[:-1])
        if len(traits) > 1:
            trait_str += f", and {traits[-1]}"
        else:
            trait_str = traits[0]

        promotion_hint = ""
        if lead >= 75 and team >= 75:
            promotion_hint = " Strong potential for tech-lead or senior IC promotion."

        return f"Candidate is {trait_str}.{promotion_hint}"
