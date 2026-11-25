export const colors = {
  coral: '#D85A30',
  coralLight: '#F0997B',
  coralDark: '#993C1D',
  coralDarkest: '#712B13',
  pale: '#FBEAE3',
  ink: '#231815',
  gray: '#6B6B6B',
  line: '#F0E4DF',
  border: '#E6D9D3',
  soft: '#F7F4F2',
  white: '#FFFFFF',
  // Extra accents used for a livelier look (Community and the professional app).
  mint: '#2FA38A',
  mintPale: '#DDF3E6',
  mintDark: '#216B45',
  sun: '#E5A21B',
  sunPale: '#FFF1CC',
  sunDark: '#8A5A00',
  sky: '#3E8FD6',
  skyPale: '#DCEEFB',
  skyDark: '#1F5F93',
  plum: '#7A4FC0',
  plumPale: '#EFE6FA',
  plumDark: '#5B3A8E',
};

export const fonts = {
  regular: 'Poppins_400Regular',
  medium: 'Poppins_500Medium',
  semibold: 'Poppins_600SemiBold',
  brand: 'Baloo2_700Bold',
};

// Poppins has no Arabic letters, so Arabic text uses Cairo.
export const arFonts: Record<string, string> = {
  Poppins_400Regular: 'Cairo_400Regular',
  Poppins_500Medium: 'Cairo_500Medium',
  Poppins_600SemiBold: 'Cairo_600SemiBold',
};

export const radius = { card: 20, pill: 999, field: 14 };
