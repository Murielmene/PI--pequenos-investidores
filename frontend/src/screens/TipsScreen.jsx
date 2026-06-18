import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import PhoneLayout from '../components/PhoneLayout';
import { StatusMessage } from '../components/Ui';
import { colors } from '../theme';

const tips = [
  {
    title: 'O QUE E INVESTIMENTO?',
    detail: 'Investir e separar dinheiro hoje para buscar seguranca, objetivos e crescimento no futuro.',
  },
  {
    title: 'RENDA FIXA VS RENDA VARIAVEL',
    detail: 'Renda fixa tende a ter regras mais previsiveis. Renda variavel oscila mais e exige cuidado.',
  },
  {
    title: 'COMO ECONOMIZAR DINHEIRO?',
    detail: 'Defina um limite por categoria, registre gastos e separe o aporte logo que receber.',
  },
];

export default function TipsScreen({ activeRoute, message, onNavigate }) {
  const [selectedTip, setSelectedTip] = useState(tips[0]);

  return (
    <PhoneLayout activeRoute={activeRoute} onNavigate={onNavigate} contentStyle={styles.content}>
      <StatusMessage message={message} />
      <Text style={styles.title}>DICAS SEMANAIS</Text>

      {tips.map((tip) => (
        <Pressable key={tip.title} style={styles.tipCard} onPress={() => setSelectedTip(tip)}>
          <Text style={styles.tipText}>{tip.title}</Text>
        </Pressable>
      ))}

      <View style={styles.detail}>
        <Text style={styles.detailTitle}>{selectedTip.title}</Text>
        <Text style={styles.detailText}>{selectedTip.detail}</Text>
      </View>
    </PhoneLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 18,
  },
  title: {
    marginBottom: 18,
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
  },
  tipCard: {
    minHeight: 86,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.muted,
  },
  tipText: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '900',
  },
  detail: {
    marginTop: 14,
    borderRadius: 6,
    padding: 12,
    backgroundColor: colors.surface,
  },
  detailTitle: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '900',
  },
  detailText: {
    marginTop: 8,
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 18,
  },
});
