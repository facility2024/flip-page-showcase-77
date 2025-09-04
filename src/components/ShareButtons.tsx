import { Button } from "@/components/ui/button";
import { Share2, MessageCircle, Mail, Instagram } from "lucide-react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

interface ShareButtonsProps {
  onClose: () => void;
}

export const ShareButtons = ({ onClose }: ShareButtonsProps) => {
  const isMobile = useIsMobile();
  const currentUrl = window.location.href;
  const shareText = "Confira esta revista digital incrível!";

  // Compartilhamento nativo no mobile
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Revista Digital",
          text: shareText,
          url: currentUrl,
        });
        toast.success("Compartilhado com sucesso!");
        onClose();
      } catch (error) {
        // Usuário cancelou ou erro
        if ((error as Error).name !== 'AbortError') {
          toast.error("Erro ao compartilhar");
        }
      }
    } else {
      // Fallback para copiar link
      copyLink();
    }
  };

  const shareToWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + " " + currentUrl)}`;
    window.open(whatsappUrl, '_blank');
    toast.success("Compartilhado no WhatsApp!");
    onClose();
  };

  const shareToEmail = () => {
    const emailUrl = `mailto:?subject=${encodeURIComponent("Revista Digital")}&body=${encodeURIComponent(shareText + " " + currentUrl)}`;
    window.open(emailUrl, '_blank');
    toast.success("Email criado!");
    onClose();
  };

  const shareToInstagram = () => {
    // Instagram doesn't support direct URL sharing, so we copy to clipboard
    navigator.clipboard.writeText(currentUrl).then(() => {
      toast.success("Link copiado! Cole no Instagram Stories ou Bio");
    });
    onClose();
  };

  const copyLink = () => {
    navigator.clipboard.writeText(currentUrl).then(() => {
      toast.success("Link copiado para área de transferência!");
    });
    onClose();
  };

  // Se é mobile e suporta Web Share API nativa, usar ela primeiro
  if (isMobile && navigator.share) {
    return (
      <div className="fixed inset-0 bg-black/80 z-60 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <h3 className="text-lg font-semibold mb-4 text-center">Compartilhar Revista</h3>
          
          <div className="space-y-3">
            <Button
              onClick={handleNativeShare}
              className="w-full flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Share2 className="h-5 w-5" />
              Compartilhar (Nativo)
            </Button>

            <div className="text-center text-gray-500 text-sm">ou escolha uma opção específica:</div>

            <Button
              onClick={shareToWhatsApp}
              className="w-full flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white"
            >
              <MessageCircle className="h-5 w-5" />
              WhatsApp
            </Button>

            <Button
              onClick={copyLink}
              variant="outline"
              className="w-full flex items-center gap-3"
            >
              <Share2 className="h-5 w-5" />
              Copiar Link
            </Button>
          </div>

          <Button
            variant="outline"
            onClick={onClose}
            className="mt-4 w-full"
          >
            Cancelar
          </Button>
        </div>
      </div>
    );
  }

  // Desktop ou mobile sem suporte a Web Share API
  return (
    <div className="fixed inset-0 bg-black/80 z-60 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4 text-center">Compartilhar Revista</h3>
        
        <div className="space-y-3">
          <Button
            onClick={shareToWhatsApp}
            className="w-full flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white"
          >
            <MessageCircle className="h-5 w-5" />
            WhatsApp
          </Button>

          <Button
            onClick={shareToEmail}
            className="w-full flex items-center gap-3 bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Mail className="h-5 w-5" />
            Email
          </Button>

          <Button
            onClick={shareToInstagram}
            className="w-full flex items-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            <Instagram className="h-5 w-5" />
            Instagram
          </Button>

          <Button
            onClick={copyLink}
            variant="outline"
            className="w-full flex items-center gap-3"
          >
            <Share2 className="h-5 w-5" />
            Copiar Link
          </Button>
        </div>

        <Button
          variant="outline"
          onClick={onClose}
          className="mt-4 w-full"
        >
          Cancelar
        </Button>
      </div>
    </div>
  );
};