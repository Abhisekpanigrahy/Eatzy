import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { forgotPassword, resetPassword } from '../api/authApi';
import BackArrow from '../components/BackArrow';

const ForgotPasswordScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP & Reset
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const validateStep1 = () => {
    let tempErrors = {};
    if (!email.trim()) {
      tempErrors.email = 'Email address is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        tempErrors.email = 'Please enter a valid email address';
      }
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const validateStep2 = () => {
    let tempErrors = {};
    if (!otp.trim()) {
      tempErrors.otp = 'OTP is required';
    } else if (otp.trim().length !== 6) {
      tempErrors.otp = 'OTP must be exactly 6 digits';
    }

    if (!newPassword) {
      tempErrors.password = 'New password is required';
    } else if (newPassword.length < 8) {
      tempErrors.password = 'Password must be at least 8 characters';
    }

    if (newPassword !== confirmPassword) {
      tempErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSendOtp = async () => {
    if (!validateStep1()) return;
    setLoading(true);
    setApiError('');
    try {
      const res = await forgotPassword(email.trim().toLowerCase());
      if (res.data.success) {
        Alert.alert(
          'OTP Sent',
          'If this email exists in our system, a 6-digit password reset OTP has been sent.',
          [{ text: 'OK', onPress: () => setStep(2) }]
        );
      } else {
        setApiError(res.data.message || 'Failed to send OTP. Please try again.');
      }
    } catch (err) {
      setApiError(err?.response?.data?.message || err.message || 'Error sending OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!validateStep2()) return;
    setLoading(true);
    setApiError('');
    try {
      const res = await resetPassword(
        email.trim().toLowerCase(),
        otp.trim(),
        newPassword
      );
      if (res.data.success) {
        Alert.alert(
          'Success 🎉',
          'Your password has been reset successfully. Please login with your new password.',
          [{ text: 'Go to Login', onPress: () => navigation.navigate('Login') }]
        );
      } else {
        setApiError(res.data.message || 'Failed to reset password. Please check your OTP.');
      }
    } catch (err) {
      setApiError(err?.response?.data?.message || err.message || 'Error resetting password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackPress = () => {
    if (step === 2) {
      setStep(1);
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
      setErrors({});
      setApiError('');
    } else {
      navigation.goBack();
    }
  };

  const handleEmailChange = (val) => {
    setEmail(val);
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: null }));
    }
  };

  const handleOtpChange = (val) => {
    setOtp(val);
    if (errors.otp) {
      setErrors((prev) => ({ ...prev, otp: null }));
    }
  };

  const handlePasswordChange = (val) => {
    setNewPassword(val);
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: null }));
    }
  };

  const handleConfirmPasswordChange = (val) => {
    setConfirmPassword(val);
    if (errors.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: null }));
    }
  };

  return (
    <View style={[styles.safe, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backBtn}>
          <BackArrow />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Password Recovery</Text>
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {step === 1 ? (
            <View style={styles.form}>
              <View style={styles.topSection}>
                <Text style={styles.logo}>Eatzy<Text style={styles.dot}>.</Text></Text>
                <Text style={styles.heading}>Forgot Password?</Text>
                <Text style={styles.subheading}>
                  Enter your email address and we'll send you an OTP to reset your password.
                </Text>
              </View>

              {apiError ? (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{apiError}</Text>
                </View>
              ) : null}

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email Address</Text>
                <View style={[styles.inputWrapper, errors.email && styles.inputWrapperError]}>
                  <Text style={styles.inputIcon}>📧</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="name@example.com"
                    placeholderTextColor="#9ca3af"
                    value={email}
                    onChangeText={handleEmailChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
                {errors.email ? <Text style={styles.fieldError}>{errors.email}</Text> : null}
              </View>

              <TouchableOpacity
                style={[styles.btn, loading && styles.btnDisabled]}
                onPress={handleSendOtp}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Text style={styles.btnText}>{loading ? 'Sending OTP...' : 'Send OTP'}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.form}>
              <View style={styles.topSection}>
                <Text style={styles.logo}>Eatzy<Text style={styles.dot}>.</Text></Text>
                <Text style={styles.heading}>Reset Password</Text>
                <Text style={styles.subheading}>
                  Enter the 6-digit OTP code sent to your email and create a new secure password.
                </Text>
              </View>

              {apiError ? (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{apiError}</Text>
                </View>
              ) : null}

              <View style={styles.inputGroup}>
                <Text style={styles.label}>OTP Code</Text>
                <View style={[styles.inputWrapper, errors.otp && styles.inputWrapperError]}>
                  <Text style={styles.inputIcon}>🔑</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="123456"
                    placeholderTextColor="#9ca3af"
                    value={otp}
                    onChangeText={handleOtpChange}
                    keyboardType="number-pad"
                    maxLength={6}
                  />
                </View>
                {errors.otp ? <Text style={styles.fieldError}>{errors.otp}</Text> : null}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>New Password</Text>
                <View style={[styles.inputWrapper, errors.password && styles.inputWrapperError]}>
                  <Text style={styles.inputIcon}>🔒</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="#9ca3af"
                    value={newPassword}
                    onChangeText={handlePasswordChange}
                    secureTextEntry
                  />
                </View>
                {errors.password ? <Text style={styles.fieldError}>{errors.password}</Text> : null}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirm New Password</Text>
                <View style={[styles.inputWrapper, errors.confirmPassword && styles.inputWrapperError]}>
                  <Text style={styles.inputIcon}>🔒</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="#9ca3af"
                    value={confirmPassword}
                    onChangeText={handleConfirmPasswordChange}
                    secureTextEntry
                  />
                </View>
                {errors.confirmPassword ? <Text style={styles.fieldError}>{errors.confirmPassword}</Text> : null}
              </View>

              <TouchableOpacity
                style={[styles.btn, loading && styles.btnDisabled]}
                onPress={handleResetPassword}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Text style={styles.btnText}>
                  {loading ? 'Resetting Password...' : 'Reset Password'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.resendBtn}
                onPress={handleSendOtp}
                disabled={loading}
              >
                <Text style={styles.resendText}>Didn't receive code? Resend OTP</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    paddingVertical: 10,
    paddingRight: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1a1a1a',
    marginLeft: 10,
  },
  container: {
    padding: 24,
    paddingTop: 10,
    justifyContent: 'center',
  },
  topSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FF4C24',
    letterSpacing: -2,
  },
  dot: { color: '#1a1a1a' },
  heading: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1a1a1a',
    marginTop: 16,
    letterSpacing: -0.5,
  },
  subheading: {
    fontSize: 15,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '600',
  },
  form: {
    width: '100%',
  },
  errorBox: {
    backgroundColor: '#fef2f2',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fee2e2',
    marginBottom: 20,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '800',
    color: '#4b5563',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#f3f4f6',
    paddingHorizontal: 16,
    height: 56,
  },
  inputWrapperError: {
    borderColor: '#ef4444',
    backgroundColor: '#fffbeb',
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1a1a1a',
    fontWeight: '600',
  },
  fieldError: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 6,
    marginLeft: 4,
  },
  btn: {
    backgroundColor: '#FF4C24',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF4C24',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    marginTop: 10,
    marginBottom: 20,
  },
  btnDisabled: {
    backgroundColor: '#fca5a5',
    elevation: 0,
  },
  btnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '900',
  },
  resendBtn: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  resendText: {
    fontSize: 14,
    color: '#FF4C24',
    fontWeight: '800',
  },
});

export default ForgotPasswordScreen;
