import { CogIcon } from "@heroicons/react/outline";
import React from "react";
import { useRecoilState } from "recoil";
import {
  followersModalState,
  followingModalState,
  profileEditModalState,
} from "../../../atoms/states";

const ProfileInfo = (props) => {
  const [followerModal, setFollowerModal] = useRecoilState(followersModalState);
  const [followingModal, setFollowingModal] =
    useRecoilState(followingModalState);
  const [profileEditModal, setProfileEditModal] = useRecoilState(
    profileEditModalState
  );

  const handleProfileEdit = () => {
    setProfileEditModal(!profileEditModal);
  };
  return (
    <div className="flex items-start space-x-10 lg:space-x-24 mx-[3%] lg:mx-[15%] mt-10 border-b border-gray-300 pb-10">
      <img
        src={props.ProfileImage}
        alt=""
        className="rounded-full object-cover w-24 h-24 lg:w-36 lg:h-36"
      />
      <div>
        <div className="flex items-center space-x-12">
          <h1 className="text-3xl font-light ">{props.Username}</h1>
          {props.signedIn === true && (
            <button
              onClick={props.disabled ? props.followButton : handleProfileEdit}
              type="button"
              className="border border-md py-1.5 px-3 rounded-md font-semibold text-sm disabled:text-gray-100"
            >
              {props.disabled
                ? props.following === true
                  ? "following"
                  : "follow"
                : "Edit Profile"}
            </button>
          )}
          <button type="button">
            <CogIcon className="w-6 h-6 text-gray-700" />
          </button>
        </div>
        <div className="flex items-center space-x-4 mt-6">
          <h3 className="cursor-pointer">
            <strong>{props.PostNumber} </strong> posts
          </h3>
          <h3
            className="cursor-pointer"
            onClick={() => setFollowerModal(!followerModal)}
          >
            <strong>{props.FollowerNumber} </strong> followers
          </h3>
          <h3
            className="cursor-pointer"
            onClick={() => setFollowingModal(!followingModal)}
          >
            <strong>{props.FollowingNumber} </strong> following
          </h3>
        </div>
        <div className="mt-4">
          <h2 className="font-semibold"> {props.name}</h2>
          <p className="mt-2 w-2/3">{props.Bio}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
