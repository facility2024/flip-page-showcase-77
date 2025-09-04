import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, BookOpen, Home, Link2, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const AdminPanel = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: "Ver Revista",
      description: "Visualizar a revista na home",
      icon: Home,
      action: () => navigate("/"),
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      title: "Editor",
      description: "Editar conteúdo da revista",
      icon: Settings,
      action: () => navigate("/editor"),
      color: "bg-purple-500 hover:bg-purple-600"
    },
    {
      title: "Gerar Link",
      description: "Criar link compartilhável",
      icon: Link2,
      action: () => {
        const content = localStorage.getItem("magazineContent");
        if (content) {
          const encodedContent = btoa(content);
          const url = `${window.location.origin}/magazine/${encodedContent}`;
          navigator.clipboard.writeText(url);
          toast.success("Link copiado!");
        } else {
          toast.error("Nenhum conteúdo para compartilhar");
        }
      },
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      title: "Backup",
      description: "Baixar configuração",
      icon: Download,
      action: () => {
        const content = localStorage.getItem("magazineContent");
        if (content) {
          const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(content);
          const linkElement = document.createElement('a');
          linkElement.setAttribute('href', dataUri);
          linkElement.setAttribute('download', 'revista-backup.json');
          linkElement.click();
          toast.success("Backup baixado!");
        } else {
          toast.error("Nenhum conteúdo para fazer backup");
        }
      },
      color: "bg-orange-500 hover:bg-orange-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Painel Administrativo</h1>
          <p className="text-white/80">Gerencie sua revista digital</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {quickActions.map((action, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300">
              <CardHeader className="text-center">
                <div className={`w-16 h-16 ${action.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <action.icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-white text-lg">{action.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-white/80 text-sm mb-4">{action.description}</p>
                <Button 
                  onClick={action.action}
                  className={`w-full ${action.color} text-white border-0`}
                >
                  Acessar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 max-w-2xl mx-auto">
            <BookOpen className="h-12 w-12 text-white/60 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Sistema de Revista Digital</h3>
            <p className="text-white/80 text-sm">
              Todas as funcionalidades estão sempre disponíveis através dos botões de navegação. 
              O editor está permanentemente acessível em qualquer remix ou cópia do projeto.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};