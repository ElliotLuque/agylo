import Header from "./header";
import Sidebar from "../kanban/sidebar";
import type { ReactElement } from "react";

const KanbanLayout: React.FC<{children: ReactElement, name: string, description: string}> = ({ children, name, description }) => {
    return <div className="flex h-screen flex-col">
      <Header />
      <main className="flex h-full flex-row">
        <Sidebar
          name={name}
          description={description}
        />
        {children}
      </main>
    </div>
}

export default KanbanLayout;