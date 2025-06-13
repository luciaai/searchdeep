import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { isAdmin } from '@/lib/admin';
import fs from 'fs';
import path from 'path';
import { Feedback } from '@prisma/client';

// Define a type for feedback items that might come from the JSON file
type FeedbackItem = {
  id: string;
  type: string;
  message: string;
  subject?: string;
  name?: string;
  email?: string;
  userId?: string;
  rating?: number;
  review?: string;
  status: string;
  isReward: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
};

// Prevent static generation for this route
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.userId;
    
    if (!userId) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Check if user is admin
    const adminCheck = await isAdmin();
    if (!adminCheck) {
      return new NextResponse(JSON.stringify({ error: 'Forbidden' }), { 
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Try to fetch feedback from both database and JSON file
    let feedbackFromDb: Feedback[] = [];
    let feedbackFromFile: FeedbackItem[] = [];
    
    // Try to fetch from database first (primary source)
    try {
      console.log('Admin Feedback API: Fetching feedback from database');
      feedbackFromDb = await prisma.feedback.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });
      console.log(`Admin Feedback API: Found ${feedbackFromDb.length} feedback entries in database`);
    } catch (dbError) {
      console.error('Admin Feedback API: Error fetching from database:', dbError);
    }
    
    // Read from JSON file as fallback
    const feedbackFilePath = path.join(process.cwd(), 'data', 'feedback.json');
    console.log('Admin Feedback API: Looking for feedback file at:', feedbackFilePath);
    try {
      if (fs.existsSync(feedbackFilePath)) {
        console.log('Admin Feedback API: Feedback file exists, reading content');
        const fileContent = fs.readFileSync(feedbackFilePath, 'utf8');
        feedbackFromFile = JSON.parse(fileContent) as FeedbackItem[];
        console.log(`Admin Feedback API: Found ${feedbackFromFile.length} feedback entries in JSON file`);
      } else {
        console.log('Admin Feedback API: Feedback file does not exist');
      }
    } catch (fileError) {
      console.error('Admin Feedback API: Error reading feedback file:', fileError);
    }
    
    // Combine feedback from both sources, removing duplicates by ID
    const allFeedbackMap = new Map<string, Feedback | FeedbackItem>();
    
    // Add database feedback first (primary source)
    if (Array.isArray(feedbackFromDb) && feedbackFromDb.length > 0) {
      console.log(`Admin Feedback API: Processing ${feedbackFromDb.length} database feedback items`);
      feedbackFromDb.forEach((item: Feedback) => {
        allFeedbackMap.set(item.id, item);
      });
    }
    
    // Add file feedback, but only if not already in database
    if (Array.isArray(feedbackFromFile) && feedbackFromFile.length > 0) {
      console.log(`Admin Feedback API: Processing ${feedbackFromFile.length} file feedback items`);
      feedbackFromFile.forEach((item: FeedbackItem) => {
        if (!allFeedbackMap.has(item.id)) {
          allFeedbackMap.set(item.id, item);
        }
      });
    }
    
    // Convert map back to array and sort by createdAt
    const combinedFeedback: (Feedback | FeedbackItem)[] = Array.from(allFeedbackMap.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
    console.log(`Admin Feedback API: Returning ${combinedFeedback.length} combined feedback items`);
    
    // Log environment information for debugging production issues
    console.log('Admin Feedback API: Environment:', {
      nodeEnv: process.env.NODE_ENV,
      isProd: process.env.NODE_ENV === 'production',
      cwd: process.cwd(),
      dataPath: path.join(process.cwd(), 'data'),
      fileExists: fs.existsSync(feedbackFilePath),
      feedbackCounts: {
        fromDb: feedbackFromDb.length,
        fromFile: feedbackFromFile.length,
        combined: combinedFeedback.length
      }
    });
    
    return new NextResponse(JSON.stringify({ feedback: combinedFeedback }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0'
      }
    });
  } catch (error) {
    console.error('Error in admin feedback API:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Update feedback status
export async function PUT(req: Request) {
  try {
    const session = await auth();
    const userId = session?.userId;
    
    if (!userId) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Check if user is admin
    const adminCheck = await isAdmin();
    if (!adminCheck) {
      return new NextResponse(JSON.stringify({ error: 'Forbidden' }), { 
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Parse request body
    const body = await req.json();
    const { id, status } = body;
    
    if (!id || !status) {
      return new NextResponse(JSON.stringify({ error: 'Missing required fields' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Validate status
    const validStatuses = ['new', 'reviewed', 'pending', 'resolved'];
    if (!validStatuses.includes(status)) {
      return new NextResponse(JSON.stringify({ error: 'Invalid status' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    console.log(`Admin Feedback API: Updating feedback ${id} status to ${status}`);
    
    // Try to update in database first
    try {
      const updatedFeedback = await prisma.feedback.update({
        where: { id },
        data: { status }
      });
      
      console.log('Admin Feedback API: Successfully updated feedback in database');
      return new NextResponse(JSON.stringify({ 
        success: true, 
        message: 'Feedback status updated successfully',
        feedback: updatedFeedback
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (dbError) {
      console.error('Admin Feedback API: Error updating in database:', dbError);
      
      // Fall back to file update
      try {
        const feedbackFilePath = path.join(process.cwd(), 'data', 'feedback.json');
        
        if (!fs.existsSync(feedbackFilePath)) {
          throw new Error('Feedback file not found');
        }
        
        const fileContent = fs.readFileSync(feedbackFilePath, 'utf8');
        const feedbackList = JSON.parse(fileContent);
        
        // Find and update the feedback item
        const feedbackIndex = feedbackList.findIndex((item: any) => item.id === id);
        
        if (feedbackIndex === -1) {
          throw new Error('Feedback not found');
        }
        
        // Update the status
        feedbackList[feedbackIndex].status = status;
        feedbackList[feedbackIndex].updatedAt = new Date().toISOString();
        
        // Write back to file
        fs.writeFileSync(feedbackFilePath, JSON.stringify(feedbackList, null, 2), 'utf8');
        
        console.log('Admin Feedback API: Successfully updated feedback in file');
        return new NextResponse(JSON.stringify({ 
          success: true, 
          message: 'Feedback status updated successfully (file fallback)',
          feedback: feedbackList[feedbackIndex]
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (fileError) {
        console.error('Admin Feedback API: File update also failed:', fileError);
        throw new Error(`Update error: ${dbError instanceof Error ? dbError.message : String(dbError)}`);
      }
    }
  } catch (error) {
    console.error('Error updating feedback status:', error);
    return new NextResponse(JSON.stringify({ 
      error: 'Failed to update feedback status',
      details: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
