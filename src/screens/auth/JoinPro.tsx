import React, { useState } from 'react';
import { View } from 'react-native';
import { colors, fonts } from '../../theme';
import { Btn, Card, Check, Icon, Line, Notice, Screen, Text, Divider } from '../../components/ui';

type Doc = { key: string; label: string; required: boolean };
const DOCS: Doc[] = [
  { key: 'licence', label: 'Professional licence (SCFHS or MoS)', required: true },
  { key: 'id', label: 'National ID or Iqama', required: true },
  { key: 'certs', label: 'Certificates and courses', required: false },
  { key: 'photo', label: 'Profile photo', required: false },
];

export function Credentials({ onBack, onContinue }: { onBack: () => void; onContinue: () => void }) {
  const [up, setUp] = useState<Record<string, boolean>>({});
  const ready = DOCS.filter((d) => d.required).every((d) => up[d.key]);
  return (
    <Screen title="Your credentials" onBack={onBack} footer={<Btn label="Continue" onPress={onContinue} disabled={!ready} />}>
      <Text style={{ fontFamily: fonts.regular, fontSize: 14, lineHeight: 21, color: colors.gray }}>Pulsae checks every professional before they go live. Upload clear photos or PDFs.</Text>
      {DOCS.map((d) => (
        <Card key={d.key} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Icon name={up[d.key] ? 'check-circle' : 'file-text'} color={up[d.key] ? colors.coral : colors.gray} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: colors.ink }}>{d.label}</Text>
            <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.gray }}>{up[d.key] ? 'sample_document.pdf' : d.required ? 'Required' : 'Optional'}</Text>
          </View>
          <Btn label={up[d.key] ? 'Remove' : 'Upload'} kind="small" onPress={() => setUp({ ...up, [d.key]: !up[d.key] })} />
        </Card>
      ))}
      <Notice text="Prototype: uploading is simulated. No file leaves your phone." />
    </Screen>
  );
}

const p13 = { fontFamily: fonts.regular, fontSize: 12.5, lineHeight: 19, color: colors.gray };

// The key terms, written to be clear and friendly. Used at sign-up and in Legal.
export function ProTermsContent() {
  return (
    <>
      <Card style={{ gap: 10 }}>
        <Text style={{ fontFamily: fonts.medium, fontSize: 15, color: colors.ink }}>How earnings work</Text>
        <Line label="Commission, first booking with a customer" value="25%" />
        <Line label="Commission, repeat bookings in the first 2 months" value="0%" />
        <Line label="Payment processing fee (up to)" value="5%" />
        <Divider />
        <Text style={p13}>The 25% is a one-time fee for bringing you a new customer. If the same customer keeps booking with you, there is no commission within 2 months of their last session. If they return after more than 2 months, the 25% applies again, as Pulsae has helped bring them back to you.</Text>
        <Text style={p13}>You are paid 48 hours after the customer confirms the session (or after the 24-hour automatic confirmation).</Text>
      </Card>

      <Card style={{ gap: 8 }}>
        <Text style={{ fontFamily: fonts.medium, fontSize: 15, color: colors.ink }}>Offers for customers</Text>
        <Text style={p13}>Today, customers can buy prepaid packs of 4 sessions (5% off) and 8 sessions (10% off). These offers help bring you more regular customers. When a customer books with an offer, the discount is covered from your session price, and you can always see the exact amount in Earnings.</Text>
        <Text style={p13}>Over time we may introduce other offers, such as new pack sizes, seasonal promotions or welcome offers. By joining Pulsae you agree to support the offers we run, and we will keep them reasonable and tell you about each new one in the app.</Text>
        <Text style={p13}>Prepaid sessions are already paid by the customer, so they are always honoured. Weekly repeat bookings are different: you choose whether to offer them.</Text>
      </Card>

      <Card style={{ gap: 8 }}>
        <Text style={{ fontFamily: fonts.medium, fontSize: 15, color: colors.ink }}>Growing together</Text>
        <Text style={p13}>Pulsae is new and will keep improving. As we grow, our fees, offers and features may be adjusted, and we may add new services. If we make a change, we will tell you in the app before it starts. It applies to future bookings only, and bookings already made stay as agreed. You can pause or stop offering sessions at any time.</Text>
      </Card>

      <Card style={{ gap: 6 }}>
        <Text style={{ fontFamily: fonts.medium, fontSize: 15, color: colors.ink }}>Cancellations</Text>
        <Text style={p13}>If you cancel or cannot attend, the customer is refunded in full and your account is flagged, so please tell the customer as early as you can. Customers who cancel with more than 24 hours notice receive a rebooking credit. Within 24 hours the session is paid to you.</Text>
      </Card>
    </>
  );
}

export function Terms({ onBack, onContinue }: { onBack: () => void; onContinue: () => void }) {
  const [a, setA] = useState(false);
  const [b, setB] = useState(false);
  const [c, setC] = useState(false);
  return (
    <Screen title="Professional terms" onBack={onBack} footer={<Btn label="Accept and continue" onPress={onContinue} disabled={!(a && b && c)} />}>
      <ProTermsContent />
      <Check on={a} onPress={() => setA(!a)} label="I have read and accept the Professional Terms and Conditions, including that fees and offers may be updated in the future with notice." />
      <Check on={b} onPress={() => setB(!b)} label="I understand that discounts on prepaid sessions and other offers run by Pulsae are covered from my session price, and I will support them." />
      <Check on={c} onPress={() => setC(!c)} label="I confirm my credentials are true and I will keep them valid." />
    </Screen>
  );
}

export function GoLive({ onBack, onDone }: { onBack: () => void; onDone: () => void }) {
  const [state, setState] = useState<'ready' | 'pending'>('ready');
  const items = ['Account created', 'Mobile and email verified', 'Credentials uploaded', 'Terms accepted'];
  if (state === 'pending') {
    return (
      <Screen title="Under review" footer={<Btn label="Demo: simulate approval" onPress={onDone} />}>
        <View style={{ alignItems: 'center', gap: 10, paddingVertical: 24 }}>
          <Icon name="clock" size={44} color={colors.coral} />
          <Text style={{ fontFamily: fonts.semibold, fontSize: 18, color: colors.ink }}>We are reviewing your details</Text>
          <Text style={{ fontFamily: fonts.regular, fontSize: 14, lineHeight: 21, color: colors.gray, textAlign: 'center' }}>This usually takes 1 to 2 working days. We will notify you as soon as you are live in Discover.</Text>
        </View>
        <Notice text="Prototype: tap the button below to see the app as an approved professional." />
      </Screen>
    );
  }
  return (
    <Screen title="Ready to go live" onBack={onBack} footer={<Btn label="Submit for review" onPress={() => setState('pending')} />}>
      {items.map((i) => (
        <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Icon name="check-circle" color={colors.coral} />
          <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: colors.ink }}>{i}</Text>
        </View>
      ))}
      <Text style={{ fontFamily: fonts.regular, fontSize: 13, lineHeight: 20, color: colors.gray }}>After approval, set your weekly availability, service area and price. Customers can find you once you are approved.</Text>
    </Screen>
  );
}
