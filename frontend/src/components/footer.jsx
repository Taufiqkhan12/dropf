const Footer = () => {
  return (
    <footer className="w-full bg-[#121212] mt-auto px-4 py-6">
      <div className="max-w-6xl mx-auto text-center space-y-2">
        <p className="text-sm text-[#6a6a6a] leading-tight tracking-tight">
          Built for Learning Purposes with Socket.io and Express to ensure fast,
          reliable, and secure file transfers. While we prioritize privacy and
          data integrity, please note that we are not responsible for any issues
          that may arise during file exchanges, including data loss, corruption,
          or unauthorized access. Use this platform at your own risk.
        </p>
        <p className="text-[15px] tracking-tight text-[#fafafa]">
          By{" "}
          <a
            href="https://taufiqkhan.vercel.app"
            target="_blank"
            className="hover:underline"
            rel="noopener noreferrer"
          >
            taufiq.
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
