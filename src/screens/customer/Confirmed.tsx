import React from 'react';
import { View } from 'react-native';
import { colors, fonts } from '../../theme';
import { Btn, Card, Icon, Line, Screen, Text } from '../../components/ui';
import { PROS } from '../../data';
import { useI18n } from '../../i18n';
import { fmtDate, fmtTime, money } from '../../lib';

export default function Confirmed({ navigation, route }: any) {
  const { lang, tf } = useI18n();
  const { ids, seriesId, total, mode, proId, date, time } = route.params;
  const pro = PROS.find((p) => p.id === proId) || PROS[0];
  const goBookings = () => navigation.navigate('Tabs', { screen: 'Bookings' });
  return (
    <Screen
      noHeader
      footer={
        <>
          <Btn label="View my bookings" onPress={goBookings} />
          <Btn label="Back to Discover" kind="outline" onPress={() => navigation.navigate('Tabs', { screen: 'Discover' })} />
        </>
      }
    >
      <View style={{ alignItems: 'center', gap: 10, paddingTop: 40 }}>
        <View style={{ width: 84, height: 84, borderRadius: 42, backgroundColor: colors.pale, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="check" size={42} color={colors.coral} />
        </View>
        <Text style={{ fontFamily: fonts.semibold, fontSize: 22, color: colors.ink }}>You are booked</Text>
        <Text style={{ fontFamily: fonts.regular, fontSize: 14, color: colors.gray, textAlign: 'center' }}>{tf('{p} has been notified.', { p: pro.name })}</Text>
      </View>
      <Card style={{ gap: 10 }}>
        <Line label="Professional" value={pro.name} />
        <Line label="First session" value={fmtDate(date, lang) + ', ' + fmtTime(time, lang)} />
        <Line label="Type" value={mode === 'single' ? 'Single session' : mode === 'weekly' ? 'Weekly repeat' : 'Pack of sessions'} />
        <Line label="Paid today" value={money(total)} bold />
      </Card>
      <Text style={{ fontFamily: fonts.regular, fontSize: 13, lineHeight: 20, color: colors.gray }}>You can message your professional, move or cancel from My bookings. Cancel more than 24 hours ahead and you get a rebooking credit.</Text>
    </Screen>
  );
}
