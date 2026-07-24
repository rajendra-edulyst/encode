import React, { memo, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

import { addUserSkill, getSkillsSuggestions } from "@/services/learner/PortfolioService";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/ShadcnButton";
import { SkillsSuggestion } from "@/@types/learner/portfolio";

// Validation Schema
const SkillSchema = z.object({
    skill_id: z.string().min(1, "Skill is required"),
    self_proficiency: z
        .number()
        .min(1, "Proficiency must be at least 1")
        .max(100, "Proficiency must be at most 10"),
});

type SkillFormData = z.infer<typeof SkillSchema>;

interface SkillProps {
    show: boolean;
    onClose: (show: boolean) => void;
    onSuccess?: () => void;
}

const Skill: React.FC<SkillProps> = ({ show, onClose, onSuccess }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<SkillFormData>({
        resolver: zodResolver(SkillSchema),
    });

    const [suggestions, setSuggestions] = useState<SkillsSuggestion[]>([]);
    const [suggestionsLoading, setSuggestionsLoading] = useState(true);
    const [suggestionsError, setSuggestionsError] = useState<string | null>(null);

    // Fetch skills from database
    useEffect(() => {
        getSkillsSuggestions()
            .then((data) => {
                setSuggestions(data);
            })
            .catch((error) => {
                setSuggestionsError(error.message || "Failed to fetch skills.");
            })
            .finally(() => {
                setSuggestionsLoading(false);
            });
    }, [setSuggestions, setSuggestionsError, setSuggestionsLoading]);

    const onSubmit = useCallback(async (data: SkillFormData) => {
        try {
            await addUserSkill({
                skill_id: data.skill_id,
                self_proficiency: data.self_proficiency.toString(),
            });
            reset();
            onClose(false);
            onSuccess && onSuccess();
            toast.success("Skill added successfully");
        } catch (error) {
            console.log(error);
            toast.error("Failed to add skill. Please try again.");
        }
    }, [reset, onClose, onSuccess]);

    return (
        <Dialog open={show} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Skill</DialogTitle>
                    <DialogDescription>Select a skill and set your proficiency</DialogDescription>
                </DialogHeader>
                <form className="bg-white" onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                        <Label htmlFor="skill_id">Select Skill</Label>
                        <select
                            id="skill_id"
                            {...register("skill_id")}
                            className="w-full border rounded-md p-2"
                        >
                            <option value="">-- Select a skill --</option>
                            {suggestionsLoading ? (
                                <option disabled>Loading...</option>
                            ) : suggestionsError ? (
                                <option disabled>{suggestionsError}</option>
                            ) : (
                                suggestions.map((skill) => (
                                    <option key={skill.id} value={skill.id}>
                                        {skill.name}
                                    </option>
                                ))
                            )}
                        </select>
                        <p className="text-red-500 text-sm">{errors.skill_id?.message}</p>
                    </div>

                    <div className="mb-3">
                        <Label htmlFor="self_proficiency">Self Proficiency (1-100)</Label>
                        <input
                            id="self_proficiency"
                            type="number"
                            min="1"
                            max="100"
                            {...register("self_proficiency", { valueAsNumber: true })}
                            className="w-full border rounded-md p-2"
                        />
                        <p className="text-red-500 text-sm">{errors.self_proficiency?.message}</p>
                    </div>
                    <div className="flex justify-end">
                        <Button className="text-white" type="submit">Add</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default memo(Skill);