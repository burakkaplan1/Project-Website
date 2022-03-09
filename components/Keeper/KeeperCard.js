import ReactHtmlParser from "react-html-parser";
import { TrashIcon } from "@heroicons/react/outline";
import Moment from "react-moment";
import { useState } from "react";

const KeeperCard = (props) => {
  return (
    <div className="relative max-w-sm h-56 shadow-lg flex flex-col space-y-3 rounded-md bg-yellow-100 dark:bg-slate-200">
      <div className="border-b bg-yellow-400 dark:bg-slate-500 border-yellow-500 dark:border-slate-400 py-4 px-2 overflow-hidden">
        <div>
          <span className="font-semibold text-xl text-ellipsis">
            {props.title}
          </span>
        </div>
      </div>

      <div className="overflow-auto h-full ">
        <span className="line-clamp-3 hover:line-clamp-none dark:text-slate-700">
          {ReactHtmlParser(props.Text)}
        </span>
      </div>
      <Moment className="absolute bottom-3 left-1 text-slate-500" fromNow>
        {props.Time}
      </Moment>
      <button
        type="button"
        className="absolute bottom-1 right-2 rounded-full flex items-center justify-center bg-yellow-500 p-2 shadow-lg hover:shadow-md"
        onClick={props.onDelete}
      >
        <TrashIcon className="w-7 h-7 text-yellow-50" />
      </button>
    </div>
  );
};

export default KeeperCard;
