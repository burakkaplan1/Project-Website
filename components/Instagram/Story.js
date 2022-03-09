import { useRecoilState } from "recoil";
import { StoryModal, StoryId } from "../../atoms/states";

const Story = (props) => {
  const [open, setOpen] = useRecoilState(StoryModal);
  const [StoryID, setStoryID] = useRecoilState(StoryId);
  const storyDisplay = () => {
    setOpen(true);
    setStoryID(props.id);
  };
  return (
    <div
      className="flex flex-col items-center text-center cursor-pointer"
      onClick={storyDisplay}
      id={props.id}
    >
      <img
        src={props.image}
        alt=""
        className="p-[1.5px] border-red-500 border-2 object-contain cursor-pointer rounded-full h-14 w-14 hover:scale-110 transition transform duration-200 ease-out "
      />
      <p className="w-[80px] truncate overflow-hidden">{props.username}</p>
    </div>
  );
};

export default Story;
