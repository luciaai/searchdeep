import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin';
import prisma from '@/lib/prisma';

// Prevent static generation for this route
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Check if user is admin
    const adminCheck = await isAdmin();
    if (!adminCheck) {
      return new NextResponse(JSON.stringify({ error: 'Forbidden' }), { 
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    console.log('Admin Credit History API: Fetching credit history from database');
    
    // Try to fetch credit history from the database
    try {
      // Check if the CreditHistory model exists by checking if it's accessible on the prisma client
      if ('creditHistory' in prisma) {
        // Use type assertion to handle the dynamic property access
        const creditHistory = await (prisma as any).creditHistory.findMany({
          orderBy: {
            createdAt: 'desc'
          }
        });
        
        console.log(`Admin Credit History API: Found ${creditHistory.length} credit history records`);
        
        // Define a type for the credit history record
        type CreditHistoryRecord = {
          id: string;
          userId: string;
          amount: number;
          reason: string;
          createdAt: Date;
          updatedAt: Date;
        };
        
        // Fetch user information for each credit history record
        const enhancedCreditHistory = await Promise.all(
          creditHistory.map(async (record: CreditHistoryRecord) => {
            const user = await prisma.user.findUnique({
              where: { id: record.userId },
              select: {
                email: true,
                firstName: true,
                lastName: true
              }
            });
            
            return {
              ...record,
              userEmail: user?.email || 'Unknown',
              userName: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown' : 'Unknown'
            };
          })
        );
        
        return new NextResponse(JSON.stringify({ 
          creditHistory: enhancedCreditHistory 
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      } else {
        console.log('Admin Credit History API: CreditHistory model not found in Prisma client');
        return new NextResponse(JSON.stringify({ 
          creditHistory: [],
          message: 'Credit history feature is not yet available'
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    } catch (dbError) {
      console.error('Error fetching credit history from database:', dbError);
      
      // If the CreditHistory model doesn't exist yet, return an empty array
      // This will happen until the schema is updated and deployed
      return new NextResponse(JSON.stringify({ 
        creditHistory: [],
        message: 'Credit history table may not exist yet'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error('Error in admin credit history API:', error);
    
    return new NextResponse(JSON.stringify({ 
      error: 'Failed to fetch credit history',
      creditHistory: []
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
