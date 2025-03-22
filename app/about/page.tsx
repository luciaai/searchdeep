
/* eslint-disable @next/next/no-img-element */
"use client";

import { GithubLogo, XLogo } from '@phosphor-icons/react';
import { Bot, Brain, Command, GraduationCap, Image, Search, Share2, Sparkles, Star, Trophy, Users, AlertTriangle, Github, Twitter, ArrowRight, ChevronRight, FileText, BookOpen, BarChart, Briefcase, Lightbulb, Clock, ExternalLink, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TextLoop } from '@/components/core/text-loop';
import { TextShimmer } from '@/components/core/text-shimmer';
import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { VercelLogo } from '@/components/logos/vercel-logo';
import { TavilyLogo } from '@/components/logos/tavily-logo';
import NextImage from 'next/image';

export default function AboutPage() {
    const router = useRouter();
    const [showWarning, setShowWarning] = useState(false);
    
    useEffect(() => {
        const hasSeenWarning = localStorage.getItem('hasSeenWarning');
        if (!hasSeenWarning) {
            setShowWarning(true);
        }
    }, []);

    const handleDismissWarning = () => {
        setShowWarning(false);
        localStorage.setItem('hasSeenWarning', 'true');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const query = formData.get('query')?.toString();
        if (query) {
            router.push(`/?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
            {/* Welcome Dialog */}
            <Dialog open={showWarning} onOpenChange={setShowWarning}>
                <DialogContent className="sm:max-w-[500px] p-0 bg-white dark:bg-gray-900 rounded-2xl border-0 shadow-xl">
                    <div className="p-8">
                        <div className="flex items-center justify-center mb-6">
                            <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                                <img src="/logo.png" alt="Ziq Logo" className="w-10 h-10 dark:invert" />
                            </div>
                        </div>
                        
                        <DialogHeader className="mb-6">
                            <DialogTitle className="text-2xl font-bold text-center text-gray-900 dark:text-white">
                                Welcome to Ziq Research Assistant
                            </DialogTitle>
                            <DialogDescription className="text-gray-600 dark:text-gray-300 text-center mt-2 text-base">
                                Your AI research companion designed for students, teachers, entrepreneurs, and business professionals.
                            </DialogDescription>
                        </DialogHeader>
                        
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="flex flex-col items-center p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                                <GraduationCap className="h-7 w-7 text-blue-500 mb-2" />
                                <p className="text-sm text-gray-600 dark:text-gray-300 text-center">Academic Research</p>
                            </div>
                            <div className="flex flex-col items-center p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                                <BookOpen className="h-7 w-7 text-blue-500 mb-2" />
                                <p className="text-sm text-gray-600 dark:text-gray-300 text-center">Lesson Planning</p>
                            </div>
                            <div className="flex flex-col items-center p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                                <BarChart className="h-7 w-7 text-blue-500 mb-2" />
                                <p className="text-sm text-gray-600 dark:text-gray-300 text-center">Market Research</p>
                            </div>
                            <div className="flex flex-col items-center p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                                <Briefcase className="h-7 w-7 text-blue-500 mb-2" />
                                <p className="text-sm text-gray-600 dark:text-gray-300 text-center">Business Strategy</p>
                            </div>
                        </div>
                        
                        <Button 
                            variant="default" 
                            onClick={handleDismissWarning}
                            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl"
                        >
                            Get Started
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 md:h-20">
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center gap-2">
                                <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                                    <img src="/logo.png" alt="Ziq Logo" className="w-6 h-6 dark:invert" />
                                </div>
                                <span className="text-xl font-bold text-gray-900 dark:text-white">Ziq</span>
                            </Link>
                        </div>
                        
                        <nav className="hidden md:flex items-center space-x-8">
                            <Link href="#features" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium text-sm">
                                Features
                            </Link>
                            <Link href="#use-cases" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium text-sm">
                                Use Cases
                            </Link>
                            <Link href="#testimonials" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium text-sm">
                                Testimonials
                            </Link>
                        </nav>
                        
                        <div className="flex items-center gap-3">
                            <Link 
                                href="/"
                                className="px-4 py-2 rounded-lg text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm"
                            >
                                Log in
                            </Link>
                            <Link 
                                href="/"
                                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-20 pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_35%,rgba(59,130,246,0.1),transparent_50%)]"></div>
                
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div 
                            className="max-w-2xl"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-full mb-6">
                                Powered by AI Research Technology
                            </div>
                            
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                                Research Smarter, <br/>
                                <span className="text-blue-600 dark:text-blue-400">Not Harder</span>
                            </h1>
                            
                            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                                Ziq helps students, teachers, entrepreneurs, and professionals find reliable information, synthesize knowledge, and gain deeper insights - all in seconds.
                            </p>
                            
                            <form onSubmit={handleSearch} className="mb-8 relative max-w-xl">
                                <input 
                                    type="text" 
                                    name="query"
                                    placeholder="Ask a research question..."
                                    className="w-full h-14 px-5 pr-36 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-500/30"
                                />
                                <button 
                                    type="submit"
                                    className="absolute right-2 top-2 px-4 h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                                >
                                    <span>Ask Ziq</span>
                                    <ArrowRight size={16} />
                                </button>
                            </form>
                            
                            <div className="flex items-center gap-4">
                                <div className="flex -space-x-2">
                                    {[...Array(4)].map((_, i) => (
                                        <div 
                                            key={i} 
                                            className="w-8 h-8 rounded-full ring-2 ring-white dark:ring-gray-900" 
                                            style={{
                                                backgroundColor: ['#60A5FA', '#818CF8', '#A78BFA', '#C084FC'][i],
                                            }}
                                        />
                                    ))}
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    <span className="font-medium">500K+</span> users trust Ziq
                                </p>
                            </div>
                        </motion.div>
                        
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-violet-500/20"></div>
                                <div className="bg-white dark:bg-gray-800 p-6 relative z-10">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                                                <img src="/logo.png" alt="Ziq Logo" className="w-5 h-5 dark:invert" />
                                            </div>
                                            <span className="font-medium text-gray-900 dark:text-white">Ziq Research Assistant</span>
                                        </div>
                                        <div className="flex gap-1.5">
                                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-5">
                                        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-750">
                                            <p className="text-gray-900 dark:text-white">
                                                What are the most effective teaching methods for high school STEM education?
                                            </p>
                                        </div>
                                        
                                        <div className="flex gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center flex-shrink-0">
                                                <img src="/logo.png" alt="Ziq Logo" className="w-5 h-5 dark:invert" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 mb-3">
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        Analyzing research from educational journals and studies...
                                                    </p>
                                                    <div className="flex gap-1 mt-1">
                                                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                                                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                                                    </div>
                                                </div>
                                                
                                                <div className="space-y-3">
                                                    <p className="text-gray-900 dark:text-white">
                                                        Based on recent research, the most effective teaching methods for high school STEM education include:
                                                    </p>
                                                    
                                                    <ul className="space-y-2">
                                                        <li className="flex items-start gap-2">
                                                            <CheckCircle size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
                                                            <span className="text-gray-700 dark:text-gray-300">Project-based learning that connects concepts to real-world applications</span>
                                                        </li>
                                                        <li className="flex items-start gap-2">
                                                            <CheckCircle size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
                                                            <span className="text-gray-700 dark:text-gray-300">Inquiry-based approaches that encourage student investigation</span>
                                                        </li>
                                                        <li className="flex items-start gap-2">
                                                            <CheckCircle size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
                                                            <span className="text-gray-700 dark:text-gray-300">Collaborative learning environments with peer instruction</span>
                                                        </li>
                                                    </ul>
                                                    
                                                    <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                                                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                                            <FileText size={12} />
                                                            <span>Sources: Journal of Research in STEM Education, Science Education, Educational Psychology Review</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Decorative elements */}
                            <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-400 rounded-full blur-3xl opacity-20"></div>
                            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-violet-400 rounded-full blur-3xl opacity-20"></div>
                        </motion.div>
                    </div>
                    
                    {/* Partners */}
                    <div className="mt-24 text-center">
                        <p className="text-sm uppercase text-gray-500 dark:text-gray-400 tracking-wider mb-8">
                            Trusted by leading institutions
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 justify-items-center items-center opacity-70">
                            {['Stanford', 'Harvard', 'MIT', 'UC Berkeley', 'Oxford', 'Cambridge'].map((name, i) => (
                                <div key={i} className="text-xl font-bold text-gray-400 dark:text-gray-600">
                                    {name}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Features Section */}
            <section id="features" className="py-20 bg-gray-50 dark:bg-gray-900/50">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Your Complete Research Assistant
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Ziq combines advanced AI with comprehensive knowledge sources to streamline your research process
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Search,
                                title: "Deep Research",
                                description: "Access information from academic journals, books, and trusted publications with precise citations",
                                color: "blue"
                            },
                            {
                                icon: Brain,
                                title: "Intelligent Synthesis",
                                description: "Ziq doesn't just search - it analyzes, compares, and generates insights across multiple sources",
                                color: "violet"
                            },
                            {
                                icon: Clock,
                                title: "Time-Saving Summaries",
                                description: "Get concise, easy-to-understand summaries of complex topics in seconds",
                                color: "indigo"
                            },
                            {
                                icon: BookOpen,
                                title: "Academic Excellence",
                                description: "Literature reviews, research paper assistance, and proper citation support for students",
                                color: "cyan"
                            },
                            {
                                icon: BarChart,
                                title: "Market Intelligence",
                                description: "Analyze industry trends, competitive landscapes, and business opportunities",
                                color: "emerald"
                            },
                            {
                                icon: Lightbulb,
                                title: "Creative Ideation",
                                description: "Generate research questions, outline structures, and develop conceptual frameworks",
                                color: "amber"
                            }
                        ].map((feature, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700"
                            >
                                <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-5">
                                    <feature.icon className="w-6 h-6 text-blue-500" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* Process Section */}
            <section className="py-20 bg-white dark:bg-gray-900">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            How Ziq Works
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Powered by advanced AI technology and comprehensive knowledge sources
                        </p>
                    </div>
                    
                    <div className="max-w-4xl mx-auto relative">
                        <div className="absolute left-8 md:left-16 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                        
                        {[
                            {
                                title: "Ask Your Question",
                                description: "Type your research question in natural language - just like you'd ask a human research assistant.",
                                icon: Search
                            },
                            {
                                title: "Knowledge Retrieval",
                                description: "Ziq searches academic databases, professional journals, books, and trusted sources to gather relevant information.",
                                icon: BookOpen
                            },
                            {
                                title: "AI Analysis & Synthesis",
                                description: "Multiple AI models work together to analyze, compare, and synthesize information from different sources.",
                                icon: Brain
                            },
                            {
                                title: "Comprehensive Answer",
                                description: "Receive a detailed, well-structured response with proper citations and sources for further reading.",
                                icon: FileText
                            }
                        ].map((step, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="flex gap-8 items-start mb-12 relative"
                            >
                                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-blue-50 dark:bg-blue-900/30 border-4 border-white dark:border-gray-900 z-10 flex-shrink-0">
                                    <step.icon className="w-7 h-7 text-blue-500" />
                                </div>
                                
                                <div className="pt-2">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                        {i+1}. {step.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {step.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* Use Cases */}
            <section id="use-cases" className="py-20 bg-gray-50 dark:bg-gray-900/50">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Made For Every Research Need
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            See how different professionals use Ziq to accelerate their work
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            {
                                icon: GraduationCap,
                                title: "For Students",
                                description: "From essay research to thesis support, Ziq helps students find reliable sources, synthesize information, and develop well-structured arguments.",
                                features: [
                                    "Literature reviews",
                                    "Research paper assistance",
                                    "Citation support",
                                    "Exam preparation"
                                ]
                            },
                            {
                                icon: BookOpen,
                                title: "For Educators",
                                description: "Teachers and professors use Ziq to develop curriculum materials, create lesson plans, and stay updated on educational research and best practices.",
                                features: [
                                    "Curriculum development",
                                    "Instructional material creation",
                                    "Educational research",
                                    "Student support materials"
                                ]
                            },
                            {
                                icon: Briefcase,
                                title: "For Professionals",
                                description: "Entrepreneurs and business people leverage Ziq for market research, competitive analysis, and strategic planning with reliable business intelligence.",
                                features: [
                                    "Market analysis",
                                    "Competitive intelligence",
                                    "Industry trend reports",
                                    "Strategy development"
                                ]
                            }
                        ].map((useCase, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100 dark:border-gray-700"
                            >
                                <div className="p-8">
                                    <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-6">
                                        <useCase.icon className="w-6 h-6 text-blue-500" />
                                    </div>
                                    
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                        {useCase.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                                        {useCase.description}
                                    </p>
                                    
                                    <ul className="space-y-2">
                                        {useCase.features.map((feature, j) => (
                                            <li key={j} className="flex items-start gap-2">
                                                <Check size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
                                                <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* Testimonials */}
            <section id="testimonials" className="py-20 bg-white dark:bg-gray-900">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            What Our Users Say
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            See how Ziq is transforming research for people like you
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                quote: "Ziq has completely transformed my research process. I can find relevant academic sources in seconds rather than hours.",
                                name: "Sarah Johnson",
                                title: "PhD Student, Stanford University"
                            },
                            {
                                quote: "As a high school teacher, Ziq helps me create research-backed lesson plans and stay current with educational best practices.",
                                name: "Michael Chen",
                                title: "Science Teacher, Boston Public Schools"
                            },
                            {
                               quote: "The market intelligence I get from Ziq has been instrumental in developing our startup's go-to-market strategy.",
                                name: "David Rodriguez",
                                title: "Founder & CEO, TechNova"
                            }
                        ].map((testimonial, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl border border-gray-100 dark:border-gray-700"
                            >
                                <div className="mb-6">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="inline-block w-5 h-5 text-yellow-400 fill-yellow-400" />
                                    ))}
                                </div>
                                
                                <blockquote className="text-gray-700 dark:text-gray-300 mb-6">
                                    "{testimonial.quote}"
                                </blockquote>
                                
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                        <span className="text-blue-600 dark:text-blue-400 font-semibold">
                                            {testimonial.name.charAt(0)}
                                        </span>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900 dark:text-white">
                                            {testimonial.name}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {testimonial.title}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* Stats */}
            <section className="py-20 bg-blue-600 dark:bg-blue-900">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { value: "10M+", label: "Questions Answered" },
                            { value: "500K+", label: "Active Users" },
                            { value: "1,000+", label: "Academic Institutions" },
                            { value: "98%", label: "Satisfaction Rate" }
                        ].map((stat, i) => (
                            <div key={i} className="space-y-2">
                                <div className="text-4xl md:text-5xl font-bold text-white">
                                    {stat.value}
                                </div>
                                <div className="text-blue-100">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* CTA Section */}
            <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto text-center space-y-8">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Ready to Transform Your Research?
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Join thousands of students, educators, and professionals who use Ziq to make their research process faster, deeper, and more effective.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/"
                                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
                            >
                                Get Started for Free
                            </Link>
                            <Link
                                href="/"
                                className="px-6 py-3 rounded-xl bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-gray-700 font-medium hover:bg-blue-50 dark:hover:bg-gray-750 transition-colors"
                            >
                                See Pricing Plans
                            </Link>
                        </div>
                        
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            No credit card required. Start with our free plan.
                        </p>
                    </div>
                </div>
            </section>
            
            {/* FAQ Section */}
            <section className="py-20 bg-white dark:bg-gray-900">
                <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Everything you need to know about Ziq
                        </p>
                    </div>
                    
                    <div className="space-y-6">
                        {[
                            {
                                question: "How is Ziq different from regular search engines?",
                                answer: "Unlike traditional search engines that return a list of links, Ziq processes information from multiple sources to provide comprehensive, synthesized answers with proper citations. It understands the context of your question and delivers research-quality responses."
                            },
                            {
                                question: "Is Ziq suitable for academic research?",
                                answer: "Yes! Ziq is designed with academic standards in mind. It provides citations for information sources, helping students and researchers maintain academic integrity while accelerating their research process."
                            },
                            {
                                question: "How accurate is the information Ziq provides?",
                                answer: "Ziq draws information from reputable academic and professional sources. While we strive for maximum accuracy, we always recommend verifying critical information through the provided citations and sources."
                            },
                            {
                                question: "Can I use Ziq for my business research needs?",
                                answer: "Absolutely. Ziq is equipped to handle market research, competitive analysis, and industry trend research to support business strategy and decision-making processes."
                            },
                            {
                                question: "What kind of data privacy does Ziq offer?",
                                answer: "We take data privacy seriously. Your research queries are not used to train our models without explicit consent, and we follow strict data protection standards to ensure your intellectual property remains secure."
                            }
                        ].map((faq, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.1 }}
                                className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl"
                            >
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                    {faq.question}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {faq.answer}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* Footer */}
            <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                                    <img src="/logo.png" alt="Ziq Logo" className="w-5 h-5 dark:invert" />
                                </div>
                                <span className="text-xl font-bold text-gray-900 dark:text-white">Ziq</span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Your AI-powered research assistant that helps you find, analyze, and synthesize information with speed and accuracy.
                            </p>
                            <div className="flex space-x-4">
                                <Link href="#" className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                                    <XLogo weight="fill" className="h-5 w-5" />
                                </Link>
                                <Link href="#" className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                                    <GithubLogo weight="fill" className="h-5 w-5" />
                                </Link>
                            </div>
                        </div>
                        
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Product</h3>
                            <ul className="space-y-3">
                                {['Features', 'Pricing', 'Use Cases', 'Testimonials', 'API'].map((item, i) => (
                                    <li key={i}>
                                        <Link href="#" className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Resources</h3>
                            <ul className="space-y-3">
                                {['Documentation', 'Blog', 'Tutorials', 'Support', 'FAQ'].map((item, i) => (
                                    <li key={i}>
                                        <Link href="#" className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Company</h3>
                            <ul className="space-y-3">
                                {['About Us', 'Careers', 'Privacy Policy', 'Terms of Service', 'Contact'].map((item, i) => (
                                    <li key={i}>
                                        <Link href="#" className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    
                    <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 md:mb-0">
                            © {new Date().getFullYear()} Ziq Research Assistant. All rights reserved.
                        </p>
                        <div className="flex space-x-6">
                            <Link href="#" className="text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                                Privacy Policy
                            </Link>
                            <Link href="#" className="text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                                Terms of Service
                            </Link>
                            <Link href="#" className="text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                                Cookies
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
                                