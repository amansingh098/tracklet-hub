
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import StatusBadge from "@/components/StatusBadge";
import { 
  getAllOrders,
  getOrderByTrackingId,
  createOrder,
  updateOrderStatus,
  updatePaymentStatus,
  getDashboardMetrics 
} from "@/lib/orderService";
import { Order, OrderStatus, PaymentStatus, DashboardMetrics } from "@/lib/types";
import { formatDate, formatCurrency } from "@/lib/utils";
import { 
  PackagePlus, 
  LogOut, 
  ClipboardList, 
  Search, 
  TrendingUp, 
  Package, 
  Truck, 
  DollarSign, 
  Clock, 
  CreditCard, 
  Wallet, 
  Receipt, 
  BarChart, 
  FileCheck
} from "lucide-react";

const Dashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  // Form states
  const [searchTrackingId, setSearchTrackingId] = useState("");
  const [searchResults, setSearchResults] = useState<Order | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  
  // New order form
  const [newOrder, setNewOrder] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    senderAddress: "",
    receiverAddress: "",
    packageDescription: "",
    weight: 1,
    amount: 0,
    paymentMethod: "cash",
    transactionId: "",
  });
  
  // Status update form
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [newStatus, setNewStatus] = useState<OrderStatus>("processing");
  const [statusLocation, setStatusLocation] = useState("");
  const [statusNote, setStatusNote] = useState("");
  
  // Payment update form
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("unpaid");
  const [paymentTransactionId, setPaymentTransactionId] = useState("");

  useEffect(() => {
    // Check authentication status
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // Redirect to login if not authenticated
        navigate("/login");
      } else {
        // Load orders if authenticated
        loadOrders();
        loadDashboardMetrics();
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const allOrders = await getAllOrders();
      setOrders(allOrders);
    } catch (error) {
      console.error("Error loading orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };
  
  const loadDashboardMetrics = async () => {
    setMetricsLoading(true);
    try {
      const dashboardMetrics = await getDashboardMetrics();
      setMetrics(dashboardMetrics);
    } catch (error) {
      console.error("Error loading metrics:", error);
      toast.error("Failed to load dashboard metrics");
    } finally {
      setMetricsLoading(false);
    }
  };

  const handleSearchOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTrackingId.trim()) {
      toast.error("Please enter a tracking ID");
      return;
    }
    
    setSearchLoading(true);
    
    try {
      const result = await getOrderByTrackingId(searchTrackingId);
      
      if (result) {
        setSearchResults(result);
        setSelectedOrderId(result.id || "");
      } else {
        setSearchResults(null);
        toast.error("No order found with this tracking ID");
      }
    } catch (error) {
      console.error("Error searching order:", error);
      toast.error("Failed to search for order");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (
      !newOrder.customerName ||
      !newOrder.customerPhone ||
      !newOrder.customerEmail ||
      !newOrder.senderAddress ||
      !newOrder.receiverAddress ||
      !newOrder.packageDescription ||
      newOrder.amount < 0
    ) {
      toast.error("Please fill in all required fields with valid values");
      return;
    }
    
    setLoading(true);
    
    try {
      const createdOrder = await createOrder({
        ...newOrder,
        weight: Number(newOrder.weight),
        amount: Number(newOrder.amount),
      });
      
      toast.success(`Order created with tracking ID: ${createdOrder.trackingId}`);
      
      // Reset form
      setNewOrder({
        customerName: "",
        customerPhone: "",
        customerEmail: "",
        senderAddress: "",
        receiverAddress: "",
        packageDescription: "",
        weight: 1,
        amount: 0,
        paymentMethod: "cash",
        transactionId: "",
      });
      
      // Refresh orders and metrics
      loadOrders();
      loadDashboardMetrics();
      
      // Switch to orders tab
      setActiveTab("orders");
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedOrderId) {
      toast.error("Please select an order");
      return;
    }
    
    if (!newStatus) {
      toast.error("Please select a status");
      return;
    }
    
    setLoading(true);
    
    try {
      await updateOrderStatus(
        selectedOrderId,
        newStatus,
        statusLocation || undefined,
        statusNote || undefined
      );
      
      toast.success("Order status updated successfully");
      
      // Reset form
      setStatusLocation("");
      setStatusNote("");
      
      // Refresh orders and metrics
      loadOrders();
      loadDashboardMetrics();
      
      // If this was from search, refresh the search result
      if (searchResults && searchResults.id === selectedOrderId) {
        const updatedOrder = await getOrderByTrackingId(searchResults.trackingId);
        setSearchResults(updatedOrder);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update order status");
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedOrderId) {
      toast.error("Please select an order");
      return;
    }
    
    setLoading(true);
    
    try {
      await updatePaymentStatus(
        selectedOrderId,
        paymentStatus,
        paymentTransactionId || undefined
      );
      
      toast.success("Payment status updated successfully");
      
      // Reset form
      setPaymentTransactionId("");
      
      // Refresh orders and metrics
      loadOrders();
      loadDashboardMetrics();
      
      // If this was from search, refresh the search result
      if (searchResults && searchResults.id === selectedOrderId) {
        const updatedOrder = await getOrderByTrackingId(searchResults.trackingId);
        setSearchResults(updatedOrder);
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
      toast.error("Failed to update payment status");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewOrder(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setNewOrder(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 pt-16 pb-10 bg-gray-50">
        <div className="container px-4 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Manage orders and track shipments
              </p>
            </div>
            
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full md:w-auto grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="create">New Order</TabsTrigger>
              <TabsTrigger value="update">Update Status</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center text-lg font-medium">
                      <Package className="mr-2 h-4 w-4 text-primary" />
                      Total Orders
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {metricsLoading ? "..." : metrics?.totalOrders || 0}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      All time orders
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center text-lg font-medium">
                      <DollarSign className="mr-2 h-4 w-4 text-green-500" />
                      Total Revenue
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">
                      {metricsLoading ? "..." : formatCurrency(metrics?.totalRevenue || 0)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      From all completed deliveries
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center text-lg font-medium">
                      <Truck className="mr-2 h-4 w-4 text-blue-500" />
                      In Transit
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">
                      {metricsLoading ? "..." : metrics?.inTransitOrders || 0}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Active shipments
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center text-lg font-medium">
                      <Clock className="mr-2 h-4 w-4 text-orange-500" />
                      Avg. Delivery Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-orange-600">
                      {metricsLoading 
                        ? "..." 
                        : metrics?.averageDeliveryTime 
                          ? metrics.averageDeliveryTime.toFixed(1) 
                          : "0"} days
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Based on completed deliveries
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-xl">Recent Orders</CardTitle>
                    <CardDescription>
                      Latest orders in the system
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    {loading ? (
                      <div className="text-center py-6">
                        <p>Loading orders...</p>
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="text-center py-6">
                        <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No orders found</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b text-left">
                              <th className="pb-3 font-medium">Tracking ID</th>
                              <th className="pb-3 font-medium">Customer</th>
                              <th className="pb-3 font-medium">Amount</th>
                              <th className="pb-3 font-medium">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {orders.slice(0, 5).map((order) => (
                              <tr key={order.id} className="hover:bg-blue-50/40 transition-colors">
                                <td className="py-3">{order.trackingId}</td>
                                <td className="py-3">{order.customerName}</td>
                                <td className="py-3">{formatCurrency(order.amount || 0)}</td>
                                <td className="py-3">
                                  <StatusBadge status={order.status} />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Order Status</CardTitle>
                    <CardDescription>
                      Current order status breakdown
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    {metricsLoading ? (
                      <div className="text-center py-6">
                        <p>Loading metrics...</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Pending</span>
                            <span className="font-medium">{metrics?.pendingOrders || 0}</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-yellow-400 rounded-full" 
                              style={{ 
                                width: metrics && metrics.totalOrders > 0 
                                  ? `${(metrics.pendingOrders / metrics.totalOrders) * 100}%` 
                                  : '0%' 
                              }}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">In Transit</span>
                            <span className="font-medium">{metrics?.inTransitOrders || 0}</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 rounded-full" 
                              style={{ 
                                width: metrics && metrics.totalOrders > 0 
                                  ? `${(metrics.inTransitOrders / metrics.totalOrders) * 100}%` 
                                  : '0%' 
                              }}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Delivered</span>
                            <span className="font-medium">{metrics?.deliveredOrders || 0}</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-green-500 rounded-full" 
                              style={{ 
                                width: metrics && metrics.totalOrders > 0 
                                  ? `${(metrics.deliveredOrders / metrics.totalOrders) * 100}%` 
                                  : '0%' 
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="orders" className="space-y-4">
              <div className="glass-morphism rounded-xl p-6">
                <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                  <h2 className="text-xl font-medium">Order List</h2>
                  <Button size="sm" onClick={loadOrders} disabled={loading}>
                    {loading ? "Loading..." : "Refresh"}
                  </Button>
                </div>
                
                {loading ? (
                  <div className="text-center py-10">
                    <p>Loading orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-10">
                    <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No orders found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-left">
                          <th className="pb-3 font-medium">Tracking ID</th>
                          <th className="pb-3 font-medium">Customer</th>
                          <th className="pb-3 font-medium">Date</th>
                          <th className="pb-3 font-medium">Amount</th>
                          <th className="pb-3 font-medium">Payment</th>
                          <th className="pb-3 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {orders.map((order) => (
                          <tr key={order.id} className="hover:bg-blue-50/40 transition-colors">
                            <td className="py-3">{order.trackingId}</td>
                            <td className="py-3">{order.customerName}</td>
                            <td className="py-3">{formatDate(order.createdAt)}</td>
                            <td className="py-3">{formatCurrency(order.amount || 0)}</td>
                            <td className="py-3">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                order.paymentStatus === 'paid' 
                                  ? 'bg-green-100 text-green-800' 
                                  : order.paymentStatus === 'partially_paid'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : order.paymentStatus === 'refunded'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {order.paymentStatus}
                              </span>
                            </td>
                            <td className="py-3">
                              <StatusBadge status={order.status} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="create">
              <div className="glass-morphism rounded-xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <PackagePlus className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-medium">Create New Order</h2>
                </div>
                
                <form onSubmit={handleCreateOrder} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Customer Information</h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="customerName">Customer Name</Label>
                        <Input
                          id="customerName"
                          name="customerName"
                          value={newOrder.customerName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="customerPhone">Phone Number</Label>
                        <Input
                          id="customerPhone"
                          name="customerPhone"
                          value={newOrder.customerPhone}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="customerEmail">Email Address</Label>
                        <Input
                          id="customerEmail"
                          name="customerEmail"
                          type="email"
                          value={newOrder.customerEmail}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Shipment Information</h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="senderAddress">Sender Address</Label>
                        <Input
                          id="senderAddress"
                          name="senderAddress"
                          value={newOrder.senderAddress}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="receiverAddress">Receiver Address</Label>
                        <Input
                          id="receiverAddress"
                          name="receiverAddress"
                          value={newOrder.receiverAddress}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="packageDescription">Package Description</Label>
                          <Input
                            id="packageDescription"
                            name="packageDescription"
                            value={newOrder.packageDescription}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="weight">Weight (kg)</Label>
                          <Input
                            id="weight"
                            name="weight"
                            type="number"
                            min="0.1"
                            step="0.1"
                            value={newOrder.weight}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide mb-4">Payment Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="amount">Delivery Fee</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                          <Input
                            id="amount"
                            name="amount"
                            type="number"
                            min="0"
                            step="0.01"
                            className="pl-8"
                            value={newOrder.amount}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="paymentMethod">Payment Method</Label>
                        <Select 
                          value={newOrder.paymentMethod} 
                          onValueChange={(value) => handleSelectChange("paymentMethod", value)}
                        >
                          <SelectTrigger id="paymentMethod">
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="credit_card">Credit Card</SelectItem>
                            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                            <SelectItem value="paypal">PayPal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="transactionId">Transaction ID (Optional)</Label>
                        <Input
                          id="transactionId"
                          name="transactionId"
                          value={newOrder.transactionId}
                          onChange={handleInputChange}
                          placeholder="For electronic payments"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 flex justify-end">
                    <Button type="submit" disabled={loading}>
                      {loading ? "Creating..." : "Create Order"}
                    </Button>
                  </div>
                </form>
              </div>
            </TabsContent>
            
            <TabsContent value="update" className="space-y-4">
              <div className="glass-morphism rounded-xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Search className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-medium">Find Order</h2>
                </div>
                
                <form onSubmit={handleSearchOrder} className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Input
                      placeholder="Enter tracking ID"
                      value={searchTrackingId}
                      onChange={(e) => setSearchTrackingId(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" disabled={searchLoading}>
                      {searchLoading ? "Searching..." : "Search"}
                    </Button>
                  </div>
                </form>
                
                {searchResults && (
                  <div className="mt-6 p-4 border rounded-lg bg-blue-50/50">
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                      <div>
                        <h3 className="font-medium">{searchResults.customerName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {searchResults.trackingId} • Created {formatDate(searchResults.createdAt)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <StatusBadge status={searchResults.status} />
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          searchResults.paymentStatus === 'paid' 
                            ? 'bg-green-100 text-green-800' 
                            : searchResults.paymentStatus === 'partially_paid'
                            ? 'bg-yellow-100 text-yellow-800'
                            : searchResults.paymentStatus === 'refunded'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {searchResults.paymentStatus || 'unpaid'} - {formatCurrency(searchResults.amount || 0)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                      <p>
                        <span className="text-muted-foreground">From:</span> {searchResults.senderAddress}
                      </p>
                      <p>
                        <span className="text-muted-foreground">To:</span> {searchResults.receiverAddress}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Package:</span> {searchResults.packageDescription}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Weight:</span> {searchResults.weight} kg
                      </p>
                      {searchResults.transactionId && (
                        <p>
                          <span className="text-muted-foreground">Transaction ID:</span> {searchResults.transactionId}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass-morphism rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Truck className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-medium">Update Status</h2>
                  </div>
                  
                  <form onSubmit={handleUpdateStatus} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="orderId">Select Order</Label>
                      <Select 
                        value={selectedOrderId} 
                        onValueChange={setSelectedOrderId}
                      >
                        <SelectTrigger id="orderId">
                          <SelectValue placeholder="Select an order" />
                        </SelectTrigger>
                        <SelectContent>
                          {orders.map((order) => (
                            <SelectItem key={order.id} value={order.id || ""}>
                              {order.trackingId} - {order.customerName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="status">New Status</Label>
                      <Select 
                        value={newStatus} 
                        onValueChange={(value) => setNewStatus(value as OrderStatus)}
                      >
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="in_transit">In Transit</SelectItem>
                          <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="failed_delivery">Failed Delivery</SelectItem>
                          <SelectItem value="returned">Returned</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="location">Location (Optional)</Label>
                      <Input
                        id="location"
                        value={statusLocation}
                        onChange={(e) => setStatusLocation(e.target.value)}
                        placeholder="e.g., New York Distribution Center"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="note">Note (Optional)</Label>
                      <Input
                        id="note"
                        value={statusNote}
                        onChange={(e) => setStatusNote(e.target.value)}
                        placeholder="e.g., Package received in good condition"
                      />
                    </div>
                    
                    <div className="pt-2">
                      <Button type="submit" disabled={loading || !selectedOrderId}>
                        {loading ? "Updating..." : "Update Status"}
                      </Button>
                    </div>
                  </form>
                </div>
                
                <div className="glass-morphism rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-medium">Update Payment</h2>
                  </div>
                  
                  <form onSubmit={handleUpdatePayment} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="orderIdPayment">Select Order</Label>
                      <Select 
                        value={selectedOrderId} 
                        onValueChange={setSelectedOrderId}
                      >
                        <SelectTrigger id="orderIdPayment">
                          <SelectValue placeholder="Select an order" />
                        </SelectTrigger>
                        <SelectContent>
                          {orders.map((order) => (
                            <SelectItem key={order.id} value={order.id || ""}>
                              {order.trackingId} - {order.customerName} - {formatCurrency(order.amount || 0)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="paymentStatus">Payment Status</Label>
                      <Select 
                        value={paymentStatus} 
                        onValueChange={(value) => setPaymentStatus(value as PaymentStatus)}
                      >
                        <SelectTrigger id="paymentStatus">
                          <SelectValue placeholder="Select payment status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unpaid">Unpaid</SelectItem>
                          <SelectItem value="partially_paid">Partially Paid</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="refunded">Refunded</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="transactionId">Transaction ID (Optional)</Label>
                      <Input
                        id="paymentTransactionId"
                        value={paymentTransactionId}
                        onChange={(e) => setPaymentTransactionId(e.target.value)}
                        placeholder="e.g., TXN123456789"
                      />
                    </div>
                    
                    <div className="pt-2">
                      <Button type="submit" disabled={loading || !selectedOrderId}>
                        {loading ? "Updating..." : "Update Payment"}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <footer className="py-6 bg-white border-t">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} TrackletHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
