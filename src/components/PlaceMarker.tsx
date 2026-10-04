import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Callout, Marker } from 'react-native-maps';
import { getCategoryById } from '../constants/categories';
import { TravelPlace } from '../types/travel';

interface PlaceMarkerProps {
  place: TravelPlace;
  onPress?: () => void;
}

/**
 * Кастомний маркер для відображення збереженої локації на карті.
 *
 * Особливості реалізації:
 * - tracksViewChanges={false}: вимикає повторні нативні знімки компонента кожен кадр (зберігає 60 FPS).
 * - anchor={<!-- -->{ x: 0.5, y: 1.0 }}: точка прив'язки знаходиться внизу по центру (на вістрі стрілки).
 * - Callout tooltip={true}: вимикає нативну білу рамку ОС і рендерить повністю власний React-дизайн.
 */
export const PlaceMarker: React.FC<PlaceMarkerProps> = ({ place, onPress }) => {
  // Знаходимо назву, колір та емодзі поточної категорії
  const category = getCategoryById(place.categoryId);

  return (
    <Marker
      coordinate={place.coordinate}
      onPress={onPress}
      // tracksViewChanges={false} КРИТИЧНО для продуктивності Android (запобігає мерехтінню)
      tracksViewChanges={false}
      // Вістря маркера вказує точно на координати (горизонталь 50%, вертикаль 100% вниз)
      anchor={{ x: 0.5, y: 1.0 }}
    >
      {/* ---------------------------------------------------------------- */}
      {/* ВІЗУАЛЬНЕ ОФОРМЛЕННЯ МАРКЕРА (БУЛЬБАШКА + СТРІЛКА)                */}
      {/* ---------------------------------------------------------------- */}
      <View style={styles.markerContainer}>
        {/* Круглий кольоровий бейдж з емодзі категорії */}
        <View style={[styles.bubble, { backgroundColor: category.color }]}>
          <Text style={styles.emoji}>{category.emoji}</Text>
        </View>

        {/* Трикутний хвостик, що вказує на географічну точку */}
        <View style={[styles.arrow, { borderTopColor: category.color }]} />
      </View>

      {/* ---------------------------------------------------------------- */}
      {/* ІНФОРМАЦІЙНЕ СПЛИВАЮЧЕ ВІКНО ПРИ КЛІКУ НА МАРКЕР                  */}
      {/* ---------------------------------------------------------------- */}
      <Callout tooltip>
        <View style={styles.callout}>
          {/* Верхній рядок: категорія та зірочки рейтингу */}
          <View style={styles.calloutHeader}>
            <Text style={styles.calloutCategory}>{category.label}</Text>
            <Text style={styles.calloutRating}>{'⭐'.repeat(place.rating)}</Text>
          </View>

          {/* Назва збереженого місця */}
          <Text style={styles.calloutTitle}>{place.title}</Text>

          {/* Короткий опис або враження */}
          {place.description ? (
            <Text style={styles.calloutDesc} numberOfLines={2}>
              {place.description}
            </Text>
          ) : null}
        </View>
      </Callout>
    </Marker>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: 'center',
    width: 44,
    height: 48,
  },
  bubble: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    // Тіні для об'єму маркера на карті
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  emoji: {
    fontSize: 18,
  },
  // Техніка побудови CSS-трикутника за допомогою прозорих меж:
  arrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  callout: {
    width: 220,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 6,
  },
  calloutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  calloutCategory: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  calloutRating: {
    fontSize: 10,
  },
  calloutTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  calloutDesc: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 16,
  },
});