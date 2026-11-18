import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import PhoneLayout from '../components/PhoneLayout';
import { MoedasPill, StatusMessage } from '../components/Ui';
import AgoraOuDepoisGame from '../games/AgoraOuDepoisGame';
import { useGame } from '../state/GameContext';
import { colors } from '../theme';

const games = [
  {
    title: 'QUIZ FINANCEIRO',
    question: 'Qual deve ser o primeiro objetivo antes de investir em risco?',
    options: ['Reserva de emergencia', 'Comprar qualquer acao', 'Gastar o salario todo'],
    answer: 'Reserva de emergencia',
  },
  {
    title: 'JOGOS PEQINVEST',
    question: 'O que ajuda a diminuir o risco?',
    options: ['Diversificacao', 'Apostar tudo', 'Ignorar custos'],
    answer: 'Diversificacao',
  },
  {
    title: 'CONTROLE DE GASTOS',
    question: 'Qual atitude melhora o controle mensal?',
    options: ['Registrar despesas', 'Esconder boletos', 'Nao olhar saldo'],
    answer: 'Registrar despesas',
  },
];

export default function GamesScreen({ activeRoute, message, onNavigate }) {
  const [selectedGame, setSelectedGame] = useState(games[0]);
  const [result, setResult] = useState('Escolha uma resposta para ganhar pontos.');
  const [jogoAberto, setJogoAberto] = useState(null);
  const { moedas, ganharMoedas } = useGame();

  const answerQuestion = (option) => {
    setResult(option === selectedGame.answer ? 'Resposta certa! Voce ganhou 10 pontos.' : 'Quase. Revise a dica e tente novamente.');
  };

  if (jogoAberto === 'agoraOuDepois') {
    return (
      <PhoneLayout activeRoute={activeRoute} onNavigate={onNavigate} contentStyle={styles.content}>
        <AgoraOuDepoisGame onGanharMoedas={ganharMoedas} onSair={() => setJogoAberto(null)} />
      </PhoneLayout>
    );
  }

  return (
    <PhoneLayout activeRoute={activeRoute} onNavigate={onNavigate} contentStyle={styles.content}>
      <StatusMessage message={message} />
      <Text style={styles.title}>JOGOS EDUCATIVOS</Text>
      <MoedasPill moedas={moedas} />

      <Pressable
        accessibilityRole="button"
        style={[styles.gameCard, styles.newGameCard]}
        onPress={() => setJogoAberto('agoraOuDepois')}
      >
        <View style={styles.newGameInfo}>
          <Text style={styles.gameText}>AGORA OU DEPOIS?</Text>
          <Text style={styles.newGameDescription}>Gastar agora ou guardar para um objetivo maior?</Text>
        </View>
        <Text style={styles.newGameAction}>JOGAR</Text>
      </Pressable>

      {games.map((game) => (
        <Pressable
          key={game.title}
          style={[styles.gameCard, selectedGame.title === game.title && styles.gameCardActive]}
          onPress={() => {
            setSelectedGame(game);
            setResult('Escolha uma resposta para ganhar pontos.');
          }}
        >
          <Text style={styles.gameText}>{game.title}</Text>
        </Pressable>
      ))}

      <View style={styles.quizBox}>
        <Text style={styles.question}>{selectedGame.question}</Text>
        {selectedGame.options.map((option) => (
          <Pressable key={option} style={styles.option} onPress={() => answerQuestion(option)}>
            <Text style={styles.optionText}>{option}</Text>
          </Pressable>
        ))}
        <Text style={styles.result}>{result}</Text>
      </View>
    </PhoneLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 16,
    gap: 10,
    backgroundColor: colors.border,
  },
  title: {
    marginBottom: 2,
    color: colors.card,
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
  },
  gameCard: {
    minHeight: 72,
    justifyContent: 'center',
    borderRadius: 6,
    paddingHorizontal: 18,
    backgroundColor: colors.surface,
  },
  gameCardActive: {
    borderWidth: 3,
    borderColor: colors.primaryDark,
  },
  gameText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '900',
  },
  newGameCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    paddingVertical: 12,
    borderWidth: 3,
    borderColor: colors.primaryDark,
    backgroundColor: colors.card,
  },
  newGameInfo: {
    flex: 1,
    gap: 4,
  },
  newGameDescription: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '800',
    lineHeight: 16,
  },
  newGameAction: {
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    overflow: 'hidden',
    color: colors.card,
    backgroundColor: colors.primaryDark,
    fontSize: 11,
    fontWeight: '900',
  },
  quizBox: {
    marginTop: 4,
    borderRadius: 6,
    padding: 12,
    backgroundColor: colors.card,
  },
  question: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '900',
    lineHeight: 18,
  },
  option: {
    marginTop: 8,
    minHeight: 30,
    justifyContent: 'center',
    borderRadius: 4,
    paddingHorizontal: 8,
    backgroundColor: colors.surface,
  },
  optionText: {
    color: colors.textPrimary,
    fontSize: 11,
    fontWeight: '900',
  },
  result: {
    marginTop: 10,
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '900',
    textAlign: 'center',
  },
});
