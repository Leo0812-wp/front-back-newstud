import React, { useState, useEffect } from 'react';
import { voucherService, productService, companyService } from '../services/api';
import { CreateVoucherData, Product, Company } from '../types';

const CreateVoucher: React.FC = () => {
  const [formData, setFormData] = useState<CreateVoucherData>({
    productId: '',
    companyId: '',
    activationTime: '',
    desactivationTime: '',
    dayOfWeek: '',
    nbUtilisation: 1,
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, companiesRes] = await Promise.all([
          productService.getAll(),
          companyService.getAll(),
        ]);
        setProducts(productsRes.data);
        setCompanies(companiesRes.data);
      } catch (err) {
        setError('Erreur lors du chargement des données');
      }
    };

    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'nbUtilisation' ? parseInt(value) || 1 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await voucherService.create(formData);
      setSuccess('Promo créée avec succès !');
      setFormData({
        productId: '',
        companyId: '',
        activationTime: '',
        desactivationTime: '',
        dayOfWeek: '',
        nbUtilisation: 1,
      });
    } catch (err: any) {
      setError(
        err.response?.data?.error || 'Erreur lors de la création de la promo'
      );
    } finally {
      setLoading(false);
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

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Créer une nouvelle Promo</h2>

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

        <div>
          <label
            htmlFor="nbUtilisation"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Nombre d'utilisations *
          </label>
          <input
            type="number"
            id="nbUtilisation"
            name="nbUtilisation"
            value={formData.nbUtilisation}
            onChange={handleChange}
            required
            min="1"
            max="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <p className="mt-1 text-sm text-gray-500">
            Nombre de vouchers à générer (max 3)
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-900 text-white py-3 px-6 border font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Création en cours...' : 'Créer la Promo'}
        </button>
      </form>
    </div>
  );
};

export default CreateVoucher;

