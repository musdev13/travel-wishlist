import AsyncStorage from '@react-native-async-storage/async-storage';
import { TravelPlace } from '../types/travel';

// Ключ сховища містить префікс @ та версію схеми (_v1)
// Це захищає від конфліктів та дозволяє легко мігрувати дані в майбутньому
const STORAGE_KEY = '@travel_wishlist_places_v1';

/**
 * Завантажує збережені локації з AsyncStorage.
 *
 * 1. Зчитує сирий текстовий JSON за ключем STORAGE_KEY.
 * 2. Якщо ключ відсутній (перший запуск додатку) — повертає порожній масив [].
 * 3. Десеріалізує JSON у типізований масив TravelPlace[].
 * 4. Якщо файл пошкоджено — перехоплює помилку та повертає [] замість падіння додатку.
 */
export const loadPlacesFromStorage = async (): Promise<TravelPlace[]> => {
  try {
    const rawData = await AsyncStorage.getItem(STORAGE_KEY);
    if (!rawData) {
      return []; // Перший запуск: даних ще немає
    }
    return JSON.parse(rawData) as TravelPlace[];
  } catch (error) {
    console.error('Помилка під час читання з AsyncStorage:', error);
    return [];
  }
};

/**
 * Зберігає оновлений масив локацій у сховище.
 *
 * 1. Серіалізує масив об'єктів у рядок JSON.stringify().
 * 2. Записує рядок у нативну базу даних пристрою (SharedPreferences на Android / SQLite або plist на iOS).
 * 3. Повертає true у разі успіху або false у разі помилки.
 */
export const savePlacesToStorage = async (places: TravelPlace[]): Promise<boolean> => {
  try {
    const jsonString = JSON.stringify(places);
    await AsyncStorage.setItem(STORAGE_KEY, jsonString);
    return true;
  } catch (error) {
    console.error('Помилка під час запису в AsyncStorage:', error);
    return false;
  }
};