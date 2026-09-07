import AsyncStorage from "@react-native-async-storage/async-storage";

const CREDENTIALS_KEY = "@khlongyong_admin_credentials";
const SESSION_KEY = "@khlongyong_admin_session";

const DEFAULT_USERNAME = "admin";
const DEFAULT_PASSWORD = "admin1234";

interface Credentials {
  username: string;
  password: string;
}

async function getCredentials(): Promise<Credentials> {
  try {
    const raw = await AsyncStorage.getItem(CREDENTIALS_KEY);
    if (raw) return JSON.parse(raw) as Credentials;
  } catch (err) {
    console.warn("อ่านข้อมูล credentials ล้มเหลว:", err);
  }
  return { username: DEFAULT_USERNAME, password: DEFAULT_PASSWORD };
}

export async function login(
  username: string,
  password: string
): Promise<boolean> {
  const creds = await getCredentials();
  const ok = username === creds.username && password === creds.password;
  if (ok) {
    await AsyncStorage.setItem(SESSION_KEY, "1");
  }
  return ok;
}

export async function logout(): Promise<void> {
  await AsyncStorage.removeItem(SESSION_KEY);
}

export async function isLoggedIn(): Promise<boolean> {
  const val = await AsyncStorage.getItem(SESSION_KEY);
  return val === "1";
}

export async function changeCredentials(
  newUsername: string,
  newPassword: string
): Promise<void> {
  await AsyncStorage.setItem(
    CREDENTIALS_KEY,
    JSON.stringify({ username: newUsername, password: newPassword })
  );
}
