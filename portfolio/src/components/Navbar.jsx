const Navbar = () => {
  return (
    <div
      className="bg-cover h-screen w-full"
      style={{
        backgroundImage:
          'url("https://images.unsplash.com/photo-1468657988500-aca2be09f4c6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGRhcmslMjBzZWF8ZW58MHx8MHx8fDA%3D")',
      }}
    >
      <nav className="p-6 bg-transparent">
        <div className="w-[80%] mx-auto flex justify-between">
          <div>
            <h1 className="text-white">Chandan</h1>
          </div>
          <div className="text-white flex gap-10">
            <a href="home">Home</a>
            <a href="about">About</a>
            <a href="projects">Projects</a>
            <a href="contact">Contact</a>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
