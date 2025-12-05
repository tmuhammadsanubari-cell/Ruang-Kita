// View - Facilities List Page
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useData } from '../controllers/DataContext';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Search, Users, MapPin, CheckCircle, AlertCircle, Wrench } from 'lucide-react';
import { Facility } from '../models/types';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface FacilitiesPageProps {
  onViewDetail: (facility: Facility) => void;
}

export function FacilitiesPage({ onViewDetail }: FacilitiesPageProps) {
  const { facilities } = useData();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFacilities = facilities.filter(facility =>
    facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    facility.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="w-4 h-4" />;
      case 'maintenance':
        return <Wrench className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'maintenance':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available':
        return 'Tersedia';
      case 'maintenance':
        return 'Maintenance';
      default:
        return 'Tidak Tersedia';
    }
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-50 to-white py-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-slate-900 mb-4">
              Jelajahi Fasilitas Kampus
            </h1>
            <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
              Temukan dan reservasi fasilitas yang Anda butuhkan dengan mudah
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Cari fasilitas berdasarkan nama atau lokasi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 text-base bg-white shadow-sm"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Facilities Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredFacilities.map((facility, index) => (
            <motion.div
              key={facility.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <Card className="overflow-hidden border-slate-200 hover:border-emerald-300 hover:shadow-xl transition-all group">
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <ImageWithFallback
                    src={facility.image}
                    alt={facility.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className={`${getStatusColor(facility.status)} border gap-1`}>
                      {getStatusIcon(facility.status)}
                      {getStatusLabel(facility.status)}
                    </Badge>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-slate-900 mb-2">{facility.name}</h3>
                  
                  <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{facility.capacity}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{facility.location}</span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                    {facility.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {facility.features.slice(0, 3).map((feature) => (
                      <Badge key={feature} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {facility.features.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{facility.features.length - 3}
                      </Badge>
                    )}
                  </div>

                  <Button
                    onClick={() => onViewDetail(facility)}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                  >
                    Lihat Detail
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredFacilities.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-600">Tidak ada fasilitas yang sesuai dengan pencarian Anda</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
