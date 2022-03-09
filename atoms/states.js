import { atom } from "recoil";

export const uploadModalState = atom({
  key: "uploadModalState",
  default: false,
});
export const storyUploadState = atom({
  key: "storyUploadState",
  default: false,
});
export const followersModalState = atom({
  key: "followersModalState",
  default: false,
});
export const followingModalState = atom({
  key: "followingModalState",
  default: false,
});

export const profileEditModalState = atom({
  key: "profileEditButton",
  default: false,
});

export const StoryModal = atom({
  key: "StoryModal",
  default: false,
});

export const StoryId = atom({
  key: "StoryId",
  default: 0,
});
