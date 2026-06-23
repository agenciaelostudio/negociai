import { CATALOGO } from "./catalog";
import type { Categoria, FormData, Mensagem } from "./types";

/**
 * Gerador local de mensagens com variações.
 * Cada atalho tem múltiplas variações de texto.
 * A cada geração, uma variação diferente é sorteada para cada script.
 */

function primeiroNome(nome: string): string {
  const limpo = nome.trim();
  if (!limpo) return "";
  return limpo.split(/\s+/)[0];
}

function ouFallback(valor: string, padrao: string): string {
  const v = (valor || "").trim();
  return v.length > 0 ? v : padrao;
}

function pickOne(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildVariations(data: FormData): Record<string, string[]> {
  const nome = ouFallback(data.nome, "Meu trabalho");
  const pnome = primeiroNome(nome) || "Olá";
  const profissao = ouFallback(data.profissao, "profissional");
  const servicos = ouFallback(data.servicos, "meus serviços");
  const preco = ouFallback(data.preco, "valores acessíveis e justos");
  const diferenciais = ouFallback(
    data.diferenciais,
    "qualidade, compromisso e atenção total ao cliente",
  );

  return {
    // ── APRESENTAÇÃO ──────────────────────────────────────────
    "/apresentacao": [
      `Olá! Aqui é ${nome}.\n\nTrabalho com ${profissao} e ajudo clientes como você com ${servicos}.\n\nMeu foco é entregar um resultado profissional, com ${diferenciais}.\n\nMe conta rapidamente o que você precisa que eu te explico exatamente como posso ajudar.`,
      `Oi! Sou ${nome}, ${profissao} especializado(a) em ${servicos}.\n\nMeus clientes escolhem meu trabalho porque ofereço ${diferenciais}.\n\nMe diz o que você está buscando que já te mostro como posso te ajudar.`,
      `Seja bem-vindo(a)! Me chamo ${nome} e atuo com ${profissao} há algum tempo.\n\nMeu trabalho é resolver exatamente o que você precisa na área de ${servicos}, com ${diferenciais}.\n\nPode me contar o que está precisando?`,
    ],

    "/boasvindas": [
      `Seja muito bem-vindo(a)! \n\nQue bom ter você por aqui.\n\nSou ${nome}, especialista em ${profissao}.\n\nMe diz: o que você está buscando? Assim já te oriento da melhor forma.`,
      `Olá! É um prazer te receber.\n\nAqui é ${nome}, ${profissao}. Trabalho com ${servicos} e estou aqui pra te ajudar.\n\nMe conta: como posso te ajudar hoje?`,
      `Que bom que você chegou até aqui!\n\nSou ${nome} e atuo como ${profissao}.\n\nSe você busca ${servicos}, está no lugar certo.\n\nMe explica rapidamente o que precisa para eu te dar a melhor solução.`,
    ],

    // ── DIFERENCIAIS ──────────────────────────────────────────
    "/diferencial": [
      `Ótima pergunta!\n\nO que me diferencia é: ${diferenciais}.\n\nNa prática, isso significa mais segurança, qualidade e tranquilidade para você do início ao fim.\n\nQuer que eu te mostre como isso se aplica ao seu caso?`,
      `Obrigado por perguntar!\n\nMeu diferencial está em ${diferenciais}. É isso que faz meus clientes confiarem no meu trabalho e voltarem sempre.\n\nQuer entender melhor como isso funciona na prática?`,
      `Sim! Explico com prazer.\n\nO que me destaca é ${diferenciais}. Isso significa que você não está pagando só pelo serviço, mas por uma experiência completa e sem preocupações.\n\nVou te mostrar como.`,
    ],

    "/porquemim": [
      `Existem várias opções no mercado, e eu respeito isso.\n\nA diferença do meu trabalho está em ${diferenciais}.\n\nNão entrego só o serviço: entrego experiência, acompanhamento e resultado.\n\nPosso te explicar exatamente o que está incluso?`,
      `Entendo que você pode estar comparando, e acho ótimo!\n\nAcredito que me escolher faz sentido porque ${diferenciais}. Além disso, meu atendimento é personalizado — cada cliente é único.\n\nQuer conversar para eu te mostrar mais?`,
      `Gosto dessa pergunta!\n\nMeu compromisso é: ${diferenciais}. É por isso que meus clientes confiam no meu trabalho.\n\nNão se trata só de preço, mas de garantia de um resultado que atende (e supera) o esperado.\n\nVamos conversar?`,
    ],

    // ── VALORES ───────────────────────────────────────────────
    "/valores": [
      `Sobre os valores:\n\nTrabalho na faixa de ${preco}, e o investimento varia conforme o que você precisa.\n\nIsso inclui ${diferenciais}, do começo ao fim.\n\nMe passa um pouco mais do que você quer que eu monto a melhor opção pra você.`,
      `Fico feliz que perguntou!\n\nMeus preços ficam em torno de ${preco}. O valor exato depende do que você precisa — posso montar uma proposta sob medida.\n\nE quero que saiba: independente do pacote, você tem ${diferenciais}.`,
      `Sobre investimento:\n\nMeus serviços partem de ${preco}. O valor final depende do escopo.\n\nMas mais importante que o preço é o que está incluso: ${diferenciais}. Uma entrega que realmente faz diferença.\n\nQuer que eu monte uma proposta personalizada?`,
    ],

    "/pacotes": [
      `Tenho opções pensadas para diferentes necessidades e orçamentos.\n\nTodas incluem o padrão de qualidade que me diferencia: ${diferenciais}.\n\nMe diz o que é prioridade pra você que eu indico o pacote ideal.`,
      `Ofereço opções flexíveis que se adaptam ao seu momento.\n\nO básico já entrega resultado, mas se quiser algo mais completo, tenho pacotes que incluem ainda mais benefícios.\n\nQual seu maior objetivo? Assim indico o melhor pra você.`,
    ],

    // ── PEDIDO DE INFORMAÇÕES ─────────────────────────────────
    "/info": [
      `Perfeito! Para te passar a melhor proposta, preciso de algumas informações:\n\n1. O que exatamente você precisa?\n2. Para quando seria?\n3. Tem alguma preferência ou detalhe importante?\n\nCom isso já consigo te dar um retorno certeiro.`,
      `Maravilha! Vou preparar tudo certinho.\n\nSó me ajuda com:\n• O que você está procurando?\n• Qual seu prazo ideal?\n• Alguma preferência?\n\nCom esses dados monto a solução certa pra você.`,
    ],

    "/agendar": [
      `Vamos agendar então!\n\nMe confirma por favor:\n\n• Data desejada\n• Horário\n• Local / detalhes\n\nAssim que tiver isso, já reservo na minha agenda pra você.`,
      `Ótimo, vamos marcar!\n\nMe passa:\n• Qual dia e horário é melhor pra você\n• Prefere presencial ou online?\n• Alguma observação?\n\nAssim que confirmar, já bloqueio na agenda.`,
    ],

    "/formaspagamento": [
      `Sobre o pagamento, facilito pra você:\n\nAceito PIX, cartão e transferência.\n\nTambém consigo parcelar conforme combinarmos.\n\nQuer que eu já te envie os dados para confirmar?`,
      `Tranquilo! As formas de pagamento são:\n\n- Cartão de crédito (parcelado)\n- PIX (à vista)\n- Transferência bancária\n\nQual é melhor pra você?`,
    ],

    // ── OBJEÇÕES ──────────────────────────────────────────────
    "/caro": [
      `Entendo perfeitamente.\n\nAlém da prestação do serviço, meu trabalho inclui ${diferenciais}.\n\nO objetivo é garantir que você tenha o melhor resultado possível, sem preocupações e sem retrabalho.\n\nPosso te explicar exatamente o que está incluso para você comparar de forma justa?`,
      `Totalmente compreensível. Deixa eu te explicar:\n\nQuando você investe comigo, está levando ${diferenciais}. Não é só o serviço — é a tranquilidade de saber que está em boas mãos.\n\nMuitos clientes achavam o mesmo no começo, e depois de ver o resultado, perceberam que valeu cada centavo.\n\nVou te mostrar o que está incluso pra você sentir a diferença.`,
      `Entendo seu ponto e respeito.\n\nSó quero que você considere: o barato muitas vezes sai caro — retrabalho, prazo perdido, resultado abaixo do esperado.\n\nComigo você tem ${diferenciais}. É um investimento que se paga pelo resultado.\n\nQuer que eu detalhe o que está incluso pra você avaliar?`,
      `Olha, eu entendo que pode parecer um investimento alto à primeira vista. Mas deixa eu te mostrar o que está por trás desse valor.\n\nAlém do serviço em si, você está contratando ${diferenciais}. Isso significa menos dor de cabeça, mais resultado e um atendimento que realmente se preocupa com você.\n\nNo fim das contas, não é sobre gastar mais — é sobre investir certo. Vou te explicar direitinho o que você leva.`,
      `Sei que o preço é um fator importante na sua decisão, e respeito isso.\n\nMas me permite fazer uma provocação? Se você escolher só pelo menor preço, pode acabar pagando mais caro depois com retrabalho, atrasos ou um resultado que não ficou como esperava.\n\nComigo, você sabe exatamente o que está comprando: ${diferenciais}. Isso é garantia de um resultado que atende — e geralmente supera — o que você esperava.\n\nQuer que eu detalhe?`,
    ],

    "/desconto": [
      `Entendo o seu lado e quero te ajudar.\n\nMeus valores já são pensados para entregar o máximo de qualidade pelo justo.\n\nO que posso fazer é ajustar o pacote ou as condições de pagamento para caber no seu momento.\n\nQuer que eu monte uma opção sob medida pra você?`,
      `Compreendo. Olha, não costumo fazer descontos porque prefiro manter a qualidade que meus clientes esperam.\n\nMas posso te ajudar de outra forma: posso ajustar o escopo ou parcelar de um jeito que fique mais confortável.\n\nO que acha?`,
      `Entendo que o orçamento é importante.\n\nEm vez de diminuir o valor, posso montar um pacote mais enxuto que atenda exatamente sua necessidade principal, sem perder a qualidade.\n\nAssim fica dentro do seu orçamento e você ainda tem ${diferenciais}.\n\nVamos ver?`,
      `Sei que desconto é sempre bem-vindo, mas vou ser sincero com você: meu preço já é calculado pra entregar o melhor resultado possível.\n\nSe eu reduzir o valor, algo precisa sair — e aí quem perde é você.\n\nO que posso fazer é te ajudar com o pagamento: posso parcelar de um jeito que fique mais leve. O que acha?`,
      `Olha, mais do que dar desconto, eu prefiro te mostrar por que o valor vale a pena.\n\nVocê não está comprando um serviço qualquer. Está investindo em ${diferenciais}.\n\nSe ainda assim o valor estiver apertado, podemos montar um plano de pagamento que se encaixe melhor pra você.\n\nVamos conversar?`,
    ],

    "/semvalor": [
      `Entendo que você pode estar na dúvida sobre o valor do serviço.\n\nDeixa eu te explicar: quando você contrata ${profissao}, está investindo em ${diferenciais}. Não é só o serviço em si — é a segurança de um resultado bem feito, no prazo e sem dor de cabeça.\n\nO que exatamente você sente que poderia ser diferente?`,
      `Posso entender sua hesitação. Muita gente olha só o preço e não enxerga o que está por trás.\n\nComigo, cada detalhe conta: ${diferenciais}. Isso transforma completamente o resultado final.\n\nVocê já parou pra pensar quanto custa ter que refazer um serviço mal feito?`,
      `Entendo seu ponto. Mas me permite mostrar algo?\n\nMeu serviço não é só sobre ${servicos} — é sobre entregar ${diferenciais}. O resultado não é só o que você vê, é a tranquilidade de saber que foi bem feito.\n\nPosso te mostrar exemplos de clientes que pensavam como você e mudaram de ideia depois de ver o resultado?`,
      `Sei que nem sempre é fácil enxergar o valor de algo que você nunca experimentou.\n\nO que te ofereço vai além de ${servicos}: é ${diferenciais}. É o cuidado de quem entende que seu tempo e seu dinheiro merecem respeito.\n\nVou te explicar direitinho o que você leva — e aí você tira suas conclusões, combinado?`,
      `Olha, seu questionamento é válido. Deixa eu te mostrar o outro lado.\n\nQuando você paga por um trabalho de ${profissao}, não está pagando só pela execução — está pagando por ${diferenciais}. Isso significa menos estresse, mais profissionalismo e um resultado que realmente entrega o que promete.\n\nQuer que eu detalhe o que está incluso pra você sentir a diferença?`,
    ],

    "/promocao": [
      `Entendo que esperar uma promoção parece uma boa ideia.\n\nMas vou ser sincero: prefiro trabalhar com preços justos o ano todo do que inflar o valor e depois dar desconto. O que eu entrego já é pensado pra ser o melhor custo-benefício.\n\nQue tal conversarmos para eu montar uma condição especial dentro do que cabe pra você?`,
      `Olha, não costumo fazer ações promocionais porque meu foco é manter a qualidade que meus clientes esperam.\n\nO que posso oferecer é um bom planejamento de pagamento e a certeza de que cada centavo investido vai se refletir no resultado final.\n\nVale mais a pena do que esperar por uma promoção que pode não vir, não acha?`,
      `Sei que todo mundo gosta de uma promoção.\n\nMas já pensou que esperar pode significar perder o momento ideal ou ficar sem vaga na agenda? O que eu ofereço já tem o melhor custo-benefício que posso entregar.\n\nQuer que eu te mostre o que está incluso pra você ver que o valor é justo?`,
      `Compreendo seu lado. Mas deixa eu te falar uma verdade: quando você espera promoção, o tempo passa, a agenda lota e a necessidade continua.\n\nMeu preço já é pensado pra ser justo e acessível dentro da qualidade que entrego. Não trabalho com jogos de preço — trabalho com transparência.\n\nO que acha de fecharmos agora e eu ainda te ajudar com um parcelamento bacana?`,
      `Eu sei que promoção chama atenção, mas quero que você pense comigo.\n\nServiço de ${profissao} de qualidade custa caro de fazer direito, e meu preço reflete isso de forma honesta. Não é um valor inflado esperando desconto.\n\nO que posso fazer é garantir ${diferenciais} e condições de pagamento que se encaixem pra você. Que tal?`,
    ],

    "/pensar": [
      `Claro, é uma decisão importante e faz todo sentido pensar com calma.\n\nSó me diz: ficou alguma dúvida específica que eu possa esclarecer agora?\n\nMuitas vezes é um detalhe pequeno que faz a diferença na decisão.\n\nEstou aqui pra te ajudar a escolher o melhor pra você.`,
      `Sem pressa! Decisões assim merecem atenção.\n\nSe quiser, posso te enviar um resumo com tudo que conversamos pra você analisar com calma.\n\nE se surgir qualquer dúvida, é só me chamar, combinado?`,
      `Claro, fique à vontade!\n\nSó não deixa esfriar, hein? Se precisar de mais informações ou quiser repensar algo, estou aqui.\n\nPosso dar um toque daqui alguns dias pra saber se conseguiu decidir?`,
      `Imagina, pode pensar à vontade!\n\nInclusive, se quiser, posso te mandar um resumo bem organizado com tudo o que conversamos, os diferenciais e valores. Aí você analisa no seu tempo e me responde quando se sentir seguro.\n\nTe envio?`,
      `Claro! É uma decisão que merece atenção mesmo.\n\nMe conta uma coisa: tem algo específico que te deixou na dúvida?\n\nSe for questão de preço, podemos ajustar. Se for sobre o serviço, posso te explicar melhor.\n\nSó não quero que você fique com pendência — tô aqui pra ajudar na sua decisão, sem pressão.`,
    ],

    "/esposa": [
      `Perfeito, decisões assim são melhores quando feitas em conjunto.\n\nPosso te enviar um resumo organizado com tudo incluso pra facilitar essa conversa?\n\nAssim vocês decidem com todas as informações na mão.`,
      `Claro, faz todo sentido conversarem juntos.\n\nVou preparar um resumo simples e direto do que está incluso pra você mostrar pra ela(e).\n\nQual a melhor forma de enviar?`,
      `Ótima ideia! Decisão compartilhada é sempre melhor.\n\nQuer que eu monte um resumo destacando os pontos principais pra facilitar a conversa de vocês?`,
      `Com certeza! É importante mesmo que vocês estejam alinhados.\n\nVou preparar um resumo bem limpo com:\n✅ O que está incluso\n✅ Investimento\n✅ Diferenciais\n✅ Próximos passos\n\nAssim vocês dois conseguem ver juntos e decidir com tranquilidade. Pode ser?`,
      `Perfeito! Nada melhor que decidir juntos.\n\nVou montar um resumo simples, quase um 'relatório executivo' do que conversamos. Daí você mostra, tiram as dúvidas e me chamam quando tiverem a resposta.\n\nPosso enviar por aqui mesmo?`,
    ],

    "/pesquisar": [
      `Faz total sentido pesquisar, eu faria o mesmo.\n\nSó um conselho de quem trabalha com ${profissao}: compare não só o preço, mas o que está incluso.\n\nNo meu caso você tem ${diferenciais}.\n\nQuando comparar, me chama que te ajudo a ver se vale a pena.`,
      `Ótimo! Pesquisar é o caminho certo.\n\nEnquanto você procura, deixo aqui meu diferencial: ${diferenciais}.\n\nO que me orgulha é que quem me escolheu depois de pesquisar, não se arrependeu.\n\nQuando tiver uma conclusão, me chama que trocamos uma ideia.`,
      `Apoio totalmente! Pesquise à vontade.\n\nSó um ponto pra você levar em conta: qualidade tem nome, e o meu é ${diferenciais}.\n\nVeja o que cada um oferece além do preço, e me conta depois o que achou.`,
      `Pesquisar é sempre uma boa ideia!\n\nSe quiser, posso te ajudar a saber o que olhar: em vez de só preço, veja o que cada profissional entrega de garantia, suporte e qualidade.\n\nNo meu caso, além do serviço, você leva ${diferenciais}. Isso faz diferença no resultado final.\n\nQuando tiver uma conclusão, me chama que trocamos uma ideia!`,
      `Fique à vontade pra pesquisar, eu super apoio!\n\nSe me permite uma dica de quem vive isso todo dia: nem sempre o mais barato é o melhor negócio. Olha o que está incluso, a qualidade, a reputação.\n\nSó de você ter ${diferenciais}, já sabe que está num nível acima.\n\nDepois me conta o que achou das outras opções — bora conversar!`,
    ],

    "/orcamento": [
      `Com prazer! Para montar seu orçamento certinho, me confirma:\n\n• O que você precisa exatamente\n• Data / prazo\n• Detalhes importantes\n\nCom isso eu te envio uma proposta personalizada na faixa de ${preco}.`,
      `Vou preparar um orçamento sob medida pra você!\n\nMe ajuda com:\n• Escopo do que precisa\n• Prazo desejado\n• Preferências ou requisitos\n\nAssim que receber, te envio a proposta em até 24h.`,
      `Claro! Faço questão de montar um orçamento bem detalhado.\n\nPra isso, me conta:\n1. Qual é exatamente o serviço que você precisa?\n2. Pra quando?\n3. Tem algum detalhe especial?\n\nCom essas informações, te mando uma proposta completa e sem surpresas.`,
      `Com certeza! Vou montar uma proposta personalizada.\n\nMe passa mais detalhes:\n• O que você está precisando?\n• Qual seu prazo?\n• Tem preferência de forma de pagamento?\n\nA partir disso monto o orçamento certinho com opções pra você escolher.`,
      `Sim! Faço orçamento sem compromisso.\n\nSó preciso de algumas informações pra te dar o valor certo:\n\n🔹 O que você precisa?\n🔹 Quantidade / escopo\n🔹 Prazo desejado\n\nCom isso, te envio uma proposta clara, sem letras miúdas, na faixa de ${preco}.`,
    ],

    "/comparando": [
      `Ótimo que está comparando, isso mostra cuidado com a decisão.\n\nNa hora de comparar, olhe além do valor: experiência, segurança e o que está realmente incluso.\n\nComigo você tem ${diferenciais}.\n\nQuer que eu detalhe ponto a ponto o que entrego?`,
      `Acho ótimo que você está avaliando as opções.\n\nEnquanto compara, quero que saiba: meu compromisso é ${diferenciais}.\n\nSe tiver qualquer dúvida ou quiser que eu alinhe algum ponto, é só falar.`,
      `Super saudável comparar! Isso mostra que você leva a decisão a sério.\n\nO que eu posso te garantir é: independente de quanto cobram, comigo você tem ${diferenciais}. E isso não é promessa, é prática.\n\nQuer ver meu trabalho de perto pra sentir a diferença?`,
      `Que bom que você está comparando! É o melhor caminho.\n\nSó um ponto pra ajudar na sua análise: pergunte pra cada profissional o que está incluso além do serviço básico.\n\nComigo, você tem ${diferenciais}. Eu diria que isso já coloca meu trabalho em outro patamar.\n\nQuer que eu monte uma comparação do que cada opção oferece?`,
      `Comparar é inteligente. Fique à vontade!\n\nEnquanto avalia, quero que saiba: muita gente me escolheu exatamente depois de comparar. Porque viram que meu diferencial não está no preço, mas em ${diferenciais}.\n\nNo fim, o barato pode custar mais caro. Me chama quando quiser fechar!`,
    ],

    "/semdinheiro": [
      `Sem problema, entendo o momento.\n\nPosso te oferecer condições de pagamento facilitadas ou reservar sua data para mais à frente.\n\nAssim você garante o serviço sem apertar agora.\n\nQual opção funciona melhor pra você?`,
      `Compreendo totalmente, esses momentos acontecem.\n\nPodemos fazer o seguinte: início o serviço e você paga parcelado, ou reservamos uma data futura.\n\nO que te deixa mais tranquilo(a)?`,
      `Relaxa, acontece. A boa notícia é que tenho opções pra isso.\n\nPodemos:\n- Parcelar em até 6x no cartão\n- Iniciar agora e pagar depois\n- Reservar a data pra quando estiver melhor\n\nQual se encaixa melhor no seu momento?`,
      `Sem problema nenhum! A vida tem desses momentos.\n\nPosso te ajudar de duas formas:\n1. Fazemos um sinal agora e o resto depois\n2. Já deixo reservado pra quando estiver melhor\n\nO importante é você não perder a oportunidade por causa do momento. O que acha?`,
      `Entendo perfeitamente, e não se preocupe.\n\nPodemos começar com uma entrada pequena e o restante você paga conforme combinamos. Assim você não fica sobrecarregado agora e já garante o serviço.\n\nQuer ver os detalhes dessa opção?`,
    ],

    // ── OBJEÇÕES: TEMPO/PRIORIDADE ────────────────────────────
    "/semtempo": [
      `Entendo que você está corrido(a). Quem não está, né?\n\nJustamente por isso meu serviço foi pensado pra quem valoriza o tempo. Com ${diferenciais}, você não perde tempo com retrabalho ou acompanhamento burocrático.\n\nMe conta: qual o melhor horário pra gente alinhar isso rapidinho?`,
      `Sei como é, a rotina não para.\n\nPor isso que ter um(a) ${profissao} de confiança faz diferença — você resolve de uma vez, sem dor de cabeça.\n\nQue tal a gente marcar um momento rápido pra eu te explicar como posso simplificar isso pra você?`,
      `Tempo é dinheiro, e eu respeito o seu.\n\nPor isso meu trabalho é focado em ${diferenciais}: resultado certo na primeira vez, sem enrolação.\n\nSe você me der 5 minutinhos, já consigo te mostrar o essencial. Pode ser agora?`,
      `Correria todo mundo tem, eu inclusive!\n\nMas pensa comigo: quanto tempo você já perdeu tentando resolver isso sozinho(a)? Comigo você resolve de forma rápida e profissional, sem estresse.\n\nVamos marcar um horário que funcione pra você?`,
      `Olha, eu entendo — a vida não para.\n\nE é exatamente por isso que faz sentido você investir em quem resolve de verdade. Com ${diferenciais}, você ganha tempo, qualidade e tranquilidade.\n\nMe diz um horário que encaixa pra você que eu me adapto.`,
    ],

    "/depois": [
      `Tudo bem, sem pressa! Mas me conta uma coisa: o que te faz deixar pra depois? É falta de tempo, dúvida ou algo específico?\n\nMuitas vezes a gente adia porque falta uma informação que eu posso te dar agora rapidinho.\n\nO que acha?`,
      `Claro, eu entendo. Mas sabe o que acontece? Quando a gente deixa pra depois, acaba esquecendo ou perdendo a oportunidade.\n\nSe for algo rápido, resolvemos agora em 2 minutos. O que te parece?`,
      `Sem problema! Só não quero que você perca a chance de resolver isso.\n\nEnquanto você pensa, deixo aqui meu contato e um resumo do que conversamos. Quando tiver um tempinho, é só me chamar.\n\nPosso dar um toque semana que vem pra gente retomar?`,
      `Imagina, fique à vontade! Mas me permite ser sincero(a)?\n\nÀs vezes a gente adia por achar que vai ter um 'momento melhor', e esse momento nunca chega. Se for algo que você realmente precisa, por que não resolver agora e tirar isso da lista?\n\nO que você acha?`,
      `Entendo perfeitamente. Só não quero que você esqueça, porque sei que a rotina é corrida.\n\nVou te mandar um resumo aqui no chat pra você ler quando tiver um tempo. Aí você me responde quando quiser, sem compromisso.\n\nPode ser?`,
    ],

    "/naoagora": [
      `Entendo que no momento não é prioridade.\n\nSó quero que saiba: quando você estiver pronto(a) pra resolver isso, estou aqui. E quando decidir, me avisa que te atendo com a mesma atenção de sempre.\n\nPosso deixar seu contato na minha lista pra quando eu tiver uma novidade?`,
      `Tudo bem, cada um sabe seu momento.\n\nMas me conta: o que precisaria mudar pra isso virar prioridade? Muitas vezes a gente só precisa de um empurrãozinho ou de ver o problema de outro ângulo.\n\nO que acha?`,
      `Sem problema, respeito seu tempo.\n\nSó um lembrete: deixar pra depois pode acabar saindo mais caro — seja porque a agenda lota, seja porque o problema pode se agravar.\n\nGuarda meu contato e quando quiser, é só me chamar. Combinado?`,
      `Olha, eu entendo que você tem outras prioridades agora. Respeito totalmente.\n\nMas se puder me responder só uma coisa: esse serviço vai precisar ser feito em algum momento, certo? Se sim, por que não resolver agora e tirar da lista de pendências?\n\nSe não for o momento, sem problema — só queria te provocar a pensar. 😊`,
      `Tudo bem, sem pressa. Cada um no seu tempo.\n\nVou deixar meu contato salvo aqui e se surgir uma oportunidade ou condição especial no futuro, posso te avisar? Assim você não perde a chance quando estiver pronto(a).`,
    ],

    "/rapidinho": [
      `Entendo que você quer algo prático e sem complicação.\n\nTenho opções mais enxutas que entregam resultado sem perder a qualidade. O legal é que mesmo no formato rápido, você ainda tem ${diferenciais}.\n\nMe conta o que você precisa exatamente que eu monto a opção mais simples pra você.`,
      `Claro! Adoro quando o cliente é objetivo.\n\nPara algo mais rápido, posso oferecer uma versão simplificada do serviço, focada no essencial. Fica mais em conta e mais ágil.\n\nQuer que eu te explique como funciona?`,
      `Rápido e simples é comigo mesmo!\n\nTenho um formato que resolve o principal sem burocracia. É a opção ideal pra quem quer resultado sem perder tempo.\n\nQuer saber mais detalhes sobre essa versão?`,
      `Perfeito, vou ser direto(a) igual!\n\nPara algo rápido, sugiro um pacote focado no que é essencial pra você. A qualidade se mantém, mas o escopo é mais enxuto — e o preço também.\n\nMe diz o que não pode faltar que eu monto exatamente sob medida.`,
      `Gosto de clientes objetivos! Vou ser igual.\n\nMinha versão express é perfeita pra você: resolvemos o principal, sem firula, com a mesma qualidade de sempre. Menos tempo, menos custo, mesmo cuidado.\n\nVamos nessa?`,
    ],

    // ── OBJEÇÕES: FINANCEIRO ──────────────────────────────────
    "/sinal": [
      `Entendo seu questionamento. Peço um sinal justamente pra garantir seu compromisso e o meu.\n\nAssim eu reservo sua data, bloqueio o material e foco 100% em fazer o melhor trabalho pra você. É a garantia de que os dois estão alinhados.\n\nO valor é pequeno perto do resultado que você vai ter. Que tal?`,
      `Compreendo sua preocupação. O sinal funciona como uma reserva — ele garante que sua vaga está guardada e que ambos estamos comprometidos.\n\nÉ uma prática comum e justa. Depois do serviço, você vê que valeu a pena.\n\nPosso te passar os detalhes de como funciona?`,
      `Olha, super entendo. Mas pensa pelo outro lado: se eu não pedisse sinal, qualquer pessoa poderia desmarcar em cima da hora, e eu ficaria com o prejuízo.\n\nO sinal é a garantia de que seu horário está realmente reservado pra você. É pequeno perto do valor total.\n\nPodemos combinar um valor simbólico pra começar?`,
      `É uma dúvida justa. Vou te explicar:\n\nO sinal serve pra garantir sua data e também mostra que você está comprometido(a) com o serviço. Assim eu preparo tudo com antecedência e dedico o melhor do meu trabalho pra você.\n\nÉ rápido, simples e dá segurança pros dois lados.\n\nVamos fechar com um sinal mínimo?`,
      `Sei que pagar adiantado pode gerar desconfiança, e respeito isso.\n\nMas quero que entenda: o sinal é o que me permite organizar sua agenda, separar os materiais e me preparar pra te entregar o melhor resultado possível.\n\nÉ uma questão de organização, não de desconfiança. Que tal começarmos com um valor bem acessível?`,
    ],

    // ── OBJEÇÕES: CONCORRÊNCIA/CONFIANÇA ──────────────────────
    "/tenhoutro": [
      `Que bom que você já tem um(a) ${profissao} de confiança! Isso é raro hoje em dia.\n\nSe um dia precisar de uma segunda opinião ou de alguém pra complementar o trabalho, estou aqui.\n\nPosso deixar meu contato com você? Assim fica registrado.`,
      `Fico feliz que você já tem alguém! Profissional de confiança é tesouro.\n\nMas se em algum momento precisar de mais alguém — seja pra uma demanda extra, segunda opinião ou urgência — pode me chamar sem medo.\n\nGuarda meu contato aí, combinado?`,
      `Que ótimo! Isso mostra que você valoriza um bom trabalho.\n\nSe no futuro você sentir que precisa de algo diferente ou complementar, estou à disposição.\n\nPosso te enviar um resumo do que faço pra você ter de referência?`,
      `Legal! Ter mais de uma opção nunca é demais, né?\n\nSe um dia seu(sua) profissional não puder atender ou se você quiser experimentar um trabalho novo, pode contar comigo.\n\nVou deixar meu cartão aqui — sem compromisso, só pra você ter.`,
      `Entendo e respeito! Cada um tem sua preferência.\n\nSó uma curiosidade: o que você mais valoriza no profissional que você já tem? Se um dia sentir que falta algo, me chama que posso ser uma alternativa.\n\nCombinado?`,
    ],

    "/naoconfio": [
      `Sinto muito que você teve uma experiência ruim. Infelizmente isso é mais comum do que deveria.\n\nQuero te mostrar como meu trabalho é diferente: prezo por ${diferenciais} acima de tudo. Transparência, qualidade e respeito são inegociáveis pra mim.\n\nQue tal a gente começar com algo pequeno pra você sentir a diferença?`,
      `Lamento que isso tenha acontecido. Experiência ruim marca a gente.\n\nO que posso fazer é te mostrar, na prática, como trabalho: com ${diferenciais}, comunicação clara e compromisso com o resultado.\n\nSe quiser, podemos começar com um serviço teste, sem compromisso grande. Assim você vê como é diferente.`,
      `Compreendo totalmente. Uma vez que a confiança é quebrada, fica difícil.\n\nO que posso te oferecer é transparência total desde o início: te mostro o passo a passo, o que está incluso, o que pode acontecer. Nada escondido.\n\nO que você precisaria ver pra se sentir confortável em confiar?`,
      `É totalmente compreensível. Infelizmente tem profissionais que não levam o trabalho a sério.\n\nMeu compromisso é ser diferente: ${diferenciais}. E não é só promessa — posso te mostrar provas, depoimentos e até conversar com clientes que já atendi.\n\nO que te deixaria mais seguro(a) pra dar uma chance?`,
      `Sinto muito por isso. Uma experiência ruim abala a confiança.\n\nMas não deixe que uma maçã podre estrague sua visão de todos os profissionais. Meu trabalho é construído em cima de ${diferenciais}. Cada cliente é tratado com o respeito que você merece.\n\nQue tal a gente marcar um bate-papo rápido pra você me conhecer melhor?`,
    ],

    "/concorrencia": [
      `Entendo que o preço é um fator importante.\n\nMas me permite perguntar: você comparou o que está incluso no pacote dele(a) com o que eu ofereço? Muitas vezes o barato sai caro quando a gente olha os detalhes.\n\nComigo você tem ${diferenciais}. Quer que eu mostre ponto a ponto a diferença?`,
      `Sei que o mercado tem opções mais baratas, e respeito sua pesquisa.\n\nSó quero que você considere: o que está por trás do preço mais baixo? Será que tem a mesma qualidade, o mesmo cuidado, a mesma garantia?\n\nMeu valor é justo pelo que entrego: ${diferenciais}. Quer entender melhor?`,
      `Olha, preço menor existe mesmo. Mas em serviço de ${profissao}, cada um cobra de acordo com o que entrega.\n\nO que eu entrego é: ${diferenciais}. E isso inclui suporte, qualidade e resultado que realmente funciona.\n\nQuer que eu detalhe o que faz meu trabalho valer cada centavo?`,
      `Você tem razão, pode ter opções mais baratas.\n\nMas deixa eu te perguntar: se fosse só sobre o menor preço, você já teria fechado com ele(a), certo? O fato de estar conversando comigo mostra que você busca algo mais.\n\nEsse 'algo mais' é ${diferenciais}. Vamos conversar sobre o que realmente importa?`,
      `Sei que o preço pesa na decisão.\n\nO que posso te dizer é que meu trabalho não compete em preço — compete em valor. Você não leva só o serviço, leva ${diferenciais}. E isso faz diferença no resultado final.\n\nSe no fim você achar que vale mais a pena, vou respeitar sua decisão. Mas me deixa pelo menos te mostrar o que está incluso?`,
    ],

    "/provas": [
      `Claro! Adoro quando o cliente quer ver resultados.\n\nTenho alguns cases e depoimentos de clientes que atendi recentemente. O feedback que mais ouço é sobre ${diferenciais}.\n\nPosso te enviar alguns exemplos pra você ver com seus próprios olhos?`,
      `Perfeito, isso é super justo!\n\nVou te mandar alguns trabalhos que fiz e depoimentos de clientes satisfeitos. Acho que isso fala mais do que qualquer palavra minha.\n\nMe dá um minuto que já te envio.`,
      `Ótimo! Prova social é o melhor argumento.\n\nTenho resultados recentes de clientes que estavam com a mesma necessidade que você. Todos destacam ${diferenciais} como o principal motivo pra terem me escolhido.\n\nQuer ver por categoria ou prefere ver os mais recentes?`,
      `Com certeza! Nada melhor que resultados de verdade.\n\nVou te enviar:\n📸 Fotos/reels de trabalhos recentes\n💬 Depoimentos de clientes\n📊 Resultados que entreguei\n\nAssim você vê na prática como é meu trabalho. Te envio agora?`,
      `Apoio total! Quem mostra o que faz não tem nada a esconder.\n\nVou te mandar um portfólio rápido com alguns dos meus melhores trabalhos e o que os clientes falaram. Tenho certeza que você vai gostar do que vê.\n\nMe dá 2 minutinhos que já compilo pra você.`,
    ],

    "/caso_especial": [
      `Entendo que você sente que seu caso é diferente.\n\nE de certa forma, todo cliente é único mesmo! Por isso meu atendimento é personalizado — eu adapto o serviço pra realidade de cada um.\n\nMe conta: o que torna seu caso tão especial? Assim já penso na melhor abordagem pra você.`,
      `Olha, cada cliente tem suas particularidades, e eu respeito isso.\n\nJá atendi casos bem diversos, e o que aprendi é que com ${diferenciais} a gente consegue resolver até situações mais complexas.\n\nMe explica melhor seu caso que vou te mostrar como posso ajudar.`,
      `Pode me contar mais! Já vi de tudo nessa área.\n\nNa maioria das vezes, o que parece um 'caso especial' é algo que já resolvi antes de forma personalizada.\n\nMe fala os detalhes que eu te mostro como funciona na prática.`,
      `Legal! Casos diferentes são os que mais me motivam.\n\nJustamente por isso meu trabalho se baseia em ${diferenciais} — porque cada situação pede uma solução sob medida.\n\nMe explica direitinho qual é a sua situação que eu monto a melhor estratégia pra você.`,
      `Entendo que você acha que seu caso foge do padrão.\n\nSinceramente? A maioria dos clientes pensa isso no começo. E no final, todos se surpreendem como a gente conseguiu resolver de forma simples e profissional.\n\nVamos conversar? Me conta seu caso sem filtro que vou ser bem honesto(a) com você.`,
    ],

    // ── OBJEÇÕES: DECISÃO/BUROCRACIA ──────────────────────────
    "/chefe": [
      `Faz sentido, decisões importantes precisam ser alinhadas com a equipe.\n\nPosso preparar um resumo profissional bem organizado pra você apresentar pra ele(a)? Assim fica fácil mostrar os benefícios e o retorno do investimento.\n\nTe envio por aqui mesmo?`,
      `Claro! Parceiros precisam estar alinhados.\n\nVou montar uma apresentação rápida com os pontos principais: o que está incluso, valores, diferenciais e por que faz sentido agora.\n\nVocê prefere receber em PDF ou por texto mesmo?`,
      `Sem problema! Decisão em conjunto é sempre melhor.\n\nQuer que eu destaque algum ponto específico pra facilitar essa conversa? Sei que cada gestor se preocupa com coisas diferentes — pra alguns é custo, pra outros é resultado.\n\nMe fala o que seu/sua sócio(a) mais valoriza que eu preparo o material.`,
      `Entendo! Se quiser, posso até participar de uma call rápida com vocês dois pra explicar os detalhes. Às vezes ouvir direto de quem executa ajuda na decisão.\n\nO que acha?`,
      `Justo! Negócio compartilhado, decisão compartilhada.\n\nVou te preparar um resumo executivo bem direto: benefícios, prazos, investimento e retorno. Coisa de 1 página. Assim você apresenta, tira as dúvidas na hora e já me traz a resposta.\n\nVou preparar?`,
    ],

    "/garantia": [
      `Excelente pergunta! Garantia é sinal de profissionalismo.\n\nMinha garantia está na qualidade que entrego: ${diferenciais}. Se algo não sair como combinado, me responsabilizo e ajusto sem custo adicional.\n\nIsso responde sua preocupação ou quer mais detalhes?`,
      `Adoro quando o cliente pergunta sobre garantia! Mostra que leva a sério.\n\nMeu compromisso é com o resultado. Se você não ficar satisfeito(a), a gente resolve — sem burocracia, sem custo extra. Isso pra mim é o mínimo.\n\nQuer que eu formalize isso por escrito no contrato?`,
      `Garantia é um direito seu, e fico feliz que perguntou.\n\nO que te garanto é: vou usar toda minha experiência e dedicação pra entregar ${diferenciais}. Se algo não ficar como esperado, ajusto até ficar certo.\n\nIsso te deixa mais tranquilo(a) pra seguir?`,
      `Sua preocupação é válida! Vou ser transparente com você.\n\nO que garanto é: qualidade no serviço, cumprimento de prazos e suporte total. Se houver qualquer problema da minha parte, assumo a responsabilidade.\n\nPosso incluir cláusulas claras no contrato pra você se sentir seguro. Que tal?`,
      `Olha, a melhor garantia que posso te dar é meu histórico e minha reputação.\n\nMas além disso, trabalhamos com contrato claro que especifica prazos, entregas e o que acontece se algo não sair como planejado. Isso protege você e também a mim.\n\nÉ um acordo justo pros dois lados. Quer que eu explique como funciona?`,
    ],

    "/autorizacao": [
      `Entendo! Decisões compartilhadas são importantes.\n\nQuanto tempo você precisa pra conseguir essa autorização? Assim já programo sua vaga e não perco a oportunidade.\n\nPosso te enviar um resumo pra facilitar seu pedido de autorização?`,
      `Sem problema! Mas pra não perder o timing, posso ir separando sua vaga na agenda enquanto você consegue a autorização?\n\nAssim que tiver o ok, já fechamos. O que acha?`,
      `Claro, faz sentido! Enquanto isso, posso te mandar os detalhes por escrito pra você apresentar e justificar o investimento.\n\nMuitas vezes ter tudo documentado ajuda na hora de conseguir a aprovação.\n\nTe envio?`,
      `Entendo. Enquanto você aguarda a autorização, deixo aqui uma sugestão:\n\nJá separa a documentação ou informações que vou precisar pra quando o ok sair. Assim que tiver a luz verde, a gente dispara sem atraso.\n\nCombinado?`,
      `Beleza, processo é processo. Respeito isso.\n\nSó me avisa: tem previsão de quando sai essa autorização? Para eu não deixar sua vaga escapar e também organizar minha agenda.\n\nAssim que tiver o sinal verde, é só me chamar que fechamos rapidinho.`,
    ],

    // ── OBJEÇÕES: PÓS-CONTATO ────────────────────────────────
    "/silencio": [
      `Oi ${pnome}! Tudo bem?\n\nVi que você leu minha mensagem e fiquei na dúvida se ficou alguma pendência. Se precisar de mais informações ou se tiver qualquer dúvida, pode falar sem medo.\n\nEstou aqui pra te ajudar no que precisar.`,
      `Olá ${pnome}! Não quero ser invasivo(a), mas percebi que você viu a mensagem e não respondeu.\n\nSe não for o momento, tudo bem! Mas se tiver alguma dúvida ou se algo não ficou claro, me fala que eu explico direitinho.\n\nCombinado?`,
      `Ei ${pnome}, tudo certo?\n\nSó passando pra saber se você teve chance de pensar sobre o que conversamos.\n\nSe rolou alguma dúvida ou se mudou de ideia, sem problema — só me avisa pra eu não ficar no achismo. 😊`,
      `Oi ${pnome}! Vim aqui numa boa.\n\nSei que às vezes a gente lê e acaba deixando pra responder depois. Faz parte! Só queria saber se ainda tem interesse ou se prefere que eu deixe quieto.\n\nMe dá um toque aí, por favor.`,
      `Fala ${pnome}! Tudo bem?\n\nVou ser sincero(a): percebi o vácuo e fiquei na dúvida se é desinteresse ou se foi só correria do dia a dia.\n\nSe não for mais o momento, é só falar que eu super entendo. Mas se ainda tiver interesse, bora retomar!`,
    ],

    "/cancelar": [
      `Olha, entendo sua decisão e respeito totalmente.\n\nSe puder me contar o motivo, fico agradecido(a) — isso me ajuda a melhorar. E se um dia quiser voltar, minha porta estará sempre aberta.\n\nFoi um prazer ter conversado com você.`,
      `Entendo que você queira cancelar. Posso saber o motivo?\n\nSe for algo relacionado ao serviço, preço ou prazo, talvez a gente possa ajustar e chegar num acordo que funcione melhor pra você.\n\nVale tentarmos?`,
      `Sem problema! Seu cancelamento é respeitado.\n\nSó queria entender se tem algo que eu poderia ter feito diferente. Seu feedback é muito valioso pra mim.\n\nE como disse, se mudar de ideia, estarei aqui.`,
      `Claro, você tem todo direito de cancelar.\n\nAntes de finalizarmos, me conta: foi algo no atendimento, no valor ou mudou o plano mesmo? Sua opinião me ajuda a crescer.\n\nIndependente da resposta, desejo tudo de bom pra você.`,
      `Ok, entendo sua decisão.\n\nVou processar o cancelamento. Se for o caso de reembolso, me avisa que te explico o procedimento.\n\nE se no futuro precisar de ${profissao} novamente, estou à disposição. Combinado?`,
    ],

    "/reclamacao": [
      `Lamento muito que você não ficou satisfeito(a). Essa não é a experiência que quero que meus clientes tenham.\n\nPode me contar exatamente o que aconteceu? Quero entender pra poder resolver da melhor forma possível.\n\nMeu compromisso é com ${diferenciais}, e vou fazer o que estiver ao meu alcance pra corrigir isso.`,
      `Sinto muito pelo ocorrido. Obrigado por me avisar.\n\nMe explica os detalhes do que não saiu como esperado que vou resolver pessoalmente. Cada cliente é importante e quero deixar tudo certo pra você.\n\nPode contar comigo pra arrumar.`,
      `Lamento que não atendi suas expectativas. Isso me incomoda de verdade.\n\nMe conta o que aconteceu em detalhes. Quero entender se foi uma falha minha, de comunicação ou de execução.\n\nAssim que entender, já vou propor uma solução. Pode confiar.`,
      `Olha, sinto muito. Não é assim que quero que meus clientes se sintam.\n\nVou ser sincero(a): às vezes algo sai fora do combinado e o importante é como a gente resolve. Pode me explicar o que houve que vou me dedicar a resolver.\n\nPode ser agora?`,
      `Obrigado por ser honesto(a) comigo. Reclamações construtivas me ajudam a melhorar.\n\nVou ouvir tudo que você tem a dizer e, se for algo que posso corrigir, vou corrigir imediatamente. Seu feedback é essencial pra eu continuar entregando ${diferenciais}.\n\nPode me contar?`,
    ],

    // ── OBJEÇÕES: OUTRAS ──────────────────────────────────────
    "/distancia": [
      `Entendo que a distância é um desafio. Mas deixa eu te mostrar como podemos contornar isso.\n\nTenho clientes que vieram de longe e acharam que valeu cada minuto de deslocamento por causa do resultado e de ${diferenciais}.\n\nSe preferir, também posso atender online. Qual opção funciona melhor?`,
      `Sei que nem todo mundo tem disponibilidade pra se deslocar.\n\nPensando nisso, ofereço também atendimento online/remoto na maioria dos casos. A qualidade é a mesma, e você não precisa sair de casa.\n\nVocê prefere online ou existe um horário que dê pra vir até mim?`,
      `Compreendo que a distância pesa.\n\nSó um pensamento: se o resultado for realmente bom e resolver seu problema de vez, vale a pena o deslocamento, não acha? Muitos clientes meus pensaram igual e depois disseram que valeu muito.\n\nQuer que eu te explique como funciona pra você avaliar?`,
      `Olha, distância é relativa quando o resultado compensa.\n\nJá atendi clientes que vieram de bairros bem distantes porque simplesmente não encontraram quem entregasse o mesmo nível de ${diferenciais} perto deles.\n\nMe diz onde você está que vejo a melhor logística pra gente.`,
      `Entendo que é longe. Duas opções pra você:\n\n1. Marcamos um horário especial e você vem — garanto que vale o deslocamento\n2. Faço atendimento online/remoto se for viável pro seu caso\n\nQual delas se encaixa melhor pra você?`,
    ],

    "/naoentendi": [
      `Claro, vou explicar de forma mais simples!\n\nBasicamente, meu trabalho como ${profissao} é oferecer ${servicos}. E a diferença é que entrego ${diferenciais}.\n\nO que exatamente ficou confuso? Posso detalhar melhor.`,
      `Sem problema! Vou tentar explicar de outro jeito.\n\nImagine que você precisa de ${servicos}. Eu cuido de tudo, do início ao fim, com ${diferenciais}. O resultado é algo feito com cuidado e profissionalismo.\n\nMe diz o que não ficou claro que eu explico de novo.`,
      `Desculpa, vou ser mais claro(a)!\n\nMeu trabalho é sobre ${servicos}. O que faz diferença é que eu entrego ${diferenciais}. Isso significa mais qualidade e menos preocupação pra você.\n\nFicou melhor agora ou quer que eu detalhe ainda mais?`,
      `Relaxa, vou simplificar:\n\nVocê precisa de ${servicos}. Eu faço isso da melhor forma possível porque meu foco é ${diferenciais}. Resultado: você paga uma vez e fica bem feito.\n\nQue parte ainda ficou confusa?`,
      `Claro, vou ser mais direto(a)!\n\nOfereço ${servicos} com ${diferenciais}. Na prática: você me contrata, eu resolvo, e você fica satisfeito(a) com o resultado.\n\nQuer que eu detalhe como funciona o processo passo a passo?`,
    ],

    "/modalidade": [
      `Entendo que você prefere uma modalidade diferente.\n\nMe conta qual formato você tem em mente. Posso adaptar meu serviço pra funcionar da melhor forma pra você.\n\nO importante é resolver seu problema, independente do formato.`,
      `Sem problema! Tenho flexibilidade pra ajustar a modalidade.\n\nMe fala qual formato você prefere e vou ver como encaixo meu trabalho dentro dessa estrutura.\n\nQual seria sua preferência?`,
      `Olha, meu método padrão funciona bem, mas entendo que cada cliente tem sua preferência.\n\nSe você tem uma ideia de como gostaria que fosse, me conta. Posso adaptar mantendo a mesma qualidade e ${diferenciais}.\n\nO que você tem em mente?`,
      `Pode me explicar melhor qual formato você prefere?\n\nJá trabalhei de várias maneiras diferentes e consigo me adaptar. O mais importante é que o resultado final atenda suas expectativas.\n\no que funciona melhor pra você?`,
      `Claro, meu serviço pode ser adaptado!\n\nMe conta como você prefere: presencial, online, por etapas, pacote fechado... Posso ajustar sem perder a qualidade e mantendo ${diferenciais}.\n\nQual modelo te atrai mais?`,
    ],

    "/reuniao": [
      `Claro! Reunião é uma ótima forma de alinhar expectativas.\n\nPodemos marcar uma call rápida de 15-20 minutos pra conversar sobre suas necessidades e eu te mostrar como posso ajudar.\n\nQual dia e horário funciona melhor pra você?`,
      `Com certeza! Nada melhor que uma conversa pra tirar dúvidas.\n\nPodemos fazer uma videochamada ou até mesmo presencial, se preferir. É rápido, só pra eu entender melhor o que você precisa.\n\nQual sua preferência?`,
      `Ótima ideia! Uma reunião rápida já resolve tudo.\n\nVou separar 20 minutos na minha agenda. Nela vou te explicar o processo, mostrar resultados e tirar todas as suas dúvidas.\n\nMe passa um dia e horário que encaixa pra você.`,
      `Perfeito! Gosto de clientes que querem conversar antes.\n\nPodemos marcar um café rápido (presencial ou virtual) pra gente se conhecer e eu te mostrar como posso ajudar com ${servicos}.\n\nVocê prefere presencial ou online?`,
      `Claro, reunião é o melhor caminho!\n\nVou preparar uma apresentação rápida com os pontos principais. Em 20 minutos a gente alinha tudo e você sai com todas as informações pra decidir.\n\nPode ser essa semana? Qual melhor dia pra você?`,
    ],

    // ── FOLLOW-UP ─────────────────────────────────────────────
    "/fup1": [
      `Oi ${pnome}, tudo bem?\n\nPassando pra saber se ficou alguma dúvida sobre a proposta que te enviei.\n\nEstou à disposição pra te ajudar a decidir. 😊`,
      `Olá ${pnome}! Como vai?\n\nSó passando pra saber se conseguiu dar uma olhada na proposta.\n\nQualquer dúvida, pode me perguntar.`,
      `E aí ${pnome}, tudo certo?\n\nVim saber se você teve chance de pensar sobre o que conversamos.\n\nTô aqui se precisar de ajuda pra decidir!`,
    ],

    "/fup3": [
      `Olá ${pnome}!\n\nSó retomando nossa conversa sobre ${servicos}.\n\nConsegui pensar em uma forma de deixar ainda melhor pra você.\n\nQuer que eu te conte?`,
      `Oi ${pnome}! Lembra de mim?\n\nEstava revisando aqui e pensei numa solução que pode encaixar ainda melhor no que você precisa.\n\nTem uns minutinhos pra eu te explicar?`,
    ],

    "/fup7": [
      `Oi ${pnome}, tudo certo?\n\nFaz alguns dias que conversamos e não quero que você perca a oportunidade.\n\nMinha agenda está preenchendo, mas ainda consigo te encaixar.\n\nQuer seguir em frente?`,
      `Olá ${pnome}! Como está?\n\nPercebi que faz uma semana que não nos falamos e resolvi dar um toque.\n\nSe ainda tiver interesse, posso reservar um horário pra você.`,
    ],

    "/fup15": [
      `Olá ${pnome}!\n\nFaz um tempinho que falamos sobre ${servicos}.\n\nSe ainda fizer sentido pra você, tenho uma condição especial pra retomarmos.\n\nPosso te enviar?`,
      `Oi ${pnome}! Sei que já faz um tempinho.\n\nMas como gosto de manter contato, resolvi perguntar: ainda está precisando de ${servicos}?\n\nSe sim, bora retomar!`,
    ],

    // ── FECHAMENTO ────────────────────────────────────────────
    "/fechar": [
      `Então vamos fechar!\n\nPara confirmar, eu só preciso reservar sua data/vaga e seguir com os próximos passos.\n\nPosso te enviar agora as instruções para garantirmos tudo certinho?`,
      `Fechado!\n\nPara confirmar, preciso de:\n• Seus dados para cadastro\n• Confirmação da data\n\nJá te envio os próximos passos.`,
      `Perfeito, vamos nessa!\n\nMe confirma os dados abaixo que já disparo os preparativos:\n\n• Nome completo\n• Data desejada\n• Melhor jeito de falar com você`,
    ],

    "/reserva": [
      `Perfeito! Para reservar sua data, faço o seguinte:\n\nBloqueio o horário na minha agenda assim que confirmarmos.\n\nPara garantir, normalmente trabalho com uma pequena reserva/sinal.\n\nQuer que eu já te envie os dados para confirmar?`,
      `Show! Posso já deixar sua data reservada.\n\nGeralmente peço um sinal pra garantir a reserva — nada complexo, só pra assegurar o compromisso.\n\nQuer seguir com isso?`,
    ],

    "/contrato": [
      `Maravilha! Para deixar tudo transparente e seguro, vou te enviar o contrato com todos os detalhes combinados.\n\nÉ rápido de assinar (dá pra fazer pelo celular).\n\nTe envio agora?`,
      `Ótimo! Vou preparar o contrato com os termos que conversamos.\n\nAssim que enviar, é só dar uma olhada e confirmar.\n\nPode ser digital mesmo — sem burocracia.`,
    ],

    "/pagamento": [
      `Show! Para concluir, seguem as formas de pagamento:\n\nPIX, cartão ou transferência.\n\nAssim que confirmar, já reservo tudo e seguimos com os próximos passos.\n\nPosso te enviar a chave PIX?`,
      `Perfeito! Para finalizar:\n\n💳 Cartão (parcelado)\n📱 PIX\n🏦 Transferência\n\nQual prefere? Já te envio os dados para pagamento e partimos pro próximo passo!`,
    ],

    // ── URGÊNCIA ──────────────────────────────────────────────
    "/urgencia": [
      `Só um aviso importante:\n\nMinha agenda para esse período está preenchendo rápido.\n\nPara garantir seu atendimento com calma e qualidade, o ideal é confirmarmos logo.\n\nQuer que eu segure sua vaga?`,
      `Olha, não quero pressionar mas minha agenda está quase cheia.\n\nSe você quer garantir, o ideal é confirmar nos próximos dias.\n\nDevo ter vaga ainda essa semana — quer garantir a sua?`,
    ],

    "/agenda": [
      `Oi ${pnome}!\n\nMinha agenda está fechando para as próximas semanas.\n\nSe quiser garantir sua data, esse é o melhor momento pra confirmarmos.\n\nPosso reservar pra você?`,
      `Só te avisando: meus horários estão bem disputados essa temporada.\n\nSe tiver uma data em mente, melhor garantirmos logo.\n\nQual dia você prefere?`,
    ],

    "/ultimasvagas": [
      `Atenção: estou com as últimas vagas disponíveis para esse período!\n\nTrabalho com um número limitado de clientes para manter a qualidade.\n\nQuer garantir a sua antes que feche?`,
      `Só mais um lembrete: estou praticamente lotado(a).\n\nTenho poucas vagas ainda. Quando fechar, só no próximo ciclo.\n\nQuer aproveitar enquanto tem?`,
    ],

    // ── PÓS-VENDA ─────────────────────────────────────────────
    "/agradecimento": [
      `Muito obrigado pela confiança, ${pnome}! 🙏\n\nFoi um prazer trabalhar com você.\n\nQualquer coisa que precisar, é só me chamar. Estou sempre por aqui.`,
      `${pnome}, muito obrigado! 🙌\n\nFico feliz que deu tudo certo. Foi um prazer te atender.\n\nSe surgir algo ou precisar de ajuda, estou à disposição!`,
    ],

    "/avaliacao": [
      `Oi ${pnome}, tudo bem?\n\nEspero que tenha gostado do resultado!\n\nSua opinião vale muito pra mim. Você poderia deixar uma avaliação rápida?\n\nLeva só um minutinho e me ajuda demais. 😊`,
      `Olá ${pnome}! 🥰\n\nQue bom que deu tudo certo! Se você gostou do resultado, ficaria muito grato(a) se pudesse deixar uma avaliação.\n\nAjuda outros clientes a confiarem no meu trabalho também.`,
    ],

    "/indicacao": [
      `${pnome}, fico muito feliz que tenha gostado!\n\nSe conhecer alguém que precise de ${profissao}, sua indicação é o maior presente.\n\nPode passar meu contato à vontade. Cuido de cada cliente com o mesmo carinho!`,
      `${pnome}, que bom que deu certo!\n\nAh, se souber de alguém que precise de ${profissao}, pode me indicar sem medo!\n\nSua confiança é o melhor cartão de visitas.`,
    ],
  };
}

export function gerarFallback(data: FormData): Mensagem[] {
  const variacoes = buildVariations(data);

  return CATALOGO.map((spec) => {
    const textos = variacoes[spec.atalho];
    const mensagem = textos
      ? pickOne(textos)
      : `${spec.titulo} para ${data.profissao || "profissional"}.`;

    return {
      categoria: spec.categoria as Categoria,
      titulo: spec.titulo,
      atalho: spec.atalho,
      mensagem,
    };
  });
}