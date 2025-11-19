import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { companyService } from '../services/api';
import { CreateCompanyData } from '../types';
import Header from './Header';

const EditCompany: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CreateCompanyData>({
    name: '',
    description: '',
    category: '',
    place: '',
    urlImage: '',
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await companyService.getById(id!);
        const company = response.data;
        setFormData({
          name: company.data.name || '',
          description: company.data.description || '',
          category: company.data.category || '',
          place: company.data.place || '',
          urlImage: company.data.urlImage || '',
        });
        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Erreur lors du chargement de l\'entreprise');
        setLoading(false);
      }
    };

    if (id) {
      fetchCompany();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      await companyService.update(id!, formData);
      setSuccess('Entreprise modifiée avec succès !');
      setTimeout(() => {
        navigate('/companies');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de la modification de l\'entreprise');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-gray-600">Chargement de l'entreprise...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate('/companies')}
              className="text-gray-900 hover:underline font-semibold"
            >
              ← Retour
            </button>
            <h2 className="text-3xl font-bold">Modifier une Entreprise</h2>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 mb-6">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="border p-6 space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nom *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 border focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie *
              </label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              />
            </div>

            <div>
              <label htmlFor="place" className="block text-sm font-medium text-gray-700 mb-2">
                Lieu *
              </label>
              <input
                type="text"
                id="place"
                name="place"
                value={formData.place}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              />
            </div>

            <div>
              <label htmlFor="urlImage" className="block text-sm font-medium text-gray-700 mb-2">
                URL Image
              </label>
              <input
                type="text"
                id="urlImage"
                name="urlImage"
                value={formData.urlImage}
                onChange={handleChange}
                className="w-full px-4 py-2 border focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              />
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
                onClick={() => navigate('/companies')}
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

export default EditCompany;

