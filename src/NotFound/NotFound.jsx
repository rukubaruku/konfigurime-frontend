import { Code, Database, FileText, Key, Terminal } from "lucide-react";
import "./notFound.css";

const NotFound = ({ menu, onAction }) => {
  const menus = [
    {
      menu: "credentials",
      title: "No credentials found",
      subtitle: "Get started by adding your first credential",
      icon: Key,
      button: "+ Add your first credential",
    },
    {
      menu: "commands",
      title: "No commands found",
      subtitle: "Get started by adding your first command",
      icon: Terminal,
      button: "+ Add your first command",
    },
    {
      menu: "scripts",
      title: "No scripts found",
      subtitle: "Get started by adding your first script",
      icon: Code,
      button: "+ Add your first script",
    },
    {
      menu: "queries",
      title: "No queries found",
      subtitle: "Get started by adding your first query",
      icon: Database,
      button: "+ Add your first query",
    },
    {
      menu: "configFiles",
      title: "No configuration files found",
      subtitle: "Get started by adding your first configuration file",
      icon: Key,
      button: "+ Add your first configuration file",
    },
    {
      menu: "notes",
      title: "No notes found",
      subtitle: "Get started by adding your first note",
      icon: FileText,
      button: "+ Add your first note",
    },
  ];

  const activeMenu = menus.find((m) => m.menu === menu);
  const Icon = activeMenu?.icon;

  return (
    <div className="not-found">
      <div className="not-found-icon">{Icon && <Icon size={40} />}</div>
      <div className="not-found-title">{activeMenu?.title}</div>
      <div className="not-found-subtitle">{activeMenu?.subtitle}</div>
      {activeMenu?.button && (
        <button
          className="not-found-button"
          onClick={() => onAction?.(activeMenu)}
        >
          {activeMenu.button}
        </button>
      )}
    </div>
  );
};

export default NotFound;
