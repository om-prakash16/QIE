"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Settings2, BrainCircuit, Save, Scale3d, ActivitySquare } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { api } from "@/lib/api/api-client";

export default function AITuningPanel() {
  const [settings, setSettings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [weights, setWeights] = useState({
      skill_match_weight: 40,
      experience_weight: 30,
      project_score_weight: 30,
      min_resonance_threshold: 65,
      mcq_difficulty: 2, // 1: Easy, 2: Med, 3: Hard
      questions_per_assessment: 10,
      skill_importance_weight: 70
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await api.admin.getSettings();
      if(Array.isArray(data)) {
          setSettings(data);
          // Map DB settings to local state if they exist
          const newWeights = { ...weights };
          data.forEach(setting => {
              if (setting.setting_key in newWeights) {
                  newWeights[setting.setting_key as keyof typeof newWeights] = parseFloat(setting.setting_value);
              }
          });
          setWeights(newWeights);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load AI tuning parameters.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTuning = async () => {
      setIsSaving(true);
      try {
          // Verify weights add up to 100
          if (weights.skill_match_weight + weights.experience_weight + weights.project_score_weight !== 100) {
              toast.error("Resonance weights must equal exactly 100%");
              setIsSaving(false);
              return;
          }

          if (api.admin.updateSettings) {
              await api.admin.updateSettings({
                  setting_key: "resonance_formula",
                  setting_value: weights
              });
          }
          toast.success("AI Resonance Formula Synchronized");
      } catch (err) {
          toast.error("Failed to update tuning parameters.");
      } finally {
          setIsSaving(false);
      }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-4xl">
      <div className="flex flex-col justify-between items-start gap-4">
        <h1 className="text-4xl md:text-5xl font-black font-heading tracking-tight flex items-center gap-4 text-white">
          <BrainCircuit className="w-10 h-10 text-fuchsia-500 drop-shadow-[0_0_15px_rgba(217,70,239,0.8)]" /> 
          Resonance Tuning
        </h1>
        <p className="text-muted-foreground text-lg">
          Adjust the semantic weighting algorithms for the AI evaluator. Changes impact candidate sorting in real-time.
        </p>
      </div>

      <Card className="bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden group border-t-fuchsia-500/30 border-t-2">
        <div className="absolute top-0 right-0 w-96 h-96 bg-fuchsia-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <CardHeader className="relative z-10 border-b border-white/10 flex flex-row items-center justify-between pb-6">
            <div>
                <CardTitle className="text-xl flex items-center gap-2"><Scale3d className="w-5 h-5 text-fuchsia-500" /> Evaluation Formula Weights</CardTitle>
                <CardDescription>Variables must sum to exactly 100%</CardDescription>
            </div>
            <div className={`px-4 py-2 rounded-full border ${weights.skill_match_weight + weights.experience_weight + weights.project_score_weight === 100 ? 'bg-fuchsia-500/10 border-fuchsia-500/30 text-fuchsia-500' : 'bg-rose-500/10 border-rose-500/30 text-rose-500'}`}>
                <span className="text-xs font-black uppercase tracking-widest">
                    TOTAL: {weights.skill_match_weight + weights.experience_weight + weights.project_score_weight}%
                </span>
            </div>
        </CardHeader>
        
        <CardContent className="space-y-10 relative z-10 pt-8 pb-10 px-8">
            {isLoading ? (
                <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-fuchsia-500/50" /></div>
            ) : (
                <>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-sm uppercase tracking-widest font-black text-white/80">Skill Validation Resonance</label>
                            <span className="text-2xl font-black text-white">{weights.skill_match_weight}%</span>
                        </div>
                        <Slider 
                            value={[weights.skill_match_weight]} 
                            max={100} 
                            step={1} 
                            onValueChange={(v) => setWeights({...weights, skill_match_weight: v[0]})}
                            className="[&_[role=slider]]:bg-fuchsia-500 [&_[role=slider]]:border-none [&>span:first-child]:bg-fuchsia-500/20 [&_[data-orientation=horizontal]]:bg-fuchsia-500" 
                        />
                        <p className="text-xs text-white/40 italic">Weight applied to verified GitHub commits and objective assessment scores.</p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-sm uppercase tracking-widest font-black text-white/80">Experience Vector</label>
                            <span className="text-2xl font-black text-white">{weights.experience_weight}%</span>
                        </div>
                        <Slider 
                            value={[weights.experience_weight]} 
                            max={100} 
                            step={1} 
                            onValueChange={(v) => setWeights({...weights, experience_weight: v[0]})}
                            className="[&_[role=slider]]:bg-blue-500 [&_[role=slider]]:border-none [&>span:first-child]:bg-blue-500/20 [&_[data-orientation=horizontal]]:bg-blue-500" 
                        />
                        <p className="text-xs text-white/40 italic">Weight applied to total years of experience and seniority trajectory.</p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-sm uppercase tracking-widest font-black text-white/80">Project Scope Analysis</label>
                            <span className="text-2xl font-black text-white">{weights.project_score_weight}%</span>
                        </div>
                        <Slider 
                            value={[weights.project_score_weight]} 
                            max={100} 
                            step={1} 
                            onValueChange={(v) => setWeights({...weights, project_score_weight: v[0]})}
                            className="[&_[role=slider]]:bg-emerald-500 [&_[role=slider]]:border-none [&>span:first-child]:bg-emerald-500/20 [&_[data-orientation=horizontal]]:bg-emerald-500" 
                        />
                        <p className="text-xs text-white/40 italic">Weight applied to independent project complexity and open-source contributions.</p>
                    </div>

                    <div className="pt-6 border-t border-white/10 space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-sm uppercase tracking-widest font-black text-white/80 text-orange-500">Global Minimum Shortlist Threshold</label>
                            <span className="text-2xl font-black text-white">{weights.min_resonance_threshold}%</span>
                        </div>
                        <Slider 
                            value={[weights.min_resonance_threshold]} 
                            max={100} 
                            step={1} 
                            onValueChange={(v) => setWeights({...weights, min_resonance_threshold: v[0]})}
                            className="[&_[role=slider]]:bg-orange-500 [&_[role=slider]]:border-none [&>span:first-child]:bg-orange-500/20 [&_[data-orientation=horizontal]]:bg-orange-500" 
                        />
                        <p className="text-xs text-white/40 italic">The minimum AI Resonance Score required for a candidate to be visible in a recruiter's shortlist.</p>
                    </div>

                    <div className="pt-8 border-t border-white/10 space-y-8">
                        <div>
                            <CardTitle className="text-xl flex items-center gap-2 mb-2"><ActivitySquare className="w-5 h-5 text-blue-400" /> Skill Assessment Tuning (Section 9)</CardTitle>
                            <CardDescription>Configure AI MCQ difficulty and skill depth.</CardDescription>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-sm uppercase tracking-widest font-black text-white/80">Question Difficulty Profile</label>
                                <Badge className={weights.mcq_difficulty === 1 ? "bg-emerald-500" : weights.mcq_difficulty === 2 ? "bg-blue-500" : "bg-rose-500"}>
                                    {weights.mcq_difficulty === 1 ? "EASY" : weights.mcq_difficulty === 2 ? "MEDIUM" : "HARD"}
                                </Badge>
                            </div>
                            <Slider 
                                value={[weights.mcq_difficulty]} 
                                max={3} 
                                min={1}
                                step={1} 
                                onValueChange={(v) => setWeights({...weights, mcq_difficulty: v[0]})}
                                className="[&_[role=slider]]:bg-blue-400" 
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="text-sm uppercase tracking-widest font-black text-white/80">Questions per Session</label>
                                <Input 
                                    type="number" 
                                    value={weights.questions_per_assessment}
                                    onChange={(e) => setWeights({...weights, questions_per_assessment: parseInt(e.target.value) || 10})}
                                    className="bg-black/40 border-white/10 text-white"
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-sm uppercase tracking-widest font-black text-white/80">Skill Weight Importance (%)</label>
                                <Input 
                                    type="number" 
                                    value={weights.skill_importance_weight}
                                    onChange={(e) => setWeights({...weights, skill_importance_weight: parseInt(e.target.value) || 70})}
                                    className="bg-black/40 border-white/10 text-white"
                                />
                            </div>
                        </div>
                    </div>

                    <Button 
                        onClick={handleSaveTuning} 
                        disabled={isSaving || (weights.skill_match_weight + weights.experience_weight + weights.project_score_weight !== 100)} 
                        className="w-full bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-black tracking-widest uppercase mt-4 shadow-[0_0_20px_rgba(217,70,239,0.4)] h-14"
                    >
                        {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : "Deploy Resonance Formula"}
                    </Button>
                </>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
