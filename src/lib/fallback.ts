import { CATALOGO } from "./catalog";
import type { Categoria, FormData, Mensagem } from "./types";

/**
 * Gerador local de mensagens.
 * Usado quando não há OPENAI_API_KEY configurada ou quando a IA falha.
 * Produz um sistema de negociação completo e personalizado a partir dos dados do formulário.
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

export function gerarFallback(data: FormData): Mensagem[] {
  const nome = ouFallback(data.nome, "Meu trabalho");
  const pnome = primeiroNome(nome) || "Olá";
  const profissao = ouFallback(data.profissao, "profissional");
  const servicos = ouFallback(data.servicos, "meus serviços");
  const preco = ouFallback(data.preco, "valores acessíveis e justos");
  const diferenciais = ouFallback(
    data.diferenciais,
    "qualidade, compromisso e atenção total ao cliente",
  );

  const textos: Record<string, string> = {
    "/apresentacao": `Olá! Aqui é ${nome}.

Trabalho com ${profissao} e ajudo clientes como você com ${servicos}.

Meu foco é entregar um resultado profissional, com ${diferenciais}.

Me conta rapidamente o que você precisa que eu te explico exatamente como posso ajudar.`,

    "/boasvindas": `Seja muito bem-vindo(a)! 

Que bom ter você por aqui.

Sou ${nome}, especialista em ${profissao}.

Me diz: o que você está buscando? Assim já te oriento da melhor forma.`,

    "/diferencial": `Ótima pergunta!

O que me diferencia é: ${diferenciais}.

Na prática, isso significa mais segurança, qualidade e tranquilidade para você do início ao fim.

Quer que eu te mostre como isso se aplica ao seu caso?`,

    "/porquemim": `Existem várias opções no mercado, e eu respeito isso.

A diferença do meu trabalho está em ${diferenciais}.

Não entrego só o serviço: entrego experiência, acompanhamento e resultado.

Posso te explicar exatamente o que está incluso?`,

    "/valores": `Sobre os valores:

Trabalho na faixa de ${preco}, e o investimento varia conforme o que você precisa.

Isso inclui ${diferenciais}, do começo ao fim.

Me passa um pouco mais do que você quer que eu monto a melhor opção pra você.`,

    "/pacotes": `Tenho opções pensadas para diferentes necessidades e orçamentos.

Todas incluem o padrão de qualidade que me diferencia: ${diferenciais}.

Me diz o que é prioridade pra você que eu indico o pacote ideal.`,

    "/info": `Perfeito! Para te passar a melhor proposta, preciso de algumas informações:

1. O que exatamente você precisa?
2. Para quando seria?
3. Tem alguma preferência ou detalhe importante?

Com isso já consigo te dar um retorno certeiro.`,

    "/agendar": `Vamos agendar então!

Me confirma por favor:

• Data desejada
• Horário
• Local / detalhes

Assim que tiver isso, já reservo na minha agenda pra você.`,

    "/formaspagamento": `Sobre o pagamento, facilito pra você:

Aceito PIX, cartão e transferência.

Também consigo parcelar conforme combinarmos.

Quer que eu já te envie os dados para confirmar?`,

    "/caro": `Entendo perfeitamente.

Além da prestação do serviço, meu trabalho inclui ${diferenciais}.

O objetivo é garantir que você tenha o melhor resultado possível, sem preocupações e sem retrabalho.

Posso te explicar exatamente o que está incluso para você comparar de forma justa?`,

    "/desconto": `Entendo o seu lado e quero te ajudar.

Meus valores já são pensados para entregar o máximo de qualidade pelo justo.

O que posso fazer é ajustar o pacote ou as condições de pagamento para caber no seu momento.

Quer que eu monte uma opção sob medida pra você?`,

    "/pensar": `Claro, é uma decisão importante e faz todo sentido pensar com calma.

Só me diz: ficou alguma dúvida específica que eu possa esclarecer agora?

Muitas vezes é um detalhe pequeno que faz a diferença na decisão.

Estou aqui pra te ajudar a escolher o melhor pra você.`,

    "/esposa": `Perfeito, decisões assim são melhores quando feitas em conjunto.

Posso te enviar um resumo organizado com tudo incluso pra facilitar essa conversa?

Assim vocês decidem com todas as informações na mão.`,

    "/pesquisar": `Faz total sentido pesquisar, eu faria o mesmo.

Só um conselho de quem trabalha com ${profissao}: compare não só o preço, mas o que está incluso.

No meu caso você tem ${diferenciais}.

Quando comparar, me chama que te ajudo a ver se vale a pena.`,

    "/orcamento": `Com prazer! Para montar seu orçamento certinho, me confirma:

• O que você precisa exatamente
• Data / prazo
• Detalhes importantes

Com isso eu te envio uma proposta personalizada na faixa de ${preco}.`,

    "/comparando": `Ótimo que está comparando, isso mostra cuidado com a decisão.

Na hora de comparar, olhe além do valor: experiência, segurança e o que está realmente incluso.

Comigo você tem ${diferenciais}.

Quer que eu detalhe ponto a ponto o que entrego?`,

    "/semdinheiro": `Sem problema, entendo o momento.

Posso te oferecer condições de pagamento facilitadas ou reservar sua data para mais à frente.

Assim você garante o serviço sem apertar agora.

Qual opção funciona melhor pra você?`,

    "/fup1": `Oi ${pnome}, tudo bem?

Passando pra saber se ficou alguma dúvida sobre a proposta que te enviei.

Estou à disposição pra te ajudar a decidir. 😊`,

    "/fup3": `Olá ${pnome}!

Só retomando nossa conversa sobre ${servicos}.

Consegui pensar em uma forma de deixar ainda melhor pra você.

Quer que eu te conte?`,

    "/fup7": `Oi ${pnome}, tudo certo?

Faz alguns dias que conversamos e não quero que você perca a oportunidade.

Minha agenda está preenchendo, mas ainda consigo te encaixar.

Quer seguir em frente?`,

    "/fup15": `Olá ${pnome}!

Faz um tempinho que falamos sobre ${servicos}.

Se ainda fizer sentido pra você, tenho uma condição especial pra retomarmos.

Posso te enviar?`,

    "/fechar": `Então vamos fechar! 🎯

Para confirmar, eu só preciso reservar sua data/vaga e seguir com os próximos passos.

Posso te enviar agora as instruções para garantirmos tudo certinho?`,

    "/reserva": `Perfeito! Para reservar sua data, faço o seguinte:

Bloqueio o horário na minha agenda assim que confirmarmos.

Para garantir, normalmente trabalho com uma pequena reserva/sinal.

Quer que eu já te envie os dados para confirmar?`,

    "/contrato": `Maravilha! Para deixar tudo transparente e seguro, vou te enviar o contrato com todos os detalhes combinados.

É rápido de assinar (dá pra fazer pelo celular).

Te envio agora?`,

    "/pagamento": `Show! Para concluir, seguem as formas de pagamento:

PIX, cartão ou transferência.

Assim que confirmar, já reservo tudo e seguimos com os próximos passos.

Posso te enviar a chave PIX?`,

    "/urgencia": `Só um aviso importante:

Minha agenda para esse período está preenchendo rápido.

Para garantir seu atendimento com calma e qualidade, o ideal é confirmarmos logo.

Quer que eu segure sua vaga?`,

    "/agenda": `Oi ${pnome}!

Minha agenda está fechando para as próximas semanas.

Se quiser garantir sua data, esse é o melhor momento pra confirmarmos.

Posso reservar pra você?`,

    "/ultimasvagas": `Atenção: estou com as últimas vagas disponíveis para esse período!

Trabalho com um número limitado de clientes para manter a qualidade.

Quer garantir a sua antes que feche?`,

    "/agradecimento": `Muito obrigado pela confiança, ${pnome}! 🙏

Foi um prazer trabalhar com você.

Qualquer coisa que precisar, é só me chamar. Estou sempre por aqui.`,

    "/avaliacao": `Oi ${pnome}, tudo bem?

Espero que tenha gostado do resultado!

Sua opinião vale muito pra mim. Você poderia deixar uma avaliação rápida?

Leva só um minutinho e me ajuda demais. 😊`,

    "/indicacao": `${pnome}, fico muito feliz que tenha gostado!

Se conhecer alguém que precise de ${profissao}, sua indicação é o maior presente.

Pode passar meu contato à vontade. Cuido de cada cliente com o mesmo carinho!`,
  };

  return CATALOGO.map((spec) => ({
    categoria: spec.categoria as Categoria,
    titulo: spec.titulo,
    atalho: spec.atalho,
    mensagem: textos[spec.atalho] ?? `${spec.titulo} para ${profissao}.`,
  }));
}
