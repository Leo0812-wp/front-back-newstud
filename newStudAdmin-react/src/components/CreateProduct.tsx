import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService, companyService } from '../services/api';
import { CreateProductData, CreateCompanyData, Company } from '../types';

type CompanySelectionMode = 'existing' | 'new';

const CreateProduct: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CreateProductData>({
    name: '',
    description: '',
    category: '',
    companyId: '',
    usable: 1,
    priceInit: '',
    priceFinal: '',
    promotion: '',
    urlImageCompanyPage: '',
    urlImageProductPage: [],
  });
  const [newCompanyData, setNewCompanyData] = useState<CreateCompanyData>({
    name: '',
    description: '',
    category: '',
    place: '',
    urlImage: '',
  });
  const [companySelectionMode, setCompanySelectionMode] = useState<CompanySelectionMode>('existing');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [creatingCompany, setCreatingCompany] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await companyService.getAll();
        setCompanies(response.data);
      } catch (err) {
        setError('Erreur lors du chargement des entreprises');
      }
    };

    fetchCompanies();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'usable' ? parseInt(value) || 1 : value,
    }));
  };

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCompanyData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateCompany = async (): Promise<string | null> => {
    setCreatingCompany(true);
    setError(null);

    try {
      const response = await companyService.create(newCompanyData);
      // Récupérer l'ID de la nouvelle entreprise créée
      // Le backend peut retourner l'ID de différentes façons
      const newCompanyId = response.data?.id || response.data?.companyId || response.data?.data?.id;
      
      if (newCompanyId) {
        setFormData((prev) => ({ ...prev, companyId: newCompanyId }));
        setSuccess('Entreprise créée avec succès !');
        // Recharger la liste des entreprises
        const companiesRes = await companyService.getAll();
        setCompanies(companiesRes.data);
        setCreatingCompany(false);
        return newCompanyId;
      } else {
        // Si l'ID n'est pas dans la réponse, recharger la liste et trouver la nouvelle entreprise par son nom
        await new Promise(resolve => setTimeout(resolve, 1000));
        const companiesRes = await companyService.getAll();
        setCompanies(companiesRes.data);
        const newCompany = companiesRes.data.find(c => c.data.name === newCompanyData.name);
        if (newCompany) {
          setFormData((prev) => ({ ...prev, companyId: newCompany.id }));
          setSuccess('Entreprise créée avec succès !');
          setCreatingCompany(false);
          return newCompany.id;
        } else {
          setError('Entreprise créée mais impossible de récupérer son ID');
          setCreatingCompany(false);
          return null;
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de la création de l\'entreprise');
      setCreatingCompany(false);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let finalCompanyId = formData.companyId;

      // Si on est en mode "nouvelle entreprise", créer d'abord l'entreprise (seulement si pas déjà créée)
      if (companySelectionMode === 'new' && !formData.companyId) {
        const newCompanyId = await handleCreateCompany();
        if (!newCompanyId) {
          setError('Impossible de créer l\'entreprise. Veuillez réessayer.');
          setLoading(false);
          return;
        }
        finalCompanyId = newCompanyId;
      } else if (companySelectionMode === 'new' && formData.companyId) {
        // L'entreprise a déjà été créée, utiliser son ID
        finalCompanyId = formData.companyId;
      }

      // Vérifier qu'on a bien un companyId
      if (!finalCompanyId) {
        setError('Veuillez sélectionner ou créer une entreprise');
        setLoading(false);
        return;
      }

      // Créer le produit avec le bon companyId
      await productService.create({
        ...formData,
        companyId: finalCompanyId,
      });
      setSuccess('Produit créé avec succès !');
      setTimeout(() => {
        navigate('/products');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de la création du produit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/products')}
          className="text-gray-900 hover:underline font-semibold"
        >
          ← Retour
        </button>
        <h2 className="text-3xl font-bold">Créer un Produit</h2>
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Entreprise *
          </label>
          
          {/* Sélection du mode */}
          <div className="mb-4 flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="companyMode"
                value="existing"
                checked={companySelectionMode === 'existing'}
                onChange={() => setCompanySelectionMode('existing')}
                className="mr-2"
              />
              <span>Choisir une entreprise existante</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="companyMode"
                value="new"
                checked={companySelectionMode === 'new'}
                onChange={() => setCompanySelectionMode('new')}
                className="mr-2"
              />
              <span>Créer une nouvelle entreprise</span>
            </label>
          </div>

          {/* Mode : Choisir une entreprise existante */}
          {companySelectionMode === 'existing' && (
            <select
              id="companyId"
              name="companyId"
              value={formData.companyId}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
            >
              <option value="">Sélectionner une entreprise</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.data.name} (ID: {company.id})
                </option>
              ))}
            </select>
          )}

          {/* Mode : Créer une nouvelle entreprise */}
          {companySelectionMode === 'new' && (
            <div className="border p-4 space-y-4 bg-gray-50">
              <h3 className="font-semibold text-gray-700 mb-3">Nouvelle entreprise</h3>
              
              <div>
                <label htmlFor="newCompanyName" className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de l'entreprise *
                </label>
                <input
                  type="text"
                  id="newCompanyName"
                  name="name"
                  value={newCompanyData.name}
                  onChange={handleCompanyChange}
                  required
                  className="w-full px-4 py-2 border focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                />
              </div>

              <div>
                <label htmlFor="newCompanyDescription" className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  id="newCompanyDescription"
                  name="description"
                  value={newCompanyData.description}
                  onChange={handleCompanyChange}
                  required
                  rows={3}
                  className="w-full px-4 py-2 border focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                />
              </div>

              <div>
                <label htmlFor="newCompanyCategory" className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie *
                </label>
                <input
                  type="text"
                  id="newCompanyCategory"
                  name="category"
                  value={newCompanyData.category}
                  onChange={handleCompanyChange}
                  required
                  className="w-full px-4 py-2 border focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                />
              </div>

              <div>
                <label htmlFor="newCompanyPlace" className="block text-sm font-medium text-gray-700 mb-2">
                  Lieu *
                </label>
                <input
                  type="text"
                  id="newCompanyPlace"
                  name="place"
                  value={newCompanyData.place}
                  onChange={handleCompanyChange}
                  required
                  className="w-full px-4 py-2 border focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                />
              </div>

              <div>
                <label htmlFor="newCompanyUrlImage" className="block text-sm font-medium text-gray-700 mb-2">
                  URL Image
                </label>
                <input
                  type="text"
                  id="newCompanyUrlImage"
                  name="urlImage"
                  value={newCompanyData.urlImage}
                  onChange={handleCompanyChange}
                  className="w-full px-4 py-2 border focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                />
              </div>

              {formData.companyId && companySelectionMode === 'new' ? (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded text-sm">
                  ✓ Entreprise créée ! Vous pouvez maintenant créer le produit.
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleCreateCompany}
                  disabled={creatingCompany || !newCompanyData.name || !newCompanyData.description || !newCompanyData.category || !newCompanyData.place}
                  className="w-full bg-blue-600 text-white py-2 px-4 font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {creatingCompany ? 'Création en cours...' : 'Créer l\'entreprise'}
                </button>
              )}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="usable" className="block text-sm font-medium text-gray-700 mb-2">
            Nombre d'utilisations par jour *
          </label>
          <input
            type="number"
            id="usable"
            name="usable"
            value={formData.usable}
            onChange={handleChange}
            required
            min="1"
            className="w-full px-4 py-2 border focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="priceInit" className="block text-sm font-medium text-gray-700 mb-2">
              Prix initial
            </label>
            <input
              type="text"
              id="priceInit"
              name="priceInit"
              value={formData.priceInit}
              onChange={handleChange}
              className="w-full px-4 py-2 border focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
            />
          </div>

          <div>
            <label htmlFor="priceFinal" className="block text-sm font-medium text-gray-700 mb-2">
              Prix final
            </label>
            <input
              type="text"
              id="priceFinal"
              name="priceFinal"
              value={formData.priceFinal}
              onChange={handleChange}
              className="w-full px-4 py-2 border focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="promotion" className="block text-sm font-medium text-gray-700 mb-2">
            Promotion (%)
          </label>
          <input
            type="text"
            id="promotion"
            name="promotion"
            value={formData.promotion}
            onChange={handleChange}
            className="w-full px-4 py-2 border focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
          />
        </div>

        <div>
          <label htmlFor="urlImageCompanyPage" className="block text-sm font-medium text-gray-700 mb-2">
            URL Image (Page entreprise)
          </label>
          <input
            type="text"
            id="urlImageCompanyPage"
            name="urlImageCompanyPage"
            value={formData.urlImageCompanyPage}
            onChange={handleChange}
            className="w-full px-4 py-2 border focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gray-900 text-white py-3 px-6 border font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Création en cours...' : 'Créer le Produit'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="px-6 py-3 border text-gray-700 font-medium hover:bg-gray-50"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;

