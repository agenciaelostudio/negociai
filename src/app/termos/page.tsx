import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Termos de Serviço — NegociAí",
  description:
    "Termos e condições de uso do NegociAí. Leia antes de contratar.",
};

export default function TermosPage() {
  return (
    <main className="min-h-screen bg-background py-16">
      <div className="container max-w-3xl">
        <Link
          href="/"
          className="mb-8 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          Voltar para o NegociAí
        </Link>

        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Termos de Serviço
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Última atualização: junho de 2026
        </p>

        <div className="prose prose-sm max-w-none space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground">
              1. Aceitação dos termos
            </h2>
            <p>
              Ao utilizar o NegociAí ("Serviço"), você concorda com estes
              Termos de Serviço. Se não concordar, não utilize o Serviço. O
              NegociAí é operado pela{" "}
              <strong>Elo Studio Marketing Digital</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">
              2. Descrição do serviço
            </h2>
            <p>
              O NegociAí é uma plataforma que gera um sistema personalizado de
              mensagens para WhatsApp Business, incluindo scripts de
              apresentação, quebra de objeções, follow-up, fechamento e
              pós-venda, utilizando inteligência artificial (Groq/OpenAI) e
              conteúdo pré-definido.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">
              3. Pagamento e acesso
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                O acesso ao sistema é liberado mediante pagamento único do valor
                indicado na página de vendas.
              </li>
              <li>
                O pagamento é processado exclusivamente pelo Asaas (PIX ou
                cartão de crédito).
              </li>
              <li>
                Após a confirmação do pagamento, o acesso é liberado
                imediatamente.
              </li>
              <li>
                O valor pago dá direito ao uso vitalício do material gerado na
                ocasião. O serviço de geração pode ser acessado novamente
                enquanto a plataforma estiver operacional.
              </li>
              <li>
                Não oferecemos reembolso após a geração do conteúdo
                personalizado, dado que o produto é digital e feito sob medida.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">
              4. Uso do conteúdo gerado
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                O conteúdo gerado é de uso pessoal e intransferível do
                comprador.
              </li>
              <li>
                É permitido editar, adaptar e personalizar as mensagens para uso
                no seu negócio.
              </li>
              <li>
                Não é permitido revender, redistribuir ou publicar o conteúdo
                gerado como se fosse de sua autoria para terceiros.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">
              5. Limitação de responsabilidade
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                O NegociAí fornece modelos e sugestões de mensagens. Os
                resultados de vendas dependem de fatores como atendimento,
                nicho de mercado, qualidade do produto/serviço e esforço do
                usuário.
              </li>
              <li>
                Não garantimos resultados específicos de vendas ou conversão.
              </li>
              <li>
                A plataforma é fornecida "no estado em que se encontra", sem
                garantias de disponibilidade ininterrupta ou livre de erros.
              </li>
              <li>
                Em nenhum caso a Elo Studio Marketing Digital será
                responsabilizada por danos indiretos ou lucros cessantes.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">
              6. Propriedade intelectual
            </h2>
            <p>
              O nome "NegociAí", a identidade visual, o código da plataforma e
              o conteúdo institucional são propriedade da Elo Studio Marketing
              Digital. O conteúdo gerado para o usuário (mensagens
              personalizadas) é de uso licenciado ao comprador conforme a
              seção 4.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">
              7. Cancelamento e reembolso
            </h2>
            <p>
              Por se tratar de um produto digital personalizado gerado
              instantaneamente, não realizamos reembolsos após a geração do
              conteúdo. Caso haja problemas técnicos que impeçam o acesso,
              entre em contato para resolução.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">
              8. Disposições gerais
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                Estes termos são regidos pela legislação brasileira.
              </li>
              <li>
                Qualquer disputa será resolvida no foro da comarca de São
                Paulo — SP.
              </li>
              <li>
                Reservamo-nos o direito de modificar estes termos a qualquer
                momento, com comunicação prévia aos usuários.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">
              9. Contato
            </h2>
            <p>
              Dúvidas sobre estes termos podem ser enviadas para:
              <br />
              <strong>agenciaelostudio@gmail.com</strong>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
