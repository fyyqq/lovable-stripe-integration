import { useState, useEffect } from "react";
import { ArrowUpRight, CreditCard, DollarSign, TrendingUp, Users } from "lucide-react";
import Header from "@/components/layout/Header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link, Outlet, useLocation, NavLink } from 'react-router-dom';
import { useAuth } from "@/hooks/useAuth";


function useTransactions() {
  const { auth } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const auth_id = auth?.user_data;
  // console.log("Auth ID in useTransactions:", auth_id);
  
  useEffect(() => {
    if (!auth_id?.id) return;
    fetch("http://127.0.0.1:8000/api/recent-transactions", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }).then(res => res.json())
    .then(data => data.transactions.filter(item => item.id !== null && item.user_id == auth_id.id).map(({ 
      user_id, name, email, created_at, updated_at, 
      stripe_id, type, amount, currency, status, reason 
    }) => ({
      user_id, name, email, created_at, updated_at, 
      stripe_id, type, amount, currency, status, reason
    })))
    .then(resultTransactions => setTransactions(resultTransactions));
  }, [auth_id]);
  
  return transactions;
}

const StatisticsCard = () => {
  const transactions = useTransactions();
  const countTotalPayments = transactions.filter(txn => txn.status === "succeeded").reduce((total, txn) => total + (txn.amount / 100), 0);
  const countActiveSubscriptions = transactions.filter(txn => txn.status === "succeeded").length;
  const countTotalSubscriptions = transactions.length;
  const averageOrderValue = countTotalSubscriptions > 0 ? (countTotalPayments / countTotalSubscriptions) : 0;

  const stats = [
    {
      title: "Total Succeeded Payments",
      value: `$${countTotalPayments.toFixed(2)}`,
      change: "+12%",
      icon: DollarSign,
    },
    {
      title: "Active Subscriptions",
      value: countActiveSubscriptions.toString(),
      change: "+8%",
      icon: Users,
    },
    {
      title: "Total Transactions",
      value: countTotalSubscriptions.toString(),
      change: "+23%",
      icon: TrendingUp,
    },
    {
      title: "Avg. Order Value",
      value: `$${averageOrderValue.toFixed(2)}`,
      change: "+5%",
      icon: CreditCard,
    },
  ];

  return stats;
}


const DisplayTransactions = () => {
  const transactions = useTransactions();
  const location = useLocation();

  const filter = location.pathname.split("/").pop();

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === "success") return transaction.status === "succeeded";
    if (filter === "failed") return transaction.status === "failed";
    if (filter === "pending") return transaction.status === "pending";
    return true; // For the "All Txns" view
  });

  return (
    <>
      {filteredTransactions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No transactions found</p>
        </div>
      ) : (
        filteredTransactions.map((transaction, index) => (
        <div key={transaction.stripe_id}>
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-muted flex items-center justify-center">
                <span className="text-xs font-medium text-muted-foreground">
                  {transaction.email.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{transaction.email}</p>
                <p className="text-xs text-muted-foreground">{transaction.type} • {transaction.stripe_id} • {transaction.updated_at}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">${(transaction.amount / 100).toFixed(2)}</p>
              <p className={`text-xs ${
                transaction.status === 'succeeded' ? 'text-success' :
                transaction.status === 'pending' ? 'text-muted-foreground' :
                'text-destructive'
              }`}>
                {transaction.status}
              </p>
            </div>
          </div>
          {index < filteredTransactions.length - 1 && <Separator />}
        </div>
      )))}
    </>
  );
}

const Dashboard = () => {
  const transactions = useTransactions();
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back! Here's your payment overview.</p>
            </div>
            <Link to="/">
              <Button className="mt-4 md:mt-0">
                <CreditCard className="w-4 h-4 mr-2" />
                New Transaction
              </Button>
            </Link>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {StatisticsCard().length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No transactions found</p>
              </div>
            ): (StatisticsCard().map((stat) => (
              <Card key={stat.title}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-primary/10 flex items-center justify-center">
                      <stat.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1">
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </CardContent>
              </Card>
            )))}
          </div>
          
          {/* Recent Transactions */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-foreground">Recent Transactions</h2>
                <nav className="flex items-center justify-between gap-4">
                  <NavLink to="." end className={ ({ isActive }) => (isActive ? "text-primary" : "") + " position-relative" }>All Txns <span className="badge position-absolute bg-dark px-3" style={{ "borderRadius": "25px", "height": "18px", "width": "18px", "margin": "-15px 0px 0 -6px" }}>
                      <p className="fw-normal" style={{ "transform": "translate(-7px, -1px)" }}>{transactions.length}</p>
                  </span>
                  </NavLink>
                  <NavLink to="success" className={ ({ isActive }) => (isActive ? "text-primary" : "") + " position-relative" }>Success <span className="badge position-absolute bg-dark px-3" style={{ "borderRadius": "25px", "height": "18px", "width": "18px", "margin": "-15px 0px 0 -6px" }}>
                    <p className="fw-normal" style={{ "transform": "translate(-7px, -1px)" }}>{transactions.filter(txns => txns.status === 'succeeded').length}</p>
                  </span>
                  </NavLink>
                  <NavLink to="failed" className={ ({ isActive }) => (isActive ? "text-primary" :  "") + " position-relative" }>Failed <span className="badge position-absolute bg-dark px-3" style={{ "borderRadius": "25px", "height": "18px", "width": "18px", "margin": "-15px 0px 0 -6px" }}>
                    <p className="fw-normal" style={{ "transform": "translate(-7px, -1px)" }}>{transactions.filter(txns => txns.status === 'failed').length}</p>
                  </span>
                  </NavLink>
                  <NavLink to="pending" className={ ({ isActive }) => (isActive ? "text-primary" : "") + " position-relative" }>Pending <span className="badge position-absolute bg-dark px-3" style={{ "borderRadius": "25px", "height": "18px", "width": "18px", "margin": "-15px 0px 0 -6px" }}>
                    <p className="fw-normal" style={{ "transform": "translate(-7px, -1px)" }}>{transactions.filter(txns => txns.status === 'pending').length}</p>
                  </span>
                  </NavLink>
                </nav>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                <Outlet />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export { DisplayTransactions };
export default Dashboard;
