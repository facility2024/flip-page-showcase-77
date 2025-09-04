import { MagazineEditor } from "@/components/MagazineEditor";

// * PÁGINA DO EDITOR - PARA CRIAR E EDITAR REVISTAS *
// * SOMENTE ACESSÍVEL VIA /editor, /edit, /admin, /settings *
// * AQUI O ADMIN CRIA E GERENCIA O CONTEÚDO *
const Editor = () => {
  return (
    <div className="min-h-screen">
      <MagazineEditor />
    </div>
  );
};

export default Editor;