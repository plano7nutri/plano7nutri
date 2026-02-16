import { Mail, Clock } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-gradient-to-br from-[#4CAF50] to-[#2E7D32] text-zinc-100 pt-16 pb-8 px-6 border-t border-white/10">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Coluna 1: Logo e Sobre */}
          <div className="space-y-4">
            <div className="text-2xl font-bold tracking-tight text-white">
              Plano <span className="text-white/80">7</span>
            </div>
            <p className="text-zinc-200/80 leading-relaxed text-sm max-w-xs font-medium">
              Sua jornada nutricional simplificada. Calculamos seu metabolismo e entregamos um plano real para 7 dias, direto no seu bolso.
            </p>
          </div>

          {/* Coluna 2: Links Úteis */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-lg">Links Úteis</h4>
            <ul className="space-y-2 text-sm font-medium">
              <li>
                <a href="#" className="text-zinc-200/70 hover:text-white transition-colors duration-200">Política de Privacidade</a>
              </li>
              <li>
                <a href="#" className="text-zinc-200/70 hover:text-white transition-colors duration-200">Termos de Uso</a>
              </li>
              <li>
                <a href="#" className="text-zinc-200/70 hover:text-white transition-colors duration-200">FAQ - Perguntas Frequentes</a>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Fale Conosco */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-lg">Fale Conosco</h4>
            <div className="space-y-3">
              <a 
                href="mailto:contato_nutriia@inventiia.com.br" 
                className="flex items-center gap-3 text-zinc-200/70 hover:text-white transition-colors duration-200 group"
              >
                <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/15 transition-all">
                  <Mail size={18} />
                </div>
                <span className="text-sm font-medium">contato_nutriia@inventiia.com.br</span>
              </a>
              
              <div className="flex items-center gap-3 text-zinc-200/70">
                <div className="p-2 rounded-full bg-white/5">
                  <Clock size={18} />
                </div>
                <p className="text-sm font-medium leading-tight">
                  Atendimento 24 horas por dia,<br /> 7 dias por semana.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Linha Inferior e Copyright */}
        <div className="pt-8 border-t border-white/10 text-center">
          <p className="text-xs font-medium text-zinc-200/40 tracking-wider uppercase">
            &copy; 2025 Plano 7. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;