import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const viewPassword = (element) => {
    jQuery(element).siblings('input').attr('type', function(index, currentAttr) {
      const view_pass = jQuery(element).find('i.bi-eye');
      const hide_pass = jQuery(element).find('i.bi-eye-slash');

      if (currentAttr === 'password') {
        view_pass.addClass('d-none');
        hide_pass.removeClass('d-none');
        return 'text';
      } else {
        view_pass.removeClass('d-none');
        hide_pass.addClass('d-none');
        return 'password';
      }
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch("http://localhost:8000/sanctum/csrf-cookie", {
        credentials: "include"
      });
      
      const data = await fetch('http://localhost:8000/api/signin', {
        credentials: "include", // send cookies
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password, rememberMe })
      });
    
      const res_json = await data.json();

      const validate_errors = res_json.errors;
      const maxError = { email: '#email_error_msg', password: '#password_error_msg' }
  
      Object.entries(maxError).forEach(([key, value]) => {
        const elem = jQuery(maxError[key]);
  
        if (validate_errors?.[key]) {
          jQuery(elem).removeClass('hidden').html(validate_errors[key][0]);
        } else {
          jQuery(elem).addClass('hidden').html('');
        }
      });

      setTimeout(() => {
        setIsSubmitting(false);
        console.log(res_json);
        if (data.status == 200) { window.location.href = "/"; }
      }, 1000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription>Sign in to your account to continue</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <p id="email_error_msg" className="text-sm text-destructive hidden">&nbsp;</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="position-relative">
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div className="p-0 m-0 position-absolute" style={{ top: '50%', right: '5px', transform: 'translate(-50%, -50%)', cursor: 'pointer' }} onClick={ (e) => viewPassword(e.currentTarget) }>
                    <i className="bi bi-eye"></i>
                    <i className="bi bi-eye-slash d-none"></i>
                  </div>
                  <p id="password_error_msg" className="text-sm text-destructive hidden">&nbsp;</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                  />
                  <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                    Remember me
                  </Label>
                </div>
                <Link to="#" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Signing in..." : "Sign in"}
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary hover:underline font-medium">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Login;