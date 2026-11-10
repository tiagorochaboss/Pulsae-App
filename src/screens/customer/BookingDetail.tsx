import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { colors, fonts } from '../../theme';
import { Btn, Card, Chip, Divider, Field, Icon, Line, Notice, Panel, Screen, Section, Text, useToast } from '../../components/ui';
import { PROS } from '../../data';
import { slotsFor, useStore } from '../../store';
import { useI18n } from '../../i18n';
import { addDaysIso, dayName, fmtDate, fmtTime, fromIso, hoursUntil, money, todayIso } from '../../lib';
import { statusTag } from './Bookings';

export default function BookingDetail({ navigation, route }: any) {
  const { s, api } = useStore();
  const { lang, tf } = useI18n();
  const toast = useToast();
  const b = s.bookings.find((x) => x.id === route.params.id);
  const [panel, setPanel] = useState<'' | 'cancel' | 'move' | 'report'>('');
  const [newDate, setNewDate] = useState(todayIso());
  const [newTime, setNewTime] = useState('');
  const [cat, setCat] = useState('');
  const [details, setDetails] = useState('');
  const [stars, setStars] = useState(0);

  if (!b) {
    return (
      <Screen title="Booking" onBack={() => navigation.goBack()}>
        <Text>This booking is no longer available.</Text>
      </Screen>
    );
  }
  const pro = PROS.find((p) => p.id === b.proId) || PROS[0];
  const hrs = hoursUntil(b.date, b.time);
  const future = b.status === 'confirmed' && hrs > 0;
  const early = hrs > 24;
  const days = Array.from({ length: 14 }, (_, i) => addDaysIso(todayIso(), i + 1));
  const reported = s.reports.some((r) => r.bookingId === b.id && r.by === 'customer');

  const doCancel = () => {
    const r = api.cancelBooking(b.id, 'customer');
    setPanel('');
    toast.show(r.type === 'credit' ? tf('Cancelled. {a} added as a rebooking credit.', { a: money(r.amount) }) : r.type === 'charged' ? 'Cancelled. This session is charged in full.' : 'Cancelled.');
  };

  return (
    <View style={{ flex: 1 }}>
      <Screen title="Booking" onBack={() => navigation.goBack()}>
        <Card style={{ gap: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ flex: 1, fontFamily: fonts.semibold, fontSize: 17, color: colors.ink }}>{fmtDate(b.date, lang) + ' · ' + fmtTime(b.time, lang)}</Text>
            {statusTag(b)}
          </View>
          <Divider />
          <Line label="Professional" value={pro.name} />
          <Line label="Where" value={b.where} />
          <Line label="Price" value={money(b.price)} />
          {b.status === 'cancelled' ? <Line label="Cancelled by" value={b.cancelledBy === 'pro' ? 'Professional' : b.cancelledBy === 'series' ? 'Series stopped' : 'You'} /> : null}
          {b.refund ? <Line label="Refund" value={b.refund} accent /> : null}
          {b.payoutDate ? <Line label="Professional paid on" value={fmtDate(b.payoutDate, lang)} /> : null}
        </Card>

        {b.seriesId ? (
          <Pressable onPress={() => navigation.navigate('SeriesDetail', { id: b.seriesId })}>
            <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Icon name="repeat" size={18} color={colors.coralDark} />
              <Text style={{ flex: 1, fontFamily: fonts.medium, fontSize: 14, color: colors.ink }}>Part of a weekly series</Text>
              <Icon name="chevron-right" size={18} color={colors.gray} />
            </Card>
          </Pressable>
        ) : null}

        {b.status === 'awaiting' ? (
          <Panel title="How was your session?">
            <Text style={{ fontFamily: fonts.regular, fontSize: 13, lineHeight: 20, color: colors.gray }}>Your professional marked this session complete. Confirm within 24 hours so they can be paid. If something went wrong, report it instead.</Text>
            <Btn label="Confirm session" onPress={() => { api.confirmSession(b.id); toast.show('Thank you. The professional will be paid in 48 hours.'); }} />
          </Panel>
        ) : null}

        {b.status === 'completed' ? (
          <Section title="Rate your session">
            <View style={{ flexDirection: 'row', gap: 6 }}>
              {[1, 2, 3, 4, 5].map((n) => (
                <Pressable key={n} accessibilityLabel={n + ' stars'} onPress={() => { setStars(n); toast.show('Thanks for your review.'); }}>
                  <Icon name="star" size={30} color={n <= stars ? colors.coral : colors.border} />
                </Pressable>
              ))}
            </View>
          </Section>
        ) : null}

        {future ? (
          <View style={{ gap: 10 }}>
            <Btn label="Message professional" kind="outline" onPress={() => navigation.navigate('Chat', { bookingId: b.id })} />
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Btn label="Move" kind="outline" style={{ flex: 1 }} onPress={() => setPanel(panel === 'move' ? '' : 'move')} />
              <Btn label="Cancel" kind="danger" style={{ flex: 1 }} onPress={() => setPanel(panel === 'cancel' ? '' : 'cancel')} />
            </View>
          </View>
        ) : null}

        {panel === 'cancel' ? (
          <Panel title="Cancel this session?">
            <Notice icon={early ? 'gift' : 'alert-circle'} text={early ? 'More than 24 hours before the session: you get a rebooking credit, valid for 30 days.' : 'Less than 24 hours before the session: the session is charged in full.'} />
            <Btn label="Yes, cancel" kind="danger" onPress={doCancel} />
            <Btn label="Keep booking" kind="outline" onPress={() => setPanel('')} />
          </Panel>
        ) : null}

        {panel === 'move' ? (
          <Panel title="Move to another time">
            {!early ? (
              <Notice text="Sessions can only be moved more than 24 hours before the start time." icon="alert-circle" />
            ) : (
              <>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                  {days.map((d) => (
                    <Chip key={d} label={dayName(d, lang) + ' ' + fromIso(d).getDate()} on={newDate === d} onPress={() => { setNewDate(d); setNewTime(''); }} />
                  ))}
                </ScrollView>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {slotsFor(s, b.proId, newDate).map((x) => <Chip key={x} label={fmtTime(x, lang)} on={newTime === x} onPress={() => setNewTime(x)} />)}
                </View>
                <Btn label="Confirm new time" disabled={!newTime} onPress={() => { api.reschedule(b.id, newDate, newTime); setPanel(''); toast.show('Your session was moved.'); }} />
              </>
            )}
          </Panel>
        ) : null}

        {b.status !== 'cancelled' && b.status !== 'unpaid' ? (
          reported ? (
            <Notice icon="flag" text="You reported a problem with this booking. Our team will get back to you." />
          ) : panel === 'report' ? (
            <Panel title="Report a problem">
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {['No-show', 'Late', 'Safety', 'Quality of service', 'Other'].map((c) => <Chip key={c} label={c} on={cat === c} onPress={() => setCat(c)} />)}
              </View>
              <Field label="Details" value={details} onChangeText={setDetails} multiline placeholder="Tell us what happened" />
              <Btn label="Send report" disabled={!cat} onPress={() => { api.report(b.id, 'customer', cat, details); setPanel(''); toast.show('Report sent.'); }} />
            </Panel>
          ) : (
            <Pressable onPress={() => setPanel('report')}>
              <Text style={{ textAlign: 'center', fontFamily: fonts.medium, fontSize: 13, color: colors.coralDark }}>Report a problem</Text>
            </Pressable>
          )
        ) : null}
      </Screen>
      {toast.node}
    </View>
  );
}
