import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

// Initialize Prisma client
const prisma = new PrismaClient();

async function migrateFeedbackToDatabase() {
  try {
    console.log('Starting feedback migration from JSON to database...');
    
    // Path to feedback.json
    const feedbackFilePath = path.join(process.cwd(), 'data', 'feedback.json');
    
    // Check if file exists
    if (!fs.existsSync(feedbackFilePath)) {
      console.log('No feedback file found at:', feedbackFilePath);
      return;
    }
    
    // Read feedback from file
    console.log('Reading feedback from file:', feedbackFilePath);
    const fileContent = fs.readFileSync(feedbackFilePath, 'utf8');
    const feedbackItems = JSON.parse(fileContent);
    
    if (!Array.isArray(feedbackItems) || feedbackItems.length === 0) {
      console.log('No feedback items found in file or invalid format');
      return;
    }
    
    console.log(`Found ${feedbackItems.length} feedback items in file`);
    
    // Get existing feedback IDs from database to avoid duplicates
    const existingFeedback = await prisma.feedback.findMany({
      select: { id: true }
    });
    const existingIds = new Set(existingFeedback.map(item => item.id));
    
    console.log(`Found ${existingIds.size} existing feedback items in database`);
    
    // Filter out items that already exist in the database
    const newItems = feedbackItems.filter(item => !existingIds.has(item.id));
    console.log(`Migrating ${newItems.length} new feedback items to database`);
    
    // Migrate each item
    let successCount = 0;
    let errorCount = 0;
    
    for (const item of newItems) {
      try {
        await prisma.feedback.create({
          data: {
            id: item.id,
            type: item.type || 'general',
            message: item.message || '',
            subject: item.subject || '',
            name: item.name || '',
            email: item.email || '',
            userId: item.userId || null,
            rating: typeof item.rating === 'number' ? item.rating : null,
            review: item.review || '',
            status: item.status || 'pending',
            isReward: item.isReward || false,
            createdAt: new Date(item.createdAt || Date.now()),
            updatedAt: new Date(item.updatedAt || Date.now())
          }
        });
        successCount++;
      } catch (error) {
        console.error(`Error migrating feedback item ${item.id}:`, error);
        errorCount++;
      }
    }
    
    console.log('Migration complete:');
    console.log(`- Successfully migrated: ${successCount} items`);
    console.log(`- Failed to migrate: ${errorCount} items`);
    console.log(`- Already in database: ${existingIds.size} items`);
    console.log(`- Total in file: ${feedbackItems.length} items`);
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration
migrateFeedbackToDatabase()
  .then(() => console.log('Migration script completed'))
  .catch(error => console.error('Migration script failed:', error));
