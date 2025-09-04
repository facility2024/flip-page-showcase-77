import { MagazineEditor } from "@/components/MagazineEditor";
import { Navigation } from "@/components/Navigation";

const Editor = () => {
  return (
    <div className="relative">
      <Navigation />
      <MagazineEditor />
    </div>
  );
};

export default Editor;