import nodemailer from "nodemailer";
import type { IReservation } from "./models/Reservation";

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 465),
    secure: Number(process.env.SMTP_PORT || 465) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
}

export async function sendReservationEmail(reservation: IReservation) {
  const owners = [process.env.OWNER_EMAIL_1, process.env.OWNER_EMAIL_2].filter(
    Boolean
  ) as string[];

  if (owners.length === 0) {
    console.warn("No OWNER_EMAIL_1 / OWNER_EMAIL_2 configured, skipping email.");
    return;
  }

  const transporter = getTransporter();

  const attachments = [];
  if (reservation.customDesignImage) {
    attachments.push({
      filename: "custom-design.png",
      content: reservation.customDesignImage.split(",")[1] ?? "",
      encoding: "base64" as const,
    });
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto;">
      <h2 style="color:#2E8378;">New Reservation - Kheyout</h2>
      <table style="width:100%; border-collapse: collapse;">
        <tbody>
          <tr><td style="padding:6px 0;"><strong>Name</strong></td><td>${reservation.name}</td></tr>
          <tr><td style="padding:6px 0;"><strong>Email</strong></td><td>${reservation.email}</td></tr>
          <tr><td style="padding:6px 0;"><strong>Phone</strong></td><td>${reservation.phone}</td></tr>
          <tr><td style="padding:6px 0;"><strong>Address</strong></td><td>${reservation.addressLine1}</td></tr>
          <tr><td style="padding:6px 0;"><strong>Quantity</strong></td><td>${reservation.quantity}</td></tr>
          <tr><td style="padding:6px 0;"><strong>Payment</strong></td><td>Cash on delivery</td></tr>
          <tr><td style="padding:6px 0;"><strong>Unit Price</strong></td><td>${reservation.unitPrice} EGP</td></tr>
          <tr><td style="padding:6px 0;"><strong>Discount applied</strong></td><td>${reservation.discountApplied ? "Yes (15%)" : "No"}</td></tr>
          <tr><td style="padding:6px 0;"><strong>Total</strong></td><td>${reservation.totalPrice} EGP</td></tr>
          ${
            reservation.description
              ? `<tr><td style="padding:6px 0;"><strong>Notes</strong></td><td>${reservation.description}</td></tr>`
              : ""
          }
        </tbody>
      </table>
      ${
        reservation.customDesignImage
          ? "<p>A custom design reference image is attached.</p>"
          : ""
      }
    </div>
  `;

  await transporter.sendMail({
    from: `"Kheyout Website" <${process.env.SMTP_USER}>`,
    to: owners.join(","),
    subject: `New Reservation from ${reservation.name}`,
    html,
    attachments,
  });
}
