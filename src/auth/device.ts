// Remember-me and Face ID helpers.
// expo-secure-store and expo-local-authentication are loaded only if installed, so the app still runs
// without them (the demo then simulates both). Install with:
//   npx expo install expo-secure-store expo-local-authentication
let Secure: any = null;
let Local: any = null;
try {
  Secure = require('expo-secure-store');
} catch (e) {
  Secure = null;
}
try {
  Local = require('expo-local-authentication');
} catch (e) {
  Local = null;
}

const KEY = 'pulsae.login';
const memory: Record<string, string> = {};

export type Saved = { id: string; password: string; faceId: boolean } | null;

export async function saveLogin(id: string, password: string, faceId: boolean) {
  const v = JSON.stringify({ id, password, faceId });
  try {
    if (Secure) await Secure.setItemAsync(KEY, v);
    else memory[KEY] = v;
  } catch (e) {
    memory[KEY] = v;
  }
}
export async function loadLogin(): Promise<Saved> {
  try {
    const v = Secure ? await Secure.getItemAsync(KEY) : memory[KEY];
    return v ? JSON.parse(v) : null;
  } catch (e) {
    return null;
  }
}
export async function clearLogin() {
  try {
    if (Secure) await Secure.deleteItemAsync(KEY);
  } catch (e) {}
  delete memory[KEY];
}

// True when the phone has Face ID / Touch ID set up. Without the native module the demo pretends it does.
export async function biometricsAvailable(): Promise<boolean> {
  if (!Local) return true;
  try {
    return (await Local.hasHardwareAsync()) && (await Local.isEnrolledAsync());
  } catch (e) {
    return false;
  }
}
export async function authenticate(reason: string): Promise<boolean> {
  if (!Local) return true; // demo fallback
  try {
    const r = await Local.authenticateAsync({ promptMessage: reason, cancelLabel: 'Cancel', disableDeviceFallback: false });
    return !!r.success;
  } catch (e) {
    return false;
  }
}
export const biometricsAreReal = () => !!Local;

// Photo picker. expo-image-picker is loaded only if installed:
//   npx expo install expo-image-picker
let Picker: any = null;
try {
  Picker = require('expo-image-picker');
} catch (e) {
  Picker = null;
}
export const photoPickerAvailable = () => !!Picker;
// Returns the chosen photo's uri, '' if cancelled, or null if permission was refused / not available.
export async function pickPhoto(source: 'library' | 'camera'): Promise<string | null> {
  if (!Picker) return null;
  try {
    const perm = source === 'camera' ? await Picker.requestCameraPermissionsAsync() : await Picker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return null;
    const opts = { allowsEditing: true, aspect: [1, 1], quality: 0.7 };
    const r = source === 'camera' ? await Picker.launchCameraAsync(opts) : await Picker.launchImageLibraryAsync({ ...opts, mediaTypes: ['images'] });
    if (r.canceled || !r.assets || !r.assets.length) return '';
    return r.assets[0].uri as string;
  } catch (e) {
    return null;
  }
}

// Photo or video for a professional's public profile. Returns the file's uri, '' if cancelled,
// or null if permission was refused or expo-image-picker is not installed.
export async function pickMedia(kind: 'photo' | 'video', source: 'library' | 'camera' = 'library'): Promise<string | null> {
  if (!Picker) return null;
  try {
    const perm = source === 'camera' ? await Picker.requestCameraPermissionsAsync() : await Picker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return null;
    const opts = { mediaTypes: [kind === 'video' ? 'videos' : 'images'], quality: 0.8, allowsEditing: false, videoMaxDuration: 60 };
    const r = source === 'camera' ? await Picker.launchCameraAsync(opts) : await Picker.launchImageLibraryAsync(opts);
    if (r.canceled || !r.assets || !r.assets.length) return '';
    return r.assets[0].uri as string;
  } catch (e) {
    return null;
  }
}
