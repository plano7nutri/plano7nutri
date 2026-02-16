import LegalLayout from "@/components/LegalLayout";
import { AlertTriangle } from "lucide-react";

const TermsOfUse = () => {
  const today = new Date().toLocaleDateString('pt-BR');

  return (
    <LegalLayout 
      title="Termos de Uso" 
      version="v1.0" 
      lastUpdate={today}
    >
      <div className="space-y-8 text-foreground/90 leading-relaxed">
        
        <div className="bg-orange-50 border border-orange-200 p-6 rounded-2xl mb-8">
          <div className="flex items-start gap-3 text-orange-800">
            <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-lg mb-2 uppercase">Aviso de Isenção de Responsabilidade Médica</h3>
              <p className="text-sm font-medium leading-relaxed">
                <strong>IMPORTANTE:</strong> O Plano 7 não é um serviço de saúde. É uma ferramenta tecnológica de sugestão alimentar. 
                <strong> NUNCA</strong> substitua orientações médicas ou nutricionais profissionais pelo conteúdo gerado por esta ferramenta. 
                Sempre consulte profissionais qualificados antes de iniciar qualquer mudança em sua dieta.
              </p>
            </div>
          </div>
        </div>

        <section>
          <h2 className="text-xl font-bold mb-4">1. NATUREZA DO SERVIÇO</h2>
          <p className="font-extrabold uppercase mb-4 text-primary">
            O PLANO 7 É UMA FERRAMENTA TECNOLÓGICA DE SUGESTÃO ALIMENTAR E CÁLCULO METABÓLICO. NÃO É UM SERVIÇO MÉDICO, NUTRICIONAL OU DE SAÚDE.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Não substitui consultas com médicos ou nutricionistas.</li>
            <li>Não somos responsáveis por diagnósticos, tratamentos ou curas de qualquer condição de saúde.</li>
            <li>As informações geradas baseiam-se em fórmulas matemáticas padrão e dados inseridos pelo próprio usuário.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">2. ISENÇÃO DE RESPONSABILIDADE MÉDICA</h2>
          <p className="mb-4">Ao utilizar o Plano 7, você declara estar ciente e concordar que:</p>
          <ul className="list-disc pl-5 space-y-3">
            <li>Nenhuma relação médico-paciente ou nutricionista-paciente é estabelecida entre as partes.</li>
            <li><strong>O uso é terminantemente desaconselhado</strong>, sem supervisão médica direta, para: gestantes, lactantes, menores de 18 anos, diabéticos, hipertensos, pessoas com transtornos alimentares, doenças renais ou qualquer condição crônica pré-existente.</li>
            <li>O Plano 7 não se responsabiliza por reações alérgicas, intolerâncias, intoxicações ou quaisquer danos diretos ou indiretos à saúde decorrentes do seguimento das sugestões apresentadas.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">3. LIMITAÇÃO DE RESPONSABILIDADE</h2>
          <p className="mb-4">
            O uso desta plataforma ocorre por sua conta e risco exclusivos. O Plano 7 não garante resultados específicos de perda de peso, ganho muscular ou performance física.
          </p>
          <p>
            Nossa responsabilidade máxima, sob qualquer pretexto, limita-se ao valor eventualmente pago pelo serviço nos últimos 12 meses. Excluímos qualquer responsabilidade por danos indiretos, lucros cessantes ou danos punitivos.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">4. ELEGIBILIDADE E USO</h2>
          <p>
            O serviço destina-se apenas a indivíduos com 18 anos ou mais, em pleno gozo de sua capacidade civil. O uso é estritamente pessoal e intransferível, sendo proibida a revenda ou uso comercial dos planos gerados.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">5. PROPRIEDADE INTELECTUAL</h2>
          <p>
            Todo o conteúdo, algoritmos, design e marca "Plano 7" são de propriedade exclusiva. É proibida a cópia, reprodução ou distribuição do conteúdo sem autorização prévia por escrito.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">6. LEI APLICÁVEL E FORO</h2>
          <p>
            Estes termos são regidos pelas leis da República Federativa do Brasil. Para a resolução de quaisquer conflitos, as partes elegem o foro da comarca de São Paulo/SP, com exclusão de qualquer outro.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">7. CONSENTIMENTO</h2>
          <p className="font-bold">
            AO UTILIZAR O PLANO 7, VOCÊ DECLARA QUE LEU, COMPREENDEU E ACEITA INTEGRALMENTE ESTES TERMOS DE USO E A NOSSA POLÍTICA DE PRIVACIDADE.
          </p>
        </section>
      </div>
    </LegalLayout>
  );
};

export default TermsOfUse;