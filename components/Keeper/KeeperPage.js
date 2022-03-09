import KeeperCards from "./KeeperCards";
import Upload from "./Upload";

const KeeperPage = () => {
  return (
    <div className="dark:bg-slate-900 bg-yellow-50/50 text-center p-10 flex flex-col justify-between font-mclaren">
      <h1 className="text-6xl text-yellow-600 dark:text-gray-200 mb-5">
        Keeper
      </h1>
      <div className="mb-5">
        <Upload />
      </div>
      <KeeperCards />
    </div>
  );
};

export default KeeperPage;
