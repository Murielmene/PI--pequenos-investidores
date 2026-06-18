import { StyleSheet, Text, View } from 'react-native';
import PhoneLayout from '../components/PhoneLayout';
import { PrimaryButton, StatusMessage } from '../components/Ui';
import { colors } from '../theme';

export default function ProfileScreen({ activeRoute, isSaving, message, onDeleteProfile, onNavigate, profile }) {
  return (
    <PhoneLayout activeRoute={activeRoute} onNavigate={onNavigate} contentStyle={styles.content}>
      <StatusMessage message={message} />

      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{profile.name.slice(0, 1).toUpperCase()}</Text>
      </View>

      <PrimaryButton title="EDITAR PERFIL" compact onPress={() => onNavigate('editProfile')} />

      <View style={styles.menu}>
        <Text style={styles.menuItem}>SALDO: R$ 0,00</Text>
        <Text style={styles.menuItem}>{profile.name}</Text>
        <Text style={styles.menuItem}>{profile.email}</Text>
        <Text style={styles.menuItem}>CONQUISTAS</Text>
        <Text style={styles.menuItem}>CONFIGURACOES</Text>
      </View>

      <PrimaryButton title={isSaving ? 'DELETANDO...' : 'DELETAR'} compact danger disabled={isSaving} onPress={onDeleteProfile} />
      <PrimaryButton title="SAIR" compact onPress={() => onNavigate('login')} />
    </PhoneLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    paddingTop: 26,
  },
  avatar: {
    width: 118,
    height: 118,
    borderRadius: 59,
    borderWidth: 8,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    backgroundColor: colors.card,
  },
  avatarText: {
    color: colors.textSecondary,
    fontSize: 56,
    fontWeight: '900',
  },
  menu: {
    width: '88%',
    gap: 10,
    marginVertical: 24,
  },
  menuItem: {
    minHeight: 28,
    borderRadius: 5,
    paddingTop: 6,
    color: colors.card,
    backgroundColor: colors.border,
    fontSize: 13,
    fontWeight: '900',
    textAlign: 'center',
  },
});
