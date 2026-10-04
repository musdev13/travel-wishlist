// Ідентифікатори категорій локацій
export type CategoryId = 'mountain' | 'beach' | 'city' | 'food' | 'nature' | 'culture';

// Інтерфейс конфігурації категорії
export interface CategoryConfig {
  id: CategoryId;
  label: string;
  emoji: string;
  color: string;
}

// Повна модель збереженої локації
export interface TravelPlace {
  id: string;
  title: string;
  description: string;
  categoryId: CategoryId;
  rating: number; // від 1 до 5 зірок
  createdAt: number; // таймстамп створення
  coordinate: {
    latitude: number;
    longitude: number;
  };
}

// Стан тимчасової точки у процесі вибору
export interface PendingPoint {
  latitude: number;
  longitude: number;
}