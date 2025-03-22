// Define the subscription tiers for the application
export interface Tier {
  id: string;
  name: string;
  description: string;
  price: number; // Price in USD
  credits: number; // Credits per month
  features: string[];
  stripePriceId?: string; // Will be populated from environment variables
}

// Define the tiers
export const tiers: Tier[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Basic access with limited credits',
    price: 0,
    credits: 3,
    features: [
      'Limited to 3 credits per month',
      'Basic search functionality',
      'No priority support'
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Monthly subscription with 30 credits',
    price: 10,
    credits: 30,
    features: [
      '30 credits per month',
      'Full access to all search features',
      'Priority support'
    ],
    stripePriceId: process.env.STRIPE_PRICEID,
  }
];

// Helper function to get a tier by ID
export function getTierById(id: string): Tier | undefined {
  return tiers.find(tier => tier.id === id);
}

// Helper function to get a tier by Stripe Price ID
export function getTierByStripePriceId(stripePriceId: string): Tier | undefined {
  return tiers.find(tier => tier.stripePriceId === stripePriceId);
}
