import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Política de Privacidade — NegociAí",
  description:
    "Política de privacidade do NegociAí. Saiba como tratamos seus dados pessoais.",
};

export default function PoliticaPrivacidade() {
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
          Política de Privacidade
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Última atualização: junho de 2026
        </p>

        <div className="prose prose-sm max-w-none space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground">
              1. Quem somos
            </h2>
            <p>
              O NegociAí é um serviço digital oferecido pela{" "}
              <strong>Elo Studio Marketing Digital</strong>. Esta Política de
              Privacidade explica como coletamos, usamos, armazenamos e
              protegemos seus dados pessoais ao utilizar nossa plataforma em{" "}
              <Link href="https://negociai-blue.vercel.app" className="text-primary underline">
                negociai-blue.vercel.app
              </Link>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">
              2. Dados que coletamos
            </h2>
            <p>Podemos coletar as seguintes informações:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Dados de cadastro:</strong> nome, e-mail, profissão,
                serviços, faixa de preço, diferenciais e objeções informados no
                formulário.
              </li>
              <li>
                <strong>Dados de pagamento:</strong> processados exclusivamente
                pelo Asaas (PIX, cartão de crédito). Nós não armazenamos dados
                de cartão ou chaves PIX.
              </li>
              <li>
                <strong>Dados de navegação:</strong> páginas acessadas, tempo de
                uso, interações com a plataforma.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">
              3. Como usamos seus dados
            </h2>
            <p>Utilizamos seus dados para:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Gerar o sistema personalizado de mensagens para WhatsApp</li>
              <li>Salvar seu perfil para futuras consultas</li>
              <li>Processar pagamentos via Asaas</li>
              <li>Melhorar nossos serviços e recomendações</li>
              <li>Enviar comunicações relacionadas ao serviço</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">
              4. Compartilhamento de dados
            </h2>
            <p>
              Não vendemos seus dados pessoais para terceiros. Compartilhamos
              apenas com:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Asaas:</strong> processamento de pagamentos (PIX e
                cartão)
              </li>
              <li>
                <strong>Supabase:</strong> armazenamento e autenticação de dados
              </li>
              <li>
                <strong>Groq / OpenAI:</strong> geração das mensagens
                personalizadas por IA (sem transferência de dados pessoais
                identificáveis para treinamento)
              </li>
              <li>
                <strong>Vercel:</strong> hospedagem da plataforma
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">
              5. Seus direitos (LGPD)
            </h2>
            <p>
              Com base na Lei Geral de Proteção de Dados (LGPD), você tem
              direito a:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Solicitar a confirmação da existência de tratamento</li>
              <li>Acessar seus dados pessoais</li>
              <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
              <li>Solicitar a anonimização, bloqueio ou eliminação</li>
              <li>Revogar o consentimento a qualquer momento</li>
              <li>Solicitar a portabilidade dos dados</li>
            </ul>
            <p className="mt-3">
              Para exercer seus direitos, entre em contato pelo e-mail{" "}
              <strong>agenciaelostudio@gmail.com</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">
              6. Segurança
            </h2>
            <p>
              Adotamos medidas técnicas e organizacionais para proteger seus
              dados contra acesso não autorizado, alteração, divulgação ou
              destruição, incluindo criptografia em trânsito (HTTPS/SSL) e
              armazenamento seguro em servidores com controle de acesso restrito.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">
              7. Cookies
            </h2>
            <p>
              Utilizamos cookies essenciais para o funcionamento da plataforma
              (autenticação e sessão) e cookies de análise para melhorar a
              experiência. Você pode gerenciar as preferências de cookies nas
              configurações do seu navegador.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">
              8. Alterações nesta política
            </h2>
            <p>
              Esta política pode ser atualizada periodicamente. Notificaremos
              alterações significativas por e-mail ou aviso na plataforma. O uso
              continuado do serviço após alterações constitui aceitação das
              novas condições.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">
              9. Contato
            </h2>
            <p>
              Para questões sobre esta política ou sobre o tratamento de seus
              dados, entre em contato:
            </p>
            <p>
              E-mail: <strong>agenciaelostudio@gmail.com</strong>
              <br />
              Responsável: Elo Studio Marketing Digital
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
