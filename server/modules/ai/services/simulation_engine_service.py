"""
Real Work Simulation Engine Service.
Generates role-specific micro-projects from job descriptions,
and evaluates submissions across 5 quality dimensions.
"""
from typing import Dict, Any, List
import uuid
import hashlib


class SimulationEngineService:

    # Task templates mapped to detected role keywords
    TASK_TEMPLATES = {
        "backend": {
            "title": "Build a REST API Endpoint",
            "description": "Create a FastAPI/Express endpoint that accepts a JSON payload of user registration data, validates all fields (name, email, password strength), hashes the password, and returns a mocked JWT token. Include proper error handling and rate-limiting middleware.",
            "boilerplate": "A starter project with FastAPI installed, a blank `main.py`, and `requirements.txt`.",
            "time_limit_minutes": 60,
            "acceptance_criteria": [
                "POST /register endpoint accepts JSON body",
                "Validates email format and password strength (8+ chars, 1 number)",
                "Returns structured JSON with access_token on success",
                "Returns 422 with clear error messages on invalid input",
                "Includes at least one middleware (rate-limit or logging)"
            ]
        },
        "frontend": {
            "title": "Create a Responsive Dashboard Card",
            "description": "Build a React functional component for a 'Stats Dashboard Card' that displays a metric title, value, percentage change indicator (up/down arrow with color), and a mini sparkline chart. Must be fully responsive (mobile-first) and use CSS animations for the percentage change.",
            "boilerplate": "A Vite + React + TypeScript starter with Tailwind CSS pre-configured.",
            "time_limit_minutes": 60,
            "acceptance_criteria": [
                "Component renders title, value, and percentage change",
                "Green arrow for positive change, red for negative",
                "Responsive: stacks vertically on mobile, horizontal on desktop",
                "Smooth CSS animation on mount",
                "Props are fully typed with TypeScript interfaces"
            ]
        },
        "data_science": {
            "title": "Analyze User Engagement Dataset",
            "description": "Given a CSV of 10,000 rows of user engagement data (user_id, session_duration, pages_viewed, signup_source, churned), write a Python script using Pandas to: clean missing values, identify the top 3 features correlating with churn, and output a summary report with visualizations.",
            "boilerplate": "A Jupyter-compatible Python environment with Pandas, Matplotlib, and Seaborn installed. Mock CSV provided.",
            "time_limit_minutes": 90,
            "acceptance_criteria": [
                "Missing values are handled (not just dropped)",
                "Correlation matrix is computed correctly",
                "Top 3 churn-correlating features are identified with reasoning",
                "At least 2 visualizations (bar chart + heatmap)",
                "Summary report is written in markdown or print statements"
            ]
        },
        "smart_contract": {
            "title": "Build a Token Vesting Contract",
            "description": "Write a Solana smart contract (using Anchor) that implements a basic token vesting schedule: an admin deposits tokens, and a beneficiary can claim them linearly over 12 months. Include proper PDA derivation and access control.",
            "boilerplate": "An Anchor workspace with a blank `lib.rs` and test scaffold.",
            "time_limit_minutes": 90,
            "acceptance_criteria": [
                "Admin can initialize vesting with amount and duration",
                "Beneficiary can claim proportional tokens based on elapsed time",
                "Cannot claim more than vested amount",
                "Uses PDA for the vault account",
                "Includes at least 2 unit tests"
            ]
        },
        "devops": {
            "title": "Containerize and Deploy a Microservice",
            "description": "Write a Dockerfile for a Node.js Express API, create a docker-compose.yml that includes the API and a PostgreSQL database, and write a health-check script. The API should connect to the database on startup.",
            "boilerplate": "A basic Express app with a `/health` endpoint and a `package.json`.",
            "time_limit_minutes": 45,
            "acceptance_criteria": [
                "Dockerfile uses multi-stage build for minimal image size",
                "docker-compose.yml defines api and db services with networking",
                "Environment variables are properly externalized",
                "Health check endpoint returns DB connection status",
                "Container starts successfully with `docker-compose up`"
            ]
        }
    }

    def detect_role_from_job(self, job_title: str, job_description: str, required_skills: List[str]) -> str:
        """Detect the primary role category from the job posting."""
        combined = f"{job_title} {job_description} {' '.join(required_skills)}".lower()

        if any(kw in combined for kw in ["solana", "anchor", "smart contract", "blockchain", "web3"]):
            return "smart_contract"
        if any(kw in combined for kw in ["data scien", "machine learning", "pandas", "analytics", "ml"]):
            return "data_science"
        if any(kw in combined for kw in ["react", "frontend", "ui", "css", "next.js", "vue"]):
            return "frontend"
        if any(kw in combined for kw in ["docker", "kubernetes", "devops", "ci/cd", "infrastructure"]):
            return "devops"
        return "backend"  # Default fallback

    def generate_simulation(self, job_title: str, job_description: str, required_skills: List[str]) -> Dict[str, Any]:
        """Generate a role-specific simulation task from a job description."""
        role = self.detect_role_from_job(job_title, job_description, required_skills)
        template = self.TASK_TEMPLATES[role]
        sim_id = f"sim_{hashlib.md5(f'{job_title}{role}'.encode()).hexdigest()[:10]}"

        return {
            "simulation_id": sim_id,
            "detected_role": role,
            "task": {
                "title": template["title"],
                "description": template["description"],
                "time_limit_minutes": template["time_limit_minutes"],
                "acceptance_criteria": template["acceptance_criteria"],
                "boilerplate_info": template["boilerplate"]
            }
        }

    def evaluate_submission(self, simulation_id: str, submitted_code: str) -> Dict[str, Any]:
        """
        Evaluate submitted code across 5 quality dimensions.
        In production, this would use GPT-o1/Claude with AST parsing.
        For hackathon: deterministic scoring based on code characteristics.
        """
        lines = submitted_code.strip().split('\n')
        line_count = len(lines)
        has_comments = any(l.strip().startswith('#') or l.strip().startswith('//') for l in lines)
        has_try_catch = 'try' in submitted_code.lower() and ('except' in submitted_code.lower() or 'catch' in submitted_code.lower())
        has_types = 'def ' in submitted_code and ':' in submitted_code or 'interface' in submitted_code or ': string' in submitted_code
        has_functions = submitted_code.count('def ') + submitted_code.count('function ') + submitted_code.count('=>')

        # Score each dimension
        code_quality = 50
        if has_comments: code_quality += 15
        if has_types: code_quality += 15
        if line_count > 20: code_quality += 10
        code_quality = min(100, code_quality + (min(has_functions, 5) * 2))

        problem_solving = 55
        if has_functions >= 3: problem_solving += 20
        if line_count > 40: problem_solving += 15
        problem_solving = min(100, problem_solving + 10)

        performance = 60
        if 'async' in submitted_code or 'await' in submitted_code: performance += 15
        if 'cache' in submitted_code.lower(): performance += 10
        performance = min(100, performance)

        logic_structure = 50
        if has_try_catch: logic_structure += 20
        if has_functions >= 2: logic_structure += 15
        logic_structure = min(100, logic_structure + 15)

        documentation = 40
        if has_comments: documentation += 30
        if 'readme' in submitted_code.lower() or '"""' in submitted_code or '/**' in submitted_code:
            documentation += 20
        documentation = min(100, documentation)

        composite = int(
            code_quality * 0.25 +
            problem_solving * 0.25 +
            performance * 0.20 +
            logic_structure * 0.20 +
            documentation * 0.10
        )

        passed = composite >= 65

        return {
            "simulation_id": simulation_id,
            "passed": passed,
            "composite_score": composite,
            "evaluation": {
                "code_quality": {"score": code_quality, "feedback": "Clean naming conventions and type safety detected." if code_quality >= 70 else "Consider improving variable naming and adding type hints."},
                "problem_solving": {"score": problem_solving, "feedback": "Well-structured approach with appropriate function decomposition." if problem_solving >= 70 else "Try decomposing the problem into smaller helper functions."},
                "performance": {"score": performance, "feedback": "Good use of async patterns for I/O operations." if performance >= 70 else "Consider async patterns for better throughput."},
                "logic_structure": {"score": logic_structure, "feedback": "Proper error handling and separation of concerns." if logic_structure >= 70 else "Add try/catch blocks and separate business logic from routing."},
                "documentation": {"score": documentation, "feedback": "Meaningful comments and documentation present." if documentation >= 70 else "Add inline comments explaining complex logic blocks."}
            },
            "sbt_eligible": composite >= 80,
            "recommendation": "Mint 'Simulation Verified' SBT" if composite >= 80 else ("Passed. Encourage candidate to retake for SBT eligibility." if passed else "Did not meet minimum threshold. Recommend further skill development.")
        }
