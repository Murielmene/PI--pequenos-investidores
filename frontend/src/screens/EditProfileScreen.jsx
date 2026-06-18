import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import PhoneLayout from '../components/PhoneLayout';
import { Field, Panel, PrimaryButton, StatusMessage } from '../components/Ui';
import { colors } from '../theme';

export default function EditProfileScreen({ activeRoute, isSaving, message, onNavigate, profile, onSave }) {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [cpf, setCpf] = useState(profile.cpf);
  const [phone, setPhone] = useState(profile.phone);
  const [address, setAddress] = useState(profile.address);

  return (
    <PhoneLayout activeRoute={activeRoute} onNavigate={onNavigate} contentStyle={styles.content}>
      <StatusMessage message={message} />
      <Text style={styles.sectionTitle}>PERFIL</Text>

      <ViewAvatar initial={name.slice(0, 1).toUpperCase()} />

      <Panel style={styles.form}>
        <Field label="NOME:" value={name} onChangeText={setName} />
        <Field label="EMAIL:" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <Field label="CPF:" value={cpf} onChangeText={setCpf} />
        <Field label="TELEFONE:" value={phone} onChangeText={setPhone} />
        <Field label="ENDERECO:" value={address} onChangeText={setAddress} />
      </Panel>

      <PrimaryButton
        title={isSaving ? 'SALVANDO...' : 'EDITAR PERFIL'}
        disabled={isSaving}
        onPress={() => onSave({ name, email, cpf, phone, address })}
      />
    </PhoneLayout>
  );
}

function ViewAvatar({ initial }) {
  return (
    <Text style={styles.avatar} accessibilityLabel="Avatar do usuario">
      {initial || 'U'}
    </Text>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    paddingTop: 8,
    gap: 12,
  },
  sectionTitle: {
    width: '100%',
    borderRadius: 5,
    paddingVertical: 6,
    color: colors.card,
    backgroundColor: colors.border,
    fontSize: 13,
    fontWeight: '900',
    textAlign: 'center',
  },
  avatar: {
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 8,
    borderColor: colors.border,
    color: colors.textSecondary,
    backgroundColor: colors.card,
    fontSize: 52,
    fontWeight: '900',
    lineHeight: 96,
    textAlign: 'center',
  },
  form: {
    paddingVertical: 10,
  },
});
