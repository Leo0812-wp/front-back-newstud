import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { companyService } from '../services/api';
import { Company } from '../types';

const CompaniesList: React.FC = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await companyService.getAll();
        setCompanies(response.data);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement des entreprises');
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  // Filtrage des entreprises
  const filteredCompanies = companies.filter((company) => {
    const matchesSearch = company.data.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.data.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || company.data.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Extraction des catégories uniques
  const categories = ['all', ...Array.from(new Set(companies.map(c => c.data.category).filter(Boolean)))];

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer l'entreprise "${name}" ?\n\nCette action est irréversible.`)) {
      return;
    }

    setDeletingId(id);
    setError(null);

    try {
      await companyService.delete(id);
      setCompanies(companies.filter(c => c.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de la suppression de l\'entreprise');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#D73738] border-t-transparent mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Chargement des entreprises...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'Roboto, sans-serif' }}>
      <div className="container mx-auto px-4 py-10">
        {/* En-tête avec titre et bouton d'action */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-[#0C0C0C] mb-2">Gestion des Entreprises</h1>
              <p className="text-gray-600 text-base">Gérez toutes vos entreprises partenaires en un seul endroit</p>
            </div>
            <button
              onClick={() => navigate('/create-company')}
              className="bg-[#D73738] text-white px-8 py-3.5 rounded-xl font-bold text-lg hover:bg-[#c02f30] transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2 justify-center md:justify-start whitespace-nowrap"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Créer une Entreprise
            </button>
          </div>

          {/* Barre de recherche et filtres */}
          <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Barre de recherche */}
              <div className="flex-1">
                <div className="relative">
                  <svg
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Rechercher une entreprise..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#D73738] focus:outline-none transition-colors text-base"
                  />
                </div>
              </div>

              {/* Filtre par catégorie */}
              <div className="md:w-64">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#D73738] focus:outline-none transition-colors text-base bg-white cursor-pointer"
                >
                  <option value="all">Toutes les catégories</option>
                  {categories.filter(c => c !== 'all').map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Compteur de résultats */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                {filteredCompanies.length} {filteredCompanies.length > 1 ? 'entreprises trouvées' : 'entreprise trouvée'}
              </span>
              {(searchTerm || selectedCategory !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                  className="text-[#D73738] hover:underline font-medium"
                >
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl mb-8 flex items-center gap-3">
            <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Liste des entreprises */}
        {filteredCompanies.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-16 text-center">
            <svg className="w-20 h-20 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <p className="text-gray-500 text-lg font-medium mb-2">Aucune entreprise trouvée</p>
            {(searchTerm || selectedCategory !== 'all') && (
              <p className="text-gray-400 text-sm">Essayez de modifier vos critères de recherche</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
              <div
                key={company.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
                style={{
                  boxShadow: '0 0.5px 0 rgba(217, 217, 217, 0.5)',
                }}
              >
                {/* Image de l'entreprise */}
                <div className="relative w-full h-52 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  {company.data.urlImage ? (
                    <img
                      src={company.data.urlImage}
                      alt={company.data.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/400x300/D9D9D9/0C0C0C?text=Pas+d\'image';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                      <svg className="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm font-medium">Pas d'image</span>
                    </div>
                  )}
                  {/* Badge catégorie */}
                  {company.data.category && (
                    <div className="absolute top-3 right-3">
                      <span className="bg-[#D73738] text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-md">
                        {company.data.category}
                      </span>
                    </div>
                  )}
                </div>

                {/* Contenu de la carte */}
                <div className="p-5 flex-1 flex flex-col">
                  {/* Nom de l'entreprise */}
                  <h3 className="text-xl font-bold text-[#0C0C0C] mb-3 line-clamp-2">
                    {company.data.name}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
                    {company.data.description}
                  </p>

                  {/* Informations supplémentaires */}
                  <div className="space-y-2 mb-4">
                    {company.data.place && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <svg className="w-4 h-4 text-[#D73738] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="truncate">{company.data.place}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <span className="truncate">ID: {company.id}</span>
                    </div>
                  </div>

                  {/* Boutons d'action */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/edit-company/${company.id}`)}
                      className="flex-1 bg-white border-2 border-[#D73738] text-[#D73738] px-4 py-3 rounded-xl font-bold text-base hover:bg-[#D73738] hover:text-white transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(company.id, company.data.name)}
                      disabled={deletingId === company.id}
                      className="px-4 py-3 bg-white border-2 border-red-500 text-red-500 rounded-xl font-bold text-base hover:bg-red-500 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {deletingId === company.id ? (
                        <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompaniesList;
