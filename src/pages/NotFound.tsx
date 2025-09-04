import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { AdminPanel } from "@/components/AdminPanel";
import { Button } from "@/components/ui/button";
import { Home, Settings } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Se a URL contém /editor, /edit, /admin, redirecionar para o editor
  useEffect(() => {
    const path = location.pathname.toLowerCase();
    if (path.includes('/editor') || path.includes('/edit') || path.includes('/admin')) {
      navigate('/editor', { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-white mb-4">404</h1>
          <p className="text-xl text-white/80 mb-6">Página não encontrada</p>
          <p className="text-white/60 mb-8">Mas você pode acessar qualquer funcionalidade abaixo:</p>
          
          <div className="flex gap-4 justify-center mb-8">
            <Button 
              onClick={() => navigate("/")}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Home className="h-4 w-4 mr-2" />
              Ir para Home
            </Button>
            <Button 
              onClick={() => navigate("/editor")}
              className="bg-purple-500 hover:bg-purple-600 text-white"
            >
              <Settings className="h-4 w-4 mr-2" />
              Abrir Editor
            </Button>
          </div>
        </div>

        <AdminPanel />
      </div>
    </div>
  );
};

export default NotFound;
