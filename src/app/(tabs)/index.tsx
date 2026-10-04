import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { MapPressEvent } from 'react-native-maps';
import { AddPlaceModal } from '../../components/AddPlaceModal';
import { DraggablePendingMarker } from '../../components/DraggablePendingMarker';
import { PlaceMarker } from '../../components/PlaceMarker';
import { INITIAL_MAP_REGION } from '../../constants/categories';
import { usePlaces } from '../../context/PlacesContext';
import { getUserCurrentLocation } from '../../services/location';
import { PendingPoint, TravelPlace } from '../../types/travel';

export default function MapScreen() {
  const mapRef = useRef<MapView>(null);

  // Отримуємо спільний стан зі сховища через хук usePlaces()
  const { places, addPlace, selectedPlaceForFocus, setSelectedPlaceForFocus } = usePlaces();

  const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [pendingPoint, setPendingPoint] = useState<PendingPoint | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  // --------------------------------------------------------------------------
  // ЕФЕКТ: РЕАКЦІЯ НА ПЕРЕХІД ЗІ СПИСКУ WISHLIST
  // --------------------------------------------------------------------------
  // Якщо користувач на вкладці "places" натиснув на картку — ми зчитуємо її з
  // selectedPlaceForFocus і плавно направляємо камеру на координати цього місця!
  useEffect(() => {
    if (selectedPlaceForFocus) {
      mapRef.current?.animateToRegion(
        {
          latitude: selectedPlaceForFocus.coordinate.latitude,
          longitude: selectedPlaceForFocus.coordinate.longitude,
          latitudeDelta: 0.02, // Збільшуємо наближення для фокусу на об'єкті
          longitudeDelta: 0.02,
        },
        1000 // 1 секунда плавної анімації польоту
      );
      // Скидаємо прапорець, щоб анімація не повторювалася при випадкових рендерах
      setSelectedPlaceForFocus(null);
    }
  }, [selectedPlaceForFocus]);

  // --------------------------------------------------------------------------
  // ОБРОБКА ТАПУ ПО КАРТІ
  // --------------------------------------------------------------------------
  const handleMapPress = (e: MapPressEvent) => {
    // Отримуємо географічні координати точки дотику
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setPendingPoint({ latitude, longitude });
  };

  // --------------------------------------------------------------------------
  // ЗБЕРЕЖЕННЯ ТОЧКИ
  // --------------------------------------------------------------------------
  const handleSavePlace = async (newPlace: TravelPlace) => {
    await addPlace(newPlace); // Оновлює стан у контексті та записує в AsyncStorage
    setPendingPoint(null);     // Ховаємо тимчасовий маркер після успішного збереження
  };

  // --------------------------------------------------------------------------
  // ЦЕНТРУВАННЯ НА ПОТОЧНІЙ ГЕОПОЗИЦІЇ
  // --------------------------------------------------------------------------
  const handleFindMe = async () => {
    const coords = await getUserCurrentLocation();
    if (coords) {
      setUserCoords(coords);
      mapRef.current?.animateToRegion(
        {
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        },
        800
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Головне полотно карти */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={INITIAL_MAP_REGION}
        showsUserLocation={true}
        showsMyLocationButton={false}
        onPress={handleMapPress} // Тап ставить нову мітку
      >
        {/* Рендеринг усіх збережених локацій зі сховища */}
        {places.map((place) => (
          <PlaceMarker key={place.id} place={place} />
        ))}

        {/* Тимчасовий маркер у процесі перетягування та вибору */}
        {pendingPoint && (
          <DraggablePendingMarker
            coordinate={pendingPoint}
            onDragEnd={(coords) => setPendingPoint(coords)}
          />
        )}
      </MapView>

      {/* Верхня інформаційна панель */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>&#x1f30d; Мій тревел-щоденник</Text>
        <Text style={styles.headerSubtitle}>
          {pendingPoint
            ? 'Натисніть кнопку внизу або перетягніть маркер'
            : 'Торкніться карти, щоб поставити мітку'}
        </Text>
      </View>

      {/* Кнопка "Знайти мене" */}
      <TouchableOpacity style={styles.fabLocation} onPress={handleFindMe} activeOpacity={0.8}>
        <Text style={styles.fabIcon}>&#x1f3af;</Text>
      </TouchableOpacity>

      {/* Кнопка підтвердження точки (активна лише коли є обрана pendingPoint) */}
      {pendingPoint && (
        <TouchableOpacity
          style={styles.confirmPinButton}
          activeOpacity={0.85}
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={styles.confirmPinText}>✨ Додати це місце у Wishlist</Text>
        </TouchableOpacity>
      )}

      {/* Модальне вікно заповнення форми */}
      <AddPlaceModal
        visible={isModalVisible}
        coordinate={pendingPoint}
        onClose={() => setIsModalVisible(false)}
        onSave={handleSavePlace}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  map: {
    ...StyleSheet.absoluteFill,
  },
  header: {
    position: 'absolute',
    top: 54,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  fabLocation: {
    position: 'absolute',
    right: 20,
    top: 140,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  fabIcon: {
    fontSize: 22,
  },
  confirmPinButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  confirmPinText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});