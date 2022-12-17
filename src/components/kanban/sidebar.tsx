const Sidebar: React.FC<{ name: string; description: string }> = ({
  name,
  description,
}) => {
  return (
    <aside className="h-full w-72 bg-gray-50">
      <div className="flex flex-col justify-between gap-2 p-2">
        <p className="text-2xl font-bold">{name}</p>
        <p>{description}</p>
      </div>
    </aside>
  );
};

export default Sidebar;
