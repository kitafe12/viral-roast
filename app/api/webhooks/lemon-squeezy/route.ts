import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { clerkClient } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
    try {
        console.log('[Webhook] Received webhook request');

        // 1. Récupération du Secret
        const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
        if (!secret) {
            console.error('[Webhook] Missing LEMONSQUEEZY_WEBHOOK_SECRET');
            return new Response('Server Error: Missing Webhook Secret', { status: 500 });
        }

        // 2. Vérification de la Signature
        const rawBody = await req.text();
        const signature = req.headers.get('x-signature') || '';

        console.log('[Webhook] Verifying signature...');
        const hmac = crypto.createHmac('sha256', secret);
        const digest = hmac.update(rawBody).digest('hex');

        if (digest !== signature) {
            console.error('[Webhook] Invalid signature');
            return new Response('Invalid signature', { status: 401 });
        }

        console.log('[Webhook] Signature verified');

        // 3. Traitement du Payload
        const payload = JSON.parse(rawBody);
        const eventName = payload.meta?.event_name;
        const userId = payload.meta?.custom_data?.user_id;

        console.log(`[Webhook] Event: ${eventName}, User: ${userId}`);

        if (eventName === 'order_created' && userId) {
            console.log('[Webhook] Processing order_created event');

            // Get Clerk client
            const client = await clerkClient();

            // Get user and current credits
            const user = await client.users.getUser(userId);
            const currentCredits = Number(user.publicMetadata?.credits || 0);

            console.log(`[Webhook] Current credits for user ${userId}: ${currentCredits}`);

            // Add 1 credit for single audit purchase
            const newCredits = currentCredits + 1;

            await client.users.updateUserMetadata(userId, {
                publicMetadata: {
                    credits: newCredits
                }
            });

            console.log(`[Webhook] Credits updated: ${currentCredits} -> ${newCredits}`);
        } else if (eventName === 'subscription_created' && userId) {
            console.log('[Webhook] Processing subscription_created event');

            const client = await clerkClient();

            // Set Pro subscription
            await client.users.updateUserMetadata(userId, {
                publicMetadata: {
                    subscription: 'pro',
                    credits: 999999 // Unlimited for pro users
                }
            });

            console.log(`[Webhook] User ${userId} upgraded to Pro`);
        } else if (eventName === 'subscription_cancelled' && userId) {
            console.log('[Webhook] Processing subscription_cancelled event');

            const client = await clerkClient();

            // Remove Pro subscription
            await client.users.updateUserMetadata(userId, {
                publicMetadata: {
                    subscription: null,
                    credits: 0
                }
            });

            console.log(`[Webhook] User ${userId} subscription cancelled`);
        }

        return NextResponse.json({ received: true }, { status: 200 });

    } catch (error: any) {
        console.error('[Webhook] Error:', error);
        console.error('[Webhook] Error details:', error?.message);
        return new Response('Webhook handler failed', { status: 500 });
    }
}
