import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { routes } from '../navigation/routes';
import { colors } from '../theme';

export default function PhoneLayout({ children, activeRoute, onNavigate, showFooter = true, contentStyle }) {
  return (
    <View style={styles.phone}>
      <View style={styles.header}>
        <Text style={styles.logo}>PEQ INVEST</Text>
      </View>

      <ScrollView contentContainerStyle={[styles.content, contentStyle]} showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>

      {showFooter && (
        <View style={styles.footer}>
          {routes.map((route) => {
            const isActive = activeRoute === route.key;

            return (
              <Pressable
                key={route.key}
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}
                onPress={() => onNavigate(route.key)}
                style={styles.navItem}
              >
                <Text style={[styles.navText, isActive && styles.navTextActive]}>{route.label}</Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  phone: {
    flex: 1,
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.phone,
  },
  header: {
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  logo: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 0,
  },
  content: {
    minHeight: 520,
    padding: 14,
    paddingBottom: 22,
  },
  footer: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.primary,
  },
  navItem: {
    minWidth: 58,
    minHeight: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    color: colors.card,
    fontSize: 10,
    fontWeight: '900',
  },
  navTextActive: {
    color: colors.surface,
  },
});
