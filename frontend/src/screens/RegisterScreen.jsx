import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import PhoneLayout from '../components/PhoneLayout';
import { Field, Panel, PrimaryButton, StatusMessage } from '../components/Ui';
import { colors } from '../theme';

export default function RegisterScreen({ isSaving, message, onCreateProfile, onNavigate }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localMessage, setLocalMessage] = useState('');

  const handleSubmit = () => {
    if (password !== confirmPassword) {
      setLocalMessage('As senhas precisam ser iguais.');
      return;
    }

    setLocalMessage('');
    onCreateProfile({ name, email, cpf, phone, address, password });
  };

  return (
    <PhoneLayout showFooter={false} contentStyle={styles.content}>
      <StatusMessage message={localMessage || message} />

      <Panel style={styles.form}>
        <Text style={styles.title}>CADASTRAR-SE</Text>
        <Field label="NOME:" value={name} onChangeText={setName} />
        <Field label="EMAIL:" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <Field label="CPF:" value={cpf} onChangeText={setCpf} />
        <Field label="TELEFONE:" value={phone} onChangeText={setPhone} />
        <Field label="ENDERECO:" value={address} onChangeText={setAddress} />
        <Field label="SENHA:" value={password} onChangeText={setPassword} secureTextEntry />
        <Field label="CONFIRMAR SENHA:" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
      </Panel>

      <PrimaryButton title={isSaving ? 'SALVANDO...' : 'CRIAR'} compact disabled={isSaving} onPress={handleSubmit} />

      <Text style={styles.footerText}>VENHA CONHECER O MELHOR APP DE EDUCACAO FINANCEIRA PARA JOVENS E CRIANCAS</Text>
    </PhoneLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  form: {
    alignItems: 'stretch',
  },
  title: {
    marginBottom: 10,
    color: colors.card,
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
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
