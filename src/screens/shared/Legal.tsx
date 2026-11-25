import React from 'react';
import { View } from 'react-native';
import { colors, fonts } from '../../theme';
import { Notice, RowItem, Screen, Text, styles } from '../../components/ui';
import { useApp } from '../../role';
import { ProTermsContent } from '../auth/JoinPro';

type Doc = { title: string; updated: string; sections: { h: string; p: string }[] };

const DOCS: Record<string, Doc> = {
  terms: {
    title: 'Terms of Use',
    updated: 'Draft',
    sections: [
      { h: 'About Pulsae', p: 'Pulsae is a marketplace that helps you find and book independent wellness professionals, such as physiotherapists and personal trainers. The professionals are independent: they provide the sessions, and Pulsae provides the platform, payments and support.' },
      { h: 'Your account', p: 'Please give accurate details and keep your password safe. You are responsible for activity on your account. We may verify your mobile number and email.' },
      { h: 'Bookings and payments', p: 'Prices are set by the professionals and shown before you pay. Payments are held securely by Pulsae and released to the professional after the session is confirmed. Prepaid sessions are paid in advance and used with the same professional.' },
      { h: 'Cancellations and refunds', p: 'More than 24 hours before a session, you receive a rebooking credit valid for 30 days (or your prepaid session returns to your balance). Within 24 hours, the session is charged in full. If a professional cancels, you are refunded in full.' },
      { h: 'Respect and safety', p: 'Please treat professionals with respect. Pulsae may warn, suspend or remove accounts that put others at risk or break these terms.' },
      { h: 'Health', p: 'Sessions are not a substitute for emergency medical care. Tell your professional about any condition or injury before you start.' },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    updated: 'Draft',
    sections: [
      { h: 'What we collect', p: 'The details you give us (name, gender, mobile number, email), your bookings, messages with your professional, your saved addresses and your preferences. Card details are handled by our payment provider and are not stored by Pulsae.' },
      { h: 'How we use it', p: 'To run your bookings and payments, to let you chat with your professional, to keep Pulsae safe, and to improve the service. With your consent, we also use your preferences for recommendations and offers.' },
      { h: 'Who sees it', p: 'Your professional sees your first name, the session address and your messages for the booking. We do not sell your personal data.' },
      { h: 'Your choices', p: 'You can update your details in Personal details, change notification settings, and ask us to access, correct or delete your data by contacting us.' },
      { h: 'Saudi data protection law', p: 'We handle personal data in line with the Saudi Personal Data Protection Law (PDPL).' },
    ],
  },
};

export function Legal({ navigation }: any) {
  const { role } = useApp();
  return (
    <Screen title="Legal" onBack={() => navigation.goBack()}>
      <View>
        <RowItem icon="file-text" title="Terms of Use" onPress={() => navigation.navigate('LegalDoc', { key: 'terms' })} />
        <RowItem icon="shield" title="Privacy Policy" onPress={() => navigation.navigate('LegalDoc', { key: 'privacy' })} />
        {role === 'pro' ? <RowItem icon="briefcase" title="Professional Terms" onPress={() => navigation.navigate('LegalDoc', { key: 'pro' })} /> : null}
      </View>
    </Screen>
  );
}

export function LegalDoc({ navigation, route }: any) {
  const key = route.params.key as string;
  if (key === 'pro') {
    return (
      <Screen title="Professional Terms" onBack={() => navigation.goBack()}>
        <ProTermsContent />
        <Notice icon="info" text="Draft text for the prototype. The final legal wording will be reviewed before launch." />
      </Screen>
    );
  }
  const d = DOCS[key];
  return (
    <Screen title={d.title} onBack={() => navigation.goBack()}>
      {d.sections.map((x) => (
        <View key={x.h} style={{ gap: 4 }}>
          <Text style={{ fontFamily: fonts.medium, fontSize: 15, color: colors.ink }}>{x.h}</Text>
          <Text style={styles.p}>{x.p}</Text>
        </View>
      ))}
      <Notice icon="info" text="Draft text for the prototype. The final legal wording will be reviewed before launch." />
    </Screen>
  );
}
