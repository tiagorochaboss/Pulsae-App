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



// Sample address of a professional's own place (clinic or studio). Shown to the customer after booking.
export const placeOf = (p: Pro) => 'Sample clinic, ' + p.area + ', Riyadh';

export type SeedReview = { id: string; who: string; rating: number; text: string; date: string };
export const REVIEWS: SeedReview[] = [
  { id: 'r1', who: 'Customer A', rating: 5, text: 'Very professional and on time. My back feels much better after three sessions.', date: '2026-10-28' },
  { id: 'r2', who: 'Customer B', rating: 5, text: 'Clear plan and great communication.', date: '2026-10-19' },
  { id: 'r3', who: 'Customer C', rating: 4, text: 'Good session, would book again.', date: '2026-10-02' },
];
// Reply already written for the first review (sample).
export const SEED_REPLIES: Record<string, string> = { r1: 'Thank you, it was a pleasure working with you.' };


// Sample photos and videos on other professionals' pages. Some professionals add none, which is fine.
export type SeedMedia = { id: string; kind: 'photo' | 'video'; art: { emoji: string; bg: string }; caption: string };
export const PRO_MEDIA: Record<string, SeedMedia[]> = {
  p2: [
    { id: 'p2a', kind: 'photo', art: { emoji: '🏋️', bg: '#FFE3D8' }, caption: 'Strength session' },
    { id: 'p2b', kind: 'video', art: { emoji: '🎬', bg: '#EFE6FA' }, caption: 'A full-body warm-up you can do at home' },
    { id: 'p2c', kind: 'photo', art: { emoji: '🤸', bg: '#DDF3E6' }, caption: 'Mobility class' },
  ],
  p4: [
    { id: 'p4a', kind: 'photo', art: { emoji: '🥗', bg: '#DDF3E6' }, caption: 'Nutrition and training go together' },
    { id: 'p4b', kind: 'photo', art: { emoji: '🏃‍♀️', bg: '#FFF1CC' }, caption: 'Morning run with clients' },
  ],
  p5: [{ id: 'p5a', kind: 'video', art: { emoji: '🧘‍♀️', bg: '#DCEEFB' }, caption: 'Gentle shoulder rehab exercises' }],
  p6: [
    { id: 'p6a', kind: 'photo', art: { emoji: '⚽', bg: '#DDF3E6' }, caption: 'Athletic performance testing' },
    { id: 'p6b', kind: 'photo', art: { emoji: '🏅', bg: '#FFF1CC' }, caption: 'Race day with the team' },
  ],
};
