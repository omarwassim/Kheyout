# Kheyout — Crochet Spider-Man Reservation Site

A simple Next.js + MongoDB site to reserve a handmade crochet Spider-Man
car charm (500 EGP, cash on delivery).

## Features
- Product hero with your logo and Spider-Man photo
- About Kheyout section linking to Instagram (@__khoyout)
- Reviews section (plain cards, edit the text in `src/lib/data/reviews.ts`)
- Reservation form: name, email, phone, address, quantity, cash payment,
  optional notes, optional custom-design photo upload
- Email popup on first visit: enter email → get 15% off automatically
  applied at checkout (verified server-side, not just trusted from the browser)
- On every reservation, an email is sent to **two** owner inboxes with all
  the order details (and the custom design photo attached, if provided)
- Orders are stored in MongoDB

## 1. Install dependencies
```bash
npm install
```

## 2. Set up environment variables
Copy `.env.example` to `.env.local` and fill in your real values:
```bash
cp .env.example .env.local
```

- `MONGODB_URI`: from [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier works fine) — create a cluster, a database user, and copy the connection string.
- `SMTP_USER` / `SMTP_PASSWORD`: if using Gmail, turn on 2-Step Verification then create an **App Password** at https://myaccount.google.com/apppasswords. Use that 16-character password, not your normal Gmail password.
- `OWNER_EMAIL_1` / `OWNER_EMAIL_2`: the two inboxes that should receive every reservation.

## 3. Run locally
```bash
npm run dev
```
Open http://localhost:3000

## 4. Deploy
The easiest option is [Vercel](https://vercel.com):
1. Push this project to a GitHub repo.
2. Import it into Vercel.
3. Add the same environment variables from `.env.local` in the Vercel project settings.
4. Deploy.

## Editing content
- **Reviews**: `src/lib/data/reviews.ts`
- **Price**: `PRODUCT_PRICE` in `.env.local` (also update `BASE_PRICE` in `src/components/ReservationForm.tsx` to match, since the price shown before submitting is calculated on the client for a live preview)
- **Discount %**: `DISCOUNT_PERCENT` in `.env.local` (also update `DISCOUNT_PERCENT` in `src/components/ReservationForm.tsx`)
- **Logo / product photo**: replace `public/logo.jpg` and `public/spiderman.png`
- **Instagram link**: search for `__khoyout` in `src/components/About.tsx` and `src/components/Footer.tsx`

## Notes on the discount
- When a visitor submits their email in the popup, it's saved to a `Subscriber` collection and remembered in their browser (`localStorage`).
- When they later submit a reservation with that same email, the server looks up the email in the `Subscriber` collection and applies 15% off — this can't be faked by editing the browser, since the discount is recalculated server-side.
