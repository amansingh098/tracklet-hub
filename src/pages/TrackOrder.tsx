
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ClipboardCopy, MapPin, Package, Calendar, Clock, CircleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import StatusBadge from "@/components/StatusBadge";
import OrderTimeline from "@/components/OrderTimeline";
import { getOrderByTrackingId } from "@/lib/orderService";
import { Order } from "@/lib/types";
import { formatDate } from "@/lib/utils";

const TrackOrder = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [trackingId, setTrackingId] = useState<string>(searchParams.get("id") || "");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [notFound, setNotFound] = useState<boolean>(false);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      setTrackingId(id);
      handleTrackOrder(id);
    }
  }, [searchParams]);

  const handleTrackOrder = async (id: string) => {
    if (!id.trim()) {
      toast.error("Please enter a tracking ID");
      return;
    }

    setLoading(true);
    setNotFound(false);
    
    try {
      const result = await getOrderByTrackingId(id);
      
      if (result) {
        setOrder(result);
        setNotFound(false);
        // Update URL with tracking ID if it's not already there
        if (searchParams.get("id") !== id) {
          setSearchParams({ id });
        }
      } else {
        setOrder(null);
        setNotFound(true);
        toast.error("No order found with this tracking ID");
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      toast.error("Failed to retrieve order information");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleTrackOrder(trackingId);
  };

  const copyTrackingId = () => {
    if (order?.trackingId) {
      navigator.clipboard.writeText(order.trackingId);
      toast.success("Tracking ID copied to clipboard");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 pt-16 pb-20">
        <div className="container px-4 py-8 max-w-4xl">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold mb-4">Track Your Order</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Enter your tracking number to get detailed information about your shipment's journey.
            </p>
          </div>
          
          <div className="mb-10 glass-morphism rounded-xl p-6 max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="flex items-center gap-3">
              <Input
                type="text"
                placeholder="Enter tracking number"
                className="flex-1"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
              />
              <Button type="submit" disabled={loading}>
                {loading ? "Searching..." : "Track"}
              </Button>
            </form>
          </div>
          
          {loading && (
            <div className="rounded-xl glass-morphism p-6 space-y-4 animate-pulse">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          )}
          
          {notFound && !loading && (
            <div className="rounded-xl glass-morphism p-8 text-center">
              <CircleAlert className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-medium mb-2">No Order Found</h2>
              <p className="text-muted-foreground mb-6">
                We couldn't find any order with the tracking ID: <span className="font-medium">{trackingId}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Please check the tracking ID and try again, or contact customer support for assistance.
              </p>
            </div>
          )}
          
          {order && !loading && (
            <div className="rounded-xl glass-morphism overflow-hidden">
              {/* Header with basic info */}
              <div className="p-6 bg-white border-b">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-xl font-medium">Tracking ID: {order.trackingId}</h2>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={copyTrackingId}
                      >
                        <ClipboardCopy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Order created on {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <StatusBadge status={order.status} className="text-sm px-3 py-1" />
                </div>
              </div>
              
              {/* Order details section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                {/* Delivery info */}
                <div className="col-span-1 md:col-span-2 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Sender info */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>From</span>
                      </div>
                      <p className="text-sm">{order.senderAddress}</p>
                    </div>
                    
                    {/* Receiver info */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>To</span>
                      </div>
                      <p className="text-sm">{order.receiverAddress}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {/* Package info */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Package className="h-4 w-4" />
                        <span>Package</span>
                      </div>
                      <p className="text-sm">{order.packageDescription}</p>
                      <p className="text-sm">Weight: {order.weight} kg</p>
                    </div>
                    
                    {/* Estimated delivery */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Estimated Delivery</span>
                      </div>
                      <p className="text-sm">{formatDate(order.estimatedDelivery)}</p>
                    </div>
                    
                    {/* Last update */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Last Update</span>
                      </div>
                      <p className="text-sm">{formatDate(order.updatedAt)}</p>
                    </div>
                  </div>
                </div>
                
                {/* Customer info */}
                <div className="space-y-4 bg-blue-50/50 p-4 rounded-lg">
                  <h3 className="font-medium">Customer Information</h3>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="text-muted-foreground">Name:</span> {order.customerName}
                    </p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">Phone:</span> {order.customerPhone}
                    </p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">Email:</span> {order.customerEmail}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Timeline section */}
              <div className="p-6 border-t">
                <h3 className="font-medium mb-4">Shipping Timeline</h3>
                <OrderTimeline statusHistory={order.statusHistory} />
              </div>
            </div>
          )}
        </div>
      </main>
      
      <footer className="py-8 bg-white border-t">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} TrackletHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default TrackOrder;
