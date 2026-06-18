const learningSteps = [
  {
    id: 'diagnosis',
    title: 'Revisar renda, despesas e capacidade de aporte',
    status: 'done',
    minutes: 6,
    description: 'Analise concluida com base no fluxo mensal informado e no valor reservado para aportes.',
    action: 'Revisar diagnostico',
  },
  {
    id: 'reserve',
    title: 'Definir meta para reserva de emergencia',
    status: 'available',
    minutes: 8,
    description: 'Calcule o valor recomendado para cobrir despesas essenciais antes de ampliar a exposicao a risco.',
    action: 'Abrir etapa',
  },
  {
    id: 'risk',
    title: 'Confirmar perfil de risco e horizonte de investimento',
    status: 'available',
    minutes: 10,
    description: 'Valide tolerancia a oscilacao, prazo dos objetivos e necessidade de liquidez.',
    action: 'Responder perfil',
  },
  {
    id: 'allocation',
    title: 'Validar a alocacao inicial recomendada',
    status: 'locked',
    minutes: 12,
    description: 'Esta etapa sera liberada apos a confirmacao do perfil de risco.',
    action: 'Etapa pendente',
  },
];

const portfolioSummary = {
  totalInvested: 1250,
  monthlyGoal: 300,
  riskProfile: 'moderado',
  suggestedProducts: [
    {
      id: 'reserve',
      name: 'Reserva com liquidez diaria',
      allocation: 50,
      detail: 'Prioridade para resgate rapido e baixa volatilidade enquanto a reserva ainda esta em formacao.',
    },
    {
      id: 'fixed-income',
      name: 'Renda fixa pos-fixada',
      allocation: 35,
      detail: 'Componente voltado a estabilidade, previsibilidade e acompanhamento de indicadores de juros.',
    },
    {
      id: 'diversified',
      name: 'Exposicao diversificada de baixo custo',
      allocation: 15,
      detail: 'Parcela controlada para diversificacao, mantendo risco compatível com um perfil moderado.',
    },
  ],
};

const wait = async () => new Promise((resolve) => setTimeout(resolve, 250));

export async function getLearningSteps() {
  await wait();
  return learningSteps;
}

export async function getPortfolioSummary() {
  await wait();
  return portfolioSummary;
}
