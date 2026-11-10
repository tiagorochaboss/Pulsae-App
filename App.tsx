import React, { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { Baloo2_700Bold } from '@expo-google-fonts/baloo-2';
import { Cairo_400Regular, Cairo_500Medium, Cairo_600SemiBold } from '@expo-google-fonts/cairo';
import { Feather } from '@expo/vector-icons';

import { colors, fonts } from './src/theme';
import { I18nProvider, useI18n } from './src/i18n';
import { Role, StoreProvider, useStore } from './src/store';
import { AppContext } from './src/role';

import Splash from './src/screens/Splash';
import Login from './src/screens/auth/Login';
import Signup, { SignupData } from './src/screens/auth/Signup';
import Verify from './src/screens/auth/Verify';
import Preferences from './src/screens/auth/Preferences';
import Forgot from './src/screens/auth/Forgot';
import { Credentials, GoLive, Terms } from './src/screens/auth/JoinPro';

import Discover from './src/screens/customer/Discover';
import Filters from './src/screens/customer/Filters';
import ProDetail from './src/screens/customer/ProDetail';
import ChooseTime from './src/screens/customer/ChooseTime';
import Checkout from './src/screens/customer/Checkout';
import Confirmed from './src/screens/customer/Confirmed';
import Bookings from './src/screens/customer/Bookings';
import BookingDetail from './src/screens/customer/BookingDetail';
import SeriesDetail from './src/screens/customer/SeriesDetail';
import CustomerProfile, { Credits, NotifSettings, PaymentMethods, PersonalDetails, SavedPros } from './src/screens/customer/Profile';

import Chat from './src/screens/shared/Chat';
import Notifications from './src/screens/shared/Notifications';
import Community from './src/screens/shared/Community';
import { AddAddress, SavedAddresses } from './src/screens/shared/SavedAddresses';
import { ContactUs, HelpCenter } from './src/screens/shared/Help';

import ProBookings from './src/screens/pro/ProBookings';
import ProBookingDetail from './src/screens/pro/ProBookingDetail';
import Earnings from './src/screens/pro/Earnings';
import Availability from './src/screens/pro/Availability';
import ServiceArea from './src/screens/pro/ServiceArea';
import ProProfile from './src/screens/pro/ProProfile';
import ProSettings, { Bank, Docs } from './src/screens/pro/ProSettings';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function useTabOptions() {
  const { t } = useI18n();
  return (icon: string, label: string) => ({
    headerShown: false,
    tabBarLabel: t(label),
    tabBarActiveTintColor: colors.coralDark,
    tabBarInactiveTintColor: colors.gray,
    tabBarLabelStyle: { fontFamily: fonts.medium, fontSize: 11 },
    tabBarStyle: { borderTopColor: colors.line, backgroundColor: colors.white },
    tabBarIcon: ({ color, size }: { color: string; size: number }) => <Feather name={icon as any} size={size} color={color} />,
  });
}

function CustomerTabs() {
  const o = useTabOptions();
  return (
    <Tab.Navigator>
      <Tab.Screen name="Discover" component={Discover} options={o('search', 'Discover')} />
      <Tab.Screen name="Bookings" component={Bookings} options={o('calendar', 'Bookings')} />
      <Tab.Screen name="Community" component={Community} options={o('users', 'Community')} />
      <Tab.Screen name="Profile" component={CustomerProfile} options={o('user', 'Profile')} />
    </Tab.Navigator>
  );
}

function ProTabs() {
  const o = useTabOptions();
  return (
    <Tab.Navigator>
      <Tab.Screen name="Bookings" component={ProBookings} options={o('calendar', 'Bookings')} />
      <Tab.Screen name="Community" component={Community} options={o('users', 'Community')} />
      <Tab.Screen name="Profile" component={ProProfile} options={o('user', 'Profile')} />
      <Tab.Screen name="Settings" component={ProSettings} options={o('settings', 'Settings')} />
    </Tab.Navigator>
  );
}

function CustomerApp() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={CustomerTabs} />
      <Stack.Screen name="ProDetail" component={ProDetail} />
      <Stack.Screen name="Filters" component={Filters} />
      <Stack.Screen name="ChooseTime" component={ChooseTime} />
      <Stack.Screen name="Checkout" component={Checkout} />
      <Stack.Screen name="Confirmed" component={Confirmed} options={{ gestureEnabled: false }} />
      <Stack.Screen name="BookingDetail" component={BookingDetail} />
      <Stack.Screen name="SeriesDetail" component={SeriesDetail} />
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="SavedAddresses" component={SavedAddresses} />
      <Stack.Screen name="AddAddress" component={AddAddress} />
      <Stack.Screen name="PersonalDetails" component={PersonalDetails} />
      <Stack.Screen name="PaymentMethods" component={PaymentMethods} />
      <Stack.Screen name="Credits" component={Credits} />
      <Stack.Screen name="Saved" component={SavedPros} />
      <Stack.Screen name="NotifSettings" component={NotifSettings} />
      <Stack.Screen name="Help" component={HelpCenter} />
      <Stack.Screen name="ContactUs" component={ContactUs} />
    </Stack.Navigator>
  );
}

function ProApp() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={ProTabs} />
      <Stack.Screen name="ProBookingDetail" component={ProBookingDetail} />
      <Stack.Screen name="ProDetail" component={ProDetail} />
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="Earnings" component={Earnings} />
      <Stack.Screen name="Availability" component={Availability} />
      <Stack.Screen name="ServiceArea" component={ServiceArea} />
      <Stack.Screen name="SavedAddresses" component={SavedAddresses} />
      <Stack.Screen name="AddAddress" component={AddAddress} />
      <Stack.Screen name="Bank" component={Bank} />
      <Stack.Screen name="Docs" component={Docs} />
      <Stack.Screen name="NotifSettings" component={NotifSettings} />
      <Stack.Screen name="Help" component={HelpCenter} />
      <Stack.Screen name="ContactUs" component={ContactUs} />
    </Stack.Navigator>
  );
}

type Phase = 'splash' | 'login' | 'forgot' | 'signup' | 'verify' | 'prefs' | 'credentials' | 'terms' | 'golive' | 'app';

function Root() {
  const { rtl } = useI18n();
  const { api } = useStore();
  const [phase, setPhase] = useState<Phase>('splash');
  const [role, setRole] = useState<Role>('customer');
  const [signup, setSignup] = useState<SignupData>({ first: '', last: '', gender: '', mobile: '', email: '', profession: '' });

  let body: React.ReactNode;
  if (phase === 'splash') body = <Splash onDone={() => setPhase('login')} />;
  else if (phase === 'login')
    body = (
      <Login
        onLogin={(r) => {
          setRole(r);
          setPhase('app');
        }}
        onSignup={(r) => {
          setRole(r);
          setPhase('signup');
        }}
        onForgot={() => setPhase('forgot')}
      />
    );
  else if (phase === 'forgot') body = <Forgot onBack={() => setPhase('login')} onDone={() => setPhase('login')} />;
  else if (phase === 'signup')
    body = (
      <Signup
        role={role}
        onBack={() => setPhase('login')}
        onContinue={(d) => {
          setSignup(d);
          setPhase('verify');
        }}
      />
    );
  else if (phase === 'verify')
    body = (
      <Verify
        mobile={signup.mobile}
        email={signup.email}
        onBack={() => setPhase('signup')}
        onDone={() => {
          if (role === 'customer') {
            api.setCustomerName((signup.first + ' ' + signup.last).trim() || 'Customer Name');
            setPhase('prefs');
          } else setPhase('credentials');
        }}
      />
    );
  else if (phase === 'prefs') body = <Preferences onDone={() => setPhase('app')} />;
  else if (phase === 'credentials') body = <Credentials onBack={() => setPhase('verify')} onContinue={() => setPhase('terms')} />;
  else if (phase === 'terms') body = <Terms onBack={() => setPhase('credentials')} onContinue={() => setPhase('golive')} />;
  else if (phase === 'golive') body = <GoLive onBack={() => setPhase('terms')} onDone={() => setPhase('app')} />;
  else
    body = (
      <NavigationContainer key={role} direction={rtl ? 'rtl' : 'ltr'}>
        {role === 'customer' ? <CustomerApp /> : <ProApp />}
      </NavigationContainer>
    );

  return (
    <AppContext.Provider value={{ role, switchRole: setRole, logout: () => setPhase('login') }}>
      <View style={{ flex: 1, direction: rtl ? 'rtl' : 'ltr', backgroundColor: colors.white }}>
        <StatusBar style={phase === 'splash' ? 'light' : 'dark'} />
        {body}
      </View>
    </AppContext.Provider>
  );
}

export default function App() {
  const [loaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Baloo2_700Bold,
    Cairo_400Regular,
    Cairo_500Medium,
    Cairo_600SemiBold,
  });
  if (!loaded) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.coral, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.white} />
      </View>
    );
  }
  return (
    <SafeAreaProvider>
      <I18nProvider>
        <StoreProvider>
          <Root />
        </StoreProvider>
      </I18nProvider>
    </SafeAreaProvider>
  );
}
