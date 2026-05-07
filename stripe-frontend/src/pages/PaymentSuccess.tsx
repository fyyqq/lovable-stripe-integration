import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const PaymentSuccess = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="container mx-auto px-4">
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="pt-12 pb-8 px-8">
              <div className="w-16 h-16 bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Payment Successful!
              </h1>
              
              <p className="text-muted-foreground mb-8">
                Thank you for your purchase. Your subscription is now active and you can start using all the features.
              </p>
              
              <div className="space-y-3">
                <Button asChild className="w-full">
                  <Link to="/dashboard">Go to Dashboard</Link>
                </Button>
                
                <Button asChild variant="outline" className="w-full">
                  <Link to="/">View Plans</Link>
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground mt-6">
                A confirmation email has been sent to your inbox.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PaymentSuccess;
