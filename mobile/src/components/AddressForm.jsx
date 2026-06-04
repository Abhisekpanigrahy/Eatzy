import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

const FIELDS = [
  { key: 'firstName',  label: 'First Name',  placeholder: 'John' },
  { key: 'lastName',   label: 'Last Name',   placeholder: 'Doe' },
  { key: 'email',      label: 'Email',        placeholder: 'john@email.com', keyboardType: 'email-address' },
  { key: 'street',     label: 'Street',       placeholder: '123 Main St' },
  { key: 'city',       label: 'City',         placeholder: 'New York' },
  { key: 'state',      label: 'State',        placeholder: 'NY' },
  { key: 'zipcode',    label: 'Zip Code',     placeholder: '10001', keyboardType: 'numeric' },
  { key: 'country',    label: 'Country',      placeholder: 'USA' },
  { key: 'phone',      label: 'Phone',        placeholder: '+1 555 000 0000', keyboardType: 'phone-pad' },
];

const AddressForm = ({ value = {}, onChange, errors = {} }) => {
  const handleChange = (key, text) => onChange?.({ ...value, [key]: text });

  return (
    <View>
      {FIELDS.map(({ key, label, placeholder, keyboardType }) => (
        <View key={key} style={styles.group}>
          <Text style={styles.label}>{label}</Text>
          <TextInput
            style={[styles.input, errors[key] && styles.inputError]}
            placeholder={placeholder}
            placeholderTextColor="#aaa"
            value={value[key] || ''}
            onChangeText={(text) => handleChange(key, text)}
            keyboardType={keyboardType || 'default'}
            autoCapitalize="none"
            accessibilityLabel={label}
          />
          {errors[key] ? <Text style={styles.errorText}>{errors[key]}</Text> : null}
        </View>
      ))}
    </View>
  );
};

/**
 * Validate all required fields. Returns an errors object.
 * If the object is empty, all fields are valid.
 */
export const validateAddress = (address = {}) => {
  const errors = {};
  FIELDS.forEach(({ key, label }) => {
    if (!address[key]?.trim()) errors[key] = `${label} is required`;
  });
  return errors;
};

const styles = StyleSheet.create({
  group: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5563',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: '#1F2937',
    fontWeight: '600',
    backgroundColor: '#F9FAFB',
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
});

export default AddressForm;
