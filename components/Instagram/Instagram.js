import HeaderInsta from "./HeaderInsta";
import Posts from "./Posts";
import Stories from "./Stories";
import StoryUpload from "./StoryUpload";
import UploadInstagram from "./UploadInstagram";
import StoryModalComponent from "./StoryModalComponent";
import Suggestions from "./Suggestions";
const Instagram = () => {
  return (
    <div className="dark:bg-gray-900">
      <HeaderInsta />

      <div className="grid lg:grid-cols-5 lg:space-x-5 justify-evenly pt-10 mx-auto w-[70%]">
        <div className="lg:col-span-3 h-[100vh] overflow-y-scroll">
          <Stories />
          <Posts />
          <UploadInstagram />
          <StoryUpload />
          <StoryModalComponent />
        </div>
        <div className="w-full h-screen hidden lg:inline-block lg:col-span-2">
          <Suggestions />
        </div>
      </div>
    </div>
  );
};

export default Instagram;
