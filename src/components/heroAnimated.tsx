// components/HeroSection.tsx
import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import axios from "axios";

interface HeroProps {
    title: string;
    subtitle: string;
    videoUrl: string;
}

const HeroSection: React.FC = () => {
    const [heroData, setHeroData] = useState<HeroProps | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isCentered, setIsCentered] = useState(false);
    const [isInactive, setIsInactive] = useState(false);
    const { scrollYProgress } = useScroll();
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const inactivityRef = useRef<NodeJS.Timeout | null>(null);

    // Scroll-based transformations
    const scale = useTransform(scrollYProgress, [0, 0.5], [isInactive ? 0.6 : 1, 1.3]);
    const y = useTransform(scrollYProgress, [0, 1], [isInactive ? window.innerHeight * 0.8 : 0, window.innerHeight * 0.6]);
    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    useEffect(() => {
        const fetchHeroData = async () => {
            try {
                const response = await axios.get<HeroProps>("/api/heroAnimated");
                setHeroData(response.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError("Failed to load hero content");
                setLoading(false);
            }
        };

        fetchHeroData();
    }, []);

    useEffect(() => {
        const handleActivity = () => {
            setIsInactive(false);
            if (inactivityRef.current) clearTimeout(inactivityRef.current);
            inactivityRef.current = setTimeout(() => {
                setIsInactive(true);
            }, 5000);
        };

        const handleScroll = () => {
            handleActivity();
            const heroSection = document.getElementById('hero');
            if (!heroSection) return;

            const rect = heroSection.getBoundingClientRect();
            const isCenter = rect.top <= window.innerHeight / 2 &&
                rect.bottom >= window.innerHeight / 2;

            if (isCenter && !isCentered) {
                setIsCentered(true);
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                timeoutRef.current = setTimeout(() => {
                    setIsCentered(false);
                }, 5000);
            } else if (!isCenter && isCentered) {
                setIsCentered(false);
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
            }
        };

        // Initialize inactivity timer
        handleActivity();
        
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('mousemove', handleActivity);
        window.addEventListener('keydown', handleActivity);
        window.addEventListener('touchstart', handleActivity);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('mousemove', handleActivity);
            window.removeEventListener('keydown', handleActivity);
            window.removeEventListener('touchstart', handleActivity);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (inactivityRef.current) clearTimeout(inactivityRef.current);
        };
    }, [isCentered]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-8 h-8 border-4 border-white border-t-transparent rounded-full"
                />
            </div>
        );
    }

    if (error || !heroData) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900 text-red-400">
                ?? {error || "Content unavailable"}
            </div>
        );
    }

    const { title, subtitle, videoUrl } = heroData;

    return (
        <section
            id="hero"
            className="relative h-screen w-full overflow-hidden bg-gray-50 dark:bg-gray-900"
        >
            <video
                className="absolute inset-0 w-full h-full object-cover opacity-100 dark:opacity-90"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                disablePictureInPicture
            >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Adjusted gradient overlay for better light/dark mode contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/50 dark:from-black/60 dark:to-black/90" />

            <motion.div
                className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 text-center w-full px-4"
                style={{
                    y: isInactive ? window.innerHeight * 0.7 : y,
                    scale,
                    opacity
                }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
                <motion.h1
                    className="text-gray-900 dark:text-white font-bold mb-4"
                    style={{
                        fontSize: isInactive
                            ? 'clamp(1.5rem, 6vw, 3rem)'
                            : 'clamp(2rem, 8vw, 4rem)',
                        transition: 'font-size 0.3s ease-in-out'
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    {title}
                </motion.h1>

                <motion.p
                    className="text-gray-700 dark:text-gray-200 mb-8 max-w-2xl mx-auto"
                    style={{
                        fontSize: isInactive
                            ? 'clamp(0.9rem, 2vw, 1.2rem)'
                            : 'clamp(1rem, 2.5vw, 1.5rem)',
                        transition: 'font-size 0.3s ease-in-out'
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 1 }}
                >
                    {subtitle}
                </motion.p>

                <motion.div
                    className="flex justify-center gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: .5 }}
                >
                    <a
                        href="/pages/shop"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg transition-all 
                        transform hover:scale-105 duration-300 text-sm shadow-xl"
                    >
                        Explore Collection
                    </a>
                    <a
                        href="/contact"
                        className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-lg transition-all 
                        transform hover:scale-105 duration-300 text-sm shadow-xl"
                    >
                        Get in Touch
                    </a>
                </motion.div>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-gray-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
            >
                <span className="mb-2 text-sm">Scroll to explore</span>
                <motion.div
                    animate={{ y: [0, 20, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-6 h-10 border-4 border-gray-300 rounded-full"
                >
                    <motion.div
                        className="w-2 h-2 bg-gray-300 rounded-full mx-auto mt-1"
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    />
                </motion.div>
            </motion.div>
        </section>
    );
};

export default HeroSection;