import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { companyService } from '../services/api';
import { CreateCompanyData } from '../types';

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#D73738] border-t-transparent mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Chargement de l'entreprise...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/companies')}
            className="mb-4 text-[#0C0C0C] hover:text-[#D73738] font-medium text-base flex items-center gap-2 transition-colors"
          >
            <span>←</span>
            <span>Retour</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0C0C0C]" style={{ fontFamily: 'Roboto, sans-serif' }}>
            Modifier l'entreprise
          </h1>
        </div>

        {/* Messages d'alerte */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-[#D73738] text-[#0C0C0C] p-4 rounded-lg shadow-sm">
            <p className="text-base font-medium">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 text-[#0C0C0C] p-4 rounded-lg shadow-sm">
            <p className="text-base font-medium">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section Informations de base */}
          <div className="bg-white rounded-[20px] p-6 sm:p-8 shadow-sm" style={{ boxShadow: '0 0.5px 0.5px rgba(217, 217, 217, 1)' }}>
            <h2 className="text-xl font-bold text-[#0C0C0C] mb-6" style={{ fontFamily: 'Roboto, sans-serif' }}>
              Informations de l'entreprise
            </h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-base font-medium text-[#0C0C0C] mb-2">
                  Nom de l'entreprise *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-[#D9D9D9] rounded-[12px] text-base text-[#0C0C0C] focus:outline-none focus:ring-2 focus:ring-[#D73738] focus:border-[#D73738] transition-all"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-base font-medium text-[#0C0C0C] mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-[#D9D9D9] rounded-[12px] text-base text-[#0C0C0C] focus:outline-none focus:ring-2 focus:ring-[#D73738] focus:border-[#D73738] transition-all resize-none"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="category" className="block text-base font-medium text-[#0C0C0C] mb-2">
                    Catégorie *
                  </label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-[#D9D9D9] rounded-[12px] text-base text-[#0C0C0C] focus:outline-none focus:ring-2 focus:ring-[#D73738] focus:border-[#D73738] transition-all"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  />
                </div>

                <div>
                  <label htmlFor="place" className="block text-base font-medium text-[#0C0C0C] mb-2">
                    Lieu *
                  </label>
                  <input
                    type="text"
                    id="place"
                    name="place"
                    value={formData.place}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-[#D9D9D9] rounded-[12px] text-base text-[#0C0C0C] focus:outline-none focus:ring-2 focus:ring-[#D73738] focus:border-[#D73738] transition-all"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="urlImage" className="block text-base font-medium text-[#0C0C0C] mb-2">
                  URL Image
                </label>
                <input
                  type="text"
                  id="urlImage"
                  name="urlImage"
                  value={formData.urlImage}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#D9D9D9] rounded-[12px] text-base text-[#0C0C0C] focus:outline-none focus:ring-2 focus:ring-[#D73738] focus:border-[#D73738] transition-all"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                />
                {formData.urlImage && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Aperçu :</p>
                    <img
                      src={formData.urlImage}
                      alt="Aperçu"
                      className="w-full h-48 object-cover rounded-[12px] border border-[#D9D9D9]"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 sm:flex-none sm:w-[300px] px-[50px] py-[13px] bg-[#D73738] text-white font-bold rounded-[12px] hover:bg-[#c02d2e] disabled:opacity-50 disabled:cursor-not-allowed transition-all text-lg"
              style={{ fontFamily: 'Roboto, sans-serif' }}
            >
              {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/companies')}
              className="flex-1 sm:flex-none px-[50px] py-[13px] bg-white text-[#0C0C0C] font-bold rounded-[12px] border-2 border-[#D9D9D9] hover:bg-gray-50 transition-all text-lg"
              style={{ fontFamily: 'Roboto, sans-serif' }}
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCompany;
