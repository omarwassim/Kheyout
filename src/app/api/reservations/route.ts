import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Reservation from "@/lib/models/Reservation";
import { sendReservationEmail } from "@/lib/mailer";
import { isEmailSubscribed } from "@/lib/checkSubscriber";

const BASE_PRICE = Number(process.env.PRODUCT_PRICE || 530);
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

    // Compare the typed email against the subscribers collection
    const discountApplied = await isEmailSubscribed(email);

    // Debug line - check your terminal to see what price/env is actually loaded.
    // Remove this console.log once everything looks right.
    console.log("[reservation] BASE_PRICE env value:", process.env.PRODUCT_PRICE);
    console.log("[reservation] discountApplied:", discountApplied);

    const unitPrice = discountApplied
      ? Math.floor(BASE_PRICE * (1 - DISCOUNT_PERCENT / 100))
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