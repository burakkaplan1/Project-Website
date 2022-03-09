import React, { useEffect } from "react";
import ProfileInfo from "./ProfileInfo";
import HeaderInsta from "../HeaderInsta";

const Profile = (props) => {
  return (
    <div>
      <HeaderInsta />
      <ProfileInfo
        ProfileImage={props.ProfileImage}
        Username={props.Username}
        PostNumber={props.PostNumber}
        FollowerNumber={props.FollowerNumber}
        FollowingNumber={props.FollowingNumber}
        name={props.name}
        Bio={props.Bio}
        signedIn={props.signedIn}
        disabled={props.disabled}
        followButton={props.followButton}
        editButton={props.editButton}
        following={props.following}
      />
      <h1>{props.userID}</h1>
    </div>
  );
};

export default Profile;
