import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { voucherService, productService, companyService } from '../services/api';
import { UpdateVoucherData, Product, Company } from '../types';

const EditVoucher: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<UpdateVoucherData>({
    productId: '',
    companyId: '',
    activationTime: '',
    desactivationTime: '',
    dayOfWeek: '',
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [voucherRes, productsRes, companiesRes] = await Promise.all([
          voucherService.getById(id!),
          productService.getAll(),
          companyService.getAll(),
        ]);
        const voucher = voucherRes.data;
        setFormData({
          productId: voucher.productId,
          companyId: voucher.companyId,
          activationTime: voucher.activationTime,
          desactivationTime: voucher.desactivationTime,
          dayOfWeek: voucher.dayOfWeek,
        });
        setProducts(productsRes.data);
        setCompanies(companiesRes.data);
        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Erreur lors du chargement de la promo');
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await voucherService.update(id!, formData);
      setSuccess('Promo modifiée avec succès !');
      setTimeout(() => {
        navigate('/vouchers');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de la modification de la promo');
    } finally {
      setSaving(false);
    }
  };

  const daysOfWeek = [
    { value: 'lundi', label: 'Lundi' },
    { value: 'mardi', label: 'Mardi' },
    { value: 'mercredi', label: 'Mercredi' },
    { value: 'jeudi', label: 'Jeudi' },
    { value: 'vendredi', label: 'Vendredi' },
    { value: 'samedi', label: 'Samedi' },
    { value: 'dimanche', label: 'Dimanche' },
  ];

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-600">Chargement de la promo...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/vouchers')}
          className="text-primary-600 hover:text-primary-700 font-semibold"
        >
          ← Retour
        </button>
            <h2 className="text-3xl font-bold text-gray-800">Modifier la Promo</h2>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="border p-6 space-y-6">
        <div>
          <label htmlFor="productId" className="block text-sm font-medium text-gray-700 mb-2">
            Produit *
          </label>
          <select
            id="productId"
            name="productId"
            value={formData.productId}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Sélectionner un produit</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.data.name} (ID: {product.id})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="companyId" className="block text-sm font-medium text-gray-700 mb-2">
            Entreprise *
          </label>
          <select
            id="companyId"
            name="companyId"
            value={formData.companyId}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Sélectionner une entreprise</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.data.name} (ID: {company.id})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="activationTime"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Heure d'activation * (HH:MM)
            </label>
            <input
              type="time"
              id="activationTime"
              name="activationTime"
              value={formData.activationTime}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label
              htmlFor="desactivationTime"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Heure de désactivation * (HH:MM)
            </label>
            <input
              type="time"
              id="desactivationTime"
              name="desactivationTime"
              value={formData.desactivationTime}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="dayOfWeek" className="block text-sm font-medium text-gray-700 mb-2">
            Jour de la semaine *
          </label>
          <select
            id="dayOfWeek"
            name="dayOfWeek"
            value={formData.dayOfWeek}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Sélectionner un jour</option>
            {daysOfWeek.map((day) => (
              <option key={day.value} value={day.value}>
                {day.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-gray-900 text-white py-3 px-6 border font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/vouchers')}
            className="px-6 py-3 border text-gray-700 font-medium hover:bg-gray-50"
          >
            Annuler
          </button>
          </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditVoucher;

