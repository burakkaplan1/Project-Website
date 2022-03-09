const Comments = (props) => {
  return (
    <div className="flex items-center space-x-2 text-sm">
      <h3 className="font-semibold">{props.CommentUser}:</h3>
      <p className="line-clamp-1 hover:line-clamp-none">{props.userComment}</p>
    </div>
  );
};

export default Comments;
