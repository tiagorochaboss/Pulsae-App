// Help centre content. Customers and professionals have separate FAQs.
export type Faq = { q: string; a: string };
export type FaqGroup = { title: string; icon: string; items: Faq[] };

export const FAQ_CUSTOMER: FaqGroup[] = [
  {
    title: 'Booking sessions',
    icon: 'calendar',
    items: [
      { q: 'How do I book a session?', a: 'Open Discover, choose a professional, tap "Book a session", pick a day, a time and where the session happens, then pay. Your booking is confirmed straight away and the professional is notified.' },
      { q: 'Where will the session take place?', a: 'You choose: at your home, at a gym, or at the professional\'s own place (if they offer it). After you book, the exact address is shown on your booking with a button that opens it in Google Maps. Your professional sees the same address.' },
      { q: 'Can I choose a female or male professional?', a: 'Yes. Use the filters in Discover to choose the gender, years of experience, language, price and more.' },
      { q: 'Can I message my professional?', a: 'Yes. Once you have a booking, open it and tap "Message professional" to agree small details such as which gate to use.' },
      { q: 'Can I move a session to another time?', a: 'Yes, more than 24 hours before the start time. Open the booking, tap Move and pick a free time. Within 24 hours a session cannot be moved.' },
    ],
  },
  {
    title: 'Prepaid sessions and weekly repeat',
    icon: 'gift',
    items: [
      { q: 'What are prepaid sessions?', a: 'You can buy 4 or 8 sessions with the same professional in one payment and get a discount (5% for 4 sessions, 10% for 8 sessions). You pay for all of them now, but you only book the first one. The others wait in your balance.' },
      { q: 'Do I have to choose dates for all my prepaid sessions?', a: 'No. Only the first session is booked at checkout. You book each of the other sessions later, whenever you want, with the same professional. Go to Bookings and tap "Book next session".' },
      { q: 'What is "Repeat weekly" and how is it different?', a: 'Repeat weekly books the same day and time every week automatically, so you never need to book again. It is charged week by week (see below), not all at once. Prepaid sessions are paid all at once but never scheduled automatically. Discounts apply to prepaid sessions only, not to weekly repeats.' },
      { q: 'How does weekly billing work?', a: 'You pay for the first week at checkout. After that you are charged each week, 48 hours before the first session of that week. You can stop at any time and it applies from the next charge.' },
      { q: 'Can a professional refuse my weekly repeat?', a: 'Weekly repeat is optional for professionals. If a professional turns it off, you are told, the series stops and sessions that were not charged yet are cancelled. Sessions you already paid for are kept.' },
    ],
  },
  {
    title: 'Payments and pricing',
    icon: 'credit-card',
    items: [
      { q: 'Which payment methods can I use?', a: 'Apple Pay, credit cards and debit cards. You can save cards in Profile > Payment methods.' },
      { q: 'Are there extra fees?', a: 'No. The price you see on the professional\'s profile is the price you pay. Any promo code or credit you use is deducted before you pay.' },
      { q: 'When does the professional get my money?', a: 'Pulsae holds your payment safely. After the session the professional marks it as completed and you confirm it within 24 hours (it is confirmed automatically if you do not reply). The professional is paid 48 hours after confirmation.' },
      { q: 'How do promo codes, credits and referrals work?', a: 'Enter a promo code at checkout. Credits (for example rebooking credits and referral rewards) are shown in Profile > Credits and referrals and can be used on your next booking. Share your code with a friend and you both get SAR 25 after their first session.' },
    ],
  },
  {
    title: 'Cancellations and refunds',
    icon: 'x-circle',
    items: [
      { q: 'What happens if I cancel?', a: 'More than 24 hours before the session: you get a rebooking credit valid for 30 days. If the session was one of your prepaid sessions, it goes back to your balance instead. Less than 24 hours before: the session is charged in full.' },
      { q: 'What if the professional cancels?', a: 'You get a full refund, or the prepaid session goes back to your balance, and we flag the professional for review.' },
      { q: 'What if I miss a session?', a: 'A missed session is treated like a cancellation within 24 hours: it is charged in full.' },
      { q: 'How do I stop a weekly repeat?', a: 'Open Bookings, tap your weekly series and choose Stop. It applies from the next charge. Sessions already paid are kept.' },
      { q: 'Something went wrong. What do I do?', a: 'Open the booking and tap "Report a problem", or contact us. Our team reviews every report and gets back to you.' },
    ],
  },
  {
    title: 'Trust and safety',
    icon: 'shield',
    items: [
      { q: 'What does "Verified" mean?', a: 'Before a professional appears on Pulsae, our team checks their identity and their professional licence or certificate against the documents they upload. Tap the Verified badge on any profile to see exactly what was checked.' },
      { q: 'Can I trust the reviews?', a: 'Only customers who completed a session on Pulsae can leave a review. Professionals can reply, but they cannot remove reviews.' },
      { q: 'How is my personal information used?', a: 'We use it to run your bookings and to improve Pulsae, as described in the Privacy Policy (Profile > Legal). Your professional sees only what is needed for the session: your first name, the session address and your messages.' },
    ],
  },
  {
    title: 'My account',
    icon: 'user',
    items: [
      { q: 'Can I sign up with a non-Saudi mobile number?', a: 'Yes. Choose your country from the list next to the number field. You can also use your email to log in.' },
      { q: 'How do I change my mobile number, email or password?', a: 'Go to Profile > Personal details. Changing a mobile number or email needs a verification code so we know it is really you. Passwords can be changed in Profile > Login and security.' },
      { q: 'Can I log in with Face ID?', a: 'Yes. Tick "Remember me" when you log in, then "Use Face ID". You can turn it off any time in Profile > Login and security.' },
    ],
  },
];

export const FAQ_PRO: FaqGroup[] = [
  {
    title: 'Getting started',
    icon: 'play-circle',
    items: [
      { q: 'How do I start receiving bookings?', a: 'Create your account, upload your professional licence or certificate and your ID or Iqama, accept the Professional Terms, and wait for approval. Once approved, you go live in Discover and customers can book you within your availability.' },
      { q: 'What does the "Verified" badge on my profile mean?', a: 'It tells customers that our team checked your identity and your licence or certificate against the documents you uploaded. It helps customers trust you. Customers can tap the badge to read what it means.' },
      { q: 'How do I set when I am available?', a: 'Go to Settings > Availability to choose your working days and hours, and to block time off. Customers can only book free times inside your availability.' },
      { q: 'Can I choose where I work?', a: 'Yes. In Service area you choose the areas you cover and where you offer sessions (customer\'s home, a gym or your own place).' },
    ],
  },
  {
    title: 'Bookings',
    icon: 'calendar',
    items: [
      { q: 'Do I need to accept each booking?', a: 'No. Single bookings are confirmed automatically for the free times you offer, so you never have to chase approvals. You are notified straight away.' },
      { q: 'What about prepaid sessions and discounts?', a: 'Prepaid packs (for example 4 or 8 sessions) and their discounts are part of how Pulsae brings customers to you. Sessions from a prepaid pack are already paid and are honoured like any other booking. Pulsae sets these offers so that customers get a consistent experience.' },
      { q: 'Can I decline weekly repeat bookings?', a: 'Yes. Weekly repeat is your choice. You can turn it on or off in My profile. If you turn it off, the customer is informed, the series stops and sessions that were not charged yet are cancelled.' },
      { q: 'How do I find the exact address?', a: 'Open the booking. The exact session address is shown with a button that opens it in Google Maps, so you know exactly where to go. Extra details from the customer, such as the gate or flat number, appear under the address.' },
      { q: 'What if I cannot make a session?', a: 'Message the customer early to agree another time. If you do need to cancel a single session, the customer is refunded in full and your account is flagged. Repeated cancellations can lead to removal from Pulsae. Prepaid sessions cannot be declined, so please contact the customer or us if something comes up.' },
      { q: 'How do I mark a session as completed?', a: 'After the session, open the booking and tap "Mark as completed". The customer then has 24 hours to confirm. If they do not reply, it is confirmed automatically.' },
      { q: 'What if a customer misbehaves or does not show up?', a: 'Open the booking and tap "Report this customer". A no-show is treated like a cancellation within 24 hours, so you are still paid. Our team reviews every report.' },
    ],
  },
  {
    title: 'Earnings and fees',
    icon: 'dollar-sign',
    items: [
      { q: 'What does Pulsae charge?', a: 'Pulsae charges a 25% commission on the first booking of a new customer with you. Repeat bookings with the same customer within 2 months are commission-free. If a customer comes back after more than 2 months, the 25% applies again, because Pulsae helped bring them back to you. A payment processing fee of up to 5% is also deducted. The Professional Terms explain this in detail, and we will always tell you in advance if these terms change.' },
      { q: 'When am I paid?', a: 'You are paid 48 hours after the customer confirms the session (or 48 hours after the automatic confirmation). Money goes to the bank account you add in Settings > Bank account.' },
      { q: 'How are discounts paid for?', a: 'Discounts on prepaid sessions are funded by the professional, as agreed in the Professional Terms. You can see exactly what you receive for each session in Earnings.' },
      { q: 'How can I see what I earned?', a: 'Open Earnings to see paid out, scheduled and pending amounts, and the commission and fee on every session.' },
    ],
  },
  {
    title: 'Customers and reviews',
    icon: 'users',
    items: [
      { q: 'Where can I see my customers?', a: 'In Clients you see every customer you have worked with, your sessions together and whether the commission-free period is still running.' },
      { q: 'Can I reply to reviews?', a: 'Yes. Open Reviews and tap Reply. Replies are public. Reviews can only be left by customers who completed a session, and they cannot be removed by professionals.' },
      { q: 'Can I contact customers outside the app?', a: 'Please keep bookings and payments on Pulsae. It protects you with secure payment, payout guarantees and support if something goes wrong.' },
    ],
  },
  {
    title: 'My account',
    icon: 'user',
    items: [
      { q: 'How do I change my details, email or password?', a: 'Go to Settings > Personal details to update your name, mobile number and email. Changes to mobile number and email need a verification code. Change your password in Settings > Login and security.' },
      { q: 'How do I update my licence or documents?', a: 'Go to Settings > Credentials and documents or contact us. We review the new file and your Verified badge stays active while we do.' },
      { q: 'Can I use Face ID?', a: 'Yes. Tick "Remember me" and "Use Face ID" when you log in, or manage it in Settings > Login and security.' },
    ],
  },
];
