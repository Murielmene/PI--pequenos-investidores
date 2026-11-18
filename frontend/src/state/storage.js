// Salva e lê dados do localStorage do navegador.
// Se o localStorage não existir (ex.: app nativo), usa um objeto em memória.
const memoria = {};

function temLocalStorage() {
  try {
    return typeof window !== 'undefined' && !!window.localStorage;
  } catch {
    return false;
  }
}

export function lerDados(chave, valorPadrao) {
  try {
    if (temLocalStorage()) {
      const texto = window.localStorage.getItem(chave);
      return texto === null ? valorPadrao : JSON.parse(texto);
    }
  } catch {
    // dado corrompido ou acesso bloqueado: cai para a memória
  }

  return chave in memoria ? memoria[chave] : valorPadrao;
}

export function salvarDados(chave, valor) {
  memoria[chave] = valor;

  try {
    if (temLocalStorage()) {
      window.localStorage.setItem(chave, JSON.stringify(valor));
    }
  } catch {
    // sem espaço ou acesso bloqueado: fica só na memória
  }
}
