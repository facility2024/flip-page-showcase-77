import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface AddPageModalProps {
  onAddPage: (imageUrl: string) => void;
  onClose: () => void;
}

export const AddPageModal = ({ onAddPage, onClose }: AddPageModalProps) => {
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imageUrl.trim()) {
      toast.error("Por favor, insira um link válido");
      return;
    }

    // Basic URL validation
    try {
      new URL(imageUrl);
    } catch {
      toast.error("URL inválida. Por favor, insira um link válido");
      return;
    }

    setIsLoading(true);
    
    // Test if image loads
    const img = new Image();
    img.onload = () => {
      onAddPage(imageUrl);
      toast.success("Página adicionada com sucesso!");
      setImageUrl("");
      setIsLoading(false);
      onClose();
    };
    
    img.onerror = () => {
      toast.error("Erro ao carregar a imagem. Verifique o link");
      setIsLoading(false);
    };
    
    img.src = imageUrl;
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-60 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4">Adicionar Nova Página</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="imageUrl">Link da Imagem</Label>
            <Input
              id="imageUrl"
              type="url"
              placeholder="https://exemplo.com/imagem.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="mt-1"
            />
            <p className="text-sm text-gray-500 mt-1">
              Cole o link direto da imagem (JPG, PNG, etc.)
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? "Carregando..." : "Adicionar Página"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};