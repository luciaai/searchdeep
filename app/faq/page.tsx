"use client";

import { NavBar } from "@/components/nav-bar";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export default function FAQPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="container max-w-5xl mx-auto px-4 py-16"> {/* Increased top padding from py-8 to py-16 */}
        <div className="flex flex-col items-center justify-center mb-8 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 p-10 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg">
          <div className="relative h-48 w-48 mb-2 animate-pulse-subtle">
            <Image 
              src="/logo.png" 
              alt="Ziq Logo" 
              fill 
              className="object-contain drop-shadow-md"
              priority
            />
          </div>
          <div className="flex flex-col items-center">
            <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500 dark:from-blue-400 dark:to-teal-300">Frequently Asked Questions</h1>
            <div className="mt-3 flex flex-wrap gap-2 justify-center">
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">Professionals</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">Researchers</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">Teachers</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Students</span>
            </div>
            <div className="mt-4">
              <Link href="/" className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg">
                <ArrowLeft size={16} />
                Back to Search
              </Link>
            </div>
          </div>
        </div>

        <div className="mb-8 bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg transition-all duration-300">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500 dark:from-blue-400 dark:to-teal-300">About Ziq Search</h2>
          </div>
          <div className="pl-14"> {/* Align with the larger icon */}
            <p className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed">
              Ziq (pronounced "Zeek", meaning "seek") is an AI-powered search engine designed to help you find accurate information quickly. 
              It combines web search capabilities with advanced AI to provide comprehensive answers to your questions.
            </p>
            <p className="text-slate-700 dark:text-slate-300">
              Use the different search modes to tailor your search experience for specific types of information, and leverage the Memory feature to save important findings for future reference.
            </p>
          </div>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          <AccordionItem value="item-0" className="bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
            <AccordionTrigger className="px-4 py-3 text-lg font-medium hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors">How is Ziq pronounced?</AccordionTrigger>
            <AccordionContent>
              <div className="bg-white/50 dark:bg-slate-800/50 p-6 rounded-lg border-t border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-sm flex items-center mb-3 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-white px-3 py-1.5 rounded-full inline-flex max-w-fit">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  PRONUNCIATION
                </h4>
                <p className="text-sm mb-2">Ziq is pronounced "Zeek" (rhymes with "seek").</p>
                <div className="mt-3 p-2 bg-purple-50 dark:bg-purple-900/20 rounded border border-purple-100 dark:border-purple-800">
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    <span className="font-medium">Name Origin:</span> The name Ziq was chosen because it means "seek" – reflecting our mission to help you seek and find accurate information quickly and efficiently.
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-1" className="bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
            <AccordionTrigger className="px-4 py-3 text-lg font-medium hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors">How do I start a new search?</AccordionTrigger>
            <AccordionContent>
              <div className="bg-white/50 dark:bg-slate-800/50 p-6 rounded-lg border-t border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-sm flex items-center mb-3 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-white px-3 py-1.5 rounded-full inline-flex max-w-fit">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  STARTING A NEW SEARCH
                </h4>
                <p className="text-sm mb-2">There are two ways to start a new search:</p>
                <ul className="list-disc pl-6 text-sm space-y-1">
                  <li>Click the <strong>+ New</strong> button in the top navigation bar to reset the current session and start fresh. This clears your current search without affecting your login status.</li>
                  <li>Type your research question in the input field at the bottom of the page and press Enter or click the arrow button to submit.</li>
                </ul>
                <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-100 dark:border-blue-800">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <span className="font-medium">Pro tip:</span> When you ask additional questions after your initial search, Ziq remembers the context of your previous searches in the same session. 
                    This allows for follow-up questions and a more conversational experience. To start completely fresh without any previous context, use the + New button.
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
            <AccordionTrigger className="px-4 py-3 text-lg font-medium hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors">How do credits work?</AccordionTrigger>
            <AccordionContent>
              <div className="bg-white/50 dark:bg-slate-800/50 p-6 rounded-lg border-t border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-sm flex items-center mb-3 bg-gradient-to-r from-blue-600 to-amber-500 dark:from-blue-400 dark:to-amber-400 text-white px-3 py-1.5 rounded-full inline-flex max-w-fit">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                  </svg>
                  CREDIT SYSTEM
                </h4>
                <p className="text-sm mb-3">
                  Each search you perform uses one credit from your account. Your credit balance is displayed in the top navigation bar. Credits properly decrement after each search and your remaining balance is saved between sessions.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-100 dark:border-amber-800">
                    <p className="text-xs font-medium text-amber-700 dark:text-amber-300 mb-1">Free Account</p>
                    <ul className="list-disc pl-4 text-sm space-y-0.5 text-slate-700 dark:text-slate-300">
                      <li>Limited to 5 credits per month</li>
                      <li>Credits reset at the start of each month</li>
                      <li>Credits persist across login sessions</li>
                      <li>Access to all search types</li>
                    </ul>
                  </div>
                  
                  <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-100 dark:border-amber-800">
                    <p className="text-xs font-medium text-amber-700 dark:text-amber-300 mb-1">Pro Account</p>
                    <ul className="list-disc pl-4 text-sm space-y-0.5 text-slate-700 dark:text-slate-300">
                      <li>30 credits per month ($10/month)</li>
                      <li>Credits persist across login sessions</li>
                      <li>Priority support</li>
                      <li>Full access to all search features</li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <Link href="/pricing" className="inline-flex items-center text-sm font-medium text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 transition-colors">
                    <span>View subscription options</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
            <AccordionTrigger className="px-4 py-3 text-lg font-medium hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors">Can I upload files or images with my search?</AccordionTrigger>
            <AccordionContent>
              <div className="bg-white/50 dark:bg-slate-800/50 p-6 rounded-lg border-t border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-sm flex items-center mb-3 bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-blue-400 dark:to-emerald-400 text-white px-3 py-1.5 rounded-full inline-flex max-w-fit">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                  </svg>
                  ATTACHMENTS
                </h4>
                <p className="text-sm">
                  Yes! Click the attachment icon (paperclip) next to the input field to upload files or images.
                </p>
                
                <div className="flex items-start mt-3 space-x-3">
                  <div className="bg-emerald-100 dark:bg-emerald-800 rounded-full p-2 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600 dark:text-emerald-200" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H9V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L7 9.414V13H5.5z" />
                      <path d="M9 13h2v5a1 1 0 11-2 0v-5z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm mb-1 font-medium">How it works:</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Our AI can analyze these attachments to provide more contextual and relevant answers to your questions.
                      This is especially useful for research papers, data analysis, or when you need information about specific images.
                    </p>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
            <AccordionTrigger className="px-4 py-3 text-lg font-medium hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors">What search groups are available?</AccordionTrigger>
            <AccordionContent>
              <div className="bg-white/50 dark:bg-slate-800/50 p-6 rounded-lg border-t border-slate-200 dark:border-slate-700 mb-4">
                <h4 className="font-bold text-sm flex items-center mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 text-white px-3 py-1.5 rounded-full inline-flex max-w-fit">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  SEARCH GROUPS
                </h4>
                <p className="text-sm mb-3">
                  Ziq offers different search groups to optimize your results for specific types of queries. Select a search group from the dropdown menu in the input area. On mobile, tap the group icon first to expand the selection options.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {/* Image Search */}
                <div className="bg-white/50 dark:bg-slate-800/50 p-6 rounded-lg border-t border-slate-200 dark:border-slate-700">
                  <h4 className="font-bold text-sm flex items-center mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 text-white px-3 py-1.5 rounded-full inline-flex max-w-fit">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                    IMAGE SEARCH
                  </h4>
                  <p className="text-sm mb-2">
                    AI-generated images based on your search query.
                  </p>
                  
                  <ul className="list-disc pl-6 text-sm space-y-1">
                    <li>Creates custom AI-generated visuals</li>
                    <li>Images are not from websites and cannot be clicked through</li>
                    <li>Great for visual inspiration and concepts</li>
                    <li>Each image includes a clear &quot;AI Generated&quot; label</li>
                  </ul>
                  
                  <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded border border-indigo-100 dark:border-indigo-800 mt-3">
                    <p className="text-xs font-medium text-indigo-700 dark:text-indigo-300 mb-1">How Image Search Works</p>
                    <p className="text-xs text-slate-700 dark:text-slate-300">
                      Uses AI to generate original images based on your search terms. These are not web search results but custom-created visuals to help illustrate your query.
                    </p>
                    <div className="mt-2 bg-indigo-100 dark:bg-indigo-800/30 p-2 rounded">
                      <p className="text-xs italic text-slate-700 dark:text-slate-300">
                        <span className="font-medium">Example:</span> &quot;Mountain lake at sunset&quot; will generate AI images of mountain lakes at sunset, not search results from websites.
                      </p>
                    </div>
                  </div>
                </div>
                {/* Web Search */}
                <div className="bg-white/50 dark:bg-slate-800/50 p-6 rounded-lg border-t border-slate-200 dark:border-slate-700">
                  <h4 className="font-bold text-sm flex items-center mb-2 text-blue-600 dark:text-blue-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
                    </svg>
                    WEB SEARCH
                  </h4>
                  <p className="text-sm mb-2">
                    Our standard search mode for general research and information gathering.
                  </p>
                  
                  <ul className="list-disc pl-6 text-sm space-y-1">
                    <li>Comprehensive web search across multiple sources</li>
                    <li>Balanced results for general information needs</li>
                    <li>Well-formatted responses with citations</li>
                    <li>Best for everyday questions and research</li>
                  </ul>
                  
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-100 dark:border-blue-800 mt-3">
                    <p className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-1">How Web Search Works</p>
                    <p className="text-xs text-slate-700 dark:text-slate-300">
                      Searches multiple web sources simultaneously to find the most relevant information. Results are analyzed, synthesized, and presented with citations to help you verify sources.
                    </p>
                    <div className="mt-2 bg-blue-100 dark:bg-blue-800/30 p-2 rounded">
                      <p className="text-xs italic text-slate-700 dark:text-slate-300">
                        <span className="font-medium">Example:</span> &quot;What are the best practices for sustainable gardening?&quot; will search across gardening websites, environmental resources, and expert advice to provide a comprehensive answer with source links.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* News Search */}
                <div className="bg-white/50 dark:bg-slate-800/50 p-6 rounded-lg border-t border-slate-200 dark:border-slate-700">
                  <h4 className="font-bold text-sm flex items-center mb-2 text-green-600 dark:text-green-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd" />
                      <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z" />
                    </svg>
                    NEWS SEARCH
                  </h4>
                  <p className="text-sm mb-2">
                    Focused on current events and recent information from news sources.
                  </p>
                  
                  <ul className="list-disc pl-6 text-sm space-y-1">
                    <li>Prioritizes recent news articles and blogs</li>
                    <li>Focuses on timely and current information</li>
                    <li>Includes sources from major news outlets</li>
                    <li>Best for staying updated on current events</li>
                  </ul>
                  
                  <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-100 dark:border-green-800 mt-3">
                    <p className="text-xs font-medium text-green-700 dark:text-green-300 mb-1">How News Search Works</p>
                    <p className="text-xs text-slate-700 dark:text-slate-300">
                      Filters search results to focus on news outlets and recent publications. Prioritizes timeliness and relevance to current events, with special attention to publication dates.
                    </p>
                    <div className="mt-2 bg-green-100 dark:bg-green-800/30 p-2 rounded">
                      <p className="text-xs italic text-slate-700 dark:text-slate-300">
                        <span className="font-medium">Example:</span> &quot;What are the latest developments in renewable energy policy?&quot; will return recent news articles and press releases about policy changes, focusing on content published within the last few days or weeks.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Memory Group */}
                <div className="bg-white/50 dark:bg-slate-800/50 p-6 rounded-lg border-t border-slate-200 dark:border-slate-700">
                  <h4 className="font-bold text-sm flex items-center mb-2 text-purple-600 dark:text-purple-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v10H5V5z" />
                      <path d="M7 7h2v2H7V7zm0 4h2v2H7v-2zm4-4h2v2h-2V7zm4 0h2v2h-2V7zm-4 4h2v2h-2v-2zm4 0h2v2h-2v-2z" />
                    </svg>
                    MEMORY GROUP
                  </h4>
                  <p className="text-sm mb-2">
                    Your personal memory companion that creates a persistent knowledge base from your searches.
                  </p>
                  
                  <ul className="list-disc pl-6 text-sm space-y-1">
                    <li>Save important search results with simple commands</li>
                    <li>Build a personalized knowledge base over time</li>
                    <li>Retrieve past information with natural language</li>
                    <li>Perfect for ongoing research and projects</li>
                  </ul>
                  
                  <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded border border-purple-100 dark:border-purple-800 mt-3">
                    <p className="text-xs font-medium text-purple-700 dark:text-purple-300 mb-1">How Memory Works</p>
                    <p className="text-xs text-slate-700 dark:text-slate-300">
                      Ask Ziq to remember specific information. Your memories are saved to your personal database and persist across search sessions. All saved memories are private and only accessible to your account. Retrieve memories anytime by asking related questions.
                    </p>
                    <div className="mt-2 bg-purple-100 dark:bg-purple-800/30 p-2 rounded">
                      <p className="text-xs italic text-slate-700 dark:text-slate-300">
                        <span className="font-medium">Example:</span> &quot;Remember that my project deadline is May 15th&quot; or &quot;Save this information about renewable energy sources.&quot; Later, you can ask &quot;What&apos;s my project deadline?&quot; or &quot;What did I save about renewable energy?&quot;
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded border border-purple-100 dark:border-purple-800 mt-3">
                    <p className="text-xs font-medium text-purple-700 dark:text-purple-300 mb-1">Managing Your Memories</p>
                    <p className="text-xs text-slate-700 dark:text-slate-300">
                      <span className="font-medium">To delete a memory:</span> Ask Ziq to &quot;forget&quot; or &quot;delete&quot; specific information. For example, &quot;Please forget what I told you about [topic]&quot; or &quot;Delete my memory about [specific information].&quot; You can also manage your memories by asking to &quot;show all my memories&quot; and then selecting which ones to remove.
                    </p>
                  </div>
                </div>
                
                {/* Academic Search */}
                <div className="bg-white/50 dark:bg-slate-800/50 p-6 rounded-lg border-t border-slate-200 dark:border-slate-700">
                  <h4 className="font-bold text-sm flex items-center mb-2 text-amber-600 dark:text-amber-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                    ACADEMIC SEARCH
                  </h4>
                  <p className="text-sm mb-2">
                    Designed for scholarly research and educational content.
                  </p>
                  
                  <ul className="list-disc pl-6 text-sm space-y-1">
                    <li>Prioritizes scholarly articles and papers</li>
                    <li>Focuses on educational and academic content</li>
                    <li>Provides more detailed citations</li>
                    <li>Best for homework, research papers, and studying</li>
                  </ul>
                  
                  <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-100 dark:border-amber-800 mt-3">
                    <p className="text-xs font-medium text-amber-700 dark:text-amber-300 mb-1">How Academic Search Works</p>
                    <p className="text-xs text-slate-700 dark:text-slate-300">
                      Targets scholarly databases and educational resources to find academic content. Emphasizes peer-reviewed sources and includes detailed citations in academic format for research papers.
                    </p>
                    <div className="mt-2 bg-amber-100 dark:bg-amber-800/30 p-2 rounded">
                      <p className="text-xs italic text-slate-700 dark:text-slate-300">
                        <span className="font-medium">Example:</span> &quot;What are the recent advances in quantum computing?&quot; will prioritize scholarly articles, research papers, and academic publications with proper citations in academic format.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Local Search */}
                <div className="bg-white/50 dark:bg-slate-800/50 p-6 rounded-lg border-t border-slate-200 dark:border-slate-700">
                  <h4 className="font-bold text-sm flex items-center mb-2 text-rose-600 dark:text-rose-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    LOCAL SEARCH
                  </h4>
                  <p className="text-sm mb-2">
                    Provides location-specific information and results.
                  </p>
                  
                  <ul className="list-disc pl-6 text-sm space-y-1">
                    <li>Focuses on location-relevant information</li>
                    <li>Helps find nearby services and businesses</li>
                    <li>Provides region-specific details</li>
                    <li>Best for travel planning and local information</li>
                  </ul>
                  
                  <div className="p-2 bg-rose-50 dark:bg-rose-900/20 rounded border border-rose-100 dark:border-rose-800 mt-3">
                    <p className="text-xs font-medium text-rose-700 dark:text-rose-300 mb-1">How Local Search Works</p>
                    <p className="text-xs text-slate-700 dark:text-slate-300">
                      Uses your location data (with permission) to find relevant local information. Prioritizes nearby businesses, services, and region-specific content to help you find what you need in your area.
                    </p>
                    <div className="mt-2 bg-rose-100 dark:bg-rose-800/30 p-2 rounded">
                      <p className="text-xs italic text-slate-700 dark:text-slate-300">
                        <span className="font-medium">Example:</span> &quot;What are the best restaurants near me?&quot; or &quot;Where can I find hiking trails in my area?&quot; will use your location to provide results specific to your geographic area.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg mt-4 border border-slate-200 dark:border-slate-800">
                <h4 className="font-bold text-sm flex items-center mb-2 text-indigo-600 dark:text-indigo-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  EXTREME MODE
                </h4>
                <p className="text-sm mb-2">
                  Our most powerful search option, designed for in-depth research and complex topics.
                </p>
                
                <ul className="list-disc pl-6 text-sm space-y-1">
                  <li>Uses advanced &quot;reason_search&quot; technology</li>
                  <li>Searches web and academic sources simultaneously</li>
                  <li>Provides comprehensive inline citations</li>
                  <li>Supports LaTeX for mathematical equations</li>
                </ul>
                
                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded border border-indigo-100 dark:border-indigo-800 mt-3">
                  <p className="text-xs font-medium text-indigo-700 dark:text-indigo-300 mb-1">How Extreme Mode Works</p>
                  <p className="text-xs text-slate-700 dark:text-slate-300">
                    Conducts multi-step research automatically by combining multiple search types in one query. Analyzes and synthesizes information to create structured, citation-rich responses.
                  </p>
                  <div className="mt-2 bg-indigo-100 dark:bg-indigo-800/30 p-2 rounded">
                    <p className="text-xs italic text-slate-700 dark:text-slate-300">
                      <span className="font-medium">Example:</span> &quot;Explain the implications of quantum computing on modern cryptography&quot; will perform deep research across academic papers, technical blogs, and expert analyses, providing a comprehensive answer with detailed citations and potentially including mathematical formulas in LaTeX format.
                    </p>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5" className="bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
            <AccordionTrigger className="px-4 py-3 text-lg font-medium hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors">How do I log in or create an account?</AccordionTrigger>
            <AccordionContent>
              <div className="bg-white/50 dark:bg-slate-800/50 p-6 rounded-lg border-t border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-sm flex items-center mb-3 bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 text-white px-3 py-1.5 rounded-full inline-flex max-w-fit">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                  </svg>
                  ACCOUNT ACCESS
                </h4>
                <p className="text-sm mb-3">
                  Creating an account allows you to track your credit usage and access premium features if you choose to subscribe.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-100 dark:border-blue-800">
                    <p className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-1">Sign In</p>
                    <ul className="list-disc pl-4 text-sm space-y-0.5 text-slate-700 dark:text-slate-300">
                      <li>Click &quot;Sign In&quot; in the top right corner</li>
                      <li>Use your Google account for quick access</li>
                      <li>Or sign in with your email and password</li>
                    </ul>
                  </div>
                  
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-100 dark:border-blue-800">
                    <p className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-1">Create Account</p>
                    <ul className="list-disc pl-4 text-sm space-y-0.5 text-slate-700 dark:text-slate-300">
                      <li>Click &quot;Sign In&quot; in the top right corner</li>
                      <li>Select &quot;Create account&quot; option</li>
                      <li>Follow the simple registration steps</li>
                    </ul>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-6" className="bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
            <AccordionTrigger className="px-4 py-3 text-lg font-medium hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors">How do I download or copy my search results?</AccordionTrigger>
            <AccordionContent>
              <div className="bg-white/50 dark:bg-slate-800/50 p-6 rounded-lg border-t border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-sm flex items-center mb-3 bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-blue-400 dark:to-emerald-400 text-white px-3 py-1.5 rounded-full inline-flex max-w-fit">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  SAVING YOUR RESULTS
                </h4>
                <p className="text-sm mb-3">
                  Ziq provides multiple ways to save and share your search results:
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded border border-emerald-100 dark:border-emerald-800">
                    <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300 mb-1">Download Feature</p>
                    <ul className="list-disc pl-4 text-sm space-y-0.5 text-slate-700 dark:text-slate-300">
                      <li>Click the download icon in the top right</li>
                      <li>Saves the entire conversation as a text file</li>
                      <li>Includes all AI responses and citations</li>
                      <li>Does not include the top scroll website list</li>
                    </ul>
                  </div>
                  
                  <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded border border-emerald-100 dark:border-emerald-800">
                    <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300 mb-1">Copy Feature</p>
                    <ul className="list-disc pl-4 text-sm space-y-0.5 text-slate-700 dark:text-slate-300">
                      <li>Click the copy icon next to any AI response</li>
                      <li>Copies only that specific response to clipboard</li>
                      <li>Includes citations from that response</li>
                      <li>Ready to paste into documents or emails</li>
                    </ul>
                  </div>
                </div>
                
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-100 dark:border-blue-800">
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    <span className="font-medium">Pro tip:</span> If you need to save the complete list of websites from the top scroll area, you can manually select and copy them before downloading the conversation. This ensures you have access to all discovered sources for your research.
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-7" className="bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
            <AccordionTrigger className="px-4 py-3 text-lg font-medium hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors">Can I see my search history?</AccordionTrigger>
            <AccordionContent>
              <div className="bg-white/50 dark:bg-slate-800/50 p-6 rounded-lg border-t border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-sm flex items-center mb-3 bg-gradient-to-r from-blue-600 to-orange-600 dark:from-blue-400 dark:to-orange-400 text-white px-3 py-1.5 rounded-full inline-flex max-w-fit">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  SEARCH HISTORY
                </h4>
                <p className="text-sm mb-3">
                  Your search history is saved when you&apos;re signed in, allowing you to revisit and repeat previous searches. <span className="font-medium">Note:</span> Only your search queries are saved, not the search results or content. Use the Memory feature to save important content.
                </p>
                
                <div className="flex items-start space-x-3 mb-3">
                  <div className="bg-orange-100 dark:bg-orange-800 rounded-full p-2 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-600 dark:text-orange-200" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm mb-1 font-medium">Accessing Your History:</p>
                    <ol className="list-decimal pl-4 text-sm space-y-0.5 text-slate-700 dark:text-slate-300">
                      <li>Click the Info icon (ⓘ) in the top navigation bar</li>
                      <li>Select &quot;History&quot; from the dropdown menu</li>
                      <li>View a table of your past searches with options to repeat them</li>
                    </ol>
                  </div>
                </div>
                
                <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded border border-orange-100 dark:border-orange-800">
                  <p className="text-xs text-orange-700 dark:text-orange-300">
                    <span className="font-medium">How Search History Works:</span> Only your search queries are saved (not the results or content). History includes the query text, search type, and timestamp. To save important content from your searches, you can: 1) Use the Memory Group feature to save content within the app, or 2) Copy and paste important text to your own documents.
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-7" className="bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
            <AccordionTrigger className="px-4 py-3 text-lg font-medium hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors">How accurate are the search results?</AccordionTrigger>
            <AccordionContent>
              <div className="bg-white/50 dark:bg-slate-800/50 p-6 rounded-lg border-t border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-sm flex items-center mb-3 bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-400 dark:to-green-400 text-white px-3 py-1.5 rounded-full inline-flex max-w-fit">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  SEARCH ACCURACY
                </h4>
                <p className="text-sm mb-3">
                  Ziq combines traditional web search with AI processing to provide the most accurate results possible.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-100 dark:border-green-800">
                    <p className="text-xs font-medium text-green-700 dark:text-green-300 mb-1">Verification Features</p>
                    <ul className="list-disc pl-4 text-sm space-y-0.5 text-slate-700 dark:text-slate-300">
                      <li>Proper citations with source links</li>
                      <li>Transparent information sourcing</li>
                      <li>Ability to check original sources</li>
                    </ul>
                  </div>
                  
                  <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-100 dark:border-green-800">
                    <p className="text-xs font-medium text-green-700 dark:text-green-300 mb-1">AI Quality Controls</p>
                    <ul className="list-disc pl-4 text-sm space-y-0.5 text-slate-700 dark:text-slate-300">
                      <li>Minimized hallucinations</li>
                      <li>Factual, well-researched answers</li>
                      <li>Multiple source verification</li>
                    </ul>
                  </div>
                </div>
                
                <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-100 dark:border-amber-800 mt-3">
                  <p className="text-xs text-amber-700 dark:text-amber-300">
                    <span className="font-medium">How Credits Work:</span> Credits are deducted immediately after each search. Your remaining credits are saved and will be available when you log back in. Credits do not reset until the start of each month, ensuring you get full use of your monthly allocation.
                  </p>
                </div>
                
                <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-100 dark:border-yellow-800 mt-3">
                  <p className="text-xs text-yellow-700 dark:text-yellow-300">
                    <span className="font-medium">Note:</span> For academic or professional research, we recommend verifying critical information with multiple authoritative sources.
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-8" className="bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
            <AccordionTrigger className="px-4 py-3 text-lg font-medium hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors">Is my search data private?</AccordionTrigger>
            <AccordionContent>
              <div className="bg-white/50 dark:bg-slate-800/50 p-6 rounded-lg border-t border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-sm flex items-center mb-3 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-white px-3 py-1.5 rounded-full inline-flex max-w-fit">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  PRIVACY & DATA
                </h4>
                <p className="text-sm mb-3">
                  Ziq is designed with your privacy in mind. We store minimal data to provide our services while protecting your information.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded border border-purple-100 dark:border-purple-800">
                    <p className="text-xs font-medium text-purple-700 dark:text-purple-300 mb-1">What We Store</p>
                    <ul className="list-disc pl-4 text-sm space-y-0.5 text-slate-700 dark:text-slate-300">
                      <li>Your account information</li>
                      <li>Usage data for credits</li>
                      <li>Subscription status</li>
                      <li>Current session search history</li>
                    </ul>
                  </div>
                  
                  <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded border border-purple-100 dark:border-purple-800">
                    <p className="text-xs font-medium text-purple-700 dark:text-purple-300 mb-1">What We Don&apos;t Store</p>
                    <ul className="list-disc pl-4 text-sm space-y-0.5 text-slate-700 dark:text-slate-300">
                      <li>Permanent search content</li>
                      <li>Personal browsing habits</li>
                      <li>Your uploaded attachments</li>
                      <li>Search results long-term</li>
                    </ul>
                  </div>
                </div>
                
                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded border border-indigo-100 dark:border-indigo-800">
                  <p className="text-xs text-indigo-700 dark:text-indigo-300">
                    <span className="font-medium">Important:</span> Your search history is only accessible to you when logged into your account. We do not share your search data with third parties. You are responsible for saving any important information you find.
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-9" className="bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
            <AccordionTrigger className="px-4 py-3 text-lg font-medium hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors">How do I provide feedback or report issues?</AccordionTrigger>
            <AccordionContent>
              <div className="bg-white/50 dark:bg-slate-800/50 p-6 rounded-lg border-t border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-sm flex items-center mb-3 bg-gradient-to-r from-blue-600 to-sky-600 dark:from-blue-400 dark:to-sky-400 text-white px-3 py-1.5 rounded-full inline-flex max-w-fit">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  FEEDBACK & SUPPORT
                </h4>
                <p className="text-sm mb-3">
                  We&apos;re constantly improving Ziq based on user feedback. If you encounter any issues or have suggestions for new features,
                  please contact our support team.
                </p>
                
                <div className="flex items-center justify-center p-3 bg-sky-50 dark:bg-sky-900/20 rounded border border-sky-100 dark:border-sky-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sky-600 dark:text-sky-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <a href="mailto:ziqnow@gmail.com" className="text-sm font-medium text-sky-600 dark:text-sky-400 hover:underline">ziqnow@gmail.com</a>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-10" className="bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
            <AccordionTrigger className="px-4 py-3 text-lg font-medium hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors">How does the mobile experience differ from desktop?</AccordionTrigger>
            <AccordionContent>
              <div className="bg-white/50 dark:bg-slate-800/50 p-6 rounded-lg border-t border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-sm flex items-center mb-3 bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 text-white px-3 py-1.5 rounded-full inline-flex max-w-fit">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  MOBILE EXPERIENCE
                </h4>
                <p className="text-sm mb-3">
                  Ziq is fully responsive and works on all devices. The mobile experience is optimized for touch interaction while maintaining all core functionality.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-start space-x-2">
                    <div className="bg-violet-100 dark:bg-violet-800 rounded-full p-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-violet-600 dark:text-violet-200" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-violet-700 dark:text-violet-300">Group Selection</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Tap to expand before selecting a search group</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <div className="bg-violet-100 dark:bg-violet-800 rounded-full p-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-violet-600 dark:text-violet-200" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-violet-700 dark:text-violet-300">New Button</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Always accessible at the top of the screen</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <div className="bg-violet-100 dark:bg-violet-800 rounded-full p-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-violet-600 dark:text-violet-200" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-violet-700 dark:text-violet-300">Attachments</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Controls adapt to smaller screen size</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <div className="bg-violet-100 dark:bg-violet-800 rounded-full p-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-violet-600 dark:text-violet-200" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-violet-700 dark:text-violet-300">Core Functionality</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Optimized for touch interaction</p>
                    </div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-11" className="bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center text-left">
                <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zm-1-5a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1zm1-4a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Understanding Search Results and Downloads</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Learn about how search results are displayed and what gets saved when you download</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6 pt-2">
              <div className="space-y-4">
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">What's the difference between the top scroll websites and the websites in the AI's response?</h4>
                  <p className="text-slate-700 dark:text-slate-300">The top scroll area shows all websites found by our search engine, while the AI's response only includes the most relevant sources as citations. Think of the top scroll as a complete bibliography and the response citations as footnotes for specific information. The top scroll gives you access to additional resources that may contain useful information not directly cited in the AI's response.</p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">Why do I see more websites in the top scroll than in the AI's response?</h4>
                  <p className="text-slate-700 dark:text-slate-300">The AI only cites sources that directly contributed to answering your question. The top scroll shows all discovered sources, giving you complete transparency and additional resources to explore. This allows you to investigate topics more deeply by accessing sources that may contain related information not specifically included in the AI's answer.</p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">When I download a conversation, what content is included?</h4>
                  <p className="text-slate-700 dark:text-slate-300">Downloads include the complete conversation between you and the AI, including any citations the AI provided in its responses. The download does not include the complete list of websites from the top scroll area. This makes it easy to save your research while keeping file sizes manageable. If you need the full list of sources, you can manually copy them from the top scroll area before downloading.</p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">How does the copy feature work?</h4>
                  <p className="text-slate-700 dark:text-slate-300">The copy feature allows you to copy the AI's response to your clipboard. When you click the copy button, only the AI's response text and its direct citations are copied—not your questions or the complete list of websites from the top scroll. This makes it easy to paste the information into documents, emails, or other applications while maintaining source attribution.</p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">If I repeat a search from my history, will I get the same websites?</h4>
                  <p className="text-slate-700 dark:text-slate-300">Not necessarily. Each search is a fresh request to our search engine, which may return different results based on updated web content, changes to search algorithms, or new available information. This ensures you always get the most current information available.</p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">How many searches do I get with a free account?</h4>
                  <p className="text-slate-700 dark:text-slate-300">Free accounts come with 5 credits per month. Each search uses 1 credit, regardless of the type of search. Your credits will persist across sessions and only reset at the beginning of each month.</p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="mt-8 text-center">
          <Link href="/">
            <Button className="gap-2 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 shadow-md hover:shadow-lg transition-all duration-300">
              Start Searching
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
