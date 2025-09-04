import { DigitalMagazine } from "@/components/DigitalMagazine";

// * ESTA É A PÁGINA HOME PRINCIPAL DA WEB *
// * AQUI A REVISTA É VISUALIZADA PELOS USUÁRIOS *
// * SEM BOTÃO DE EDITOR - APENAS VISUALIZAÇÃO *
const Index = () => {
  return (
    <div className="min-h-screen">
      <DigitalMagazine />
    </div>
  );
};

export default Index;
