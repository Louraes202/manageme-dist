import React, { useState } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';

// Componente personalizado para um botão de opção
const RadioButton = ({ isSelected, label, onPress }) => {
  const buttonStyle = {
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: isSelected ? 'blue' : 'grey',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: isSelected ? 'blue' : 'transparent',
    marginRight: 10,
    paddingHorizontal: 15,
  };

  const labelStyle = {
    color: isSelected ? 'white' : 'grey',
  };

  return (
    <TouchableOpacity onPress={onPress} style={buttonStyle}>
        <Text style={labelStyle}>{label}</Text>
    </TouchableOpacity>
  );
};

// Componente do grupo de opções que utiliza o componente RadioButton
const RadioButtonGroup = ({ options }) => {
  const [selectedOption, setSelectedOption] = useState(options[0].value);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
      {options.map(option => (
        <RadioButton
          key={option.value}
          isSelected={selectedOption === option.value}
          label={option.label}
          onPress={() => setSelectedOption(option.value)}
        />
      ))}
    </View>
  );
};

// Exemplo de uso do RadioButtonGroup
const YourComponent = ({radioOptions}) => {

  return (
    <RadioButtonGroup options={radioOptions} />
  );
};

export default YourComponent;
