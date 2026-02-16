import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Printer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LegalLayoutProps {
  title: string;
  version: string;
  lastUpdate: string;
  children: React.ReactNode;
}

const LegalLayout = ({ title, version, lastUpdate, children }: LegalLayoutProps) => {
  const navigate = useNavigate();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 no-print">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-medium"
          >
            <ArrowLeft size={18} /> Voltar
          </button>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/80 transition-colors font-semibold text-sm"
          >
            <Printer size={18} /> Imprimir Documento
          </button>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-8 sm:p-12 shadow-card border border-border"
        >
          <div className="mb-10 border-b border-border pb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">{title}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground font-medium">
              <span>Versão: {version}</span>
              <span className="hidden sm:inline">•</span>
              <span>Última atualização: {lastUpdate}</span>
            </div>
          </div>

          <div className="prose prose-zinc max-w-none legal-content">
            {children}
          </div>

          <div className="mt-12 pt-8 border-t border-border flex justify-center no-print">
            <button 
              onClick={() => navigate(-1)}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold shadow-glow hover:shadow-card-hover transition-all"
            >
              Li e compreendo os termos
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LegalLayout;