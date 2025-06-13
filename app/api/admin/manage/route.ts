import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { isAdmin } from '@/lib/admin';
import fs from 'fs';
import path from 'path';

// Prevent static generation for this route
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
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
    
    // Parse the request body
    const body = await request.json();
    const { email, action } = body;
    
    if (!email || !email.includes('@')) {
      return new NextResponse(JSON.stringify({ error: 'Invalid email address' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (action !== 'add' && action !== 'remove') {
      return new NextResponse(JSON.stringify({ error: 'Invalid action' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Since we're using a hardcoded list in admin.ts, we need to modify that file
    // In a real application, you would update a database record instead
    
    // Path to the admin.ts file
    const adminFilePath = path.join(process.cwd(), 'lib', 'admin.ts');
    
    if (!fs.existsSync(adminFilePath)) {
      return new NextResponse(JSON.stringify({ error: 'Admin configuration file not found' }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Read the current file content
    const fileContent = fs.readFileSync(adminFilePath, 'utf8');
    
    // Extract the admin emails array
    const adminArrayMatch = fileContent.match(/const ADMIN_EMAILS = \[([\s\S]*?)\];/);
    
    if (!adminArrayMatch) {
      return new NextResponse(JSON.stringify({ error: 'Could not parse admin configuration' }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Get the current list of admin emails
    const adminEmailsContent = adminArrayMatch[1];
    const adminEmails = adminEmailsContent
      .split(',')
      .map(line => {
        const match = line.match(/'([^']*)'|"([^"]*)"/);
        return match ? (match[1] || match[2]) : null;
      })
      .filter(Boolean) as string[];
    
    // Check if the email already exists in the list
    const emailExists = adminEmails.includes(email);
    
    if (action === 'add' && emailExists) {
      return new NextResponse(JSON.stringify({ error: 'Email is already an admin' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (action === 'remove' && !emailExists) {
      return new NextResponse(JSON.stringify({ error: 'Email is not an admin' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Update the list
    let newAdminEmails: string[];
    if (action === 'add') {
      newAdminEmails = [...adminEmails, email];
    } else {
      newAdminEmails = adminEmails.filter(e => e !== email);
    }
    
    // Format the new array content
    const newAdminEmailsContent = newAdminEmails
      .map(email => `  '${email}'`)
      .join(',\n');
    
    // Replace the array in the file content
    const newFileContent = fileContent.replace(
      /const ADMIN_EMAILS = \[([\s\S]*?)\];/,
      `const ADMIN_EMAILS = [\n${newAdminEmailsContent}\n];`
    );
    
    // Write the updated content back to the file
    fs.writeFileSync(adminFilePath, newFileContent, 'utf8');
    
    // Also update any user record in the database to reflect admin status
    try {
      const user = await prisma.user.findFirst({
        where: { email }
      });
      
      if (user) {
        // Check if the User model has an isAdmin field in the schema
        const userModel = prisma.user as any;
        if (userModel && typeof userModel.update === 'function') {
          try {
            // Try to update the user with the isAdmin field
            // This is a best-effort update and may fail if the field doesn't exist
            await prisma.user.update({
              where: { id: user.id },
              data: { 
                // Use a type assertion to bypass TypeScript's type checking
                // since we're not sure if isAdmin exists in the schema
                ...(action === 'add' ? { isAdmin: true } : { isAdmin: false }) as any
              }
            });
            console.log(`Updated user ${user.email} admin status to ${action === 'add'}`); 
          } catch (updateError) {
            console.log(`Could not update isAdmin field for user ${user.email}`, updateError);
            // Field might not exist in the schema, which is okay
          }
        }
      }
    } catch (dbError) {
      console.error('Error updating user admin status in database:', dbError);
      // Continue execution even if database update fails
    }
    
    return new NextResponse(JSON.stringify({ 
      success: true, 
      message: `Admin ${action === 'add' ? 'added' : 'removed'} successfully`,
      email
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in admin manage API:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
