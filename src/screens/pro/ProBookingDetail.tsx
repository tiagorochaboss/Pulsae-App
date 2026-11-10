import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { colors, fonts } from '../../theme';
import { Btn, Card, Chip, Divider, Field, Line, Notice, Panel, Screen, Tag, Text, useToast } from '../../components/ui';
import { useStore } from '../../store';
import { useI18n } from '../../i18n';
import { fmtDate, fmtTime, money } from '../../lib';

export default function ProBookingDetail({ navigation, route }: any) {
  const { s, api } = useStore();
  const { lang } = useI18n();
  const toast = useToast();
  const [panel, setPanel] = useState<'' | 'cancel' | 'report'>('');
  const [cat, setCat] = useState('');
  const [details, setDetails] = useState('');
  const b = s.bookings.find((x) => x.id === route.params.id);
  if (!b) {
    return (
      <Screen title="Booking" onBack={() => navigation.goBack()}>
        <Text>This booking is no longer available.</Text>
      </Screen>
    );
  }
  const reported = s.reports.some((r) => r.bookingId === b.id && r.by === 'pro');
  return (
    <View style={{ flex: 1 }}>
      <Screen title="Booking" onBack={() => navigation.goBack()}>
        <Card style={{ gap: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ flex: 1, fontFamily: fonts.semibold, fontSize: 17, color: colors.ink }}>{fmtDate(b.date, lang) + ' · ' + fmtTime(b.time, lang)}</Text>
            <Tag label={b.status === 'confirmed' ? 'Confirmed' : b.status === 'awaiting' ? 'Waiting for customer' : b.status === 'completed' ? 'Completed' : 'Cancelled'} tone={b.status === 'confirmed' ? 'outline' : 'gray'} />
          </View>
          <Divider />
          <Line label="Customer" value={b.customer} />
          <Line label="Where" value={b.where} />
          <Line label="Session price" value={money(b.price)} />
          {b.payoutDate ? <Line label="Payout date" value={fmtDate(b.payoutDate, lang)} accent /> : null}
        </Card>

        {b.status === 'confirmed' ? (
          <View style={{ gap: 10 }}>
            <Btn label="Message customer" kind="outline" onPress={() => navigation.navigate('Chat', { bookingId: b.id })} />
            <Btn label="Mark as completed" onPress={() => { api.markComplete(b.id); toast.show('Marked complete. The customer was asked to confirm.'); }} />
            <Btn label="Cancel session" kind="danger" onPress={() => setPanel(panel === 'cancel' ? '' : 'cancel')} />
          </View>
        ) : null}
        {b.status === 'awaiting' ? <Notice icon="clock" text="Waiting for the customer to confirm. If they do not respond within 24 hours the session is confirmed automatically. You are paid 48 hours after confirmation." /> : null}
        {b.status === 'completed' ? <Notice icon="check-circle" text="The customer confirmed this session." /> : null}

        {panel === 'cancel' ? (
          <Panel title="Cancel this session?">
            <Notice icon="alert-circle" text="The customer will be refunded in full and your account will be flagged. Repeated cancellations can lead to removal from Pulsae." />
            <Btn label="Yes, cancel" kind="danger" onPress={() => { api.cancelBooking(b.id, 'pro'); setPanel(''); toast.show('Cancelled. The customer was refunded.'); }} />
            <Btn label="Keep session" kind="outline" onPress={() => setPanel('')} />
          </Panel>
        ) : null}

        {b.status !== 'cancelled' ? (
          reported ? (
            <Notice icon="flag" text="You reported this customer. Our team will review it." />
          ) : panel === 'report' ? (
            <Panel title="Report this customer">
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {['No-show', 'Late', 'Behaviour', 'Safety', 'Other'].map((c) => <Chip key={c} label={c} on={cat === c} onPress={() => setCat(c)} />)}
              </View>
              <Field label="Details" value={details} onChangeText={setDetails} multiline />
              <Btn label="Send report" disabled={!cat} onPress={() => { api.report(b.id, 'pro', cat, details); setPanel(''); toast.show('Report sent.'); }} />
            </Panel>
          ) : (
            <Pressable onPress={() => setPanel('report')}>
              <Text style={{ textAlign: 'center', fontFamily: fonts.medium, fontSize: 13, color: colors.coralDark }}>Report this customer</Text>
            </Pressable>
          )
        ) : null}
      </Screen>
      {toast.node}
    </View>
  );
}
