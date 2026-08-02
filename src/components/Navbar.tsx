const navLink =
  "text-foreground transition-colors duration-200 hover:text-accent ";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-[1000] flex items-center justify-between px-8 py-4 pressStart text-[0.8rem] border-b-2 border-b-button shadow-md bg-nav-background">
      <div className="text-base text-navTitle">KQ Who?</div>
      <div className="flex gap-8">
        <a href="index.html" className={navLink}>
          Home
        </a>
        <a href="instructions.html" className={navLink}>
          Instructions
        </a>
        <a href="about.html" className={navLink}>
          About
        </a>
      </div>
    </nav>
  );
}
