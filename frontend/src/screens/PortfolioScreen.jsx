import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { getPortfolioSummary } from '../api/investmentApi';
import { colors } from '../theme';

const formatCurrency = (value) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

export default function PortfolioScreen() {
  const [summary, setSummary] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    getPortfolioSummary().then((data) => {
      setSummary(data);
      setSelectedProduct(data.suggestedProducts[0]);
    });
  }, []);

  return (
    <View style={styles.root}>
      <Text style={styles.eyebrow}>Carteira</Text>
      <Text style={styles.title}>Visao consolidada</Text>
      <Text style={styles.subtitle}>
        Acompanhe os valores informados, a meta de aporte e a alocacao sugerida para o perfil atual.
      </Text>

      {!summary ? (
        <Text style={styles.loading}>Carregando informacoes da carteira...</Text>
      ) : (
        <>
          <View style={styles.summary}>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Patrimonio informado</Text>
              <Text style={styles.metricValue}>{formatCurrency(summary.totalInvested)}</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Aporte planejado</Text>
              <Text style={styles.metricValue}>{formatCurrency(summary.monthlyGoal)}</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Perfil atual</Text>
              <Text style={styles.metricValue}>{summary.riskProfile}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Alocacao recomendada</Text>
          <View style={styles.products}>
            {summary.suggestedProducts.map((product) => (
              <Pressable
                key={product.id}
                accessibilityRole="button"
                accessibilityState={{ selected: selectedProduct?.id === product.id }}
                onPress={() => setSelectedProduct(product)}
                style={[styles.product, selectedProduct?.id === product.id && styles.productSelected]}
              >
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productAllocation}>{product.allocation}%</Text>
              </Pressable>
            ))}
          </View>

          {selectedProduct && (
            <View style={styles.productDetail}>
              <Text style={styles.productDetailTitle}>{selectedProduct.name}</Text>
              <Text style={styles.productDetailText}>{selectedProduct.detail}</Text>
            </View>
          )}
        </>
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
  loading: {
    marginTop: 24,
    color: colors.textSecondary,
  },
  summary: {
    marginTop: 24,
    gap: 12,
  },
  metric: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  metricLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  metricValue: {
    marginTop: 6,
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    textTransform: 'capitalize',
  },
  sectionTitle: {
    marginTop: 24,
    marginBottom: 12,
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  products: {
    gap: 10,
  },
  product: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  productSelected: {
    backgroundColor: colors.card,
    borderColor: colors.primary,
  },
  productName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  productAllocation: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
  },
  productDetail: {
    marginTop: 16,
    padding: 18,
    borderRadius: 8,
    backgroundColor: colors.secondary,
  },
  productDetailTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.card,
  },
  productDetailText: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: colors.surface,
  },
});
