const Footer = () => {
  return (
    <footer className="bg-[#f9fafc] border-t border-gray-200 py-6">
      <div className="px-40 flex justify-between items-center mx-auto px-4 font-[monospace] text-[11px]">
        <p className="text-center text-gray-500">MIRa · Music Information Retrieval Analysis</p>
        <p className="text-center text-gray-500">
          &copy; {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
};

export default Footer;