import { XCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="container mx-auto px-4">
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="pt-12 pb-8 px-8">
              <div className="w-16 h-16 bg-destructive/10 flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-8 h-8 text-destructive" />
              </div>
              
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Payment Failed
              </h1>
              
              <p className="text-muted-foreground mb-8">
                We couldn't process your payment. Please check your card details and try again.
              </p>
              
              <div className="space-y-3">
                <Button onClick={() => navigate(-1)} className="w-full">
                  Try Again
                </Button>
                
                <Button asChild variant="outline" className="w-full">
                  <Link to="/">View Plans</Link>
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground mt-6">
                Need help? <a href="#" className="text-primary hover:underline">Contact support</a>
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PaymentFailed;
