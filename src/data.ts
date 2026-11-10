// Sample data only. Names, prices and ratings are placeholders for the prototype.
export type Pro = {
  id: string;
  name: string;
  role: string;
  category: 'Physiotherapists' | 'Trainers';
  gender: 'Female' | 'Male';
  rating: string;
  reviews: number;
  area: string;
  distance: number; // km, used by the filter only
  cert: string;
  years: number;
  price: number;
  languages: string[];
  locations: string[];
  about: string;
};

const ABOUT =
  'Short personal introduction written by the professional appears here, covering approach, specialties and the kind of clients they enjoy working with.';

export const PROS: Pro[] = [
  { id: 'p1', name: 'Sample Name A', role: 'Physiotherapist · Sports injuries', category: 'Physiotherapists', gender: 'Female', rating: '4.9', reviews: 48, area: 'Al Olaya', distance: 3.2, cert: 'SCFHS licensed', years: 8, price: 250, languages: ['Arabic', 'English'], locations: ['Home', 'Their place'], about: ABOUT },
  { id: 'p2', name: 'Sample Name B', role: 'Personal trainer · Strength', category: 'Trainers', gender: 'Male', rating: '4.8', reviews: 31, area: 'Al Malqa', distance: 5, cert: 'MoS certified', years: 5, price: 180, languages: ['Arabic', 'English'], locations: ['Home', 'Gym'], about: ABOUT },
  { id: 'p3', name: 'Sample Name C', role: 'Physiotherapist · Back and neck', category: 'Physiotherapists', gender: 'Male', rating: '4.7', reviews: 22, area: 'Al Yasmin', distance: 9, cert: 'SCFHS licensed', years: 12, price: 300, languages: ['Arabic'], locations: ['Their place'], about: ABOUT },
  { id: 'p4', name: 'Sample Name D', role: 'Personal trainer · Weight loss', category: 'Trainers', gender: 'Female', rating: '4.9', reviews: 40, area: 'Hittin', distance: 7, cert: 'MoS certified', years: 3, price: 150, languages: ['English'], locations: ['Home', 'Gym'], about: ABOUT },
  { id: 'p5', name: 'Sample Name E', role: 'Physiotherapist · Rehabilitation', category: 'Physiotherapists', gender: 'Female', rating: '4.6', reviews: 15, area: 'Al Nakheel', distance: 12, cert: 'SCFHS licensed', years: 6, price: 220, languages: ['Arabic', 'English'], locations: ['Home'], about: ABOUT },
  { id: 'p6', name: 'Sample Name F', role: 'Personal trainer · Athletic performance', category: 'Trainers', gender: 'Male', rating: '4.8', reviews: 27, area: 'Al Sahafah', distance: 6, cert: 'MoS certified', years: 10, price: 350, languages: ['Arabic', 'English'], locations: ['Gym', 'Their place'], about: ABOUT },
];

export const ME_PRO_ID = 'p1';

export const FAQ = [
  { q: 'How do I book a session?', a: 'Open Discover, choose a professional, pick a day and time, then pay. Your booking is confirmed straight away.' },
  { q: 'When is my payment released to the professional?', a: 'Pulsae holds your payment. After your session the professional marks it complete and you confirm it within 24 hours. The professional is paid 48 hours after your confirmation.' },
  { q: 'Can I cancel a booking?', a: 'More than 24 hours before the session you get a rebooking credit valid for 30 days. Within 24 hours the session is charged in full.' },
  { q: 'How does weekly repeat billing work?', a: 'You are charged each week for that week\'s sessions, 48 hours before the first one. You can stop the series at any time and it applies from the next charge.' },
  { q: 'What if something went wrong?', a: 'Use "Report a problem" on the booking or contact us. We review every report.' },
];
