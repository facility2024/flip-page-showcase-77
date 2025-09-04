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

// Formato oficial da revista: 794x1123 (proporção exata)
const PAGE_WIDTH = 794;
const PAGE_HEIGHT = 1123;
const PAGE_RATIO = PAGE_WIDTH / PAGE_HEIGHT; // ≈ 0.707

export const DigitalMagazine = () => {
  const flipBookRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [customPages, setCustomPages] = useState<string[]>([]);

  // Default model pages (apenas mostradas se não há conteúdo do editor)
  const defaultPages = [
    modelPage1, modelPage2, modelPage3, modelPage4, 
    modelPage5, modelPage6, modelPage7, modelPage8, 
    modelPage9, modelPage10, modelPage11, modelPage12
  ];

  // Se há páginas customizadas do editor, usar apenas essas
  const hasEditorContent = customPages.length > 0;
  const totalPages = hasEditorContent ? customPages.length : defaultPages.length;

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

  const zoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 2));
  };

  const zoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };

  const toggleSound = () => {
    setIsMuted(prev => !prev);
    toast(isMuted ? "Som ativado" : "Som desativado");
  };


  const toggleShare = () => {
    setShowShare(prev => !prev);
  };


  // Sincronizar com o editor - GARANTIR QUE TODAS AS PÁGINAS SEJAM EXIBIDAS
  useEffect(() => {
    const loadMagazineContent = () => {
      console.log("🔍 [DIGITAL-MAGAZINE] ========== INÍCIO DO CARREGAMENTO ==========");
      
      const savedContent = localStorage.getItem("magazineContent");
      const currentCacheVersion = localStorage.getItem("magazine_cache_version");
      
      if (savedContent) {
        try {
          const content = JSON.parse(savedContent);
          const allPageImages: string[] = [];
          
          console.log("🔍 [DIGITAL-MAGAZINE] Conteúdo carregado:", content);
          console.log("🔍 [DIGITAL-MAGAZINE] Total de páginas no editor:", content.pages?.length || 0);
          console.log("🔍 [DIGITAL-MAGAZINE] Versão do cache:", content.cacheVersion || 'sem versão');
        
        // PROCESSAR TODAS AS PÁGINAS DO EDITOR - SEM EXCEÇÃO OU LIMITAÇÃO
        if (content.pages && Array.isArray(content.pages) && content.pages.length > 0) {
          console.log(`🚀 [DIGITAL-MAGAZINE] Processando ${content.pages.length} páginas...`);
          
          content.pages.forEach((page: any, index: number) => {
            console.log(`🔍 [DIGITAL-MAGAZINE] Processando página ${index + 1}/${content.pages.length}:`, page);
            
            // Prioridade 1: Se a página tem PDF, usar o PDF
            if (page.pdfUrl && page.pdfUrl.trim()) {
              allPageImages.push(page.pdfUrl);
              console.log(`✅ [DIGITAL-MAGAZINE] Página ${index + 1} adicionada (PDF):`, page.pdfUrl);
            }
            // Prioridade 2: Se a página tem imagens, adicionar TODAS as imagens
            else if (page.images && Array.isArray(page.images) && page.images.length > 0) {
              page.images.forEach((image: string, imgIndex: number) => {
                if (image && image.trim()) {
                  allPageImages.push(image);
                  console.log(`✅ [DIGITAL-MAGAZINE] Página ${index + 1}, Imagem ${imgIndex + 1} adicionada:`, image);
                }
              });
            }
            // Prioridade 3: SEMPRE adicionar página, mesmo se vazia (usar placeholder)
            else {
              allPageImages.push(placeholderPage);
              console.log(`⚠️ [DIGITAL-MAGAZINE] Página ${index + 1} vazia - usando placeholder`);
            }
          });
        } else {
          console.log("⚠️ [DIGITAL-MAGAZINE] Nenhuma página encontrada no editor");
        }
        
        // Se há capa configurada, adicionar ela como primeira página (após processar todas)
        if (content.coverUrl && content.coverUrl.trim()) {
          allPageImages.unshift(content.coverUrl); // Adiciona no início
          console.log("✅ [DIGITAL-MAGAZINE] Capa adicionada como primeira página:", content.coverUrl);
        }
        
        console.log("🎯 [DIGITAL-MAGAZINE] ========== RESULTADO FINAL ==========");
        console.log(`📊 Total de páginas do editor: ${content.pages?.length || 0}`);
        console.log(`📊 Total de páginas geradas para visualização: ${allPageImages.length}`);
        console.log("📋 Lista completa de páginas para visualização:", allPageImages);
        console.log("🎯 [DIGITAL-MAGAZINE] ========== FIM DA SINCRONIZAÇÃO ==========");
        
          // FORÇAR atualização das páginas
          setCustomPages([...allPageImages]); // Force new array reference
          
          if (allPageImages.length > 0) {
            toast.success(`🎉 ${allPageImages.length} páginas carregadas na revista!`);
          } else {
            console.warn("⚠️ [DIGITAL-MAGAZINE] Nenhuma página foi gerada!");
            toast.warning("Nenhuma página encontrada no editor");
          }
        } catch (error) {
          console.error("❌ [DIGITAL-MAGAZINE] Erro ao carregar conteúdo do editor:", error);
          toast.error("Erro ao sincronizar com editor");
        }
      } else {
        console.log("⚠️ [DIGITAL-MAGAZINE] Nenhum conteúdo salvo encontrado no localStorage");
      }
    };
    
    // Carregar conteúdo inicial
    loadMagazineContent();
    
    toast("Arraste o canto da página para virar");
    
    // Listener para recarregamento forçado
    const handleForceReload = (e: CustomEvent) => {
      console.log("🔄 [DIGITAL-MAGAZINE] Recarregamento forçado solicitado:", e.detail);
      setTimeout(() => {
        loadMagazineContent();
      }, 100);
    };
    
    // Listener para mudanças no localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "magazineContent" && e.newValue === null) {
        // Revista foi limpa no editor
        setCustomPages([]);
        setCurrentPage(0);
        setZoom(1);
        console.log("🧹 [DIGITAL-MAGAZINE] Revista limpa pelo editor");
        toast.success("Revista limpa pelo editor!");
      } else if (e.key === "magazineContent" && e.newValue) {
        try {
          const content = JSON.parse(e.newValue);
          const allPageImages: string[] = [];
          
          console.log("🔄 [DIGITAL-MAGAZINE] ========== SINCRONIZAÇÃO EM TEMPO REAL ==========");
          console.log("🔄 [DIGITAL-MAGAZINE] Conteúdo recebido:", content);
          console.log("🔄 [DIGITAL-MAGAZINE] Total de páginas recebidas:", content.pages?.length || 0);
          
          // PROCESSAR TODAS AS PÁGINAS - GARANTIA 100%
          if (content.pages && Array.isArray(content.pages) && content.pages.length > 0) {
            console.log(`🚀 [DIGITAL-MAGAZINE] Sincronizando ${content.pages.length} páginas...`);
            
            content.pages.forEach((page: any, index: number) => {
              console.log(`🔄 [DIGITAL-MAGAZINE] Sincronizando página ${index + 1}/${content.pages.length}:`, page);
              
              // Prioridade 1: PDF
              if (page.pdfUrl && page.pdfUrl.trim()) {
                allPageImages.push(page.pdfUrl);
                console.log(`✅ [DIGITAL-MAGAZINE] Página ${index + 1} sincronizada (PDF):`, page.pdfUrl);
              }
              // Prioridade 2: Imagens (TODAS)
              else if (page.images && Array.isArray(page.images) && page.images.length > 0) {
                page.images.forEach((image: string, imgIndex: number) => {
                  if (image && image.trim()) {
                    allPageImages.push(image);
                    console.log(`✅ [DIGITAL-MAGAZINE] Página ${index + 1}, Imagem ${imgIndex + 1} sincronizada:`, image);
                  }
                });
              }
              // Prioridade 3: Página vazia (placeholder)
              else {
                allPageImages.push(placeholderPage);
                console.log(`⚠️ [DIGITAL-MAGAZINE] Página ${index + 1} vazia sincronizada - usando placeholder`);
              }
            });
          }
          
          // Se há capa configurada, adicionar ela como primeira página
          if (content.coverUrl && content.coverUrl.trim()) {
            allPageImages.unshift(content.coverUrl); // Adiciona no início
            console.log("✅ [DIGITAL-MAGAZINE] Capa sincronizada como primeira página:", content.coverUrl);
          }
          
          console.log("🎯 [DIGITAL-MAGAZINE] ========== SINCRONIZAÇÃO COMPLETA ==========");
          console.log(`📊 Total de páginas do editor: ${content.pages?.length || 0}`);
          console.log(`📊 Total de páginas sincronizadas: ${allPageImages.length}`);
          console.log("📋 Lista final sincronizada:", allPageImages);
          console.log("🎯 [DIGITAL-MAGAZINE] ========== FIM DA SINCRONIZAÇÃO ==========");
          
          // FORÇAR atualização das páginas
          setCustomPages([...allPageImages]); // Force new array reference
          toast.success(`🔄 ${allPageImages.length} páginas sincronizadas!`);
        } catch (error) {
          console.error("❌ [DIGITAL-MAGAZINE] Erro ao sincronizar:", error);
          toast.error("Erro na sincronização em tempo real");
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('magazineForceReload', handleForceReload as EventListener);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('magazineForceReload', handleForceReload as EventListener);
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
              // Tentar limpar e revalidar a URL
              const target = e.currentTarget;
              const originalSrc = pageImage;
              
              // Se a URL parece truncada ou tem problemas
              if (originalSrc && (originalSrc.includes('%20') || originalSrc.includes('MODELO%20'))) {
                try {
                  // Tentar decodificar a URL
                  const decodedUrl = decodeURIComponent(originalSrc);
                  console.log("Tentando URL decodificada:", decodedUrl);
                  target.src = decodedUrl;
                  return;
                } catch (decodeError) {
                  console.warn("Erro ao decodificar URL:", decodeError);
                }
              }
              
              // Como fallback, usar placeholder
              target.src = placeholderPage;
              target.alt = `Erro ao carregar página ${index + 1}`;
              console.warn(`Usando placeholder para página ${index + 1} devido a erro de carregamento`);
            }}
          />
        </div>
      </MagazinePage>
    ));
  };

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden">
      {/* Navegação Permanente */}
      <Navigation />
      
      {/* Áudio para som de virar página */}
      <audio
        ref={audioRef}
        preload="auto"
        style={{ display: 'none' }}
      >
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