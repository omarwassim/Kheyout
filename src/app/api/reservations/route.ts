import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Reservation from "@/lib/models/Reservation";
import Subscriber from "@/lib/models/Subscriber";
import { sendReservationEmail } from "@/lib/mailer";

const BASE_PRICE = Number(process.env.PRODUCT_PRICE ||540);
const DISCOUNT_PERCENT = Number(process.env.DISCOUNT_PERCENT || 15);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      phone,
      addressLine1,
      quantity,
      description,
      customDesignImage,
    } = body;

    if (!name || !email || !phone || !addressLine1 || !quantity) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    const parsedQuantity = Math.max(1, Number(quantity) || 1);

    await connectToDatabase();

    // Server-side truth: only apply the discount if this email actually subscribed
    const subscriber = await Subscriber.findOne({
      email: String(email).toLowerCase().trim(),
    });
    const discountApplied = Boolean(subscriber);

    const unitPrice = discountApplied
      ? Math.round(BASE_PRICE * (1 - DISCOUNT_PERCENT / 100))
      : BASE_PRICE;
    const totalPrice = unitPrice * parsedQuantity;

    const reservation = await Reservation.create({
      name,
      email,
      phone,
      addressLine1,
      quantity: parsedQuantity,
      paymentMethod: "cash",
      description: description || undefined,
      customDesignImage: customDesignImage || undefined,
      unitPrice,
      discountApplied,
      totalPrice,
    });

    try {
      await sendReservationEmail(reservation);
    } catch (emailError) {
      // Don't fail the whole request if email sending fails - the order is still saved
      console.error("Failed to send reservation email:", emailError);
    }

    return NextResponse.json({
      success: true,
      discountApplied,
      unitPrice,
      totalPrice,
    });
  } catch (error) {
    console.error("Reservation error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
