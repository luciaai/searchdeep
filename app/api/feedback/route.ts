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
    const { name, email, type, message, subject, rating, review } = body;
    
    // Validate based on submission type
    // For regular feedback, require message and type
    // For reviews, require rating and type
    const isReview = rating && rating >= 1 && rating <= 5;
    
    if ((!message && !isReview) || (!review && isReview) || !type) {
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
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
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
    fs.writeFileSync(feedbackFilePath, JSON.stringify(feedbackList, null, 2), 'utf8');
    
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
    return new NextResponse(JSON.stringify({ 
      error: 'Failed to submit feedback. Please try again later.' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
