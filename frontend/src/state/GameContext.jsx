import { createContext, useContext, useEffect, useState } from 'react';
import { lerDados, salvarDados } from './storage';

// "Memória global" da gamificação: as moedas 🪙 do PEQ INVEST.
// Qualquer tela acessa com o hook useGame().
const GameContext = createContext(null);

const CHAVE_MOEDAS = 'peqinvest:moedas';

export function GameProvider({ children }) {
  const [moedas, setMoedas] = useState(() => lerDados(CHAVE_MOEDAS, 0));

  // Salva automaticamente sempre que o saldo de moedas muda.
  useEffect(() => {
    salvarDados(CHAVE_MOEDAS, moedas);
  }, [moedas]);

  const ganharMoedas = (quantidade) => {
    if (!Number.isFinite(quantidade) || quantidade <= 0) {
      return;
    }

    setMoedas((atual) => atual + quantidade);
  };

  return <GameContext.Provider value={{ moedas, ganharMoedas }}>{children}</GameContext.Provider>;
}

export function useGame() {
  const contexto = useContext(GameContext);

  if (!contexto) {
    throw new Error('useGame precisa estar dentro de <GameProvider>.');
  }

  return contexto;
}
