import { ArrowCircleDownIcon } from "@phosphor-icons/react";

const ReceivedFile = ({ fileName, fileSize, onDownload }) => {
  return (
    <div className="bg-[#1E1E1E] border border-zinc-700 text-white rounded-lg p-4 flex items-center justify-between w-full max-w-md shadow-md">
      <div className="flex items-center gap-4">
        <div className="bg-green-600 rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold">
          {fileName.slice(0, 2).toUpperCase()}
        </div>
        <div className="flex flex-col">
          <span className="font-medium text-base truncate">{fileName}</span>
          <span className="text-sm text-zinc-400">
            {(fileSize / 1024).toFixed(1)} KB
          </span>
        </div>
      </div>
      <button onClick={onDownload} className="cursor-pointer">
        <ArrowCircleDownIcon size={32} />
      </button>
    </div>
  );
};

export default ReceivedFile;
