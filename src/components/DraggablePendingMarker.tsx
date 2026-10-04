import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Marker } from 'react-native-maps';
import { PendingPoint } from '../types/travel';

interface Props {
  coordinate: PendingPoint;
  onDragEnd: (coords: { latitude: number; longitude: number }) => void;
}

/**
 * Тимчасовий маркер вибору локації з підтримкою перетягування (Draggable).
 *
 * Користувач затискає маркер пальцем (Long Press), після чого переміщує його
 * по карті у точне місце (наприклад, на конкретний будинок чи галявину парку).
 * Подія onDragEnd повертає фінальні координати після відпускання пальця.
 */
export const DraggablePendingMarker: React.FC<Props> = ({ coordinate, onDragEnd }) => {
  return (
    <Marker
      draggable                          // Вмикає можливість перетягування жестом
      coordinate={coordinate}            // Поточні координати точки
      onDragEnd={(e) => {
        // e.nativeEvent.coordinate містить нові { latitude, longitude }
        onDragEnd(e.nativeEvent.coordinate);
      }}
      anchor={{ x: 0.5, y: 1.0 }}        // Прив'язка до нижнього вістря шпильки
    >
      <View style={styles.pinWrapper}>
        {/* Текстова підказка для користувача */}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Утримуй і тягни</Text>
        </View>

        {/* Червоне коло з іконкою шпильки */}
        <View style={styles.pinCircle}>
          <Text style={styles.pinIcon}>&#x1f4cd;</Text>
        </View>

        {/* Вістрі шпильки */}
        <View style={styles.pinTip} />
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  pinWrapper: {
    alignItems: 'center',
  },
  badge: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  pinCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#EF4444', // Яскравий червоний колір привертає увагу
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 8,
  },
  pinIcon: {
    fontSize: 20,
  },
  pinTip: {
    width: 4,
    height: 8,
    backgroundColor: '#EF4444',
  },
});