// View - Admin Manage Facilities Page
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../controllers/DataContext';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../components/ui/alert-dialog';
import { Plus, Edit2, Trash2, Users, MapPin, X, Upload, Image as ImageIcon } from 'lucide-react';
import { Facility, FacilityStatus } from '../models/types';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { supabase } from '../lib/supabase'; 
import { toast } from 'sonner@2.0.3';

interface ManageFacilitiesPageProps {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
}

export function ManageFacilitiesPage({ showSuccess, showError }: ManageFacilitiesPageProps) {
  const { facilities, addFacility, updateFacility, deleteFacility } = useData();
  const [isUploading, setIsUploading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    location: '',
    status: 'available' as FacilityStatus,
    description: '',
    image: '',
    features: [] as string[]
  });

  const [imagePreview, setImagePreview] = useState<string>('');
  const [newFeature, setNewFeature] = useState('');

  const handleOpenDialog = (facility?: Facility) => {
    if (facility) {
      setEditingFacility(facility);
      setFormData({
        name: facility.name,
        capacity: facility.capacity.toString(),
        location: facility.location,
        status: facility.status,
        description: facility.description,
        image: facility.image,
        features: facility.features
      });
      setImagePreview(facility.image);
    } else {
      setEditingFacility(null);
      setFormData({
        name: '',
        capacity: '',
        location: '',
        status: 'available',
        description: '',
        image: '',
        features: []
      });
      setImagePreview('');
    }
    setShowDialog(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showError('File harus berupa gambar');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showError('Ukuran file maksimal 5MB');
      return;
    }

    setIsUploading(true);

    try {
      // 1. Buat nama file unik agar tidak bentrok
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      // 2. Upload ke Supabase Storage bucket 'facility-images'
      const { error: uploadError } = await supabase.storage
        .from('facility-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // 3. Dapatkan Public URL untuk disimpan di database
      const { data } = supabase.storage
        .from('facility-images')
        .getPublicUrl(filePath);

      // 4. Update state form dengan URL gambar
      setFormData(prev => ({ ...prev, image: data.publicUrl }));
      setImagePreview(data.publicUrl);
      showSuccess('Gambar berhasil diunggah');

    } catch (error: any) {
      console.error('Error uploading image:', error);
      showError('Gagal mengunggah gambar: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, image: '' });
    setImagePreview('');
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.capacity || !formData.location || !formData.description) {
      showError('Mohon lengkapi semua data yang diperlukan');
      return;
    }

    const facilityData = {
      name: formData.name,
      capacity: parseInt(formData.capacity),
      location: formData.location,
      status: formData.status,
      description: formData.description,
      image: formData.image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
      features: formData.features
    };

    if (editingFacility) {
      updateFacility(editingFacility.id, facilityData);
      showSuccess('Fasilitas berhasil diperbarui');
    } else {
      addFacility(facilityData);
      showSuccess('Fasilitas berhasil ditambahkan');
    }

    setShowDialog(false);
    setImagePreview('');
  };

  const handleDelete = (id: string) => {
    deleteFacility(id);
    showSuccess('Fasilitas berhasil dihapus');
    setDeleteTarget(null);
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="bg-gradient-to-br from-emerald-50 to-white py-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-slate-900 mb-4">Kelola Fasilitas</h1>
              <p className="text-slate-600">
                Tambah, edit, atau hapus fasilitas kampus
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Button
                onClick={() => handleOpenDialog()}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Fasilitas
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.map((facility, index) => (
            <motion.div
              key={facility.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <Card className="overflow-hidden border-slate-200 hover:border-emerald-300 hover:shadow-xl transition-all">
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <ImageWithFallback
                    src={facility.image}
                    alt={facility.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-slate-900">{facility.name}</h3>
                    <Badge
                      className={
                        facility.status === 'available'
                          ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                          : facility.status === 'maintenance'
                          ? 'bg-amber-100 text-amber-700 border-amber-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }
                    >
                      {facility.status === 'available'
                        ? 'Tersedia'
                        : facility.status === 'maintenance'
                        ? 'Maintenance'
                        : 'Tidak Tersedia'}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{facility.capacity}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{facility.location}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleOpenDialog(facility)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => setDeleteTarget(facility.id)}
                      variant="outline"
                      size="sm"
                      className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Hapus
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingFacility ? 'Edit Fasilitas' : 'Tambah Fasilitas Baru'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nama Fasilitas *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Auditorium Utama"
                  required
                />
              </div>

              <div>
                <Label htmlFor="capacity">Kapasitas *</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  placeholder="Jumlah orang"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="location">Lokasi *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Contoh: Gedung A Lantai 1"
                required
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: FacilityStatus) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Tersedia</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="unavailable">Tidak Tersedia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Deskripsi *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Jelaskan fasilitas ini..."
                rows={3}
                required
              />
            </div>

            <div>
              <Label>Gambar Fasilitas</Label>
              
              {imagePreview ? (
                <div className="mt-2 relative">
                  <div className="relative h-48 rounded-lg overflow-hidden bg-slate-100 border-2 border-slate-200">
                    <ImageWithFallback
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveImage}
                    className="mt-2 w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Hapus Gambar
                  </Button>
                </div>
              ) : (
                <div className="mt-2">
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/50 transition-all"
                  >
                    <Upload className="w-12 h-12 text-slate-400 mb-3" />
                    <p className="text-sm text-slate-600 mb-1">Klik untuk upload gambar</p>
                    <p className="text-xs text-slate-500">PNG, JPG, JPEG (Max 5MB)</p>
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              )}
            </div>

            <div>
              <Label>Fasilitas & Fitur</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Contoh: AC, Proyektor, WiFi"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddFeature();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddFeature} variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.features.map((feature, index) => (
                  <Badge key={index} variant="secondary" className="gap-1 pr-1">
                    {feature}
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(index)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDialog(false)}
                className="flex-1"
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                disabled={isUploading}
              >
                {isUploading ? 'Mengunggah...' : (editingFacility ? 'Simpan Perubahan' : 'Tambah Fasilitas')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Fasilitas?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Fasilitas akan dihapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTarget && handleDelete(deleteTarget)}
              className="bg-red-600 hover:bg-red-700"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}