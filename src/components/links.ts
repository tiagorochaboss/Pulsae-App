import { Link, Role } from '../store';

// Opens the screen a notification points to.
export function openLink(navigation: any, role: Role, link?: Link) {
  if (!link) return;
  const tab = (name: string) => navigation.navigate('Tabs', { screen: name });
  switch (link.to) {
    case 'booking':
      return navigation.navigate(role === 'pro' ? 'ProBookingDetail' : 'BookingDetail', { id: link.id });
    case 'chat':
      return navigation.navigate('Chat', { bookingId: link.id });
    case 'credits':
      return role === 'customer' ? navigation.navigate('Credits') : undefined;
    case 'prepaid':
      return role === 'customer' ? navigation.navigate('Prepaid') : undefined;
    case 'series':
      return role === 'customer' ? navigation.navigate('SeriesDetail', { id: link.id }) : tab('Bookings');
    case 'earnings':
      return role === 'pro' ? navigation.navigate('Earnings') : undefined;
    case 'community':
      return tab('Community');
    case 'post':
      return navigation.navigate('PostDetail', { id: link.id });
    case 'docs':
      return role === 'pro' ? navigation.navigate('Docs') : undefined;
    case 'reviews':
      return role === 'pro' ? navigation.navigate('ProReviews') : undefined;
  }
}
