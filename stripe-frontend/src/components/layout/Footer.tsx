import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/30 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">S</span>
              </div>
              <span className="font-semibold text-foreground">SaaSFlow</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Simple payments for modern businesses.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-foreground mb-4 text-sm">Product</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link></li>
              <li><Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-foreground mb-4 text-sm">Company</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-foreground mb-4 text-sm">Legal</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 SaaSFlow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
