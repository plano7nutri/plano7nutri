import LegalLayout from "@/components/LegalLayout";

const PrivacyPolicy = () => {
  const today = new Date().toLocaleDateString('pt-BR');

  return (
    <LegalLayout 
      title="Política de Privacidade" 
      version="v1.0" 
      lastUpdate={today}
    >
      <div className="space-y-8 text-foreground/90 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold mb-4">1. COLETA E TRATAMENTO DE DADOS</h2>
          <p className="mb-4">
            O Plano 7, em conformidade com a Lei Geral de Proteção de Dados (Lei 13.709/2018 - LGPD), coleta informações necessárias para a prestação de seus serviços de sugestão nutricional.
          </p>
          <div className="bg-muted/50 p-4 rounded-xl space-y-2 mb-4">
            <p><strong>Dados coletados:</strong> Nome completo, número de WhatsApp, idade, sexo biológico, peso, altura, nível de atividade física, objetivos nutricionais, restrições alimentares e preferências pessoais.</p>
            <p><strong>Finalidade:</strong> Realização de cálculos metabólicos (TMB e GET), personalização do plano de 7 dias e envio das informações via WhatsApp.</p>
            <p><strong>Base Legal:</strong> Execução de contrato ou de procedimentos preliminares a pedido do titular (Art. 7º, V da LGPD).</p>
          </div>
          <p className="font-bold text-primary underline">
            NÃO COMPARTILHAMOS SEUS DADOS PESSOAIS COM TERCEIROS PARA FINS COMERCIAIS OU PUBLICITÁRIOS.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">2. ARMAZENAMENTO E SEGURANÇA</h2>
          <p className="mb-4">
            Seus dados são armazenados em servidores de alta segurança providos pelo Supabase (infraestrutura AWS), localizados em data centers globais com os mais rigorosos padrões de proteção.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Utilizamos criptografia SSL/TLS para todo o tráfego de dados.</li>
            <li>Implementamos Row Level Security (RLS) no banco de dados para garantir que apenas o sistema acesse suas informações.</li>
            <li>Os dados são retidos enquanto a conta estiver ativa. Após 24 meses de inatividade completa, os dados pessoais identificáveis são automaticamente anonimizados ou excluídos.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">3. DIREITOS DO TITULAR (LGPD)</h2>
          <p className="mb-4">Como titular dos dados, você possui os seguintes direitos garantidos pela legislação brasileira:</p>
          <ul className="list-decimal pl-5 space-y-2">
            <li><strong>Acesso e Confirmação:</strong> Saber se tratamos seus dados e quais são eles.</li>
            <li><strong>Correção:</strong> Solicitar alteração de dados incompletos ou inexatos.</li>
            <li><strong>Exclusão:</strong> Direito ao esquecimento, solicitando a remoção de seus dados de nossa base.</li>
            <li><strong>Portabilidade:</strong> Receber seus dados em formato estruturado.</li>
            <li><strong>Revogação do Consentimento:</strong> Quando aplicável, retirar sua autorização de uso.</li>
          </ul>
          <p className="mt-4">Para exercer qualquer um destes direitos, entre em contato com nosso DPO pelo e-mail: <strong>contato_nutriia@inventiia.com.br</strong>.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">4. COOKIES E TECNOLOGIAS</h2>
          <p>
            Utilizamos apenas cookies estritamente necessários para o funcionamento técnico da plataforma (sessão e segurança). Não utilizamos cookies de rastreamento de terceiros para fins de marketing sem seu consentimento explícito.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">5. COMPARTILHAMENTO DE DADOS</h2>
          <p className="mb-4">
            Reforçamos que <strong>não vendemos ou alugamos seus dados</strong>. O compartilhamento ocorre apenas nas seguintes exceções:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Cumprimento de ordem judicial ou obrigação legal.</li>
            <li>Prevenção de fraudes e proteção de segurança da plataforma.</li>
            <li>Uso de processadores de infraestrutura necessários para a entrega do serviço (ex: Supabase, API de WhatsApp), sendo compartilhado apenas o mínimo necessário.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">6. CLÁUSULA DE SEVERABILIDADE</h2>
          <p>
            Caso qualquer disposição desta Política de Privacidade seja considerada inválida, ilegal ou inexequível por qualquer autoridade competente, tal invalidade não afetará as demais disposições, que permanecerão em pleno vigor.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">7. CONTATO</h2>
          <p>
            Qualquer dúvida sobre esta política deve ser direcionada ao nosso Encarregado de Dados (DPO) através do e-mail: <strong>contato_nutriia@inventiia.com.br</strong>.
          </p>
        </section>
      </div>
    </LegalLayout>
  );
};

export default PrivacyPolicy;