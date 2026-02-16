import { Instagram, Facebook, Mail, Youtube } from "lucide-react";

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

          {/* Coluna 3: Redes Sociais e Contato */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-lg">Conecte-se</h4>
            <div className="flex items-center gap-4">
              <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-white transition-all duration-300">
                <Instagram size={20} />
              </a>
              <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-white transition-all duration-300">
                <Facebook size={20} />
              </a>
              <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-white transition-all duration-300">
                <Youtube size={20} />
              </a>
              <a href="mailto:contato@plano7.com.br" className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-white transition-all duration-300">
                <Mail size={20} />
              </a>
            </div>
            <p className="text-sm text-zinc-200/60 font-medium">contato@plano7.com.br</p>
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