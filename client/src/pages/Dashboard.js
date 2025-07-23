import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getUserShops, deleteShop } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ShopList from '../components/shops/ShopList';
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { PlusCircle, Store, CheckCircle, Clock, LayoutGrid, Trash2, Edit, Eye, AlertCircle } from 'lucide-react';

const StatCard = ({ icon, title, value, delay }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay }}>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>{icon}</CardHeader>
      <CardContent><div className="text-2xl font-bold">{value}</div></CardContent>
    </Card>
  </motion.div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [shopToDelete, setShopToDelete] = useState(null);

  useEffect(() => {
    const fetchUserShops = async () => {
      try { setLoading(true); const response = await getUserShops(); setShops(response.data.shops); }
      catch (err) { setError(err.response?.data?.message || 'Failed to load shops'); }
      finally { setLoading(false); }
    };
    fetchUserShops();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!shopToDelete) return;
    try { await deleteShop(shopToDelete._id); setShops(shops.filter(shop => shop._id !== shopToDelete._id)); }
    catch (err) { alert(err.response?.data?.message || 'Failed to delete shop'); }
    finally { setShopToDelete(null); }
  };

  if (loading) { return <LoadingSpinner text="Loading your dashboard..." />; }

  const stats = [
    { title: "Total Shops", value: shops.length, icon: <Store className="h-4 w-4 text-muted-foreground" /> },
    { title: "Active Shops", value: shops.filter(s => s.isActive).length, icon: <CheckCircle className="h-4 w-4 text-muted-foreground" /> },
    { title: "Pending Review", value: shops.filter(s => !s.isActive).length, icon: <Clock className="h-4 w-4 text-muted-foreground" /> },
    { title: "Categories", value: new Set(shops.map(s => s.category)).size, icon: <LayoutGrid className="h-4 w-4 text-muted-foreground" /> },
  ];

  return (
    <>
      <div className="container mx-auto px-4 py-8 bg-gray-50/50 min-h-screen">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
            <div><h1 className="text-3xl font-bold tracking-tight">My Dashboard</h1><p className="text-muted-foreground mt-1">Welcome back, {user?.name}!</p></div>
            <Button asChild><Link to="/shop/create"><PlusCircle className="mr-2 h-4 w-4" /> Add New Shop</Link></Button>
          </div>
        </motion.div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat, i) => (<StatCard key={stat.title} {...stat} delay={0.1 * (i + 1)} />))}
        </div>
        {error && (<Card className="my-8 bg-destructive/10 border-destructive/50"><CardContent className="p-4 flex items-center text-destructive"><AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" /><span className="font-medium">{error}</span></CardContent></Card>)}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }}>
          <Card>
            <CardHeader><CardTitle>Your Shops</CardTitle></CardHeader>
            <CardContent>
              {shops.length > 0 ? (
                <div className="divide-y">
                  {shops.map(shop => (
                    <div key={shop._id} className="flex flex-wrap items-center justify-between gap-4 py-4">
                      <div className="grid gap-1"><p className="font-semibold">{shop.name}</p><div className="flex items-center gap-4 text-sm text-muted-foreground"><Badge variant="outline">{shop.category}</Badge><Badge variant={shop.isActive ? "secondary" : "destructive"}>{shop.isActive ? 'Active' : 'Pending'}</Badge></div></div>
                      <div className="flex items-center gap-1"><Button asChild variant="ghost" size="icon" title="View Shop"><Link to={`/shop/${shop._id}`}><Eye className="h-4 w-4" /></Link></Button><Button asChild variant="ghost" size="icon" title="Edit Shop"><Link to={`/shop/edit/${shop._id}`}><Edit className="h-4 w-4" /></Link></Button><Button onClick={() => setShopToDelete(shop)} variant="ghost" size="icon" title="Delete Shop"><Trash2 className="h-4 w-4 text-destructive" /></Button></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16"><Store className="mx-auto h-12 w-12 text-muted-foreground" /><h3 className="mt-4 text-lg font-medium">You haven't created any shops yet.</h3><p className="mt-1 text-sm text-muted-foreground">Get started by adding your first shop to the platform.</p><Button asChild className="mt-6"><Link to="/shop/create"><PlusCircle className="mr-2 h-4 w-4" />Create Your First Shop</Link></Button></div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <AlertDialog open={!!shopToDelete} onOpenChange={() => setShopToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone. This will permanently delete the shop "{shopToDelete?.name}" and all of its data.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
export default Dashboard;