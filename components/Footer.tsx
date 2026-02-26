export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950 px-6 py-10 text-sm text-white/70">
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
        <p>Reality Anchors Limited helps structural teams move from estimation to governed optimization.</p>
        <div>
          <p className="font-medium text-white">Links</p>
          <a href="#solutions" className="block hover:text-white">Solutions</a>
          <a href="#case-studies" className="block hover:text-white">Case Studies</a>
          <a href="#contact" className="block hover:text-white">Contact</a>
        </div>
        <div>
          <p className="font-medium text-white">Contact</p>
          <a href="mailto:hello@realityanchors.example" className="block hover:text-white">hello@realityanchors.example</a>
        </div>
      </div>
      <p className="mx-auto mt-6 max-w-7xl text-xs text-white/50">© {new Date().getFullYear()} Reality Anchors Limited</p>
    </footer>
  );
}
