/* eslint-disable @next/next/no-img-element */
"use client";

import { GithubLogo, XLogo } from '@phosphor-icons/react';
import { Bot, Brain, Command, GraduationCap, ImageIcon, Search, Share2, Sparkles, Star, Trophy, Users, AlertTriangle, Github, Twitter, ArrowRight, ChevronRight, FileText, BookOpen, BarChart, Briefcase, Lightbulb, Clock, ExternalLink, CheckCircle, MessageCircle, FileCheck } from 'lucide-react';
import Image from 'next/image';
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

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
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
                                Your AI research companion that delivers deep insights with cited sources for all your search needs.
                            </DialogDescription>
                        </DialogHeader>
                        
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="flex flex-col items-center p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                                <Search className="h-7 w-7 text-blue-500 mb-2" />
                                <p className="text-sm text-gray-600 dark:text-gray-300 text-center">Deep Research</p>
                            </div>
                            <div className="flex flex-col items-center p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                                <BookOpen className="h-7 w-7 text-blue-500 mb-2" />
                                <p className="text-sm text-gray-600 dark:text-gray-300 text-center">Quality Sources</p>
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
            {/* <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
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
            </header> */}

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
                                Specialized for Students of All Ages, Educators & Homeschoolers
                            </div>
                            
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500 dark:from-blue-400 dark:to-teal-300">
                                Smart Search for <br/>
                                Curious Minds
                            </h1>
                            
                            <div className="mt-3 mb-4 flex flex-wrap gap-2">
                                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">Deep Research</span>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">Quality Sources</span>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">Smart Synthesis</span>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Instant Insights</span>
                            </div>
                            
                            <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-3">
                                Discover More With Less Searching
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                                Ziq transforms how educators, students of all ages, and homeschooling families discover and utilize knowledge. Access scholarly sources, find curriculum materials, and discover engaging learning experiences with clickable source links that let you explore the original information.
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
                                    className="absolute right-2 top-2 px-4 h-10 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                                >
                                    <span>Ask Ziq</span>
                                    <ArrowRight size={16} />
                                </button>
                            </form>
                            

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
                        <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500 dark:from-blue-400 dark:to-teal-300">
                            Discover More, Search Less
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Ziq empowers curious minds to find, explore, and synthesize valuable information from diverse quality sources across the web
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Search,
                                title: "Everyday Research",
                                description: "Find answers to everyday questions with AI-powered search that cuts through the noise to deliver quality information",
                                color: "blue"
                            },
                            {
                                icon: BookOpen,
                                title: "Deep Research",
                                description: "Find and access peer-reviewed academic papers, research journals, and scholarly publications with source attribution",
                                color: "violet"
                            },
                            {
                                icon: Users,
                                title: "Quality Sources",
                                description: "Find age-appropriate learning materials, curriculum options, and educational activities aligned with educational standards",
                                color: "indigo"
                            },
                            {
                                icon: Brain,
                                title: "Smart Synthesis",
                                description: "Get AI-powered summaries that connect information from multiple sources to answer complex questions",
                                color: "cyan"
                            },
                            {
                                icon: FileText,
                                title: "Instant Insights",
                                description: "Responses include clickable links to source websites, making it easy to access and verify original information",
                                color: "emerald"
                            },
                            {
                                icon: Lightbulb,
                                title: "Professional Research",
                                description: "Support for business, technical, and professional research needs with focused, relevant information gathering",
                                color: "amber"
                            }
                        ].map((feature, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="p-6 bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg transition-all duration-300"
                            >
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 dark:from-blue-400 dark:to-teal-300 flex items-center justify-center mb-5">
                                    <feature.icon className="w-6 h-6 text-white" />
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
                        <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500 dark:from-blue-400 dark:to-teal-300">
                            How Ziq Works: From Question to Answer
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Powered by advanced search technology and AI to help you find quality information
                        </p>
                    </div>
                    
                    <div className="max-w-4xl mx-auto relative">
                        <div className="absolute left-8 md:left-16 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                        
                        {[
                            {
                                title: "Ask Your Question",
                                description: "Enter any question about a topic you're researching, whether it's academic, professional, or personal interest.",
                                icon: Search
                            },
                            {
                                title: "Smart Search Technology",
                                description: "Ziq searches across the web, news sources, and scholarly resources to find the most relevant information for your query.",
                                icon: BookOpen
                            },
                            {
                                title: "Smart Synthesis",
                                description: "Advanced AI analyzes and organizes the search results to create a comprehensive response to your question.",
                                icon: Brain
                            },
                            {
                                title: "Sourced Answers",
                                description: "Receive clear, concise answers with links to source websites so you can verify information and explore further.",
                                icon: FileCheck
                            },
                            {
                                title: "Deeper Exploration",
                                description: "Ask follow-up questions to dig deeper into your topic or explore related concepts and connections.",
                                icon: MessageCircle
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
                        <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500 dark:from-blue-400 dark:to-teal-300">
                            Specialized Research Tools for Everyone
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Ziq helps Students of All Ages, Educators, and Homeschooling Families find the information they need
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            {
                                icon: BookOpen,
                                title: "For Students of All Ages",
                                description: "Access quality information sources, learning materials, and publications with Ziq's comprehensive search capabilities for any topic you want to explore deeply.",
                                features: [
                                    "Age-appropriate resources",
                                    "Learning materials",
                                    "Source links",
                                    "Comprehensive coverage"
                                ]
                            },
                            {
                                icon: GraduationCap,
                                title: "For Academic Educators",
                                description: "Find engaging curriculum materials, discover lesson plans aligned with standards, and access the latest educational research and teaching methodologies.",
                                features: [
                                    "Educational resource discovery",
                                    "Academic research access",
                                    "Teaching methodology information",
                                    "Curriculum planning assistance"
                                ]
                            },
                            {
                                icon: Users,
                                title: "For Homeschooling Families",
                                description: "Find age-appropriate learning materials, explore curriculum options to meet individual learning needs, and discover resources that connect educational concepts across subjects.",
                                features: [
                                    "Homeschool curriculum resources",
                                    "Educational activities and materials",
                                    "Grade-level appropriate content",
                                    "Multi-subject learning resources"
                                ]
                            }
                        ].map((useCase, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-slate-200 dark:border-slate-700"
                            >
                                <div className="p-8">
                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 dark:from-blue-400 dark:to-teal-300 flex items-center justify-center mb-6">
                                        <useCase.icon className="w-6 h-6 text-white" />
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
                                                <Check size={18} className="text-teal-500 mt-0.5 flex-shrink-0" />
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
                        <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500 dark:from-blue-400 dark:to-teal-300">
                            What Our Users Say
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            See how Ziq is transforming research for people like you
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                quote: "Ziq has completely transformed my research process. I can find relevant information in seconds rather than hours, with sources I can trust.",
                                name: "Nick Kukaj",
                                title: "Product Manager"
                            },
                            {
                                quote: "The Ziq Deep mode is a game-changer. It provides comprehensive answers with verified sources that I can actually cite in my work.",
                                name: "Ross Cohen",
                                title: "Content Strategist"
                            },
                            {
                               quote: "As I was looking for info on a class I was teaching, I found ZIQ directly clear and concise answered my questions and was instrumental in my successful teaching of the class. I recommend ZIQ to anyone who is looking for info on a topic without all the links.",
                                name: "Steven Walker",
                                title: "Electrician & Homeschool Dad"
                            }
                        ].map((testimonial, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg transition-all duration-300"
                            >
                                <div className="mb-6">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="inline-block w-5 h-5 text-yellow-400 fill-yellow-400" />
                                    ))}
                                </div>
                                
                                <blockquote className="text-gray-700 dark:text-gray-300 mb-6">
                                    &ldquo;{testimonial.quote}&rdquo;
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
            
            {/* Founder's Perspective */}
            <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Founder's Perspective</h2>
                            <p className="text-lg text-gray-600 dark:text-gray-400">Why I created Ziq</p>
                        </div>
                        
                        <div className="flex flex-col md:flex-row gap-8 items-center mb-10">
                            <div className="w-32 h-32 rounded-full overflow-hidden flex-shrink-0 border-2 border-blue-500 dark:border-blue-400">
                                {/* Replace the src with your actual image path once you add your photo */}
                                <Image 
                                    src="/images/founder.jpg" 
                                    alt="Lucia Walker, Founder of Ziq" 
                                    width={128} 
                                    height={128} 
                                    className="object-cover w-full h-full"
                                />
                            </div>
                            
                            <div>
                                <blockquote className="text-lg text-gray-700 dark:text-gray-300 mb-4 italic">
                                    "As both the founder of Ziq and a homeschool mom, I've seen firsthand how challenging it can be to find quality educational resources efficiently. I created Ziq because I wanted to create a way for my boys to quickly find quality information and spend less time searching and more time learning. Now they can explore topics deeply with reliable sources, while I can easily find age-appropriate materials for their studies. It's my mission to make learning more engaging and efficient for students of all ages, educators, and homeschooling families everywhere."
                                </blockquote>
                                
                                <div className="font-semibold text-gray-900 dark:text-white">
                                    Lucia Walker
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Founder & CEO, Homeschool Mom
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Why Choose Ziq */}
            <section className="py-20 bg-blue-600 dark:bg-blue-900">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-white mb-4">Why Choose Ziq</h2>
                        <p className="text-blue-100 max-w-3xl mx-auto">Experience the difference with our research-focused approach</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { icon: <Clock className="h-8 w-8 mx-auto mb-3 text-blue-200" />, label: "Find Information Faster" },
                            { icon: <CheckCircle className="h-8 w-8 mx-auto mb-3 text-blue-200" />, label: "Access to Source Links" },
                            { icon: <Lightbulb className="h-8 w-8 mx-auto mb-3 text-blue-200" />, label: "Organized Results" },
                            { icon: <BookOpen className="h-8 w-8 mx-auto mb-3 text-blue-200" />, label: "Scholarly Resources" }
                        ].map((feature, i) => (
                            <div key={i} className="space-y-2">
                                <div className="text-white">
                                    {feature.icon}
                                </div>
                                <div className="text-blue-100">
                                    {feature.label}
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
                            Discover how Ziq can make your research process faster, deeper, and more effective. Join our growing community of users who are transforming the way they find and synthesize information.
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
                                answer: "Unlike traditional search engines that return a list of links, Ziq processes information from multiple sources to provide comprehensive, synthesized answers with links to original sources. It helps students of all ages, educators, and homeschoolers find relevant information faster by organizing search results into a coherent response."
                            },
                            {
                                question: "How can homeschooling families benefit from Ziq?",
                                answer: "Homeschooling families can use Ziq to find age-appropriate learning materials and educational resources across all subjects. It helps parents discover content for curriculum development, research teaching approaches, and access educational materials while providing links to original sources for deeper exploration."
                            },
                            {
                                question: "How can students use Ziq for their studies?",
                                answer: "High school and college students can use Ziq to research topics for assignments, find study materials, and explore subjects in greater depth. The organized responses help students gather information efficiently, while source links allow them to verify information and cite original sources in their work."
                            },
                            {
                                question: "How can educators use Ziq?",
                                answer: "Educators can use Ziq to find teaching resources, research subject matter, and discover educational content across various topics. The organized responses with source links help save time when preparing lessons or expanding knowledge on educational topics."
                            },
                            {
                                question: "How does Ziq support students of all ages?",
                                answer: "Students of all ages can use Ziq to explore topics they're curious about, research subjects for assignments, and find learning materials at their level. The organized responses make information more accessible, while source links allow students to verify information and explore topics more deeply at their own pace."
                            },
                            {
                                question: "What kind of data privacy does Ziq offer?",
                                answer: "We take data privacy seriously. Your research queries are handled according to our privacy policy, and we follow data protection standards to ensure your information remains secure."
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
                        </div>
                        
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Product</h3>
                            <ul className="space-y-3">
                                {['Features', 'Use Cases', 'Testimonials'].map((item, i) => (
                                    <li key={i}>
                                        {item === 'Features' && <Link href="#features" className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">{item}</Link>}
                                        {item === 'Use Cases' && <Link href="#use-cases" className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">{item}</Link>}
                                        {item === 'Testimonials' && <Link href="#testimonials" className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">{item}</Link>}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Resources</h3>
                            <ul className="space-y-3">
                                {['Documentation', 'Blog', 'Tutorials', 'Support', 'FAQ'].map((item, i) => (
                                    <li key={i}>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {item}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Company</h3>
                            <ul className="space-y-3">
                                {['About Us', 'Careers', 'Privacy Policy', 'Terms of Service', 'Contact'].map((item, i) => (
                                    <li key={i}>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {item}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    
                    <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 md:mb-0">
                            &copy; {new Date().getFullYear()} Ziq Research Assistant. All rights reserved.
                        </p>
                        <div className="flex space-x-6">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                Privacy Policy
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                Terms of Service
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                Cookies
                            </span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}