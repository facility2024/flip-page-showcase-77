import { DigitalMagazine } from "@/components/DigitalMagazine";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Revista sempre na home - SEM botão do editor para o usuário */}
      <DigitalMagazine />
    </div>
  );
};

export default Index;
