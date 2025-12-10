import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { companyService } from '../services/api';
import { Company } from '../types';

const CompaniesList: React.FC = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-600">Chargement des entreprises...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Liste des Entreprises</h2>
        <button
          onClick={() => navigate('/create-company')}
          className="bg-gray-900 text-white px-6 py-2 border font-medium hover:bg-gray-800"
        >
          + Créer une Entreprise
        </button>
      </div>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}
      {companies.length === 0 ? (
        <div className="border p-12 text-center text-gray-500">
          Aucune entreprise trouvée
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <div
              key={company.id}
              className="border overflow-hidden"
            >
              <div className="border-b p-4">
                <h3 className="text-xl font-semibold">{company.data.name}</h3>
              </div>
              <div className="w-full h-48 bg-gray-100 overflow-hidden">
                {company.data.urlImage ? (
                  <img
                    src={company.data.urlImage}
                    alt={company.data.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Pas d'image
                  </div>
                )}
              </div>
              <div className="p-4">
                <p className="text-gray-600 mb-4 text-sm line-clamp-3">
                  {company.data.description}
                </p>
                <div className="border-t pt-4 space-y-3">
                  <div className="text-xs text-gray-500 space-y-1">
                    <div>ID: {company.id}</div>
                    {company.data.place && (
                      <div>{company.data.place}</div>
                    )}
                    {company.data.category && (
                      <div>Catégorie: {company.data.category}</div>
                    )}
                  </div>
                  <button
                    onClick={() => navigate(`/edit-company/${company.id}`)}
                    className="w-full border px-4 py-2 text-sm hover:bg-gray-50 mt-2"
                  >
                    Modifier
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

