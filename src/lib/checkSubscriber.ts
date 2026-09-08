import Subscriber from "@/lib/models/Subscriber";

/**
 * Compares the email the customer typed against the subscribers
 * collection. Returns true if found (give discount), false if not
 * (give original price). Case-insensitive and trims whitespace so
 * "Test@Gmail.com " and "test@gmail.com" count as the same email.
 */
export async function isEmailSubscribed(email: string): Promise<boolean> {
  const cleanEmail = email.toLowerCase().trim();

  const match = await Subscriber.findOne({ email: cleanEmail });

  return Boolean(match);
}