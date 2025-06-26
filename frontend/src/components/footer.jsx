const Footer = () => {
  return (
    // <footer className="pb-4  bg-[#121212] h-auto text-[#6a6a6a] flex flex-col justify-center items-center">
    //   <p className=" text-[12px] mb-2">
    //     Built for Learning Purposes with Socket.io and Express to ensure fast,
    //     reliable, and secure file transfers. While we prioritize privacy and
    //     data integrity, please note that <br /> we are not responsible for any
    //     issues that may arise during file exchanges, including data loss,
    //     corruption, or unauthorized access. Use this platform at your own risk.
    //   </p>
    //   <p className="  text-[#fafafa] text-[12px] sm:text-lg cursor-pointer">
    //     Guide
    //   </p>
    // </footer>
    <footer className="bg-[#121212] py-2 px-4">
      <div className="max-w-6xl mx-auto space-y-4">
        <p className="text-xs sm:text-sm text-[#616161] text-center leading-relaxed tracking-tight">
          Built for Learning Purposes with Socket.io and Express to ensure fast,
          reliable, and secure file transfers. While we prioritize privacy and
          data integrity, please note that we are not responsible for any issues
          that may arise during file exchanges, including data loss, corruption,
          or unauthorized access. Use this platform at your own risk.
        </p>
        <p className="text-center text-sm sm:text-base tracking-tight text-white">
          By{" "}
          <a
            href="https://taufiqkhan.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            taufiq.
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
