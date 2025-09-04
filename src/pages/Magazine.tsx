import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { DigitalMagazine } from "@/components/DigitalMagazine";
import { Navigation } from "@/components/Navigation";
import { toast } from "sonner";

const Magazine = () => {
  const { encodedContent } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!encodedContent) {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    try {
      // Decodificar o conteúdo da revista
      const decodedContent = atob(encodedContent);
      const content = JSON.parse(decodedContent);

      // Salvar no localStorage para que o DigitalMagazine possa acessar
      localStorage.setItem("magazineContent", JSON.stringify(content));
      
      // Disparar evento para sincronizar
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'magazineContent',
        newValue: JSON.stringify(content),
        storageArea: localStorage
      }));

      setIsLoading(false);
      toast.success("Revista carregada com sucesso!");
    } catch (error) {
      console.error("Erro ao decodificar revista:", error);
      setHasError(true);
      setIsLoading(false);
      toast.error("Erro ao carregar revista compartilhada");
    }
  }, [encodedContent]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-white text-xl">Carregando revista...</div>
      </div>
    );
  }

  if (hasError) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen relative">
      <Navigation />
      <DigitalMagazine />
    </div>
  );
};

export default Magazine;