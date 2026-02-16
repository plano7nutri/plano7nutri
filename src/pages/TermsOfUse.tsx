import LegalLayout from "@/components/LegalLayout";
import { Info } from "lucide-react";

const TermsOfUse = () => {
  const today = new Date().toLocaleDateString('pt-BR');

  return (
    <LegalLayout 
      title="Termos de Uso" 
      version="v1.1" 
      lastUpdate={today}
    >
      <div className="space-y-8 text-foreground/90 leading-relaxed">
        
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl mb-8">
          <div className="flex items-start gap-3 text-blue-800">
            <Info className="w-6 h-6 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-lg mb-2 uppercase">Definição da Ferramenta</h3>
              <p className="text-sm font-medium leading-relaxed">
                O Plano 7 é uma <strong>plataforma de organização tecnológica</strong> desenvolvida para oferecer sugestões de cardápios e cálculos nutricionais. Como facilitador digital, recomendamos que as informações aqui geradas sejam acompanhadas por profissionais de saúde qualificados para uma melhor adaptação às suas necessidades individuais.
              </p>
            </div>
          </div>
        </div>

        <section>
          <h2 className="text-xl font-bold mb-4">1. NATUREZA DO SERVIÇO</h2>
          <p className="font-bold mb-4">
            O PLANO 7 É UM SOFTWARE DE APOIO À ORGANIZAÇÃO ALIMENTAR. ESTA FERRAMENTA ATUA COMO UM AUXILIAR NO PLANEJAMENTO DE REFEIÇÕES.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>A plataforma funciona através de algoritmos matemáticos baseados nas informações fornecidas.</li>
            <li>O Plano 7 não atua como instituição de saúde, instituto médico ou consultoria clínica.</li>
            <li>Nossa proposta é oferecer praticidade e organização para o seu dia a dia nutricional.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">2. RESPONSABILIDADE E USO CONSCIENTE</h2>
          <p className="mb-4">Ao utilizar o Plano 7, o usuário compreende que:</p>
          <ul className="list-disc pl-5 space-y-3">
            <li>A ferramenta fornece sugestões baseadas em dados estatísticos e padrões nutricionais gerais.</li>
            <li>Pessoas com condições específicas (como gestantes ou portadores de patologias) devem buscar orientação profissional para validar se as sugestões automáticas são compatíveis com seu quadro clínico atual.</li>
            <li>O Plano 7 não realiza diagnósticos médicos ou prescrições terapêuticas.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">3. LIMITAÇÃO DE RESPONSABILIDADE</h2>
          <p className="mb-4">
            A plataforma trabalha para oferecer dados precisos, mas os resultados podem variar de acordo com o metabolismo individual e o rigor na execução das sugestões.
          </p>
          <p>
            Não nos responsabilizamos pelo uso inadequado das informações ou pela omissão de dados de saúde relevantes durante o cadastro que possam impactar os cálculos gerados.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">4. ELEGIBILIDADE</h2>
          <p>
            O serviço destina-se a indivíduos com 18 anos ou mais. O uso do Plano 7 é pessoal e visa facilitar a rotina alimentar do usuário cadastrado através de tecnologia e inteligência de dados.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">5. PROPRIEDADE INTELECTUAL</h2>
          <p>
            Os algoritmos, design e marca Plano 7 são propriedades tecnológicas protegidas. O acesso à ferramenta concede ao usuário o direito de uso pessoal das sugestões geradas pelo sistema.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">6. LEI APLICÁVEL</h2>
          <p>
            Estes termos seguem a legislação brasileira, elegendo o foro da comarca de São Paulo/SP para dirimir eventuais questões sobre o uso da tecnologia.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">7. ACEITAÇÃO</h2>
          <p className="font-bold text-primary">
            AO ACESSAR O PLANO 7, VOCÊ CONCORDA COM ESTA ESTRUTURA DE USO E RECONHECE A NATUREZA TECNOLÓGICA DA FERRAMENTA.
          </p>
        </section>
      </div>
    </LegalLayout>
  );
};

export default TermsOfUse;