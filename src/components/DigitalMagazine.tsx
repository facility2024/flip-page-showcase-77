import { useRef, useState, useCallback, useEffect } from "react";
import HTMLFlipBook from "react-pageflip";
import { MagazinePage } from "./MagazinePage";
import { Navigation } from "./Navigation";
import { ShareButtons } from "./ShareButtons";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Volume2, Share2 } from "lucide-react";
import { toast } from "sonner";
import modelPage1 from "@/assets/model-page1.jpg";
import modelPage2 from "@/assets/model-page2.jpg";
import modelPage3 from "@/assets/model-page3.jpg";
import modelPage4 from "@/assets/model-page4.jpg";
import modelPage5 from "@/assets/model-page5.jpg";
import modelPage6 from "@/assets/model-page6.jpg";
import modelPage7 from "@/assets/model-page7.jpg";
import modelPage8 from "@/assets/model-page8.jpg";
import modelPage9 from "@/assets/model-page9.jpg";
import modelPage10 from "@/assets/model-page10.jpg";
import modelPage11 from "@/assets/model-page11.jpg";
import modelPage12 from "@/assets/model-page12.jpg";
import placeholderPage from "@/assets/placeholder-page.png";
import { useLocation } from "react-router-dom";

// Formato oficial da revista: 794x1123 (proporção exata)
const PAGE_WIDTH = 794;
const PAGE_HEIGHT = 1123;
const PAGE_RATIO = PAGE_WIDTH / PAGE_HEIGHT; // ≈ 0.707

export const DigitalMagazine = () => {
  const location = useLocation();
  const flipBookRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [customPages, setCustomPages] = useState<string[]>([]);

  // Default model pages (apenas se não há conteúdo do editor)
  const defaultPages = [
    modelPage1, modelPage2, modelPage3, modelPage4, 
    modelPage5, modelPage6, modelPage7, modelPage8, 
    modelPage9, modelPage10, modelPage11, modelPage12
  ];

  // Se há páginas customizadas do editor, usar apenas essas
  const hasEditorContent = customPages.length > 0;
  const totalPages = hasEditorContent ? customPages.length : defaultPages.length;
  
  // Verificar se deve mostrar engrenagem (APENAS na home "/" e editor "/editor")
  const isHomePage = location.pathname === "/";
  const isEditorPage = location.pathname === "/editor";
  const shouldShowNavigation = isHomePage || isEditorPage;

  const onPage = useCallback((e: any) => {
    setCurrentPage(e.data);
    
    // Tocar som de virar página se não estiver mutado
    if (!isMuted && audioRef.current) {
      try {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(error => {
          console.log("Erro ao reproduzir som:", error);
        });
      } catch (error) {
        console.log("Erro no áudio:", error);
      }
    }
  }, [isMuted]);

  const zoomIn = () => setZoom(prev => Math.min(prev + 0.2, 2));
  const zoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));
  const toggleSound = () => {
    setIsMuted(prev => !prev);
    toast(isMuted ? "Som ativado" : "Som desativado");
  };
  const toggleShare = () => setShowShare(prev => !prev);

  // SINCRONIZAÇÃO SIMPLIFICADA E 100% FUNCIONAL
  useEffect(() => {
    const loadContent = () => {
      const savedContent = localStorage.getItem("magazineContent");
      if (!savedContent) return;

      try {
        const content = JSON.parse(savedContent);
        const pages: string[] = [];

        console.log(`🚀 [REVISTA] Carregando ${content.pages?.length || 0} páginas...`);

        // Processar TODAS as páginas do editor
        content.pages?.forEach((page: any, index: number) => {
          if (page.pdfUrl?.trim()) {
            pages.push(page.pdfUrl);
            console.log(`✅ Página ${index + 1} adicionada:`, page.pdfUrl);
          } else if (page.images?.length > 0) {
            page.images.forEach((img: string) => {
              if (img?.trim()) pages.push(img);
            });
          } else {
            pages.push(placeholderPage);
          }
        });

        // Adicionar capa se existe
        if (content.coverUrl?.trim()) {
          pages.unshift(content.coverUrl);
        }

        setCustomPages([...pages]);
        if (pages.length > 0) {
          toast.success(`📚 ${pages.length} páginas carregadas!`);
        }
      } catch (error) {
        console.error("❌ Erro ao carregar revista:", error);
      }
    };

    // Carregar inicial
    loadContent();
    toast("Arraste o canto da página para virar");

    // Listener para sincronização em tempo real
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "magazineContent") {
        if (e.newValue) {
          loadContent();
        } else {
          setCustomPages([]);
          setCurrentPage(0);
        }
      }
    };

    // Listener para recarregamento forçado
    const handleForceReload = () => setTimeout(loadContent, 100);

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('magazineForceReload', handleForceReload);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('magazineForceReload', handleForceReload);
    };
  }, []);

  // Render all pages (editor content or default)
  const renderPages = () => {
    const allPages = hasEditorContent ? customPages : defaultPages;
    
    return allPages.map((pageImage, index) => (
      <MagazinePage key={index}>
        <div
          className="relative w-full h-full bg-white"
          style={{
            padding: "clamp(12px, 2.5vmin, 32px)",
            boxSizing: "border-box",
          }}
        >
          <img
            src={pageImage}
            alt={`Página ${index + 1} da Revista`}
            className="w-full h-full object-contain"
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
            loading="lazy"
            decoding="async"
            onError={(e) => {
              console.error("Erro ao carregar imagem:", pageImage);
              const target = e.currentTarget;
              const originalSrc = pageImage;
              
              // Se a URL parece truncada ou tem problemas
              if (originalSrc && (originalSrc.includes('%20') || originalSrc.includes('MODELO%20'))) {
                try {
                  const decodedUrl = decodeURIComponent(originalSrc);
                  console.log("Tentando URL decodificada:", decodedUrl);
                  target.src = decodedUrl;
                  return;
                } catch (decodeError) {
                  console.warn("Erro ao decodificar URL:", decodeError);
                }
              }
              
              // Fallback para placeholder
              target.src = placeholderPage;
              target.alt = `Erro ao carregar página ${index + 1}`;
            }}
          />
        </div>
      </MagazinePage>
    ));
  };

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden">
      {/* Navegação - APENAS se permitido */}
      {shouldShowNavigation && <Navigation />}
      
      {/* Áudio para som de virar página */}
      <audio ref={audioRef} preload="auto" style={{ display: 'none' }}>
        <source src="/sounds/page-turn.mp3" type="audio/mpeg" />
      </audio>

      {/* Desktop Controls - Vertical */}
      <div className="fixed top-1/2 right-4 z-50 transform -translate-y-1/2 hidden md:flex flex-col gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={toggleShare}
          className="bg-black/20 backdrop-blur-sm border-white/20 text-white hover:bg-black/40 w-12 h-12 p-0"
          title="Compartilhar"
        >
          <Share2 className="h-5 w-5" />
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={zoomOut}
          className="bg-black/20 backdrop-blur-sm border-white/20 text-white hover:bg-black/40 w-12 h-12 p-0"
          title="Diminuir Zoom"
        >
          <ZoomOut className="h-5 w-5" />
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={zoomIn}
          className="bg-black/20 backdrop-blur-sm border-white/20 text-white hover:bg-black/40 w-12 h-12 p-0"
          title="Aumentar Zoom"
        >
          <ZoomIn className="h-5 w-5" />
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={toggleSound}
          className={`bg-black/20 backdrop-blur-sm border-white/20 text-white hover:bg-black/40 w-12 h-12 p-0 ${isMuted ? 'opacity-50' : ''}`}
          title={isMuted ? "Ativar Som" : "Desativar Som"}
        >
          <Volume2 className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile Controls - Horizontal */}
      <div className="fixed top-4 right-4 z-50 flex gap-2 md:hidden">
        <Button
          variant="secondary"
          size="sm"
          onClick={toggleShare}
          className="bg-black/20 backdrop-blur-sm border-white/20 text-white hover:bg-black/40 w-10 h-10 p-0"
        >
          <Share2 className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={zoomOut}
          className="bg-black/20 backdrop-blur-sm border-white/20 text-white hover:bg-black/40 w-10 h-10 p-0"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={zoomIn}
          className="bg-black/20 backdrop-blur-sm border-white/20 text-white hover:bg-black/40 w-10 h-10 p-0"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={toggleSound}
          className={`bg-black/20 backdrop-blur-sm border-white/20 text-white hover:bg-black/40 w-10 h-10 p-0 ${isMuted ? 'opacity-50' : ''}`}
        >
          <Volume2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Share Modal */}
      {showShare && (
        <ShareButtons onClose={() => setShowShare(false)} />
      )}

      {/* Magazine Container */}
      <div 
        className="transition-all duration-300 ease-magazine flex items-center justify-center w-full h-full p-2"
        style={{ transform: `scale(${zoom})` }}
      >
        <div className="shadow-magazine rounded-lg overflow-hidden w-full h-full flex items-center justify-center">
          <HTMLFlipBook
            ref={flipBookRef}
            width={typeof window !== 'undefined'
              ? Math.min(
                  Math.floor(window.innerWidth * 0.9),
                  Math.floor(window.innerHeight * 0.9 * PAGE_RATIO)
                )
              : PAGE_WIDTH}
            height={typeof window !== 'undefined'
              ? Math.min(
                  Math.floor(window.innerHeight * 0.9),
                  Math.floor(window.innerWidth * 0.9 / PAGE_RATIO)
                )
              : PAGE_HEIGHT}
            size="stretch"
            minWidth={320}
            maxWidth={1024}
            minHeight={480}
            maxHeight={1600}
            maxShadowOpacity={0.8}
            showCover={true}
            mobileScrollSupport={true}
            onFlip={onPage}
            className="magazine-flipbook"
            style={{}}
            startPage={0}
            drawShadow={true}
            flippingTime={600}
            usePortrait={typeof window !== 'undefined' ? window.innerWidth < 768 : false}
            startZIndex={0}
            autoSize={true}
            clickEventForward={true}
            useMouseEvents={true}
            swipeDistance={30}
            showPageCorners={true}
            disableFlipByClick={false}
          >
            {renderPages()}
          </HTMLFlipBook>
        </div>
      </div>
    </div>
  );
};