"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2, Brain, CheckCircle2, ShieldAlert, Zap, Trophy, History } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export default function SkillQuizPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const skill = searchParams.get("skill") || "Solana Development";
  
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const startQuiz = async () => {
      try {
        const res = await fetch(`${API_BASE}/ai/generate-quiz`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ skill, difficulty: "intermediate", count: 5 })
        });
        const data = await res.json();
        if (data.status === "success") {
          setQuestions(data.questions);
        }
      } catch (err) {
        console.error("Quiz failed to load", err);
      } finally {
        setIsLoading(false);
      }
    };
    startQuiz();
  }, [skill]);

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [questions[currentStep].id]: value[0] }); // Extracting 'A', 'B', etc.
  };

  const nextStep = () => {
    if (currentStep < questions.length - 1) setCurrentStep(currentStep + 1);
  };

  const submitQuiz = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/ai/evaluate-quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quiz_id: "last", answers }) // Mocking quiz_id for MVP
      });
      const data = await res.json();
      setResult(data.result || data);
    } catch (err) {
      console.error("Submission failed", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-muted-foreground font-black uppercase tracking-widest animate-pulse">Generating AI Quiz...</p>
      </div>
    );
  }

  if (result) {
    return (
      <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Card className="bg-white/5 border-white/10 backdrop-blur-xl overflow-hidden">
          <CardHeader className="text-center p-8 border-b border-white/10">
            <div className="flex justify-center mb-4">
              {result.passed ? (
                <div className="p-4 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-500">
                  <Trophy className="w-12 h-12" />
                </div>
              ) : (
                <div className="p-4 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-500">
                   <ShieldAlert className="w-12 h-12" />
                </div>
              )}
            </div>
            <CardTitle className="text-3xl font-black uppercase tracking-tighter">
              {result.passed ? "Skill Verified" : "Assessment Failed"}
            </CardTitle>
            <CardDescription className="text-base font-medium">
              You scored {result.score}% on the {skill} AI Assessment.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                    <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">Correct Answers</p>
                    <p className="text-2xl font-black">{result.correct_count} / {result.total_questions}</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                    <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">Pass Requirement</p>
                    <p className="text-2xl font-black">80%</p>
                </div>
            </div>

            {result.passed ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex gap-4 items-start">
                    <Zap className="w-5 h-5 text-emerald-500 mt-1" />
                    <p className="text-sm font-medium leading-relaxed">
                        Excellent work! Your technical proficiency has been verified by the AI Engine. 
                        You are now authorized to mint your verifiable **{skill} Skill NFT** on Solana.
                    </p>
                </div>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-8 rounded-2xl text-lg font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 cursor-pointer">
                    <History className="mr-2 h-5 w-5" />
                    Mint Skill NFT (on Solana)
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex gap-4 items-start">
                    <ShieldAlert className="w-5 h-5 text-rose-500 mt-1" />
                    <p className="text-sm font-medium leading-relaxed">
                        You didn't reach the required 80% score for on-chain verification. 
                        Review your skills and try again in 24 hours.
                    </p>
                </div>
                <Button variant="outline" className="w-full py-8 rounded-2xl text-lg font-black uppercase tracking-widest border-white/10 bg-white/5 hover:bg-white/10" onClick={() => router.push('/dashboard/skills')}>
                    Back to Skills
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentStep];

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <div className="flex items-center justify-between">
         <div className="space-y-1">
            <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
                <Brain className="w-6 h-6 text-primary" />
                AI Skill Verification
            </h2>
            <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary text-[10px] font-black uppercase italic">
                   {skill}
                </Badge>
                <Badge variant="outline" className="bg-white/5 border-white/10 text-muted-foreground text-[10px] font-black uppercase">
                   Step {currentStep + 1} of {questions.length}
                </Badge>
            </div>
         </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-[10px] font-black uppercase text-muted-foreground">
            <span>Overall Progress</span>
            <span>{Math.round((currentStep / questions.length) * 100)}%</span>
        </div>
        <Progress value={(currentStep / questions.length) * 100} className="h-2 bg-white/5" />
      </div>

      <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
        <CardHeader className="p-8 pb-4">
           <CardTitle className="text-xl font-bold leading-relaxed">
              {currentQuestion.text}
           </CardTitle>
        </CardHeader>
        <CardContent className="p-8 pt-4 space-y-8">
            <RadioGroup onValueChange={handleAnswer} className="grid grid-cols-1 gap-4">
                {currentQuestion.options.map((opt: string) => (
                    <div key={opt} className="flex items-center space-x-2 rounded-xl border border-white/5 p-4 bg-white/[0.02] hover:bg-white/5 hover:border-white/10 transition-all cursor-pointer group">
                        <RadioGroupItem value={opt} id={opt} className="border-white/20 group-hover:border-primary" />
                        <Label htmlFor={opt} className="flex-1 cursor-pointer text-sm font-medium">{opt}</Label>
                    </div>
                ))}
            </RadioGroup>

            <div className="pt-4">
                {currentStep < questions.length - 1 ? (
                    <Button 
                        onClick={nextStep} 
                        disabled={!answers[currentQuestion.id]}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest py-8 rounded-2xl text-lg shadow-lg"
                    >
                        Next Question
                    </Button>
                ) : (
                    <Button 
                        onClick={submitQuiz}
                        disabled={!answers[currentQuestion.id] || isSubmitting}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest py-8 rounded-2xl text-lg shadow-lg shadow-emerald-500/20"
                    >
                        {isSubmitting ? (
                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        ) : (
                            <CheckCircle2 className="w-5 h-5 mr-2" />
                        )}
                        Complete Assessment
                    </Button>
                )}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
