import { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from '../components/Ui';
import { colors } from '../theme';

// ---------------------------------------------------------------
// Regras do jogo "Agora ou Depois?"
// O dinheiro deste jogo (R$) é FICTÍCIO e só existe aqui dentro.
// Ele não se mistura com as moedas 🪙 do PEQ INVEST: as moedas
// só entram no final, como recompensa, pelo onGanharMoedas().
// ---------------------------------------------------------------
const SALDO_INICIAL = 50;
const MESADA = 10;
const SATISFACAO_MEDIA = 50;
const QUEDA_DA_ALEGRIA = 20; // quanto a alegria de uma compra cai a cada semana
const OBJETIVO = { emoji: '🛹', nome: 'skate', preco: 90 };
const MOEDAS_POR_CONCLUIR = 20;
const BONUS_OBJETIVO = 10;

// Uma tentação por semana. A primeira é o brinquedo simples de R$ 30.
const SEMANAS = [
  {
    emoji: '🚗',
    nome: 'Carrinho simples',
    preco: 30,
    alegria: 40,
    cena: 'Na vitrine tem um carrinho simples. É legal, mas bem básico.',
  },
  {
    emoji: '🍫',
    nome: 'Chocolate',
    preco: 5,
    alegria: 15,
    cena: 'Na saída da escola, o chocolate da cantina está chamando você.',
  },
  {
    emoji: '🃏',
    nome: 'Pacote de figurinhas',
    preco: 10,
    alegria: 20,
    cena: 'Todo mundo está trocando figurinhas no recreio.',
  },
  {
    emoji: '🧸',
    nome: 'Pelúcia',
    preco: 25,
    alegria: 30,
    cena: 'Uma pelúcia fofa apareceu na promoção.',
  },
  {
    emoji: '🧢',
    nome: 'Boné da moda',
    preco: 20,
    alegria: 25,
    cena: 'Seu amigo apareceu de boné novo e você também quer um.',
  },
];

// Guardando todas as semanas, o jogador termina com este valor.
const SALDO_MAXIMO = SALDO_INICIAL + MESADA * SEMANAS.length;

function nivelDaSatisfacao(valor) {
  if (valor >= 75) {
    return { emoji: '😄', texto: 'ALTA' };
  }

  if (valor >= 45) {
    return { emoji: '🙂', texto: 'MÉDIA' };
  }

  return { emoji: '😕', texto: 'BAIXA' };
}

// A alegria de uma compra passa rápido: a cada semana ela cai até voltar à média.
function passarUmaSemana(satisfacao) {
  return Math.max(SATISFACAO_MEDIA, satisfacao - QUEDA_DA_ALEGRIA);
}

// Refaz o saldo semana a semana a partir das escolhas (usado no gráfico final).
function calcularEvolucao(escolhas) {
  let saldo = SALDO_INICIAL;
  const pontos = [{ rotulo: 'INÍCIO', saldo, comprou: false }];

  escolhas.forEach((escolha, indice) => {
    if (escolha.comprou) {
      saldo -= escolha.item.preco;
    }

    saldo += MESADA;
    pontos.push({ rotulo: `S${indice + 1}`, saldo, comprou: escolha.comprou });
  });

  return pontos;
}

function mensagemFinal(conseguiu, totalGasto) {
  if (conseguiu && totalGasto === 0) {
    return 'Você esperou todas as semanas e conquistou o skate. Guardar um pouco de cada vez transforma pouco dinheiro em um objetivo grande.';
  }

  if (conseguiu) {
    return `Você gastou R$ ${totalGasto} e mesmo assim chegou lá. Isso é planejar: saber quanto dá para gastar sem perder o que mais importa.`;
  }

  return `A alegria das compras passou rápido, e o skate ficou de fora. Seus gastos somaram R$ ${totalGasto}: sem eles, você teria R$ ${SALDO_MAXIMO}.`;
}

// ---------------------------------------------------------------
// Pedaços da tela
// ---------------------------------------------------------------
function Barra({ progresso, altura = 12 }) {
  const porcentagem = Math.max(0, Math.min(1, progresso)) * 100;

  return (
    <View style={[styles.barra, { height: altura, borderRadius: altura / 2 }]}>
      <View style={[styles.barraPreenchida, { width: `${porcentagem}%`, borderRadius: altura / 2 }]} />
    </View>
  );
}

function Cabecalho({ onSair, legenda }) {
  return (
    <View style={styles.cabecalho}>
      <Pressable accessibilityRole="button" onPress={onSair} style={styles.voltar}>
        <Text style={styles.voltarTexto}>‹ JOGOS</Text>
      </Pressable>
      {legenda ? <Text style={styles.legenda}>{legenda}</Text> : null}
    </View>
  );
}

function Cofrinho({ saldo }) {
  const faltam = OBJETIVO.preco - saldo;

  return (
    <View style={styles.cofrinho}>
      <Text style={styles.rotulo}>SALDO DO JOGO</Text>
      <Text style={styles.saldo}>R$ {saldo}</Text>

      <View style={styles.trilha}>
        <Text style={styles.trilhaEmoji}>🐷</Text>
        <View style={styles.trilhaBarra}>
          <Barra progresso={saldo / OBJETIVO.preco} altura={16} />
        </View>
        <Text style={styles.trilhaEmoji}>{OBJETIVO.emoji}</Text>
      </View>

      <Text style={styles.faltam}>
        {faltam > 0 ? `Faltam R$ ${faltam} para o skate de R$ ${OBJETIVO.preco}` : 'Já dá para comprar o skate!'}
      </Text>
    </View>
  );
}

function Satisfacao({ valor }) {
  const nivel = nivelDaSatisfacao(valor);

  return (
    <View style={styles.satisfacao}>
      <Text style={styles.satisfacaoEmoji}>{nivel.emoji}</Text>
      <View style={styles.satisfacaoInfo}>
        <Text style={styles.satisfacaoTitulo}>SATISFAÇÃO: {nivel.texto}</Text>
        <Barra progresso={valor / 100} altura={8} />
      </View>
    </View>
  );
}

function LinhaDoTempo({ semanaAtual, escolhas }) {
  return (
    <View style={styles.linhaDoTempo}>
      {SEMANAS.map((item, indice) => {
        const escolha = escolhas[indice];
        const ehAtual = indice === semanaAtual && !escolha;

        return (
          <View
            key={item.nome}
            style={[
              styles.bolinha,
              ehAtual && styles.bolinhaAtual,
              escolha && (escolha.comprou ? styles.bolinhaComprou : styles.bolinhaGuardou),
            ]}
          >
            <Text style={styles.bolinhaTexto}>{escolha ? (escolha.comprou ? '🛒' : '🐷') : indice + 1}</Text>
          </View>
        );
      })}
    </View>
  );
}

function BotaoEscolha({ emoji, titulo, detalhe, onPress, disabled }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${titulo}. ${detalhe}`}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.escolha, pressed && styles.escolhaPressionada, disabled && styles.escolhaDesativada]}
    >
      <Text style={styles.escolhaEmoji}>{emoji}</Text>
      <Text style={styles.escolhaTitulo}>{titulo}</Text>
      <Text style={styles.escolhaDetalhe}>{detalhe}</Text>
    </Pressable>
  );
}

function GraficoEvolucao({ pontos }) {
  const alturaObjetivo = (OBJETIVO.preco / SALDO_MAXIMO) * 100;

  return (
    <View style={styles.grafico}>
      <View style={styles.graficoArea}>
        <View style={[styles.linhaObjetivo, { bottom: `${alturaObjetivo}%` }]}>
          <Text style={styles.linhaObjetivoTexto}>
            {OBJETIVO.emoji} R$ {OBJETIVO.preco}
          </Text>
        </View>
        {pontos.map((ponto) => (
          <View key={ponto.rotulo} style={styles.graficoColuna}>
            <View
              style={[
                styles.graficoBarra,
                ponto.comprou && styles.graficoBarraComprou,
                { height: `${(ponto.saldo / SALDO_MAXIMO) * 100}%` },
              ]}
            />
          </View>
        ))}
      </View>
      <View style={styles.graficoLegendas}>
        {pontos.map((ponto) => (
          <View key={ponto.rotulo} style={styles.graficoLegenda}>
            <Text style={styles.graficoValor}>R$ {ponto.saldo}</Text>
            <Text style={styles.graficoRotulo}>{ponto.rotulo}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ---------------------------------------------------------------
// Jogo
// ---------------------------------------------------------------
export default function AgoraOuDepoisGame({ onGanharMoedas, onSair }) {
  // fase: 'inicio' -> 'escolha' -> 'resultadoDaSemana' -> ... -> 'fim'
  const [fase, setFase] = useState('inicio');
  const [semana, setSemana] = useState(0);
  const [saldo, setSaldo] = useState(SALDO_INICIAL);
  const [satisfacao, setSatisfacao] = useState(SATISFACAO_MEDIA);
  const [escolhas, setEscolhas] = useState([]);
  const recompensaPagaRef = useRef(false); // garante que as moedas são pagas uma vez por partida

  const tentacao = SEMANAS[semana];
  const ultimaEscolha = escolhas[escolhas.length - 1];
  const ehUltimaSemana = semana === SEMANAS.length - 1;
  const legendaSemana = `SEMANA ${semana + 1} DE ${SEMANAS.length}`;

  const comecar = () => {
    setSemana(0);
    setSaldo(SALDO_INICIAL);
    setSatisfacao(SATISFACAO_MEDIA);
    setEscolhas([]);
    recompensaPagaRef.current = false;
    setFase('escolha');
  };

  const escolher = (comprou) => {
    if (comprou) {
      setSaldo(saldo - tentacao.preco);
      setSatisfacao(Math.min(100, satisfacao + tentacao.alegria));
    }

    setEscolhas([...escolhas, { item: tentacao, comprou }]);
    setFase('resultadoDaSemana');
  };

  // Fim da semana: chega a mesada e o tempo passa.
  const receberMesada = () => {
    const novoSaldo = saldo + MESADA;
    setSaldo(novoSaldo);

    if (!ehUltimaSemana) {
      setSatisfacao(passarUmaSemana(satisfacao));
      setSemana(semana + 1);
      setFase('escolha');
      return;
    }

    const conseguiu = novoSaldo >= OBJETIVO.preco;
    setSatisfacao(conseguiu ? 100 : 30);
    setFase('fim');

    if (!recompensaPagaRef.current) {
      recompensaPagaRef.current = true;
      onGanharMoedas(MOEDAS_POR_CONCLUIR + (conseguiu ? BONUS_OBJETIVO : 0));
    }
  };

  // ---------- Tela inicial ----------
  if (fase === 'inicio') {
    return (
      <View style={styles.tela}>
        <Cabecalho onSair={onSair} />
        <Text style={styles.titulo}>AGORA OU DEPOIS?</Text>

        <View style={styles.cartao}>
          <Text style={styles.objetivoEmoji}>{OBJETIVO.emoji}</Text>
          <Text style={styles.cartaoTitulo}>SEU OBJETIVO: UM SKATE DE R$ {OBJETIVO.preco}</Text>
          <Text style={styles.texto}>
            Você tem 5 semanas. Toda semana aparece algo legal para comprar. Você decide: comprar agora ou guardar para depois?
          </Text>
        </View>

        <View style={styles.regras}>
          <Text style={styles.regra}>🐷 Você começa com R$ {SALDO_INICIAL} no cofrinho.</Text>
          <Text style={styles.regra}>📅 No fim de cada semana chega R$ {MESADA} de mesada.</Text>
          <Text style={styles.regra}>🛒 Comprar dá alegria na hora, mas tira dinheiro do cofrinho.</Text>
          <Text style={styles.regra}>🪙 Ao terminar, você ganha moedas do PEQ INVEST.</Text>
        </View>

        <Text style={styles.aviso}>
          O dinheiro deste jogo é de mentirinha. Suas moedas 🪙 do app não são gastas aqui.
        </Text>

        <PrimaryButton title="COMEÇAR" onPress={comecar} />
      </View>
    );
  }

  // ---------- Tela final ----------
  if (fase === 'fim') {
    const conseguiu = saldo >= OBJETIVO.preco;
    const compras = escolhas.filter((escolha) => escolha.comprou);
    const totalGasto = compras.reduce((soma, escolha) => soma + escolha.item.preco, 0);
    const moedasGanhas = MOEDAS_POR_CONCLUIR + (conseguiu ? BONUS_OBJETIVO : 0);

    return (
      <View style={styles.tela}>
        <Cabecalho onSair={onSair} legenda="RESULTADO" />

        <View style={styles.cartao}>
          <Text style={styles.objetivoEmoji}>{conseguiu ? `${OBJETIVO.emoji}🎉` : '😕'}</Text>
          <Text style={styles.cartaoTitulo}>{conseguiu ? 'VOCÊ CONQUISTOU O SKATE!' : 'O SKATE FICOU PARA DEPOIS'}</Text>
          <Text style={styles.texto}>
            {conseguiu
              ? `Você terminou com R$ ${saldo}, comprou o skate e ainda sobrou R$ ${saldo - OBJETIVO.preco}.`
              : `Você terminou com R$ ${saldo}. Faltaram R$ ${OBJETIVO.preco - saldo} para o skate.`}
          </Text>
          <Satisfacao valor={satisfacao} />
        </View>

        <View style={styles.cartao}>
          <Text style={styles.cartaoTitulo}>SEU COFRINHO SEMANA A SEMANA</Text>
          <GraficoEvolucao pontos={calcularEvolucao(escolhas)} />
          {compras.length > 0 ? <Text style={styles.graficoNota}>Barras claras: semanas em que você comprou.</Text> : null}
          <Text style={styles.texto}>
            {compras.length === 0
              ? 'Você guardou em todas as semanas.'
              : `Você gastou R$ ${totalGasto} com: ${compras.map((escolha) => escolha.item.nome.toLowerCase()).join(', ')}.`}
          </Text>
        </View>

        <View style={styles.licao}>
          <Text style={styles.licaoTitulo}>O QUE APRENDEMOS</Text>
          <Text style={styles.licaoTexto}>{mensagemFinal(conseguiu, totalGasto)}</Text>
          <Text style={styles.licaoTexto}>
            Antes de comprar, pergunte: eu preciso disso agora? Isso me deixa mais longe do meu objetivo?
          </Text>
        </View>

        <View style={styles.recompensa}>
          <Text style={styles.recompensaValor}>+{moedasGanhas} 🪙 MOEDAS PEQ INVEST</Text>
          <Text style={styles.recompensaDetalhe}>
            {conseguiu
              ? `${MOEDAS_POR_CONCLUIR} por terminar + ${BONUS_OBJETIVO} por alcançar o objetivo`
              : `${MOEDAS_POR_CONCLUIR} por terminar. Alcance o objetivo para ganhar +${BONUS_OBJETIVO}.`}
          </Text>
        </View>

        <View style={styles.botoesFinais}>
          <PrimaryButton title="JOGAR DE NOVO" onPress={comecar} />
          <PrimaryButton title="VOLTAR AOS JOGOS" onPress={onSair} />
        </View>
      </View>
    );
  }

  // ---------- Semanas (escolha e resultado da semana) ----------
  const podeComprar = saldo >= tentacao.preco;

  return (
    <View style={styles.tela}>
      <Cabecalho onSair={onSair} legenda={legendaSemana} />
      <Cofrinho saldo={saldo} />
      <Satisfacao valor={satisfacao} />
      <LinhaDoTempo semanaAtual={semana} escolhas={escolhas} />

      {fase === 'escolha' ? (
        <>
          <View style={styles.vitrine}>
            <Text style={styles.vitrineEmoji}>{tentacao.emoji}</Text>
            <Text style={styles.cartaoTitulo}>{tentacao.nome.toUpperCase()}</Text>
            <View style={styles.preco}>
              <Text style={styles.precoTexto}>R$ {tentacao.preco}</Text>
            </View>
            <Text style={styles.texto}>{tentacao.cena}</Text>
          </View>

          <View style={styles.escolhas}>
            <BotaoEscolha
              emoji="🛒"
              titulo="COMPRAR AGORA"
              detalhe={podeComprar ? 'Alegria na hora' : 'Saldo insuficiente'}
              disabled={!podeComprar}
              onPress={() => escolher(true)}
            />
            <BotaoEscolha
              emoji="🐷"
              titulo="GUARDAR PARA DEPOIS"
              detalhe="O dinheiro fica no cofrinho"
              onPress={() => escolher(false)}
            />
          </View>
        </>
      ) : (
        <View style={styles.cartao}>
          <Text style={styles.vitrineEmoji}>{ultimaEscolha.comprou ? ultimaEscolha.item.emoji : '🐷'}</Text>
          <Text style={styles.cartaoTitulo}>
            {ultimaEscolha.comprou ? `VOCÊ COMPROU: ${ultimaEscolha.item.nome.toUpperCase()}` : 'VOCÊ GUARDOU!'}
          </Text>
          <Text style={styles.texto}>
            {ultimaEscolha.comprou
              ? `Que alegria! Mas o cofrinho caiu para R$ ${saldo}, e essa alegria costuma passar em poucos dias.`
              : `A satisfação continua média, mas o skate ficou mais perto. Seus R$ ${saldo} continuam guardados.`}
          </Text>
          <Text style={styles.mesada}>
            {ehUltimaSemana
              ? `📅 Última semana! Receba R$ ${MESADA} de mesada e veja o resultado.`
              : `📅 Fim da semana: hora de receber R$ ${MESADA} de mesada.`}
          </Text>
          <PrimaryButton title={ehUltimaSemana ? 'VER RESULTADO' : 'RECEBER MESADA'} onPress={receberMesada} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tela: {
    gap: 10,
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  voltar: {
    minHeight: 28,
    justifyContent: 'center',
    borderRadius: 4,
    paddingHorizontal: 10,
    backgroundColor: colors.primaryDark,
  },
  voltarTexto: {
    color: colors.card,
    fontSize: 11,
    fontWeight: '900',
  },
  legenda: {
    color: colors.card,
    fontSize: 12,
    fontWeight: '900',
  },
  titulo: {
    color: colors.card,
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
  },
  cartao: {
    alignItems: 'center',
    gap: 8,
    borderRadius: 6,
    padding: 14,
    backgroundColor: colors.card,
  },
  cartaoTitulo: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '900',
    textAlign: 'center',
  },
  texto: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 18,
    textAlign: 'center',
  },
  objetivoEmoji: {
    fontSize: 52,
  },
  regras: {
    gap: 8,
    borderRadius: 6,
    padding: 12,
    backgroundColor: colors.surface,
  },
  regra: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 18,
  },
  aviso: {
    color: colors.card,
    fontSize: 11,
    fontWeight: '800',
    lineHeight: 16,
    textAlign: 'center',
  },

  // Cofrinho
  cofrinho: {
    alignItems: 'center',
    borderRadius: 6,
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: colors.card,
  },
  rotulo: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '900',
  },
  saldo: {
    color: colors.primaryDark,
    fontSize: 40,
    fontWeight: '900',
  },
  trilha: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  trilhaEmoji: {
    fontSize: 24,
  },
  trilhaBarra: {
    flex: 1,
  },
  faltam: {
    marginTop: 8,
    color: colors.textPrimary,
    fontSize: 11,
    fontWeight: '900',
    textAlign: 'center',
  },
  barra: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: colors.primarySoft,
  },
  barraPreenchida: {
    height: '100%',
    backgroundColor: colors.primary,
  },

  // Satisfação
  satisfacao: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.surface,
  },
  satisfacaoEmoji: {
    fontSize: 26,
  },
  satisfacaoInfo: {
    flex: 1,
    gap: 4,
  },
  satisfacaoTitulo: {
    color: colors.textPrimary,
    fontSize: 11,
    fontWeight: '900',
  },

  // Linha do tempo
  linhaDoTempo: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  bolinha: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  bolinhaAtual: {
    borderColor: colors.card,
    backgroundColor: colors.primaryDark,
  },
  bolinhaGuardou: {
    borderColor: colors.surface,
    backgroundColor: colors.surface,
  },
  bolinhaComprou: {
    borderColor: colors.card,
    backgroundColor: colors.card,
  },
  bolinhaTexto: {
    color: colors.card,
    fontSize: 13,
    fontWeight: '900',
  },

  // Vitrine e escolhas
  vitrine: {
    alignItems: 'center',
    gap: 6,
    borderRadius: 6,
    padding: 14,
    backgroundColor: colors.card,
  },
  vitrineEmoji: {
    fontSize: 46,
  },
  preco: {
    borderRadius: 12,
    paddingVertical: 3,
    paddingHorizontal: 12,
    backgroundColor: colors.primaryDark,
  },
  precoTexto: {
    color: colors.card,
    fontSize: 14,
    fontWeight: '900',
  },
  escolhas: {
    flexDirection: 'row',
    gap: 10,
  },
  escolha: {
    flex: 1,
    minHeight: 104,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderRadius: 6,
    borderWidth: 3,
    borderColor: colors.primaryDark,
    padding: 8,
    backgroundColor: colors.surface,
  },
  escolhaPressionada: {
    backgroundColor: colors.primarySoft,
    transform: [{ scale: 0.97 }],
  },
  escolhaDesativada: {
    opacity: 0.5,
  },
  escolhaEmoji: {
    fontSize: 28,
  },
  escolhaTitulo: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '900',
    textAlign: 'center',
  },
  escolhaDetalhe: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'center',
  },
  mesada: {
    width: '100%',
    borderRadius: 4,
    paddingVertical: 6,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
    fontSize: 11,
    fontWeight: '900',
    textAlign: 'center',
  },

  // Gráfico de evolução
  grafico: {
    width: '100%',
    gap: 4,
  },
  graficoArea: {
    height: 110,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
    borderBottomWidth: 2,
    borderBottomColor: colors.textPrimary,
  },
  graficoColuna: {
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
  },
  graficoBarra: {
    width: '100%',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    backgroundColor: colors.primary,
  },
  graficoBarraComprou: {
    backgroundColor: colors.primarySoft,
  },
  linhaObjetivo: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 1,
    borderTopWidth: 2,
    borderStyle: 'dashed',
    borderTopColor: colors.primaryDark,
  },
  linhaObjetivoTexto: {
    position: 'absolute',
    right: 0,
    bottom: 2,
    paddingHorizontal: 4,
    color: colors.primaryDark,
    backgroundColor: colors.card,
    fontSize: 10,
    fontWeight: '900',
  },
  graficoLegendas: {
    flexDirection: 'row',
    gap: 6,
  },
  graficoLegenda: {
    flex: 1,
    alignItems: 'center',
  },
  graficoValor: {
    color: colors.textPrimary,
    fontSize: 9,
    fontWeight: '900',
  },
  graficoRotulo: {
    color: colors.textSecondary,
    fontSize: 9,
    fontWeight: '800',
  },
  graficoNota: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'center',
  },

  // Lição e recompensa
  licao: {
    gap: 6,
    borderRadius: 6,
    padding: 14,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.primaryDark,
  },
  licaoTitulo: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: '900',
    textAlign: 'center',
  },
  licaoTexto: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 18,
    textAlign: 'center',
  },
  recompensa: {
    alignItems: 'center',
    gap: 2,
    borderRadius: 6,
    padding: 12,
    backgroundColor: colors.primaryDark,
  },
  recompensaValor: {
    color: colors.card,
    fontSize: 16,
    fontWeight: '900',
  },
  recompensaDetalhe: {
    color: colors.surface,
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'center',
  },
  botoesFinais: {
    alignItems: 'center',
    gap: 8,
  },
});
