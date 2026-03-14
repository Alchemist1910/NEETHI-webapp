"use client";

import { CornerRightUp } from "lucide-react";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useAutoResizeTextarea } from "@/components/hooks/use-auto-resize-textarea";

interface AIInputWithLoadingProps {
    id?: string;
    placeholder?: string;
    minHeight?: number;
    maxHeight?: number;
    loadingDuration?: number;
    thinkingDuration?: number;
    onSubmit?: (value: string) => void | Promise<void>;
    className?: string;
    autoAnimate?: boolean;
}

export function AIInputWithLoading({
    id = "ai-input-with-loading",
    placeholder = "Type a message...",
    minHeight = 56,
    maxHeight = 200,
    loadingDuration = 3000,
    thinkingDuration = 1000,
    onSubmit,
    className,
    autoAnimate = false
}: AIInputWithLoadingProps) {
    const [inputValue, setInputValue] = useState("");
    const [submitted, setSubmitted] = useState(autoAnimate);
    const [isAnimating, setIsAnimating] = useState(autoAnimate);

    const { textareaRef, adjustHeight } = useAutoResizeTextarea({
        minHeight,
        maxHeight,
    });

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const runAnimation = () => {
            if (!isAnimating) return;
            setSubmitted(true);
            timeoutId = setTimeout(() => {
                setSubmitted(false);
                timeoutId = setTimeout(runAnimation, thinkingDuration);
            }, loadingDuration);
        };

        if (isAnimating) {
            runAnimation();
        }

        return () => clearTimeout(timeoutId);
    }, [isAnimating, loadingDuration, thinkingDuration]);

    const handleSubmit = async () => {
        if (!inputValue.trim() || submitted) return;

        setSubmitted(true);
        await onSubmit?.(inputValue);
        setInputValue("");
        adjustHeight(true);

        setTimeout(() => {
            setSubmitted(false);
        }, loadingDuration);
    };

    return (
        <div className={cn("w-full py-4", className)}>
            <div className="relative max-w-2xl w-full mx-auto flex items-start flex-col gap-2">
                <div className="relative max-w-2xl w-full mx-auto">
                    <Textarea
                        id={id}
                        placeholder={placeholder}
                        className={cn(
                            "max-w-xl bg-[#1c1c1c] w-full rounded-full pl-6 pr-12 py-4 shadow-xl border border-white/5",
                            "placeholder:text-gray-500",
                            "text-gray-200 resize-none text-wrap text-base focus-visible:ring-0 outline-none leading-relaxed",
                            `min-h-[${minHeight}px]`
                        )}
                        ref={textareaRef}
                        value={inputValue}
                        onChange={(e) => {
                            setInputValue(e.target.value);
                            adjustHeight();
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit();
                            }
                        }}
                        disabled={submitted}
                    />
                    <button
                        onClick={handleSubmit}
                        className={cn(
                            "absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 transition-all flex items-center justify-center h-8 w-8",
                            submitted || !inputValue.trim() ? "bg-white/5 text-gray-500 cursor-default" : "bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                        )}
                        type="button"
                        disabled={submitted || !inputValue.trim()}
                    >
                        {submitted ? (
                            <div
                                className="w-3 h-3 border-2 border-white/50 border-t-white rounded-full animate-spin transition duration-700"
                            />
                        ) : (
                            <CornerRightUp className="w-4 h-4" />
                        )}
                    </button>
                </div>
                <p className="pl-6 h-4 text-xs font-medium tracking-wide mx-auto mt-2 text-gray-500">
                    {submitted ? "AI is thinking..." : "Ready to submit!"}
                </p>
            </div>
        </div>
    );
}
