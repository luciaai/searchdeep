# Email Verification Guide for Ziq

This guide explains how to configure Clerk to require email verification for all new users, preventing anonymous users from abusing your system.

## Why Email Verification is Important

- **Prevents Abuse**: Requiring email verification reduces fake accounts and credit system abuse
- **Improves User Trust**: Verified users lead to a more trustworthy community
- **Enables Communication**: Allows you to send important updates and notifications
- **Facilitates Account Recovery**: Makes it easier for users to recover lost accounts

## Configuration Steps in Clerk Dashboard

### 1. Access Authentication Settings

1. Log in to your [Clerk Dashboard](https://dashboard.clerk.dev/)
2. Select your Ziq application
3. Navigate to **User & Authentication** in the left sidebar

### 2. Configure Contact Methods

1. Click on **Email, Phone, Username**
2. Under **Contact information**, ensure **Email Address** is checked
3. Make it required by selecting **Required** from the dropdown
4. Enable **Email verification** by toggling it ON

### 3. Set Up Email Templates

1. Go to **Email Templates** in the left sidebar
2. Customize the **Verification Email** template:
   - Update the sender name to "Ziq"
   - Personalize the content to match your brand
   - Preview and test the email

### 4. Configure Sign-Up Requirements

1. Go to **Authentication** → **Sign-up**
2. Enable **Require verified email address to complete sign-up**
3. Set **Verification methods** to include Email

### 5. Test the Configuration

1. Open your application in an incognito/private browser window
2. Attempt to sign up with a test email address
3. Verify that you receive a verification email
4. Confirm that you cannot access the full application features until verifying your email

## Handling Existing Users

For existing users without verified emails, we've implemented a gentle reminder system:

- A non-intrusive dialog will appear for users without a verified email
- Users can add an email address or dismiss the reminder
- Dismissed reminders will reappear after 7 days
- This approach respects existing users while encouraging email verification

## Additional Security Recommendations

1. **Rate Limiting**: Consider implementing rate limiting for API endpoints to prevent abuse
2. **Credit System Monitoring**: Monitor for unusual patterns in credit usage
3. **IP Tracking**: Track IP addresses for suspicious activity
4. **Regular Audits**: Periodically review user accounts for potential abuse

## Need Help?

If you encounter any issues with the email verification setup, refer to:

- [Clerk Documentation](https://clerk.dev/docs)
- [Email Configuration Guide](https://clerk.dev/docs/authentication/email-phone-username)
