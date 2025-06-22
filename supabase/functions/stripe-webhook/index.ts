import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from 'npm:stripe@14.12.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    })

    const signature = req.headers.get('stripe-signature')
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')

    if (!signature || !webhookSecret) {
      return new Response('Webhook signature verification failed', { 
        status: 400,
        headers: corsHeaders 
      })
    }

    const body = await req.text()
    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.log(`Webhook signature verification failed.`, err.message)
      return new Response('Webhook signature verification failed', { 
        status: 400,
        headers: corsHeaders 
      })
    }

    // Handle the event
    console.log(`Processing event: ${event.type}`)

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionChange(subscription)
        break

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object as Stripe.Subscription
        await handleSubscriptionCanceled(deletedSubscription)
        break

      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutCompleted(session)
        break

      case 'invoice.payment_succeeded':
        const invoice = event.data.object as Stripe.Invoice
        await handleInvoicePaymentSucceeded(invoice)
        break

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object as Stripe.Invoice
        await handleInvoicePaymentFailed(failedInvoice)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Webhook error:', error)
    return new Response('Webhook error', { 
      status: 400,
      headers: corsHeaders 
    })
  }
})

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  console.log('Subscription changed:', subscription.id)
  
  // Update user subscription status in database
  const customerId = subscription.customer as string
  const status = subscription.status
  const planId = subscription.metadata?.planId
  const currentPeriodEnd = new Date(subscription.current_period_end * 1000)
  
  // Here you would update your database with the subscription info
  // For example, update the user's subscription tier, status, and renewal date
  
  console.log(`Updated subscription for customer ${customerId}: ${status} - Plan: ${planId}`)
}

async function handleSubscriptionCanceled(subscription: Stripe.Subscription) {
  console.log('Subscription canceled:', subscription.id)
  
  const customerId = subscription.customer as string
  
  // Update user to free tier
  // Set subscription status to canceled
  // Keep access until period end if configured
  
  console.log(`Canceled subscription for customer ${customerId}`)
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('Checkout completed:', session.id)
  
  const customerId = session.customer as string
  const metadata = session.metadata || {}
  
  if (session.mode === 'subscription') {
    // Handle subscription purchase
    console.log(`New subscription for customer ${customerId}`)
    
    // Grant access to premium features
    // Send welcome email
    // Update user tier
    
  } else if (session.mode === 'payment') {
    // Handle one-time purchase
    if (metadata.itemType === 'marketplace') {
      // Grant access to marketplace item
      console.log(`Marketplace purchase: ${metadata.itemId}`)
      
    } else if (metadata.itemType === 'tutorial') {
      // Grant access to premium tutorial
      console.log(`Tutorial purchase: ${metadata.tutorialId}`)
    }
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('Invoice payment succeeded:', invoice.id)
  
  // Handle successful recurring payment
  // Extend subscription period
  // Send receipt email
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Invoice payment failed:', invoice.id)
  
  // Handle failed payment
  // Send payment failed notification
  // Potentially downgrade access after grace period
}