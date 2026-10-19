const cargos = [
  {
    nome: "DEPUTADO FEDERAL",
    digitos: 4,
    candidatos: {
      "2222": { nome: "LUKÃO", partido: "PL" },
      "1313": { nome: "ADELITA MONTEIRO", partido: "PT" },
      "1277": { nome: "ADAIL JR.", partido: "PDT" }
    }
  },
  {
    nome: "DEPUTADO ESTADUAL",
    digitos: 5,
    candidatos: {
      "22022": { nome: "BELA CARMELO", partido: "PL" },
      "44000": { nome: "ABDIAS FILHO", partido: "UNIÃO" },
      "50500": { nome: "AILTON LOPES", partido: "PSOL" }
    }
  },
  {
    nome: "1º SENADOR",
    digitos: 3,
    candidatos: {
      "400": { nome: "CID GOMES", partido: "PSB" },
      "180": { nome: "LUIZIANNE", partido: "REDE" },
      "222": { nome: "ALCIDES FERNANDES", partido: "PL" }
    }
  },
  {
    nome: "2º SENADOR",
    digitos: 3,
    candidatos: {
      "400": { nome: "CID GOMES", partido: "PSB" },
      "180": { nome: "LUIZIANNE", partido: "REDE" },
      "222": { nome: "ALCIDES FERNANDES", partido: "PL" }
    }
  },
  {
    nome: "GOVERNADOR",
    digitos: 2,
    candidatos: {
      "45": { nome: "CIRO GOMES", partido: "PSDB" },
      "13": { nome: "ELMANO DE FREITAS", partido: "PT" },
      "30": { nome: "VERA LÚCIA", partido: "NOVO" },
      "14": { nome: "DELEGADO HUGGO", partido: "MISSÃO" }
    }
  },
  {
    nome: "PRESIDENTE",
    digitos: 2,
    candidatos: {
      "13": { nome: "LULA", partido: "PT" },
      "22": { nome: "FLÁVIO BOLSONARO", partido: "PL" },
      "55": { nome: "RONALDO CAIADO", partido: "PSD" },
      "30": { nome: "ROMEU ZEMA", partido: "NOVO" }
    }
  }
];

let etapa = 0;
let numero = "";
let branco = false;

const cpfsUsados = new Set();

const el = id => document.getElementById(id);

el("formCPF").addEventListener("submit", iniciar);

function iniciar(evento) {
  evento.preventDefault();

  const cpf = el("cpf").value.trim();

  if (!/^\d{11}$/.test(cpf)) {
    el("mensagemCPF").textContent =
      "Digite 11 números fictícios.";
    return;
  }

  if (cpfsUsados.has(cpf)) {
    el("mensagemCPF").textContent =
      "Identificador já utilizado nesta sessão.";
    return;
  }

  el("mensagemCPF").textContent = "";
  el("telaCPF").hidden = true;
  el("telaFinal").hidden = true;
  el("telaUrna").hidden = false;

  etapa = 0;
  prepararCargo();
}

function prepararCargo() {
  numero = "";
  branco = false;

  const cargo = cargos[etapa];

  el("progresso").textContent =
    `Cargo ${etapa + 1} de ${cargos.length}`;

  el("cargo").textContent = cargo.nome;
  el("numero").textContent = "";
  el("nome").textContent = "Digite o número";
  el("partido").textContent = "";
  el("mensagem").textContent = "";
}

function digitarNumero(n) {
  if (branco) return;

  const cargo = cargos[etapa];

  if (numero.length >= cargo.digitos) return;

  numero += n;
  el("numero").textContent = numero;

  mostrarCandidato();
}

function mostrarCandidato() {
  const cargo = cargos[etapa];

  el("nome").textContent = "";
  el("partido").textContent = "";
  el("mensagem").textContent = "";

  if (numero.length < cargo.digitos) return;

  const candidato = cargo.candidatos[numero];

  if (!candidato) {
    el("nome").textContent = "NÚMERO NÃO CADASTRADO";
    el("mensagem").textContent = "Aperte CORRIGE.";
    return;
  }

  el("nome").textContent = candidato.nome;
  el("partido").textContent = "Partido: " + candidato.partido;
  el("mensagem").textContent =
    "Confira os dados e aperte CONFIRMA.";
}

function votoBranco() {
  numero = "";
  branco = true;

  el("numero").textContent = "";
  el("nome").textContent = "VOTO EM BRANCO";
  el("partido").textContent = "";
  el("mensagem").textContent =
    "Aperte CONFIRMA para continuar.";
}

function corrigir() {
  prepararCargo();
  el("mensagem").textContent =
    "Digite novamente o número.";
}

function confirmar() {
  const cargo = cargos[etapa];

  if (branco) {
    avancar();
    return;
  }

  if (numero.length !== cargo.digitos) {
    el("mensagem").textContent =
      `Digite os ${cargo.digitos} números ou escolha BRANCO.`;
    return;
  }

  const candidato = cargo.candidatos[numero];

  if (!candidato) {
    el("mensagem").textContent =
      "Número inválido. Aperte CORRIGE.";
    return;
  }

  avancar();
}

function avancar() {
  etapa++;

  if (etapa < cargos.length) {
    prepararCargo();
    return;
  }

  const cpf = el("cpf").value.trim();
  cpfsUsados.add(cpf);

  el("telaUrna").hidden = true;
  el("telaFinal").hidden = false;

  el("resumoFinal").textContent =
    "Você concluiu os seis cargos da simulação. " +
    "Nenhum voto foi enviado à Justiça Eleitoral.";

  el("cpf").value = "";
}

function voltarInicio() {
  el("telaFinal").hidden = true;
  el("telaCPF").hidden = false;
  el("mensagemCPF").textContent = "";
}

document.querySelectorAll("[data-numero]").forEach(botao => {
  botao.addEventListener("click", () => {
    digitarNumero(botao.dataset.numero);
  });
});

el("btnBranco").addEventListener("click", votoBranco);
el("btnCorrige").addEventListener("click", corrigir);
el("btnConfirma").addEventListener("click", confirmar);
el("btnInicio").addEventListener("click", voltarInicio);