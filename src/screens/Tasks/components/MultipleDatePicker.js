import React, { useState } from 'react';
import { StyleSheet, Button, View } from 'react-native';
import { Modal } from 'native-base';
import { Calendar } from 'react-native-calendars';

const MultipleDatePicker = ({ isVisible, onClose }) => {
  const [selectedDates, setSelectedDates] = useState({});

  const toggleDate = (date) => {
    const newDates = { ...selectedDates };
    if (newDates[date]) {
      delete newDates[date];
    } else {
      newDates[date] = { selected: true, selectedColor: 'blue' };
    }
    setSelectedDates(newDates);
  };

  return (
    <Modal
      animationPreset="slide"
    >
        <Calendar
          markingType={'simple'}
          markedDates={selectedDates}
          onDayPress={(day) => toggleDate(day.dateString)}
        />
    </Modal>
  );
};


export default MultipleDatePicker;
