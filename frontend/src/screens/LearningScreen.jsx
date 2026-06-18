import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { getLearningSteps } from '../api/investmentApi';
import { colors } from '../theme';

const statusLabel = {
  available: 'Disponivel',
  locked: 'Pendente',
  done: 'Concluido',
};

export default function LearningScreen() {
  const [steps, setSteps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStep, setSelectedStep] = useState(null);

  useEffect(() => {
    getLearningSteps()
      .then((data) => {
        setSteps(data);
        setSelectedStep(data.find((step) => step.status !== 'locked') ?? data[0]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <View style={styles.root}>
      <Text style={styles.eyebrow}>Plano de acao</Text>
      <Text style={styles.title}>Etapas para investir com consistencia</Text>
      <Text style={styles.subtitle}>
        Siga uma sequencia objetiva para sair do diagnostico financeiro e chegar a uma carteira inicial bem documentada.
      </Text>

      <View style={styles.list}>
        {isLoading ? (
          <Text style={styles.loading}>Carregando plano de acao...</Text>
        ) : (
          steps.map((step) => (
            <Pressable
              key={step.id}
              accessibilityRole="button"
              accessibilityState={{ disabled: step.status === 'locked', selected: selectedStep?.id === step.id }}
              disabled={step.status === 'locked'}
              onPress={() => setSelectedStep(step)}
              style={[
                styles.step,
                selectedStep?.id === step.id && styles.stepSelected,
                step.status === 'locked' && styles.stepDisabled,
              ]}
            >
              <View style={styles.stepHeader}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={[styles.badge, step.status === 'done' && styles.badgeDone]}>{statusLabel[step.status]}</Text>
              </View>
              <Text style={styles.stepMeta}>{step.minutes} min</Text>
            </Pressable>
          ))
        )}
      </View>

      {selectedStep && (
        <View style={styles.detail}>
          <Text style={styles.detailTitle}>{selectedStep.action}</Text>
          <Text style={styles.detailText}>{selectedStep.description}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingBottom: 24,
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.accent,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    lineHeight: 24,
    color: colors.textSecondary,
  },
  list: {
    marginTop: 24,
    gap: 12,
  },
  loading: {
    color: colors.textSecondary,
  },
  step: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  stepDisabled: {
    opacity: 0.55,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  badge: {
    overflow: 'hidden',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: colors.surface,
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  badgeDone: {
    backgroundColor: colors.successSurface,
    color: colors.successText,
  },
  stepMeta: {
    marginTop: 8,
    color: colors.textSecondary,
  },
  detail: {
    marginTop: 20,
    padding: 18,
    borderRadius: 8,
    backgroundColor: colors.secondary,
  },
  detailTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.card,
  },
  detailText: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: colors.surface,
  },
});
