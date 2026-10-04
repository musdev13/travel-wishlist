import React, { createContext, useContext, useEffect, useState } from 'react';
import { loadPlacesFromStorage, savePlacesToStorage } from '../services/storage';
import { TravelPlace } from '../types/travel';

// Опис інтерфейсу стану та методів контексту
interface PlacesContextType {
  places: TravelPlace[];                                       // Список усіх збережених локацій
  selectedPlaceForFocus: TravelPlace | null;                  // Точка, обрана для перельоту камери
  setSelectedPlaceForFocus: (place: TravelPlace | null) => void; // Встановлення цільової точки
  addPlace: (newPlace: TravelPlace) => Promise<void>;          // Додавання нової точки
  deletePlace: (id: string) => Promise<void>;                  // Видалення точки за id
}

// Створюємо React-контекст із початковим значенням undefined
const PlacesContext = createContext<PlacesContextType | undefined>(undefined);

/**
 * Провайдер стану: огортає кореневий маршрут додатку
 */
export const PlacesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Стан списку збережених місць
  const [places, setPlaces] = useState<TravelPlace[]>([]);

  // 2. Стан обраного місця для взаємодії між табами:
  // Коли користувач у Списку тисне на картку, ми записуємо сюди об'єкт локації,
  // перемикаємо таб на Карту, і MapView плавно летить до цих координат!
  const [selectedPlaceForFocus, setSelectedPlaceForFocus] = useState<TravelPlace | null>(null);

  // 3. При монтуванні провайдера (старт додатку) зчитуємо збережені дані з пам'яті
  useEffect(() => {
    const initData = async () => {
      const stored = await loadPlacesFromStorage();
      setPlaces(stored);
    };
    initData();
  }, []);

  // 4. Додавання нового місця:
  // Додаємо нову точку на початок списку (щоб свіжі були зверху)
  // та синхронно зберігаємо оновлений масив у постійну пам'ять
  const addPlace = async (newPlace: TravelPlace) => {
    const updated = [newPlace, ...places];
    setPlaces(updated);
    await savePlacesToStorage(updated);
  };

  // 5. Видалення місця:
  // Фільтруємо масив за id та зберігаємо новий стан
  const deletePlace = async (id: string) => {
    const updated = places.filter((p) => p.id !== id);
    setPlaces(updated);
    await savePlacesToStorage(updated);
  };

  return (
    <PlacesContext.Provider
      value={{
        places,
        selectedPlaceForFocus,
        setSelectedPlaceForFocus,
        addPlace,
        deletePlace,
      }}
    >
      {children}
    </PlacesContext.Provider>
  );
};

/**
 * Користувацький хук usePlaces() для зручного доступу до контексту.
 * Викидає зрозумілу помилку, якщо розробник забув обернути компонент у <PlacesProvider>.
 */
export const usePlaces = (): PlacesContextType => {
  const context = useContext(PlacesContext);
  if (!context) {
    throw new Error('usePlaces must be used within a PlacesProvider');
  }
  return context;
};