import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    console.log('Feedback API: Processing new submission');
    
    // Get authentication, but don't fail if not authenticated
    // This allows both authenticated and anonymous feedback
    const session = await auth();
    const userId = session?.userId;
    console.log('Feedback API: User authentication status:', userId ? 'Authenticated' : 'Not authenticated');
    
    // Parse the request body
    const body = await request.json();
    const { name, email, type, message, subject, rating, review } = body;
    
    console.log('Feedback API: Received submission:', { 
      type, 
      hasMessage: !!message, 
      hasSubject: !!subject, 
      hasRating: !!rating, 
      hasReview: !!review 
    });
    
    // Validate based on submission type
    // For regular feedback, require message and type
    // For reviews, require rating and type
    const isReview = rating && rating >= 1 && rating <= 5;
    
    // More flexible validation logic
    // For feedback: require type and message
    // For reviews: require type, rating, and review
    if (!type || (isReview && !review) || (!isReview && !message)) {
      return new NextResponse(JSON.stringify({ error: 'Missing required fields' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // If user is signed in, get their information from the database
    let userData = null;
    try {
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
    } catch (userError) {
      console.error('Feedback API: Error fetching user data:', userError);
      // Continue without user data if there's an error
    }
    
    // Store feedback in a JSON file (temporary solution until database migration issues are resolved)
    const feedbackId = `feedback_${Date.now()}`;
    const feedbackData = {
      id: feedbackId,
      type,
      message,
      subject: subject || '',
      name: userId ? `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim() : name || '',
      email: userId ? userData?.email || '' : email || '',
      userId: userData?.id || null,
      rating: typeof rating === 'number' && rating >= 1 && rating <= 5 ? rating : null,
      review: review || '',
      status: 'pending',
      isReward: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Ensure the data directory exists
    const dataDir = path.join(process.cwd(), 'data');
    console.log('Feedback API: Data directory path:', dataDir);
    
    try {
      if (!fs.existsSync(dataDir)) {
        console.log('Feedback API: Creating data directory');
        fs.mkdirSync(dataDir, { recursive: true });
      }
      
      // Test write permissions
      const testFile = path.join(dataDir, '.test-write');
      fs.writeFileSync(testFile, 'test', 'utf8');
      fs.unlinkSync(testFile);
      console.log('Feedback API: Directory permissions verified');
    } catch (dirError) {
      console.error('Feedback API: Error with data directory:', dirError);
      throw new Error(`Directory error: ${dirError instanceof Error ? dirError.message : String(dirError)}`);
    }
    
    // Path to feedback.json
    const feedbackFilePath = path.join(dataDir, 'feedback.json');
    
    // Read existing feedback or create new array
    let feedbackList = [];
    if (fs.existsSync(feedbackFilePath)) {
      try {
        const fileContent = fs.readFileSync(feedbackFilePath, 'utf8');
        feedbackList = JSON.parse(fileContent);
      } catch (error) {
        console.error('Error reading feedback file:', error);
      }
    }
    
    // Add new feedback to the list
    feedbackList.unshift(feedbackData);
    
    // Write updated feedback list back to file
    try {
      fs.writeFileSync(feedbackFilePath, JSON.stringify(feedbackList, null, 2), 'utf8');
      console.log('Feedback API: Successfully wrote feedback to file');
    } catch (writeError) {
      console.error('Feedback API: Error writing feedback to file:', writeError);
      throw new Error(`Write error: ${writeError instanceof Error ? writeError.message : String(writeError)}`);
    }
    
    return new NextResponse(JSON.stringify({ 
      success: true, 
      message: 'Feedback submitted successfully',
      feedback: feedbackData
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error processing feedback submission:', error);
    
    // More detailed error response
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : '';
    
    console.error('Error details:', {
      message: errorMessage,
      stack: errorStack
    });
    
    return new NextResponse(JSON.stringify({ 
      error: 'Failed to submit feedback. Please try again later.',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
