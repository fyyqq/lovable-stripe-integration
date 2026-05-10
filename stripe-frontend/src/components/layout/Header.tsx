import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";


const Header = () => {
  const { auth, loading } = useAuth();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navLinks = [
    { href: "/", label: "Pricing" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  const navLinksAuth = [
    { href: "/signin", label: "Sign in" },
    { href: "/signup", label: "Register" },
  ];

  const [isAuth, setIsAuth] = useState({
    "check_auth" : false,
    "user_data" : {}
  });

  const logoutFunc = async(elem) => {
    setIsSubmitting(true);

    try {
      const data = await fetch('http://localhost:8000/api/logout', {
        method: 'POST',
        credentials: "include", // send cookies
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      const data_json = await data.json();
      if (data.status == 200) {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else { 
        setIsSubmitting(false);
        return null; 
      }
    } catch (error) {
      setIsSubmitting(false);
      console.error(error.message);
    }
  }

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">S</span>
          </div>
          <span className="font-semibold text-foreground">SaaSFlow</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          {
          navLinks.map((link) => (
            // if url on /dashboard and user is not authenticated, do not show dashboard link
            !loading ? null : (link.href === '/dashboard' && !auth.check_auth) ? null : (
            <Link key={link.href} to={link.href}
              className={ cn("text-sm font-medium transition-colors hover:text-primary", location.pathname === link.href ? "text-primary" : "text-muted-primary" )} >{link.label}</Link>
            )
          ))
          }
        </nav>

        <div className="flex items-center gap-3">
          {/* if loading is false / done, do not show anything, if loading is false and user is not authenticated, show sign in and register button, if user is authenticated, show logout button */}
          { !loading ? null : !auth.check_auth ? (
            navLinksAuth.map((link) => (
              <Link key={link.href} to={link.href}>
                <Button variant={link.href === "/signin" ? "ghost" : ""} size="sm">
                  {link.label}
                </Button>
              </Link>
            ))
          ) : (
            <Button onClick={(e) => logoutFunc(e.currentTarget)} className="logout_btn" variant="destructive" size="sm" disabled={isSubmitting}>
              Logout
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
