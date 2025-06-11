import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const session = await auth();
    const userId = session?.userId;
    
    // Parse the request body
    const body = await request.json();
    const { name, email, type, message } = body;
    
    if (!message || !type) {
      return new NextResponse(JSON.stringify({ error: 'Missing required fields' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // If user is signed in, get their information from the database
    let userData = null;
    if (userId) {
      userData = await prisma.user.findUnique({
        where: { clerkId: userId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true
        }
      });
    }
    
    // Store feedback in a JSON file (temporary solution until database migration issues are resolved)
    const feedbackId = `feedback_${Date.now()}`;
    const feedbackData = {
      id: feedbackId,
      type,
      message,
      name: userId ? `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim() : name || '',
      email: userId ? userData?.email || '' : email || '',
      userId: userData?.id || null,
      status: 'pending',
      isReward: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Path to the feedback JSON file
    const feedbackFilePath = path.join(process.cwd(), 'data', 'feedback.json');
    
    try {
      // Read existing feedback data
      let feedbackArray = [];
      if (fs.existsSync(feedbackFilePath)) {
        const fileContent = fs.readFileSync(feedbackFilePath, 'utf8');
        feedbackArray = JSON.parse(fileContent);
      } else {
        // Create the data directory if it doesn't exist
        const dataDir = path.join(process.cwd(), 'data');
        if (!fs.existsSync(dataDir)) {
          console.log('Creating data directory...');
          fs.mkdirSync(dataDir, { recursive: true });
        }
        console.log('Feedback file does not exist, creating new one');
      }
      
      // Add new feedback
      feedbackArray.push(feedbackData);
      
      // Write back to file
      console.log('Writing feedback to file:', feedbackFilePath);
      fs.writeFileSync(feedbackFilePath, JSON.stringify(feedbackArray, null, 2));
      
      console.log('Feedback saved to JSON file:', feedbackId);
    } catch (error) {
      console.error('Error storing feedback in JSON file:', error);
      // Try to provide more detailed error information
      if (error instanceof Error) {
        console.error('Error details:', error.message, error.stack);
      }
      
      // Check if directory exists and is writable
      const dataDir = path.join(process.cwd(), 'data');
      console.log('Data directory exists:', fs.existsSync(dataDir));
      
      try {
        // Test write permissions with a temporary file
        const testFile = path.join(dataDir, 'test-write.txt');
        fs.writeFileSync(testFile, 'test');
        fs.unlinkSync(testFile);
        console.log('Directory is writable');
      } catch (writeError) {
        console.error('Directory is not writable:', writeError);
      }
    }
    
    // Also try to store in database if it exists
    try {
      // @ts-ignore - Prisma client might not have the feedback model yet
      await prisma.feedback?.create({
        data: {
          id: feedbackId,
          type,
          message,
          name: userId ? `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim() : name || '',
          email: userId ? userData?.email || '' : email || '',
          userId: userData?.id || null,
          status: 'pending',
          isReward: false
        }
      });
      console.log('Feedback also saved to database');
    } catch (error: any) {
      console.log('Could not save feedback to database (expected if table doesn\'t exist yet):', error.message);
    }
    
    const feedback = feedbackData;
    
    return new NextResponse(JSON.stringify({ 
      success: true,
      feedbackId: feedback.id
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal server error' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
