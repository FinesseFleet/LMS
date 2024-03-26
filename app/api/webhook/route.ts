import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import Cors from 'micro-cors';
import { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "stream/consumers";

const cors = Cors({
  allowMethods: ['POST', 'HEAD'],
});
// export async function POST(req: Request) {
//   const body = await req.text();
//   const signature = headers().get("Stripe-Signature") as string;

//   let event: Stripe.Event;

  // try {
  //   event = stripe.webhooks.constructEvent(
  //     body,
  //     signature,
  //     process.env.STRIPE_WEBHOOK_SECRET!
  //   )
  // } catch (error: any) {
  //   return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  // }

  // const session = event.data.object as Stripe.Checkout.Session;
  // const userId = session?.metadata?.userId;
  // const courseId = session?.metadata?.courseId;

  // if (event.type == 'checkout.session.completed') {
  //   if (!userId || !courseId) {
  //     return new NextResponse(`Webhook Error: Missing metadata`, { status: 400 });
  //   }

  //   await db.purchase.create({
  //     data: {
  //       courseId: courseId,
  //       userId: userId,
  //     }
  //   });
  // } else {
  //   return new NextResponse(`Webhook Error: Unhandled event type ${event.type}`, { status: 200 })
  // }

  "!!!!!!!!!!!"
  // Partial of ./pages/api/webhooks/index.ts
// ...
const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET!

// Stripe requires the raw body to construct the event.
export const config = {
  api: {
    bodyParser: false,
  },
}

const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const buf = await buffer(req)
    const sig = req.headers['stripe-signature']!
    alert(sig)
    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(buf.toString(), sig, webhookSecret)
    } catch (err: any) {
      console.log(`❌ Error message: ${err.message}`)
      res.status(400).send(`Webhook Error: ${err.message}`)
      return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
    }
    const session = event.data.object as Stripe.Checkout.Session;
  const userId = session?.metadata?.userId;
  const courseId = session?.metadata?.courseId;

  if (event.type == 'checkout.session.completed') {
    if (!userId || !courseId) {
      return new NextResponse(`Webhook Error: Missing metadata`, { status: 400 });
    }

    await db.purchase.create({
      data: {
        courseId: courseId,
        userId: userId,
      }
    });
    } else {
      return new NextResponse(`Webhook Error: Unhandled event type ${event.type}`, { status: 200 })
    }
    // Successfully constructed event
    console.log('✅ Success:', event.id)
    // ...
  "!!!!!!!!!!!!!!"

  return new NextResponse(null, { status: 200 });
}}
export default cors(webhookHandler as any);
