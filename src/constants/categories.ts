import { Region } from 'react-native-maps';
import { CategoryConfig } from '../types/travel';

// Початковий огляд карти: місто Хмельницький (основна локація додатку)
export const KHMELNYTSKYI_REGION: Region = {
  latitude: 49.4230,
  longitude: 26.9871,
  latitudeDelta: 0.08,
  longitudeDelta: 0.06,
};

// Альтернативний огляд карти: місто Вінниця
export const VINNYTSIA_REGION: Region = {
  latitude: 49.2331,
  longitude: 28.4682,
  latitudeDelta: 0.08,
  longitudeDelta: 0.06,
};

// За замовчуванням початковий регіон — місто Хмельницький
export const INITIAL_MAP_REGION: Region = VINNYTSIA_REGION;

// Список категорій для міток та фільтрів
export const CATEGORIES: CategoryConfig[] = [
  { id: 'mountain', label: 'Гори', emoji: '&#x1f3d4;️', color: '#6366F1' },
  { id: 'beach', label: 'Пляжі', emoji: '&#x1f3d6;️', color: '#0EA5E9' },
  { id: 'city', label: 'Міста', emoji: '&#x1f3d9;️', color: '#8B5CF6' },
  { id: 'nature', label: 'Природа', emoji: '&#x1f332;', color: '#10B981' },
  { id: 'culture', label: 'Культура', emoji: '&#x1f3db;️', color: '#F59E0B' },
  { id: 'food', label: 'Гастрономія', emoji: '☕', color: '#EC4899' },
];

export const getCategoryById = (id: string): CategoryConfig => {
  return (
    CATEGORIES.find((cat) => cat.id === id) || {
      id: 'city',
      label: 'Локація',
      emoji: '&#x1f4cd;',
      color: '#3B82F6',
    }
  );
};