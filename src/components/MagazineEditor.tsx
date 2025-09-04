import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  FileText, 
  Image, 
  Video, 
  Music, 
  MousePointer, 
  Eye, 
  Palette, 
  FileSpreadsheet,
  Link2,
  Save,
  Download,
  Share2,
  Trash2,
  Plus,
  BookOpen,
  Home,
  CheckSquare,
  Square
} from "lucide-react";
import { toast } from "sonner";

interface PageContent {
  pdfUrl: string;
  images: string[];
  audioUrl: string;
  videoUrl: string;
  buttons: Array<{
    text: string;
    url: string;
    color: string;
  }>;
  forms: Array<{
    name: string;
    fields: string[];
  }>;
}

interface MagazineContent {
  pages: PageContent[];
  backgroundImage: string;
  coverUrl: string;
  accessLogs: Array<{
    date: string;
    ip: string;
    page: string;
  }>;
}

export const MagazineEditor = () => {
  const [content, setContent] = useState<MagazineContent>({
    pages: [{
      pdfUrl: "",
      images: [],
      audioUrl: "",
      videoUrl: "",
      buttons: [],
      forms: []
    }],
    backgroundImage: "",
    coverUrl: "",
    accessLogs: []
  });

  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [selectedPageForContent, setSelectedPageForContent] = useState(0);
  const [selectedPagesForContent, setSelectedPagesForContent] = useState<number[]>([]);
  const [pdfQueue, setPdfQueue] = useState("");

  const [newButton, setNewButton] = useState({
    text: "",
    url: "",
    color: "#5d0ff2",
    pageIndex: 0,
    selectedPages: [] as number[] // Permite seleção múltipla de páginas
  });

  const [newForm, setNewForm] = useState({
    name: "",
    fields: [""],
    pageIndex: 0,
    selectedPages: [] as number[] // Permite seleção múltipla de páginas
  });

  const [generatedUrl, setGeneratedUrl] = useState("");

  const currentPage = content.pages[currentPageIndex] || content.pages[0];

  // Auto-sincronização em tempo real com a home + Carregamento de remix
  useEffect(() => {
    // Verificar se há conteúdo de remix na URL
    const urlParams = new URLSearchParams(window.location.search);
    const remixData = urlParams.get('remix');
    
    if (remixData) {
      try {
        console.log("🔄 [EDITOR] ========== CARREGANDO REMIX ==========");
        console.log("🔄 [EDITOR] Dados de remix recebidos:", remixData);
        
        const decodedContent = JSON.parse(atob(remixData));
        console.log("🔄 [EDITOR] Conteúdo decodificado:", decodedContent);
        console.log("🔄 [EDITOR] Total de páginas no remix:", decodedContent.pages?.length || 0);
        
        // FORÇAR carregamento completo do remix
        setContent({
          ...decodedContent,
          pages: decodedContent.pages || [{
            pdfUrl: "",
            images: [],
            audioUrl: "",
            videoUrl: "",
            buttons: [],
            forms: []
          }]
        });
        
        console.log("✅ [EDITOR] Remix carregado com sucesso!");
        console.log(`📊 [EDITOR] Páginas carregadas no editor: ${decodedContent.pages?.length || 0}`);
        toast.success(`🔄 Remix carregado! ${decodedContent.pages?.length || 0} páginas disponíveis no editor!`);
        
        // Limpar URL para não carregar remix novamente
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
      } catch (error) {
        console.error("❌ [EDITOR] Erro ao carregar remix:", error);
        toast.error("Erro ao carregar remix. Carregando conteúdo salvo local.");
      }
    }

    // Carrega conteúdo salvo ao inicializar (se não há remix)
    const savedContent = localStorage.getItem("magazineContent");
    if (savedContent) {
      try {
        const parsed = JSON.parse(savedContent);
        setContent(parsed);
        console.log("📚 [EDITOR] Conteúdo local carregado:", parsed);
      } catch (error) {
        console.error("Erro ao carregar conteúdo salvo:", error);
      }
    }
  }, []);

  // Auto-save sempre que o conteúdo mudar - COM LOGS DETALHADOS
  useEffect(() => {
    // Salvar automaticamente a cada mudança (com pequeno debounce)
    const timeoutId = setTimeout(() => {
      console.log("💾 [EDITOR] Auto-salvamento iniciado...");
      console.log(`📊 [EDITOR] Páginas a serem salvas: ${content.pages.length}`);
      console.log("📋 [EDITOR] Conteúdo completo:", content);
      
      localStorage.setItem("magazineContent", JSON.stringify(content));
      
      // Disparar evento para sincronizar com home em tempo real
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'magazineContent',
        newValue: JSON.stringify(content),
        storageArea: localStorage
      }));
      
      console.log("✅ [EDITOR] Auto-salvamento concluído e sincronizado com a home!");
    }, 500); // 500ms de debounce

    return () => clearTimeout(timeoutId);
  }, [content]);

  // Adicionar nova página
  const handleAddPage = () => {
    setContent(prev => ({
      ...prev,
      pages: [...prev.pages, {
        pdfUrl: "",
        images: [],
        audioUrl: "",
        videoUrl: "",
        buttons: [],
        forms: []
      }]
    }));
    toast.success("Nova página adicionada!");
  };

  // Processar múltiplos PDFs em fila - GARANTIR QUE TODAS AS PÁGINAS SEJAM CRIADAS
  const handleProcessPdfQueue = () => {
    const urls = pdfQueue.split('\n').filter(url => url.trim());
    if (urls.length === 0) {
      toast.error("Nenhuma URL foi fornecida!");
      return;
    }

    console.log("🚀 [EDITOR] ========== PROCESSAMENTO DE PDFs INICIADO ==========");
    console.log("🚀 [EDITOR] URLs recebidas:", urls);
    console.log(`📊 [EDITOR] Total de URLs para processar: ${urls.length}`);

    // A primeira URL sempre será a capa
    const [firstUrl, ...remainingUrls] = urls;
    
    console.log("✅ [EDITOR] Configurando capa:", firstUrl.trim());

    // Limpar e validar URLs
    const cleanedUrls = urls.map(url => {
      let cleanUrl = url.trim();
      
      // Tentar decodificar URLs que possam estar mal codificadas
      try {
        if (cleanUrl.includes('%20') || cleanUrl.includes('%') || cleanUrl.includes('MODELO%20')) {
          cleanUrl = decodeURIComponent(cleanUrl);
          console.log(`🔧 [EDITOR] URL decodificada: ${cleanUrl}`);
        }
      } catch (error) {
        console.warn(`⚠️ [EDITOR] Erro ao decodificar URL: ${cleanUrl}`, error);
      }
      
      return cleanUrl;
    });

    // Criar páginas para TODAS as URLs (incluindo a primeira como página)
    const newPages = cleanedUrls.map((url, index) => {
      console.log(`✅ [EDITOR] Criando página ${index + 1}/${cleanedUrls.length}: ${url}`);
      
      if (!url) {
        console.warn(`⚠️ [EDITOR] URL vazia encontrada no índice ${index}`);
        return {
          pdfUrl: "",
          images: [],
          audioUrl: "",
          videoUrl: "",
          buttons: [],
          forms: []
        };
      }
      
      return {
        pdfUrl: url,
        images: [],
        audioUrl: "",
        videoUrl: "",
        buttons: [],
        forms: []
      };
    });

    console.log("🎯 [EDITOR] Páginas criadas:", newPages);
    console.log(`📊 [EDITOR] Total final de páginas: ${newPages.length}`);

    // GARANTIR que todas as páginas sejam definidas COM VALIDAÇÃO
    const finalContent = {
      pages: [...newPages], // Force new array
      backgroundImage: content.backgroundImage,
      coverUrl: cleanedUrls[0] || firstUrl.trim(),
      accessLogs: content.accessLogs || []
    };

    // Validar que o conteúdo está correto antes de salvar
    if (finalContent.pages.length === 0) {
      console.error("❌ [EDITOR] ERRO CRÍTICO: Nenhuma página foi criada!");
      toast.error("Erro: Nenhuma página foi criada. Verifique as URLs.");
      return;
    }

    // Atualizar state do editor
    setContent(finalContent);

    console.log("🎯 [EDITOR] ========== CONTEÚDO FINAL ==========");
    console.log("📊 Total de páginas no estado:", finalContent.pages.length);
    console.log("📋 Conteúdo completo:", finalContent);
    console.log("🎯 [EDITOR] ========== FIM DO PROCESSAMENTO ==========");

    setPdfQueue("");
    toast.success(`🎉 ${cleanedUrls.length} páginas criadas! Capa configurada!`);
    
    // Auto-salvar IMEDIATAMENTE para garantir sincronização
    setTimeout(() => {
      console.log("💾 [EDITOR] Iniciando auto-salvamento forçado...");
      console.log(`💾 [EDITOR] Salvando ${finalContent.pages.length} páginas...`);
      
      // Validar novamente antes de salvar
      if (finalContent.pages.length === 0) {
        console.error("❌ [EDITOR] ERRO: Tentando salvar conteúdo sem páginas!");
        toast.error("Erro ao salvar: conteúdo vazio detectado.");
        return;
      }
      
      localStorage.setItem("magazineContent", JSON.stringify(finalContent));
      
      // Disparar evento para sincronizar em tempo real
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'magazineContent',
        newValue: JSON.stringify(finalContent),
        storageArea: localStorage
      }));
      
      console.log("✅ [EDITOR] Auto-salvamento forçado concluído!");
      toast.success(`📚 ${finalContent.pages.length} páginas sincronizadas com a visualização!`);
    }, 50); // Reduzido para 50ms para sincronização mais rápida
  };

  // Adicionar conteúdo às páginas selecionadas
  const handleAddContentToPage = (contentType: string, value: string) => {
    if (!value.trim()) return;

    // Usar páginas múltiplas se selecionadas, senão usar página individual
    const targetPages = selectedPagesForContent.length > 0 
      ? selectedPagesForContent 
      : [selectedPageForContent];

    setContent(prev => {
      const newPages = [...prev.pages];
      
      targetPages.forEach(pageIndex => {
        if (newPages[pageIndex]) {
          if (contentType === 'image') {
            newPages[pageIndex] = {
              ...newPages[pageIndex],
              images: [...newPages[pageIndex].images, value]
            };
          } else if (contentType === 'audio') {
            newPages[pageIndex] = {
              ...newPages[pageIndex],
              audioUrl: value
            };
          } else if (contentType === 'video') {
            newPages[pageIndex] = {
              ...newPages[pageIndex],
              videoUrl: value
            };
          }
        }
      });

      return { ...prev, pages: newPages };
    });

    const pagesList = targetPages.map(p => p + 1).join(", ");
    const contentTypeLabel = contentType === 'image' ? 'Imagem' 
      : contentType === 'audio' ? 'Áudio' 
      : 'Vídeo';
    
    toast.success(`✅ ${contentTypeLabel} adicionado às páginas: ${pagesList}!`);
  };

  // Adicionar botão às páginas selecionadas
  const handleAddButton = () => {
    if (newButton.text && newButton.url) {
      // Se há páginas selecionadas, usar essas; senão usar a página individual
      const targetPages = newButton.selectedPages.length > 0 
        ? newButton.selectedPages 
        : [newButton.pageIndex];

      setContent(prev => {
        const newPages = [...prev.pages];
        
        // Aplicar o botão a todas as páginas selecionadas
        targetPages.forEach(pageIndex => {
          if (newPages[pageIndex]) {
            newPages[pageIndex] = {
              ...newPages[pageIndex],
              buttons: [...newPages[pageIndex].buttons, {
                text: newButton.text,
                url: newButton.url,
                color: newButton.color
              }]
            };
          }
        });
        
        return { ...prev, pages: newPages };
      });

      const pagesList = targetPages.map(p => p + 1).join(", ");
      setNewButton({ text: "", url: "", color: "#5d0ff2", pageIndex: 0, selectedPages: [] });
      toast.success(`✅ Botão adicionado às páginas: ${pagesList}!`);
    }
  };

  // Adicionar formulário às páginas selecionadas
  const handleAddForm = () => {
    if (newForm.name && newForm.fields.some(field => field.trim())) {
      // Se há páginas selecionadas, usar essas; senão usar a página individual
      const targetPages = newForm.selectedPages.length > 0 
        ? newForm.selectedPages 
        : [newForm.pageIndex];

      setContent(prev => {
        const newPages = [...prev.pages];
        
        // Aplicar o formulário a todas as páginas selecionadas
        targetPages.forEach(pageIndex => {
          if (newPages[pageIndex]) {
            newPages[pageIndex] = {
              ...newPages[pageIndex],
              forms: [...newPages[pageIndex].forms, {
                name: newForm.name,
                fields: newForm.fields.filter(f => f.trim())
              }]
            };
          }
        });
        
        return { ...prev, pages: newPages };
      });

      const pagesList = targetPages.map(p => p + 1).join(", ");
      setNewForm({ name: "", fields: [""], pageIndex: 0, selectedPages: [] });
      toast.success(`✅ Formulário adicionado às páginas: ${pagesList}!`);
    }
  };

  const handleAddFormField = () => {
    setNewForm(prev => ({
      ...prev,
      fields: [...prev.fields, ""]
    }));
  };

  const handleFormFieldChange = (index: number, value: string) => {
    setNewForm(prev => ({
      ...prev,
      fields: prev.fields.map((field, i) => i === index ? value : field)
    }));
  };

  // Funções para seleção múltipla de páginas para botões
  const handleToggleButtonPage = (pageIndex: number) => {
    setNewButton(prev => ({
      ...prev,
      selectedPages: prev.selectedPages.includes(pageIndex)
        ? prev.selectedPages.filter(p => p !== pageIndex)
        : [...prev.selectedPages, pageIndex]
    }));
  };

  const handleSelectAllButtonPages = () => {
    setNewButton(prev => ({
      ...prev,
      selectedPages: prev.selectedPages.length === content.pages.length 
        ? [] 
        : content.pages.map((_, index) => index)
    }));
  };

  // Funções para seleção múltipla de páginas para formulários
  const handleToggleFormPage = (pageIndex: number) => {
    setNewForm(prev => ({
      ...prev,
      selectedPages: prev.selectedPages.includes(pageIndex)
        ? prev.selectedPages.filter(p => p !== pageIndex)
        : [...prev.selectedPages, pageIndex]
    }));
  };

  const handleSelectAllFormPages = () => {
    setNewForm(prev => ({
      ...prev,
      selectedPages: prev.selectedPages.length === content.pages.length 
        ? [] 
        : content.pages.map((_, index) => index)
    }));
  };

  // Funções para seleção múltipla de páginas para conteúdo
  const handleToggleContentPage = (pageIndex: number) => {
    setSelectedPagesForContent(prev => 
      prev.includes(pageIndex)
        ? prev.filter(p => p !== pageIndex)
        : [...prev, pageIndex]
    );
  };

  const handleSelectAllContentPages = () => {
    setSelectedPagesForContent(prev => 
      prev.length === content.pages.length 
        ? [] 
        : content.pages.map((_, index) => index)
    );
  };

  // Limpar revista (Lixeira)
  const handleClearMagazine = () => {
    setContent({
      pages: [{
        pdfUrl: "",
        images: [],
        audioUrl: "",
        videoUrl: "",
        buttons: [],
        forms: []
      }],
      backgroundImage: "",
      coverUrl: "",
      accessLogs: []
    });
    setCurrentPageIndex(0);
    setSelectedPageForContent(0);
    setGeneratedUrl("");
    
    // Limpar localStorage para sincronizar com a home
    localStorage.removeItem("magazineContent");
    
    toast.success("Revista limpa! Redirecionando para home...");
    // Redirecionar para home após 2 segundos
    setTimeout(() => {
      window.location.href = "/";
    }, 2000);
  };

  const handleGenerateUrl = () => {
    console.log("🔗 [EDITOR] Gerando URL oficial...");
    console.log(`📊 [EDITOR] Páginas incluídas no link: ${content.pages.length}`);
    console.log("📋 [EDITOR] Conteúdo a ser codificado:", content);
    
    const encodedContent = btoa(JSON.stringify(content));
    const url = `${window.location.origin}/magazine/${encodedContent}`;
    setGeneratedUrl(url);
    navigator.clipboard.writeText(url);
    
    console.log("✅ [EDITOR] URL gerada:", url);
    toast.success(`🔗 Link oficial gerado! ${content.pages.length} páginas incluídas e copiado para área de transferência!`);
  };

  // Gerar URL do remix que sempre abre com editor
  const handleGenerateRemixUrl = () => {
    console.log("🔄 [EDITOR] ========== GERANDO URL DE REMIX ==========");
    console.log(`📊 [EDITOR] Total de páginas para incluir: ${content.pages.length}`);
    console.log("📋 [EDITOR] Conteúdo completo para remix:", content);
    
    // Validar se há conteúdo para remixar
    if (!content.pages || content.pages.length === 0) {
      toast.error("Nenhuma página para remixar! Adicione páginas primeiro.");
      return;
    }
    
    try {
      const contentToEncode = {
        ...content,
        pages: [...content.pages] // Force array copy
      };
      
      const encodedContent = btoa(JSON.stringify(contentToEncode));
      const remixUrl = `${window.location.origin}/editor?remix=${encodedContent}`;
      
      console.log("✅ [EDITOR] URL de remix gerada:", remixUrl);
      console.log(`📊 [EDITOR] Remix incluirá ${contentToEncode.pages.length} páginas`);
      
      navigator.clipboard.writeText(remixUrl);
      toast.success(`🔄 Remix criado! ${contentToEncode.pages.length} páginas incluídas. Link copiado!`);
    } catch (error) {
      console.error("❌ [EDITOR] Erro ao gerar remix:", error);
      toast.error("Erro ao gerar URL de remix");
    }
  };

  const handleSave = () => {
    console.log("💾 [EDITOR] Salvamento manual iniciado...");
    console.log(`📊 [EDITOR] Total de páginas: ${content.pages.length}`);
    console.log("📋 [EDITOR] Conteúdo completo a ser salvo:", content);
    
    localStorage.setItem("magazineContent", JSON.stringify(content));
    
    // Disparar evento personalizado para sincronizar em tempo real
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'magazineContent',
      newValue: JSON.stringify(content),
      storageArea: localStorage
    }));
    
    console.log("✅ [EDITOR] Salvamento manual concluído!");
    toast.success(`📚 Revista salva! ${content.pages.length} páginas sincronizadas com a home!`);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(content, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'revista-config.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    toast.success("Configuração exportada com sucesso!");
  };

  const handleViewMagazine = () => {
    console.log("🏠 [EDITOR] Redirecionando para home...");
    console.log(`📊 [EDITOR] Páginas que serão exibidas na home: ${content.pages.length}`);
    
    // Salvar automaticamente antes de ir para home
    localStorage.setItem("magazineContent", JSON.stringify(content));
    
    // Garantir sincronização imediata
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'magazineContent',
      newValue: JSON.stringify(content),
      storageArea: localStorage
    }));
    
    console.log("✅ [EDITOR] Conteúdo salvo e sincronizado!");
    toast.success(`📚 ${content.pages.length} páginas salvas! Redirecionando para home...`);
    
    // Pequeno delay para mostrar o toast
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-editor text-white font-bold">
      {/* Mobile Header */}
      <div className="p-4 border-b border-white/20 md:hidden">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-white">Editor Digital</h1>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <BookOpen className="w-4 h-4" />
              <span>{currentPageIndex + 1}/{content.pages.length}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              onClick={handleViewMagazine}
              variant="outline" 
              size="sm"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              <Home className="w-4 h-4 mr-2" />
              Ver Revista
            </Button>
            <Button 
              onClick={handleClearMagazine}
              variant="outline" 
              size="sm"
              className="bg-red-500/20 border-red-300/30 text-red-100 hover:bg-red-500/30"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Lixeira
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Button 
              onClick={handleSave}
              variant="outline" 
              size="sm"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              <Save className="w-4 h-4 mr-1" />
              Salvar
            </Button>
            <Button 
              onClick={handleExport}
              variant="outline" 
              size="sm"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
            <Button 
              onClick={handleGenerateUrl}
              size="sm"
              className="bg-white text-purple-600 hover:bg-white/90 font-bold text-xs"
            >
              <Share2 className="w-4 h-4 mr-1" />
              Link
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Button 
              onClick={handleGenerateRemixUrl}
              size="sm"
              className="bg-green-500/20 border-green-400/30 text-green-100 hover:bg-green-500/30 font-bold text-xs"
            >
              <BookOpen className="w-4 h-4 mr-1" />
              Remix
            </Button>
            <Button 
              onClick={() => toast.info("💾 Todas as alterações são salvas automaticamente!")}
              size="sm"
              variant="outline"
              className="bg-blue-500/20 border-blue-400/30 text-blue-100 hover:bg-blue-500/30 text-xs"
            >
              ✅ Auto-save ON
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="p-6 border-b border-white/20 hidden md:block">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-white">Editor de Revista Digital</h1>
            <div className="flex items-center gap-2 text-white/80">
              <BookOpen className="w-5 h-5" />
              <span>Página {currentPageIndex + 1} de {content.pages.length}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={handleViewMagazine}
              variant="outline" 
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              <Home className="w-4 h-4 mr-2" />
              Ver Revista
            </Button>
            <Button 
              onClick={handleClearMagazine}
              variant="outline" 
              className="bg-red-500/20 border-red-300/30 text-red-100 hover:bg-red-500/30"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Lixeira
            </Button>
            <Button 
              onClick={handleSave}
              variant="outline" 
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
            <Button 
              onClick={handleExport}
              variant="outline" 
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
            <Button 
              onClick={handleGenerateUrl}
              className="bg-white text-purple-600 hover:bg-white/90 font-bold"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Gerar Link Oficial
            </Button>
            <Button 
              onClick={handleGenerateRemixUrl}
              variant="outline"
              className="bg-green-500/20 border-green-400/30 text-green-100 hover:bg-green-500/30 font-bold"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Link Remix (com Editor)
            </Button>
          </div>
        </div>
      </div>

      {/* Page Navigation */}
      <div className="p-3 border-b border-white/10 md:p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
            {/* Mobile: Scrollable page numbers */}
            <div className="flex overflow-x-auto gap-2 pb-2 md:pb-0 scrollbar-thin scrollbar-thumb-white/20">
              {content.pages.map((_, index) => (
                <Button
                  key={index}
                  variant={currentPageIndex === index ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPageIndex(index)}
                  className={`flex-shrink-0 ${currentPageIndex === index 
                    ? "bg-white text-purple-600" 
                    : "bg-white/10 border-white/30 text-white hover:bg-white/20"
                  }`}
                >
                  {index + 1}
                </Button>
              ))}
            </div>
            <Button 
              onClick={handleAddPage}
              size="sm"
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 flex-shrink-0 w-full md:w-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Página
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-3 md:p-6">
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 bg-white/10 backdrop-blur-sm gap-1 h-auto p-1">
            <TabsTrigger 
              value="content" 
              className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white text-xs md:text-sm p-2 md:p-3"
            >
              <span className="md:hidden">Conteúdo</span>
              <span className="hidden md:inline">Conteúdo</span>
            </TabsTrigger>
            <TabsTrigger 
              value="buttons" 
              className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white text-xs md:text-sm p-2 md:p-3"
            >
              <span className="md:hidden">Botões</span>
              <span className="hidden md:inline">Botões</span>
            </TabsTrigger>
            <TabsTrigger 
              value="forms" 
              className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white text-xs md:text-sm p-2 md:p-3 col-span-2 md:col-span-1"
            >
              <span className="md:hidden">Forms</span>
              <span className="hidden md:inline">Formulários</span>
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white text-xs md:text-sm p-2 md:p-3 hidden md:flex"
            >
              Analytics
            </TabsTrigger>
            <TabsTrigger 
              value="design" 
              className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white text-xs md:text-sm p-2 md:p-3 hidden md:flex"
            >
              Design
            </TabsTrigger>
          </TabsList>

          {/* Mobile-only tabs for analytics and design */}
          <div className="mt-2 md:hidden">
            <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-sm gap-1 h-auto p-1">
              <TabsTrigger 
                value="analytics" 
                className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white text-xs p-2"
              >
                Analytics
              </TabsTrigger>
              <TabsTrigger 
                value="design" 
                className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white text-xs p-2"
              >
                Design
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Content Tab */}
          <TabsContent value="content" className="mt-4 md:mt-6">
            <div className="space-y-4 md:space-y-6">
              {/* Cover URL Section */}
              <Card className="bg-white/5 backdrop-blur-sm border-white/20 shadow-2xl transform hover:translate-x-1 md:hover:translate-x-2 transition-all duration-300">
                <CardHeader className="pb-3 md:pb-6">
                  <CardTitle className="text-white flex items-center gap-2 text-lg md:text-xl">
                    <BookOpen className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="text-sm md:text-base">URL da Capa da Revista</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 md:space-y-4">
                    <Input
                      placeholder="https://exemplo.com/capa-revista.jpg"
                      value={content.coverUrl}
                      onChange={(e) => setContent(prev => ({ ...prev, coverUrl: e.target.value }))}
                      className="bg-white/10 border-white/30 text-white placeholder:text-white/60 text-sm md:text-base"
                    />
                    {content.coverUrl && (
                      <div className="text-white/80 text-xs md:text-sm">
                        ✓ Capa da revista configurada
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* PDF Queue Section */}
              <Card className="bg-white/5 backdrop-blur-sm border-white/20 shadow-2xl transform hover:translate-x-1 md:hover:translate-x-2 transition-all duration-300">
                <CardHeader className="pb-3 md:pb-6">
                  <CardTitle className="text-white flex items-center gap-2 text-lg md:text-xl">
                    <FileText className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="text-sm md:text-base">Criar Páginas via PDFs</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 md:space-y-4">
                    <Textarea
                      placeholder="Cole os links dos PDFs aqui (um por linha)&#10;https://exemplo.com/revista1.pdf&#10;https://exemplo.com/revista2.pdf&#10;&#10;NOTA: A primeira URL será sempre a capa da revista!"
                      value={pdfQueue}
                      onChange={(e) => setPdfQueue(e.target.value)}
                      className="bg-white/10 border-white/30 text-white placeholder:text-white/60 min-h-[80px] md:min-h-[100px] text-sm md:text-base"
                    />
                    <Button 
                      onClick={handleProcessPdfQueue}
                      className="w-full bg-white text-purple-600 hover:bg-white/90 text-sm md:text-base"
                      disabled={!pdfQueue.trim()}
                    >
                      Processar PDFs e Criar Páginas
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Page Selector for Content with Multiple Selection */}
              <Card className="bg-white/5 backdrop-blur-sm border-white/20 shadow-2xl">
                <CardHeader className="pb-3 md:pb-6">
                  <CardTitle className="text-white text-lg md:text-xl">
                    🎯 Selecionar Páginas para Aplicar Conteúdo ({selectedPagesForContent.length} selecionadas de {content.pages.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Controles de seleção múltipla */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-white/80 text-sm">
                      {selectedPagesForContent.length > 0 
                        ? `✅ ${selectedPagesForContent.length} páginas selecionadas` 
                        : "👆 Clique nas páginas para selecionar múltiplas"
                      }
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSelectAllContentPages}
                        variant="outline"
                        size="sm"
                        className="bg-white/10 border-white/30 text-white hover:bg-white/20 text-xs"
                      >
                        {selectedPagesForContent.length === content.pages.length ? 'Limpar Todas' : 'Selecionar Todas'}
                      </Button>
                      {selectedPagesForContent.length > 0 && (
                        <Button
                          onClick={() => setSelectedPagesForContent([])}
                          variant="outline"
                          size="sm"
                          className="bg-red-500/20 border-red-400/30 text-red-100 hover:bg-red-500/30 text-xs"
                        >
                          Limpar
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {/* Grid de seleção de páginas */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-60 overflow-y-auto bg-white/5 p-3 rounded-lg border border-white/20">
                    {content.pages.map((page, index) => {
                      const isSelected = selectedPagesForContent.includes(index);
                      return (
                        <div
                          key={index}
                          onClick={() => handleToggleContentPage(index)}
                          className={`relative cursor-pointer border-2 rounded-lg overflow-hidden transition-all duration-200 hover:scale-105 ${
                            isSelected
                              ? 'border-purple-400 bg-purple-500/20 shadow-lg'
                              : 'border-white/30 bg-white/5 hover:border-white/60'
                          }`}
                        >
                          {/* Preview da página */}
                          {page.pdfUrl ? (
                            <div className="w-full h-20 bg-white/10 flex items-center justify-center">
                              <FileText className="w-6 h-6 text-white/60" />
                            </div>
                          ) : (
                            <div className="w-full h-20 bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                              <BookOpen className="w-6 h-6 text-white/60" />
                            </div>
                          )}
                          
                          {/* Info da página */}
                          <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white text-xs py-1 px-2">
                            <div className="text-center font-medium">P{index + 1}</div>
                            <div className="text-center text-xs opacity-75">
                              {page.pdfUrl ? '📄' : '📝'} • {page.images.length}🖼️ • {page.buttons.length}🔘
                            </div>
                          </div>
                          
                          {/* Indicador de seleção */}
                          <div className="absolute top-1 right-1">
                            {isSelected ? (
                              <CheckSquare className="w-5 h-5 text-purple-400 bg-white rounded" />
                            ) : (
                              <Square className="w-5 h-5 text-white/40 bg-black/50 rounded" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Fallback para página individual se nenhuma selecionada */}
                  {selectedPagesForContent.length === 0 && (
                    <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-400/30 rounded-lg">
                      <div className="flex items-center gap-2 text-yellow-200 text-sm mb-2">
                        <span>⚠️</span>
                        <span>Nenhuma página selecionada - usando página individual</span>
                      </div>
                      <Select value={selectedPageForContent.toString()} onValueChange={(value) => setSelectedPageForContent(parseInt(value))}>
                        <SelectTrigger className="bg-white/10 border-white/30 text-white">
                          <SelectValue placeholder={`Página individual (Total: ${content.pages.length})`} />
                        </SelectTrigger>
                        <SelectContent>
                          {content.pages.map((_, index) => (
                            <SelectItem key={index} value={index.toString()}>
                              Página {index + 1} de {content.pages.length}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {/* Images Section */}
                <Card className="bg-white/5 backdrop-blur-sm border-white/20 shadow-2xl transform hover:translate-x-1 md:hover:translate-x-2 transition-all duration-300">
                  <CardHeader className="pb-3 md:pb-6">
                    <CardTitle className="text-white flex items-center gap-2 text-lg md:text-xl">
                      <Image className="w-4 h-4 md:w-5 md:h-5" />
                      <span className="text-sm md:text-base">Imagens (Rodapé)</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input
                      placeholder="URL da imagem"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value) {
                          handleAddContentToPage('image', e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                      className="bg-white/10 border-white/30 text-white placeholder:text-white/60 text-sm md:text-base"
                    />
                    <div className="mt-3 space-y-2 max-h-32 overflow-y-auto">
                      {content.pages[selectedPageForContent]?.images.map((img, index) => (
                        <div key={index} className="text-xs md:text-sm text-white/80 bg-white/5 p-2 rounded truncate">
                          {img}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Audio Section */}
                <Card className="bg-white/5 backdrop-blur-sm border-white/20 shadow-2xl transform hover:translate-x-1 md:hover:translate-x-2 transition-all duration-300">
                  <CardHeader className="pb-3 md:pb-6">
                    <CardTitle className="text-white flex items-center gap-2 text-lg md:text-xl">
                      <Music className="w-4 h-4 md:w-5 md:h-5" />
                      <span className="text-sm md:text-base">Áudio (Rodapé)</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input
                      placeholder="https://exemplo.com/audio.mp3"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value) {
                          handleAddContentToPage('audio', e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                      className="bg-white/10 border-white/30 text-white placeholder:text-white/60 text-sm md:text-base"
                    />
                    {content.pages[selectedPageForContent]?.audioUrl && (
                      <div className="mt-2 text-xs md:text-sm text-white/80">
                        ✓ Áudio configurado
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Video Section */}
                <Card className="bg-white/5 backdrop-blur-sm border-white/20 shadow-2xl transform hover:translate-x-1 md:hover:translate-x-2 transition-all duration-300">
                  <CardHeader className="pb-3 md:pb-6">
                    <CardTitle className="text-white flex items-center gap-2 text-lg md:text-xl">
                      <Video className="w-4 h-4 md:w-5 md:h-5" />
                      <span className="text-sm md:text-base">Vídeo (Rodapé)</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input
                      placeholder="https://exemplo.com/video.mp4"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value) {
                          handleAddContentToPage('video', e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                      className="bg-white/10 border-white/30 text-white placeholder:text-white/60 text-sm md:text-base"
                    />
                    {content.pages[selectedPageForContent]?.videoUrl && (
                      <div className="mt-2 text-xs md:text-sm text-white/80">
                        ✓ Vídeo configurado
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Buttons Tab */}
          <TabsContent value="buttons" className="mt-4 md:mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <Card className="bg-white/5 backdrop-blur-sm border-white/20 shadow-2xl transform hover:translate-y-1 md:hover:translate-y-2 transition-all duration-300">
                <CardHeader className="pb-3 md:pb-6">
                  <CardTitle className="text-white flex items-center gap-2 text-lg md:text-xl">
                    <MousePointer className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="text-sm md:text-base">Adicionar Botão</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 md:space-y-4">
                  {/* Seleção de páginas múltiplas */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-white text-sm md:text-base">
                        📄 Selecionar Páginas ({newButton.selectedPages.length} selecionadas)
                      </Label>
                      <Button
                        onClick={handleSelectAllButtonPages}
                        variant="outline"
                        size="sm"
                        className="bg-white/10 border-white/30 text-white hover:bg-white/20 text-xs"
                      >
                        {newButton.selectedPages.length === content.pages.length ? 'Desselecionar Todas' : 'Selecionar Todas'}
                      </Button>
                    </div>
                    
                    {/* Grid de seleção de páginas */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto bg-white/5 p-3 rounded-lg border border-white/20">
                      {content.pages.map((page, index) => (
                        <div
                          key={index}
                          onClick={() => handleToggleButtonPage(index)}
                          className={`relative cursor-pointer border-2 rounded-lg p-2 transition-all duration-200 hover:scale-105 ${
                            newButton.selectedPages.includes(index)
                              ? 'border-green-400 bg-green-500/20'
                              : 'border-white/30 bg-white/5 hover:border-white/60'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-white text-xs font-medium">
                              Página {index + 1}
                            </span>
                            {newButton.selectedPages.includes(index) ? (
                              <CheckSquare className="w-4 h-4 text-green-400" />
                            ) : (
                              <Square className="w-4 h-4 text-white/40" />
                            )}
                          </div>
                          <div className="text-xs text-white/60 mt-1">
                            {page.pdfUrl ? '📄 PDF' : '📝 Vazia'} • {page.buttons.length} btns
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Fallback para página individual se nenhuma selecionada */}
                    {newButton.selectedPages.length === 0 && (
                      <div className="mt-3">
                        <Label className="text-white/70 text-xs">📍 Página Individual (fallback)</Label>
                        <Select value={newButton.pageIndex.toString()} onValueChange={(value) => setNewButton(prev => ({...prev, pageIndex: parseInt(value)}))}>
                          <SelectTrigger className="bg-white/10 border-white/30 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {content.pages.map((_, index) => (
                              <SelectItem key={index} value={index.toString()}>
                                Página {index + 1}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="text-white text-sm md:text-base">🔤 Texto do Botão</Label>
                    <Input
                      placeholder="Ex: Clique Aqui, Saiba Mais, Comprar..."
                      value={newButton.text}
                      onChange={(e) => setNewButton(prev => ({ ...prev, text: e.target.value }))}
                      className="bg-white/10 border-white/30 text-white placeholder:text-white/60 text-sm md:text-base"
                    />
                  </div>
                  <div>
                    <Label className="text-white text-sm md:text-base">🔗 URL de Destino</Label>
                    <Input
                      placeholder="https://exemplo.com/destino"
                      value={newButton.url}
                      onChange={(e) => setNewButton(prev => ({ ...prev, url: e.target.value }))}
                      className="bg-white/10 border-white/30 text-white placeholder:text-white/60 text-sm md:text-base"
                    />
                  </div>
                  <div>
                    <Label className="text-white text-sm md:text-base">🎨 Cor do Botão</Label>
                    <Input
                      type="color"
                      value={newButton.color}
                      onChange={(e) => setNewButton(prev => ({ ...prev, color: e.target.value }))}
                      className="bg-white/10 border-white/30 h-10 md:h-12"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleAddButton} 
                    className="w-full bg-white text-purple-600 hover:bg-white/90 text-sm md:text-base font-bold"
                    disabled={!newButton.text || !newButton.url}
                  >
                    {newButton.selectedPages.length > 0
                      ? `✅ Adicionar às ${newButton.selectedPages.length} páginas selecionadas`
                      : `📄 Adicionar à página ${newButton.pageIndex + 1}`
                    }
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-sm border-white/20 shadow-2xl">
                <CardHeader className="pb-3 md:pb-6">
                  <CardTitle className="text-white text-lg md:text-xl">Botões por Página</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 md:space-y-4 max-h-96 overflow-y-auto">
                    {content.pages.map((page, pageIndex) => (
                      <div key={pageIndex}>
                        <h4 className="text-white font-semibold mb-2 text-sm md:text-base">Página {pageIndex + 1}</h4>
                        <div className="space-y-2">
                          {page.buttons.map((button, buttonIndex) => (
                            <div 
                              key={buttonIndex} 
                              className="p-2 md:p-3 bg-white/10 rounded-lg border border-white/20"
                            >
                              <div className="text-white font-semibold text-sm md:text-base">{button.text}</div>
                              <div className="text-white/70 text-xs md:text-sm truncate">{button.url}</div>
                              <div 
                                className="w-4 h-4 rounded mt-1"
                                style={{ backgroundColor: button.color }}
                              ></div>
                            </div>
                          ))}
                          {page.buttons.length === 0 && (
                            <div className="text-white/50 text-xs md:text-sm italic">Nenhum botão nesta página</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Forms Tab */}
          <TabsContent value="forms" className="mt-4 md:mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <Card className="bg-white/5 backdrop-blur-sm border-white/20 shadow-2xl transform hover:translate-y-1 md:hover:translate-y-2 transition-all duration-300">
                <CardHeader className="pb-3 md:pb-6">
                  <CardTitle className="text-white flex items-center gap-2 text-lg md:text-xl">
                    <FileSpreadsheet className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="text-sm md:text-base">Criar Formulário</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 md:space-y-4">
                  {/* Seleção de páginas múltiplas para formulários */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-white text-sm md:text-base">
                        📝 Selecionar Páginas ({newForm.selectedPages.length} selecionadas)
                      </Label>
                      <Button
                        onClick={handleSelectAllFormPages}
                        variant="outline"
                        size="sm"
                        className="bg-white/10 border-white/30 text-white hover:bg-white/20 text-xs"
                      >
                        {newForm.selectedPages.length === content.pages.length ? 'Desselecionar Todas' : 'Selecionar Todas'}
                      </Button>
                    </div>
                    
                    {/* Grid de seleção de páginas para formulários */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto bg-white/5 p-3 rounded-lg border border-white/20">
                      {content.pages.map((page, index) => (
                        <div
                          key={index}
                          onClick={() => handleToggleFormPage(index)}
                          className={`relative cursor-pointer border-2 rounded-lg p-2 transition-all duration-200 hover:scale-105 ${
                            newForm.selectedPages.includes(index)
                              ? 'border-blue-400 bg-blue-500/20'
                              : 'border-white/30 bg-white/5 hover:border-white/60'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-white text-xs font-medium">
                              Página {index + 1}
                            </span>
                            {newForm.selectedPages.includes(index) ? (
                              <CheckSquare className="w-4 h-4 text-blue-400" />
                            ) : (
                              <Square className="w-4 h-4 text-white/40" />
                            )}
                          </div>
                          <div className="text-xs text-white/60 mt-1">
                            {page.pdfUrl ? '📄 PDF' : '📝 Vazia'} • {page.forms.length} forms
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Fallback para página individual se nenhuma selecionada */}
                    {newForm.selectedPages.length === 0 && (
                      <div className="mt-3">
                        <Label className="text-white/70 text-xs">📍 Página Individual (fallback)</Label>
                        <Select value={newForm.pageIndex.toString()} onValueChange={(value) => setNewForm(prev => ({...prev, pageIndex: parseInt(value)}))}>
                          <SelectTrigger className="bg-white/10 border-white/30 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {content.pages.map((_, index) => (
                              <SelectItem key={index} value={index.toString()}>
                                Página {index + 1}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="text-white text-sm md:text-base">📝 Nome do Formulário</Label>
                    <Input
                      placeholder="Ex: Contato, Newsletter, Cadastro..."
                      value={newForm.name}
                      onChange={(e) => setNewForm(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-white/10 border-white/30 text-white placeholder:text-white/60 text-sm md:text-base"
                    />
                  </div>
                  <div>
                    <Label className="text-white text-sm md:text-base">🏷️ Campos do Formulário</Label>
                    <div className="max-h-40 overflow-y-auto space-y-2">
                      {newForm.fields.map((field, index) => (
                        <Input
                          key={index}
                          value={field}
                          onChange={(e) => handleFormFieldChange(index, e.target.value)}
                          placeholder={`Campo ${index + 1} (ex: Nome, Email, Telefone...)`}
                          className="bg-white/10 border-white/30 text-white placeholder:text-white/60 text-sm md:text-base"
                        />
                      ))}
                    </div>
                    <Button 
                      onClick={handleAddFormField}
                      variant="outline"
                      size="sm"
                      className="mt-2 bg-white/10 border-white/30 text-white hover:bg-white/20 w-full text-xs md:text-sm"
                    >
                      ➕ Adicionar Campo
                    </Button>
                  </div>
                  
                  <Button 
                    onClick={handleAddForm} 
                    className="w-full bg-white text-purple-600 hover:bg-white/90 text-sm md:text-base font-bold"
                    disabled={!newForm.name || !newForm.fields.some(field => field.trim())}
                  >
                    {newForm.selectedPages.length > 0
                      ? `✅ Criar nas ${newForm.selectedPages.length} páginas selecionadas`
                      : `📝 Criar na página ${newForm.pageIndex + 1}`
                    }
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-sm border-white/20 shadow-2xl">
                <CardHeader className="pb-3 md:pb-6">
                  <CardTitle className="text-white text-lg md:text-xl">Formulários por Página</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 md:space-y-4 max-h-96 overflow-y-auto">
                    {content.pages.map((page, pageIndex) => (
                      <div key={pageIndex}>
                        <h4 className="text-white font-semibold mb-2 text-sm md:text-base">Página {pageIndex + 1}</h4>
                        <div className="space-y-2">
                          {page.forms.map((form, formIndex) => (
                            <div 
                              key={formIndex} 
                              className="p-2 md:p-3 bg-white/10 rounded-lg border border-white/20"
                            >
                              <div className="text-white font-semibold text-sm md:text-base">{form.name}</div>
                              <div className="text-white/70 text-xs md:text-sm">
                                Campos: {form.fields.join(', ')}
                              </div>
                            </div>
                          ))}
                          {page.forms.length === 0 && (
                            <div className="text-white/50 text-xs md:text-sm italic">Nenhum formulário nesta página</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="mt-4 md:mt-6">
            <Card className="bg-white/5 backdrop-blur-sm border-white/20 shadow-2xl transform hover:translate-x-1 md:hover:translate-x-2 transition-all duration-300">
              <CardHeader className="pb-3 md:pb-6">
                <CardTitle className="text-white flex items-center gap-2 text-lg md:text-xl">
                  <Eye className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="text-sm md:text-base">Log de Acesso</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 md:space-y-3 max-h-96 overflow-y-auto">
                  {content.accessLogs.length === 0 ? (
                    <div className="text-white/60 text-center py-6 md:py-8 text-sm md:text-base">
                      Nenhum acesso registrado ainda
                    </div>
                  ) : (
                    content.accessLogs.map((log, index) => (
                      <div 
                        key={index}
                        className="p-2 md:p-3 bg-white/10 rounded-lg border border-white/20 flex flex-col md:flex-row md:justify-between gap-2"
                      >
                        <div className="text-white">
                          <div className="font-semibold text-sm md:text-base">Página {log.page}</div>
                          <div className="text-xs md:text-sm text-white/70">{log.ip}</div>
                        </div>
                        <div className="text-white/60 text-xs md:text-sm self-start md:self-center">{log.date}</div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Design Tab */}
          <TabsContent value="design" className="mt-4 md:mt-6">
            <Card className="bg-white/5 backdrop-blur-sm border-white/20 shadow-2xl transform hover:translate-y-1 md:hover:translate-y-2 transition-all duration-300">
              <CardHeader className="pb-3 md:pb-6">
                <CardTitle className="text-white flex items-center gap-2 text-lg md:text-xl">
                  <Palette className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="text-sm md:text-base">Fundo Global</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="https://exemplo.com/background.jpg"
                  value={content.backgroundImage}
                  onChange={(e) => setContent(prev => ({ ...prev, backgroundImage: e.target.value }))}
                  className="bg-white/10 border-white/30 text-white placeholder:text-white/60 text-sm md:text-base"
                />
                {content.backgroundImage && (
                  <div className="mt-3 md:mt-4">
                    <img 
                      src={content.backgroundImage} 
                      alt="Preview" 
                      className="w-full h-24 md:h-32 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Generated URL Display */}
        {generatedUrl && (
          <Card className="mt-4 md:mt-6 bg-white/10 backdrop-blur-sm border-white/30 shadow-2xl">
            <CardHeader className="pb-3 md:pb-6">
              <CardTitle className="text-white flex items-center gap-2 text-lg md:text-xl">
                <Link2 className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-sm md:text-base">Link Oficial Gerado</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white/5 p-3 md:p-4 rounded-lg border border-white/20">
                <code className="text-white text-xs md:text-sm break-all leading-relaxed">{generatedUrl}</code>
              </div>
              <div className="mt-3 md:mt-4 text-white/80 text-xs md:text-sm">
                ✓ Link copiado! Compartilhe para que outros vejam sua revista.
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};