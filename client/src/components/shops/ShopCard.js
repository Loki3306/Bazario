import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { MapPin, Phone, MessageSquare, ExternalLink } from 'lucide-react';

const cardVariants = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
};

const ShopCard = ({ shop, index }) => {
  const handleWhatsApp = (e) => {
    e.preventDefault();
    const phone = shop.contact.whatsapp || shop.contact.phone;
    const message = `Hi! I found your shop "${shop.name}" on LocalConnect and I'm interested.`;
    const url = `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  const handleCall = (e) => {
    e.preventDefault();
    window.open(`tel:${shop.contact.phone}`, '_self');
  };

  return (
    <motion.div variants={cardVariants} initial="initial" animate="animate" transition={{ duration: 0.5, delay: (index || 0) * 0.1 }}>
      <Card className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="p-0 relative">
          <div className="h-48 bg-gray-200">
            <img src={shop.images?.[0]?.url || 'https://i.imgur.com/K7w7USh.png'} alt={shop.images?.[0]?.alt || shop.name} className="w-full h-full object-cover"/>
          </div>
          <Badge variant="secondary" className="absolute top-3 left-3">{shop.category.charAt(0).toUpperCase() + shop.category.slice(1)}</Badge>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="mb-2 text-xl font-semibold tracking-tight">{shop.name}</CardTitle>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{shop.description || 'No description provided.'}</p>
          <div className="flex items-center text-sm text-muted-foreground"><MapPin className="w-4 h-4 mr-2 flex-shrink-0" /><span>{shop.address?.city}, {shop.address?.state}</span></div>
        </CardContent>
        <CardFooter className="p-4 flex justify-between items-center">
          <Button asChild variant="outline" size="sm"><Link to={`/shop/${shop._id}`}><ExternalLink className="w-4 h-4 mr-2" />View Details</Link></Button>
          <div className="flex space-x-1">
            {shop.contact?.whatsapp && (<Button onClick={handleWhatsApp} size="icon" variant="ghost" title="Chat on WhatsApp"><MessageSquare className="w-5 h-5" style={{ color: 'hsl(var(--secondary))' }} /></Button>)}
            {shop.contact?.phone && (<Button onClick={handleCall} size="icon" variant="ghost" title="Call Shop"><Phone className="w-5 h-5" style={{ color: 'hsl(var(--primary))' }}/></Button>)}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
export default ShopCard;