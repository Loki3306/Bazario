import React from 'react';
import ShopCard from './ShopCard';
import LoadingSpinner from '../common/LoadingSpinner';
import { Card, CardContent } from "../ui/card";
import { AlertTriangle, ShoppingBag } from 'lucide-react';

const ShopList = ({ shops, loading, error }) => {
  if (loading) {
    return <LoadingSpinner text="Loading shops..." />;
  }
  if (error) {
    return (
      <Card className="my-8 text-center"><CardContent className="p-10"><AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" /><h3 className="text-xl font-semibold text-destructive mb-2">Error Loading Shops</h3><p className="text-muted-foreground">{error}</p></CardContent></Card>
    );
  }
  if (!shops || shops.length === 0) {
    return (
      <Card className="my-8 text-center"><CardContent className="p-12"><ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" /><h3 className="text-2xl font-semibold mb-2">No Shops Found</h3><p className="text-muted-foreground">Try adjusting your search or check back later.</p></CardContent></Card>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {shops.map((shop, index) => (<ShopCard key={shop._id} shop={shop} index={index} />))}
    </div>
  );
};
export default ShopList;