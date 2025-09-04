import { Button } from "@/components/ui/button";
import { Settings, Home, BookOpen } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === "/";
  const isEditor = location.pathname === "/editor";
  const isMagazineView = location.pathname.startsWith("/magazine/");

  return (
    <div className="fixed top-4 left-4 z-50 flex gap-2">
      {!isHome && (
        <Button
          onClick={() => navigate("/")}
          variant="secondary"
          size="sm"
          className="bg-black/20 backdrop-blur-sm border-white/20 text-white hover:bg-black/40"
          title="Ir para Home"
        >
          <Home className="h-4 w-4" />
        </Button>
      )}
      
      {!isEditor && (
        <Button
          onClick={() => navigate("/editor")}
          variant="secondary"
          size="sm"
          className="bg-black/20 backdrop-blur-sm border-white/20 text-white hover:bg-black/40"
          title="Abrir Editor"
        >
          <Settings className="h-4 w-4" />
        </Button>
      )}

      {isMagazineView && (
        <Button
          onClick={() => navigate("/editor")}
          variant="secondary"
          size="sm"
          className="bg-purple-600/80 backdrop-blur-sm border-purple-400/30 text-white hover:bg-purple-600"
          title="Editar esta Revista"
        >
          <BookOpen className="h-4 w-4 mr-1" />
          Editar
        </Button>
      )}
    </div>
  );
};