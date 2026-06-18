import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import PhoneLayout from '../components/PhoneLayout';
import { Field, Panel, PrimaryButton, StatusMessage } from '../components/Ui';
import { colors } from '../theme';

export default function LoginScreen({ message, onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <PhoneLayout showFooter={false} contentStyle={styles.content}>
      <StatusMessage message={message} />

      <Panel style={styles.form}>
        <Text style={styles.title}>LOGIN</Text>
        <Field label="EMAIL:" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <Field label="SENHA:" value={password} onChangeText={setPassword} secureTextEntry />
        <PrimaryButton title="ENTRAR" compact onPress={() => onNavigate('home')} />
      </Panel>

      <Pressable onPress={() => onNavigate('register')} style={styles.linkButton}>
        <Text style={styles.linkText}>CADASTRAR-SE</Text>
      </Pressable>

      <Text style={styles.footerText}>VENHA CONHECER O MELHOR APP DE EDUCACAO FINANCEIRA PARA JOVENS E CRIANCAS</Text>
    </PhoneLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    alignItems: 'center',
  },
  title: {
    marginBottom: 12,
    color: colors.card,
    fontSize: 18,
    fontWeight: '900',
  },
  linkButton: {
    marginTop: 12,
    minWidth: 150,
    minHeight: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  linkText: {
    color: colors.card,
    fontSize: 8,
    fontWeight: '900',
  },
  footerText: {
    position: 'absolute',
    left: 10,
    right: 10,
    bottom: 0,
    color: colors.card,
    backgroundColor: colors.primary,
    fontSize: 8,
    fontWeight: '900',
    lineHeight: 12,
    padding: 4,
    textAlign: 'center',
  },
});
