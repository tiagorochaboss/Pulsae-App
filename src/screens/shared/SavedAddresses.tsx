import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { colors, fonts } from '../../theme';
import { Btn, Card, Check, Chip, Empty, Field, Icon, Screen, Tag, Text, styles } from '../../components/ui';
import { useStore } from '../../store';
import { useApp } from '../../role';

export function SavedAddresses({ navigation }: any) {
  const { s, api } = useStore();
  const { role } = useApp();
  const list = s.addresses[role];
  return (
    <Screen title={role === 'customer' ? 'Saved addresses' : 'Saved places'} onBack={() => navigation.goBack()} footer={<Btn label="Add new" onPress={() => navigation.navigate('AddAddress')} />}>
      {list.length === 0 ? <Empty icon="map-pin" title="Nothing saved yet" sub="Save your home or gym to book faster." /> : null}
      {list.map((a) => (
        <Card key={a.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Icon name={a.label === 'Home' ? 'home' : a.label === 'Gym' ? 'activity' : 'map-pin'} color={colors.coralDark} />
          <View style={{ flex: 1, gap: 2 }}>
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
              <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: colors.ink }}>{a.label}</Text>
              {a.isDefault ? <Tag label="Default" /> : null}
            </View>
            <Text style={styles.cap}>{a.line}</Text>
            {a.notes ? <Text style={styles.cap}>{a.notes}</Text> : null}
          </View>
          <Pressable accessibilityLabel="Remove" hitSlop={8} onPress={() => api.removeAddress(role, a.id)}>
            <Icon name="trash-2" size={18} color={colors.gray} />
          </Pressable>
        </Card>
      ))}
    </Screen>
  );
}

export function AddAddress({ navigation }: any) {
  const { api } = useStore();
  const { role } = useApp();
  const [label, setLabel] = useState(role === 'customer' ? 'Home' : 'My clinic');
  const [line, setLine] = useState('');
  const [notes, setNotes] = useState('');
  const [def, setDef] = useState(false);
  const labels = role === 'customer' ? ['Home', 'Work', 'Gym'] : ['My clinic', 'Gym', 'Other'];
  return (
    <Screen title="New address" onBack={() => navigation.goBack()} footer={<Btn label="Save address" disabled={!line.trim()} onPress={() => { api.addAddress(role, { label, line: line.trim(), notes: notes.trim(), isDefault: def }); navigation.goBack(); }} />}>
      <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
        {labels.map((l) => <Chip key={l} label={l} on={label === l} onPress={() => setLabel(l)} />)}
      </View>
      <Field label="Street and district" value={line} onChangeText={setLine} placeholder="Street, district, Riyadh" />
      <Field label="Building, gate or notes" value={notes} onChangeText={setNotes} />
      <Check on={def} onPress={() => setDef(!def)} label="Make this my default" />
    </Screen>
  );
}
