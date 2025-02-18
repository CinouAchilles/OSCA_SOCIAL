import RightPanel from "../../component/common/RightPanel";
import Sidebar from "../../component/common/Sidebar";
import SidebarPhone from "../../component/common/SidebarPhone";

export default function Bookmarks() {
    
  return (
    <div className="min-h-screen flex text-white">
      <Sidebar />
      <div className="min-h-screen overflow-y-scroll border-r border-gray-700 h-screen scrollbar-custom md:w-auto md:mb-0 flex-1 pb-14 md:pb-0">
        <h1 className="text-white">Bookmarks</h1>
      </div>

      <SidebarPhone />
      <RightPanel />

    </div>
  );
}
