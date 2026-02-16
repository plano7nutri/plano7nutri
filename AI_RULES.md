# AI Development Rules - Plano 7

Este documento define a stack tecnológica e as regras de implementação para este projeto.

## Tech Stack

- **Framework:** React 18 com Vite (TypeScript).
- **Estilização:** Tailwind CSS para todo o design visual.
- **Componentes UI:** shadcn/ui (baseado em Radix UI).
- **Animações:** Framer Motion para transições de estado e micro-interações.
- **Ícones:** Lucide React.
- **Roteamento:** React Router DOM v6.
- **Gerenciamento de Estado/Dados:** TanStack Query (React Query) para operações assíncronas.
- **Formulários:** React Hook Form com validação Zod.
- **Notificações:** Sonner para toasts e alertas.

## Regras de Desenvolvimento

### 1. Estilização e Design
- Use **apenas** classes do Tailwind CSS. Evite CSS puro ou Inline Styles.
- Utilize a função utilitária `cn()` (em `@/lib/utils`) para combinar classes condicionalmente.
- Siga o sistema de design definido no `tailwind.config.ts` (cores `primary`, `secondary`, `accent`, etc).

### 2. Componentes
- Novos componentes devem ser criados na pasta `src/components/`.
- Componentes de UI base (botões, inputs, etc.) devem ser consumidos de `src/components/ui/`.
- Mantenha os componentes pequenos (idealmente < 100 linhas). Refatore se crescerem demais.
- Use `Lucide React` para todos os ícones.

### 3. Estado e Dados
- Use `useState` para estados locais simples.
- Use `TanStack Query` para qualquer busca de dados ou operações que envolvam latência/servidor.
- Mantenha a lógica de negócio separada da UI sempre que possível (hooks customizados).

### 4. Navegação
- Todas as rotas devem ser definidas no `src/App.tsx`.
- Use o componente `NavLink` customizado para links de navegação que precisam de estado ativo.

### 5. Animações
- Use `Framer Motion` para entradas de página, transições de wizard e feedbacks visuais.
- Prefira animações suaves e baseadas em `AnimatePresence` para trocas de componentes.

### 6. Boas Práticas
- Sempre use TypeScript com tipagem rigorosa.
- Não utilize blocos `try/catch` genéricos; deixe os erros subirem para serem tratados globalmente ou pela UI de erro.
- Mantenha o código em Português (Brasil) para a interface do usuário, mas código (variáveis, funções) em Inglês.