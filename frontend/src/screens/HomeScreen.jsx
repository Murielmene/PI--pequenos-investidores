import { Pressable, StyleSheet, Text, View } from 'react-native';
import PhoneLayout from '../components/PhoneLayout';
import { Panel, StatusMessage } from '../components/Ui';
import { colors } from '../theme';

export default function HomeScreen({ activeRoute, message, onNavigate, profile }) {
  return (
    <PhoneLayout activeRoute={activeRoute} onNavigate={onNavigate}>
      <StatusMessage message={message} />

      <View style={styles.profileLine}>
        <Pressable style={styles.avatar} onPress={() => onNavigate('profile')}>
          <Text style={styles.avatarText}>U</Text>
        </Pressable>
        <View style={styles.statusPill}>
          <Text style={styles.statusText}>REALIZE OBJETIVOS</Text>
          <Text style={styles.points}>0 PONTOS</Text>
        </View>
      </View>

      <Panel style={styles.progressPanel}>
        <Text style={styles.panelTitle}>PROGRESSO</Text>
        <View style={styles.progressRow}>
          <View style={styles.dots}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
            <Text style={styles.progressText}>90%</Text>
          </View>
        </View>
      </Panel>

      <Panel style={styles.tipPanel}>
        <Text style={styles.panelTitle}>DICA DA SEMANA</Text>
        <Text style={styles.bodyText}>Guarde uma parte do dinheiro antes de gastar. Reserva vem antes de risco.</Text>
      </Panel>

      <Panel style={styles.challengePanel}>
        <Text style={styles.panelTitle}>DESAFIO DIARIO</Text>
        <Text style={styles.bodyText}>Anote uma despesa pequena de hoje e veja quanto ela pesa no mes.</Text>
      </Panel>

      <Panel>
        <Text style={styles.panelTitle}>JOGOS EDUCATIVOS</Text>
        <View style={styles.gamesRow}>
          <Pressable style={styles.gameCard} onPress={() => onNavigate('games')}>
            <Text style={styles.gameIcon}>QUIZ</Text>
            <Text style={styles.gameLabel}>FINANCEIRO</Text>
          </Pressable>
          <Pressable style={styles.gameCard} onPress={() => onNavigate('tips')}>
            <Text style={styles.gameIcon}>R$</Text>
            <Text style={styles.gameLabel}>DICAS</Text>
          </Pressable>
        </View>
      </Panel>

      <Text style={styles.welcome}>Ola, {profile.name}. Continue aprendendo um passo por vez.</Text>
    </PhoneLayout>
  );
}

const styles = StyleSheet.create({
  profileLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 4,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
  },
  avatarText: {
    color: colors.textSecondary,
    fontSize: 24,
    fontWeight: '900',
  },
  statusPill: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 4,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
  },
  statusText: {
    color: colors.textPrimary,
    fontSize: 9,
    fontWeight: '900',
  },
  points: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '900',
  },
  progressPanel: {
    marginBottom: 10,
  },
  tipPanel: {
    marginBottom: 10,
  },
  challengePanel: {
    marginBottom: 10,
  },
  panelTitle: {
    color: colors.card,
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  dots: {
    flexDirection: 'row',
    gap: 5,
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 5,
    backgroundColor: colors.surface,
  },
  progressTrack: {
    flex: 1,
    height: 28,
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: 6,
    backgroundColor: colors.primarySoft,
  },
  progressFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '90%',
    backgroundColor: colors.primary,
  },
  progressText: {
    color: colors.card,
    fontSize: 14,
    fontWeight: '900',
    textAlign: 'right',
    paddingRight: 8,
  },
  bodyText: {
    marginTop: 8,
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 18,
    textAlign: 'center',
  },
  gamesRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  gameCard: {
    flex: 1,
    minHeight: 92,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    backgroundColor: colors.surface,
  },
  gameIcon: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '900',
  },
  gameLabel: {
    marginTop: 6,
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '900',
  },
  welcome: {
    marginTop: 12,
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
  },
});
