const Guide = () => {
  return (
    <div className="sm:text-lg bg-[#151515] tracking-tight px-4 leading-tight font-medium text-white">
      {guideData.map((roleData, roleIndex) => (
        <div key={roleIndex} className="mt-10">
          <h2 className="mb-4 text-2xl font-bold text-white">
            {roleData.role}
          </h2>
          {roleData.steps.map((step, stepIndex) => {
            const [before, highlight, after] = step.split("**");

            return (
              <p key={stepIndex} className="flex items-start gap-3 mb-4">
                {/* Step circle */}
                <span className="border-2 border-green-700 text-green-700 text-sm font-bold rounded-full w-8 h-8 flex justify-center items-center flex-shrink-0 mt-1">
                  {stepIndex + 1}
                </span>
                {/* Step description */}
                <span className="text-gray-300">
                  {before}
                  {highlight && (
                    <span className=" text-green-700 rounded  mx-1">
                      {highlight}
                    </span>
                  )}
                  {after}
                </span>
              </p>
            );
          })}
        </div>
      ))}
    </div>
  );
};

const guideData = [
  {
    role: "Sender",
    steps: [
      "Create Room: Click **Create Room** to generate a code.",
      "Share Code/QR: Provide the **code or QR** to the receiver.",
      "Send Files: Upload files and click **Send File**.",
      "Data Loss: Files will be lost if the page is **refreshed** or the session is interrupted.",
    ],
  },
  {
    role: "Receiver",
    steps: [
      "Join Room: Enter the **code or scan the QR**.",
      "Download Files: Click **Download** to save files.",
      "Data Loss: **Download** files before the page is refreshed, as they will disappear.",
    ],
  },
];

export default Guide;
