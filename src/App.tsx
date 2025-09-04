import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Editor from "./pages/Editor";
import Magazine from "./pages/Magazine";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/edit" element={<Editor />} />
        <Route path="/admin" element={<Editor />} />
        <Route path="/settings" element={<Editor />} />
        <Route path="/magazine/:encodedContent" element={<Magazine />} />
        <Route path="/revista/:encodedContent" element={<Magazine />} />
        <Route path="/view/:encodedContent" element={<Magazine />} />
        {/* Garantir que o editor sempre esteja acessível em qualquer remix */}
        <Route path="*/editor" element={<Editor />} />
        <Route path="*/edit" element={<Editor />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
