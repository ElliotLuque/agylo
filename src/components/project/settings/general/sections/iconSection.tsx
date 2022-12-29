import { getIconBg } from "../../../../../utils/colorSetter";
import ColorSelector from "../colorSelector";

const IconSection: React.FC<{
  iconId: number;
  projectId: number;
  setToast: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ iconId, projectId, setToast }) => {
  return (
    <div className="flex flex-col items-center gap-6 py-5">
      <span
        className={`mt-4 h-20 w-20 rounded-2xl ${getIconBg(iconId)}`}
      ></span>
      <ColorSelector projectId={projectId} setToast={setToast} />
    </div>
  );
};

export default IconSection;
