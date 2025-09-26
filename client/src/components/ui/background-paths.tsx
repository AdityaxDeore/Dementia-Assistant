"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

function FloatingPaths({ position }: { position: number }) {
    const paths = Array.from({ length: 36 }, (_, i) => ({
        id: i,
        d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
            380 - i * 5 * position
        } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
            152 - i * 5 * position
        } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
            684 - i * 5 * position
        } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
        color: `rgba(15,23,42,${0.1 + i * 0.03})`,
        width: 0.5 + i * 0.03,
    }));

    // Fresh vibrant colors array
    const freshColors = [
        'rgba(34, 197, 94, 0.6)',   // Emerald
        'rgba(59, 130, 246, 0.6)',  // Blue
        'rgba(168, 85, 247, 0.6)',  // Purple
        'rgba(244, 63, 94, 0.6)',   // Rose
        'rgba(249, 115, 22, 0.6)',  // Orange
        'rgba(14, 165, 233, 0.6)',  // Sky
        'rgba(139, 92, 246, 0.6)',  // Violet
        'rgba(236, 72, 153, 0.6)',  // Pink
        'rgba(16, 185, 129, 0.6)',  // Emerald
        'rgba(99, 102, 241, 0.6)',  // Indigo
        'rgba(245, 101, 101, 0.6)', // Red
        'rgba(52, 211, 153, 0.6)',  // Teal
    ];

    return (
        <div className="absolute inset-0 pointer-events-none">
            <svg
                className="w-full h-full"
                viewBox="0 0 696 316"
                fill="none"
            >
                <title>Background Paths</title>
                {paths.map((path) => (
                    <motion.path
                        key={path.id}
                        d={path.d}
                        stroke={freshColors[path.id % freshColors.length]}
                        strokeWidth={path.width}
                        initial={{ pathLength: 0.3, opacity: 0.6 }}
                        animate={{
                            pathLength: 1,
                            opacity: [0.3, 0.8, 0.3],
                            pathOffset: [0, 1, 0],
                        }}
                        transition={{
                            duration: 15 + Math.random() * 10,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                        }}
                    />
                ))}
            </svg>
        </div>
    );
}

export function BackgroundPaths({
    title = "Background Paths",
}: {
    title?: string;
}) {
    const words = title.split(" ");

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 dark:from-emerald-950 dark:via-blue-950 dark:to-purple-950">
            <div className="absolute inset-0">
                <FloatingPaths position={1} />
                <FloatingPaths position={-1} />
            </div>

            {title && (
                <div className="relative z-10 container mx-auto px-3 sm:px-4 md:px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 2 }}
                        className="max-w-4xl mx-auto"
                    >
                        <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 sm:mb-6 md:mb-8 tracking-tighter leading-tight">
                            {words.map((word, wordIndex) => (
                                <span
                                    key={wordIndex}
                                    className="inline-block mr-2 sm:mr-3 md:mr-4 last:mr-0"
                                >
                                    {word.split("").map((letter, letterIndex) => (
                                        <motion.span
                                            key={`${wordIndex}-${letterIndex}`}
                                            initial={{ y: 50, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{
                                                delay:
                                                    wordIndex * 0.1 +
                                                    letterIndex * 0.03,
                                                type: "spring",
                                                stiffness: 150,
                                                damping: 25,
                                            }}
                                            className="inline-block text-transparent bg-clip-text 
                                            bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 
                                            dark:from-emerald-400 dark:via-blue-400 dark:to-purple-400"
                                        >
                                            {letter}
                                        </motion.span>
                                    ))}
                                </span>
                            ))}
                        </h1>
                    </motion.div>
                </div>
            )}
        </div>
    );
}

export function DemoBackgroundPaths() {
    return <BackgroundPaths title="Welcome to Clarity" />
}