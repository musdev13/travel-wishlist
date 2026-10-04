import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { CATEGORIES } from '../constants/categories';
import { CategoryId, PendingPoint, TravelPlace } from '../types/travel';

interface Props {
  visible: boolean;
  coordinate: PendingPoint | null;
  onClose: () => void;
  onSave: (newPlace: TravelPlace) => void;
}

/**
 * Модальне вікно створення нової локації у Wishlist.
 *
 * Особливості:
 * - KeyboardAvoidingView: піднімає форму над екранною клавіатурою при введенні тексту.
 * - Горизонтальний скрол категорій із підсвіткою активного бейджа.
 * - Інтерактивний вибір пріоритету (1-5 зірочок).
 * - Валідація обов'язкового поля назви перед збереженням.
 */
export const AddPlaceModal: React.FC<Props> = ({ visible, coordinate, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('mountain');
  const [rating, setRating] = useState<number>(5);

  // Валідація та створення об'єкта локації
  const handleSave = () => {
    // Перевірка на непорожню назву
    if (!title.trim() || !coordinate) {
      alert('Будь ласка, введіть назву локації!');
      return;
    }

    const newPlace: TravelPlace = {
      id: `place-${Date.now()}`, // Унікальний таймстамп-ідентифікатор
      title: title.trim(),
      description: description.trim(),
      categoryId: selectedCategory,
      rating,
      createdAt: Date.now(),
      coordinate: {
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
      },
    };

    // Передаємо нову точку батьківському компоненту
    onSave(newPlace);

    // Скидаємо поля форми для наступного використання
    setTitle('');
    setDescription('');
    setRating(5);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      {/* 
        KeyboardAvoidingView запобігає перекриттю кнопки збереження екранною клавіатурою.
        На iOS використовується режим 'padding', на Android — 'height'.
      */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.backdrop}
      >
        <View style={styles.sheet}>
          {/* Верхня риска для імітації шторки (BottomSheet handle) */}
          <View style={styles.handle} />

          <Text style={styles.sheetTitle}>✨ Нове місце у Wishlist</Text>
          <Text style={styles.coordsSubtitle}>
            Координати: {coordinate?.latitude.toFixed(4)}, {coordinate?.longitude.toFixed(4)}
          </Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* 1. Назва локації */}
            <Text style={styles.inputLabel}>Назва локації *</Text>
            <TextInput
              style={styles.input}
              placeholder="Наприклад: Парк ім. Чекмана або Набережна Бугу (Вінниця: Фонтан Roshen)"
              placeholderTextColor="#94A3B8"
              value={title}
              onChangeText={setTitle}
            />

            {/* 2. Вибір категорії (Гори, Пляжі, Міста, Кафе...) */}
            <Text style={styles.inputLabel}>Категорія</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryRow}>
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.categoryChip, isSelected && { backgroundColor: cat.color }]}
                    onPress={() => setSelectedCategory(cat.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.categoryChipEmoji}>{cat.emoji}</Text>
                    <Text style={[styles.categoryChipText, isSelected && styles.categoryChipTextActive]}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* 3. Рейтинг пріоритету від 1 до 5 */}
            <Text style={styles.inputLabel}>Оцінка пріоритету</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)} activeOpacity={0.6}>
                  <Text style={styles.starText}>{star <= rating ? '⭐' : '☆'}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* 4. Довільні нотатки */}
            <Text style={styles.inputLabel}>Нотатки або план вражень</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Чому ви хочете сюди поїхати? Що скуштувати чи відвідати?"
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={3}
              value={description}
              onChangeText={setDescription}
            />

            {/* 5. Кнопки керування */}
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.7}>
                <Text style={styles.cancelBtnText}>Скасувати</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
                <Text style={styles.saveBtnText}>Зберегти точку</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.45)', // Напівпрозоре затемнення фону
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
    maxHeight: '85%',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#CBD5E1',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 14,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  coordsSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0F172A',
    marginBottom: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top', // Вирівнює багаторядковий текст угору на Android
  },
  categoryRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    marginRight: 8,
    gap: 6,
  },
  categoryChipEmoji: {
    fontSize: 16,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  starText: {
    fontSize: 28,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#64748B',
  },
  saveBtn: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});