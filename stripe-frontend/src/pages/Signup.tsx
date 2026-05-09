import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { set } from "date-fns";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [haveErrors, setHaveErrors] = useState(false);

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
    
    // const data = await fetch('http://127.0.0.1:8000/api/signup', {
    const data = await fetch('http://localhost:8000/api/signup', {
      method: 'POST',
      credentials: "include", // send cookies
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ fullName, email, password, password_confirmation: confirmPassword })
    })

    const res_json = await data.json();
    // localStorage.setItem('auth_token', res_json.access_token);
    const validate_errors = res_json.errors;

    const errorMap = {
      fullName: '#fullname_error_msg',
      email: '#email_error_msg',
      password: '#password_error_msg',
      password_confirmation: '#password_confirmation_error_msg',
    }

    Object.entries(errorMap).forEach(([key, value]) => {
      const elem = jQuery(errorMap[key]);
      
      if (validate_errors?.[key]) {
        jQuery(elem).removeClass('hidden').html(validate_errors[key][0]);
        setIsSubmitting(false);
        setHaveErrors(true);
      } else {
        jQuery(elem).addClass('hidden').html('');
        setHaveErrors(false);
      }
    });
    
    setTimeout(() => {
      setIsSubmitting(false);
      if (data.status == 200) { window.location.href = "/"; }
    }, 1000);
  };    

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
            <CardDescription>Get started with your free account</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                <p id="fullname_error_msg" className={`text-sm text-destructive hidden`}>{ '' }</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                  <p id="email_error_msg" className={`text-sm text-destructive hidden`}>{ '' }</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="position-relative">
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    name="password"
                    onChange={(e) => setPassword(e.target.value)}
                    />
                  <div className="p-0 m-0 position-absolute" style={{ top: '50%', right: '5px', transform: 'translate(-50%, -50%)', cursor: 'pointer' }} onClick={ (e) => viewPassword(e.currentTarget) }>
                    <i className="bi bi-eye"></i>
                    <i className="bi bi-eye-slash d-none"></i>
                  </div>
                </div>
                <p id="password_error_msg" className={`text-sm text-destructive hidden`}>{ '' }</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <div className="position-relative">
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    name="password_confirmation"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <div className="p-0 m-0 position-absolute" style={{ top: '50%', right: '5px', transform: 'translate(-50%, -50%)', cursor: 'pointer' }} onClick={ (e) => viewPassword(e.currentTarget) }>
                    <i className="bi bi-eye"></i>
                    <i className="bi bi-eye-slash d-none"></i>
                  </div>
                </div>
                <p id="password_confirmation_error_msg" className={`text-sm text-destructive hidden`}>{ '' }</p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={isSubmitting || haveErrors}>
                {isSubmitting || haveErrors ? "Creating account..." : "Create account"}
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Sign in
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

export default Signup;
