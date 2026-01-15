import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService, companyService, voucherService } from '../services/api';
import { CreateProductData, CreateCompanyData, Company } from '../types';

type CompanySelectionMode = 'existing' | 'new';

const CreateProduct: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CreateProductData>({
    name: '',
    description: '',
    category: '',
    companyId: '',
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
  
const getCurrentTime = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

  // Champs pour la création de promo
  const [promoData, setPromoData] = useState<{
    activationTime: string;
    desactivationTime: string;
    dayOfWeek: string;
    nbUtilisation: number;
    nbVouchers: number;
    isIndefinite: boolean;
  }>({
    activationTime: getCurrentTime(),
    desactivationTime: '',
    dayOfWeek: '',
    nbUtilisation: 1,
    nbVouchers: 1,
    isIndefinite: false,
  });

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

//   const handleChange = (
//   e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
// ) => {
//   let { name, value } = e.target; // Note l'utilisation de 'let' ici

//   const numericFields = ['promotion', 'priceInit', 'priceFinal'];

//   if (numericFields.includes(name)) {
//     // 1. Remplacer automatiquement la virgule par un point
//     value = value.replace(',', '.');

//     // 2. Valider avec le point uniquement (puisqu'on vient de remplacer la virgule)
//     if (!/^\d*\.?\d*$/.test(value)) {
//       return;
//     }
//   }

//   setFormData((prev) => ({
//     ...prev,
//     [name]: value,
//   }));
// };
const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    let { name, value } = e.target;

    // --- 1. VALIDATION REGEX (Code précédent) ---
    const numericFields = ['promotion', 'priceInit', 'priceFinal'];
    if (numericFields.includes(name)) {
      value = value.replace(',', '.'); // On standardise
      if (!/^\d*\.?\d*$/.test(value)) return;
    }

    // On prépare le nouvel état potentiel
    let updatedFormData = { ...formData, [name]: value };

    // --- 2. CALCULS AUTOMATIQUES ---
    
    // Fonction utilitaire pour convertir en nombre proprement (gère vide, undefined et string)
    const parseNum = (val: string | undefined) => parseFloat(val || '0') || 0;

    // A. Si on modifie la PROMOTION -> On calcule le PRIX FINAL
    if (name === 'promotion') {
      const initPrice = parseNum(formData.priceInit);
      const promoVal = parseNum(value);

      if (initPrice > 0) {
        // Formule : PrixInit * (1 - Promo/100)
        const newFinalPrice = initPrice * (1 - promoVal / 100);
        // .toFixed(2) garde 2 décimales max, mais renvoie un string
        updatedFormData.priceFinal = newFinalPrice.toFixed(2);
      }
    }

    // B. Si on modifie le PRIX FINAL -> On calcule la PROMOTION
    else if (name === 'priceFinal') {
      const initPrice = parseNum(formData.priceInit);
      const finalPrice = parseNum(value);

      if (initPrice > 0) {
        // Formule : ((PrixInit - PrixFinal) / PrixInit) * 100
        const newPromo = ((initPrice - finalPrice) / initPrice) * 100;
        // On arrondit la promo à 2 décimales max pour éviter "33.33333%"
        updatedFormData.promotion = newPromo.toFixed(2);
      }
    }

    // C. Si on modifie le PRIX INITIAL -> On met à jour le PRIX FINAL (en gardant la promo constante)
    else if (name === 'priceInit') {
      const initPrice = parseNum(value);
      const currentPromo = parseNum(formData.promotion);

      if (currentPromo > 0) {
        const newFinalPrice = initPrice * (1 - currentPromo / 100);
        updatedFormData.priceFinal = newFinalPrice.toFixed(2);
      }
    }

    // --- 3. MISE À JOUR DE L'ÉTAT ---
    setFormData(updatedFormData);
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

  const handlePromoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    if (name === 'isIndefinite') {
      setPromoData((prev) => ({
        ...prev,
        isIndefinite: checked,
        desactivationTime: checked ? 'indefini' : '',
      }));
    } else {
      setPromoData((prev) => ({
        ...prev,
        [name]: name === 'nbUtilisation' || name === 'nbVouchers' ? parseInt(value) || 1 : value,
      }));
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
      const productResponse = await productService.create({
        ...formData,
        companyId: finalCompanyId,
      });
      
      // Récupérer l'ID du produit créé
      const productId = productResponse.data?.id || productResponse.data?.productId || productResponse.data?.data?.id;
      
      if (!productId) {
        // Si l'ID n'est pas dans la réponse, recharger la liste et trouver le produit par son nom
        await new Promise(resolve => setTimeout(resolve, 1000));
        const productsRes = await productService.getAll();
        const newProduct = productsRes.data.find(p => p.data.name === formData.name);
        if (newProduct) {
          // Créer le voucher si les champs promo sont remplis
          if (promoData.activationTime && (promoData.desactivationTime || promoData.isIndefinite) && promoData.dayOfWeek) {
            try {
              await voucherService.create({
                productId: newProduct.id,
                companyId: finalCompanyId,
                activationTime: promoData.activationTime,
                desactivationTime: promoData.isIndefinite ? 'indefini' : promoData.desactivationTime,
                dayOfWeek: promoData.dayOfWeek,
                nbUtilisation: promoData.nbVouchers,
              });
              setSuccess('Promo créée avec succès !');
            } catch (voucherErr: any) {
              setSuccess('Promo créée avec succès, mais erreur lors de l’association de la promo');
              console.error('Erreur création voucher:', voucherErr);
            }
          } else {
            setSuccess('Promo créée avec succès !');
          }
        } else {
          setSuccess('Promo créée avec succès !');
        }
      } else {
        // Créer le voucher si les champs promo sont remplis
        if (promoData.activationTime && (promoData.desactivationTime || promoData.isIndefinite) && promoData.dayOfWeek) {
          try {
            await voucherService.create({
              productId: productId,
              companyId: finalCompanyId,
              activationTime: promoData.activationTime,
              desactivationTime: promoData.isIndefinite ? 'indefini' : promoData.desactivationTime,
              dayOfWeek: promoData.dayOfWeek,
              nbUtilisation: promoData.nbVouchers,
            });
            setSuccess('Promo créée avec succès !');
          } catch (voucherErr: any) {
            setSuccess('Promo créée avec succès, mais erreur lors de l’association de la promo');
            console.error('Erreur création voucher:', voucherErr);
          }
        } else {
          setSuccess('Promo créée avec succès !');
        }
      }
      
      setTimeout(() => {
        navigate('/products');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de la création de la promo');
    } finally {
      setLoading(false);
    }
  };

   // Fonction pour ajouter/retirer un jour
  const toggleDay = (dayValue: string) => {
    setPromoData((prev) => {
      const currentDays = prev.dayOfWeek;
      // Si le jour est déjà là, on le retire, sinon on l'ajoute
      const newDays = currentDays.includes(dayValue)
        ? currentDays.filter((d) => d !== dayValue)
        : [...currentDays, dayValue];
      
      return { ...prev, dayOfWeek: newDays };
    });
  };

  // Fonction pour générer le texte affiché (ex: "Lundi, Week-end")
  const getSelectedDaysLabel = () => {
    const selected = promoData.dayOfWeek;
    if (selected.length === 0) return 'Aucun jour sélectionné';
    if (selected.length === 7) return 'Tous les jours';

    const hasSaturday = selected.includes('samedi');
    const hasSunday = selected.includes('dimanche');
    const hasMonday = selected.includes('lundi');
    const hasTuesday = selected.includes('mardi');
    const hasWednesday = selected.includes('mercredi');
    const hasThursday = selected.includes('jeudi');
    const hasFriday = selected.includes('vendredi');

    // Vérifier si tous les jours ouvrables (lundi-vendredi) sont sélectionnés
    const allWeekdaysSelected = hasMonday && hasTuesday && hasWednesday && hasThursday && hasFriday;

    // On prend tous les jours SAUF samedi et dimanche pour commencer
    let labels: string[] = [];

    if (allWeekdaysSelected && !hasSaturday && !hasSunday) {
      // Si uniquement lundi-vendredi sont sélectionnés, afficher "Semaine"
      labels.push('Semaine');
    } else if (allWeekdaysSelected) {
      // Si lundi-vendredi + weekend
      labels.push('Semaine');
    } else {
      // Sinon, afficher les jours individuels
      labels = selected
        .filter((d) => d !== 'samedi' && d !== 'dimanche')
        .map((d) => d.charAt(0).toUpperCase() + d.slice(1)); // Capitalize (Lundi)
    }

    // Logique spéciale Week-end
    if (hasSaturday && hasSunday) {
      labels.push('Week-end');
    } else {
      if (hasSaturday) labels.push('Samedi');
      if (hasSunday) labels.push('Dimanche');
    }

    return labels.join(', ');
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

  const productCategories = [
    { value: 'service', label: 'Service' },
    { value: 'boissons', label: 'Boissons' },
    { value: 'nourriture', label: 'Nourriture' },
  ];

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/products')}
            className="text-gray-900 font-semibold"
          >
            ← Retour
          </button>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Créer une nouvelle promotion</h2>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 mb-6 rounded-xl">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 mb-6 rounded-xl">
            {success}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-gray-900 mb-3">
                Nom (du produit) <span className="text-[#D73738]">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-900 focus:border-[#D73738] focus:ring-4 focus:ring-red-200 transition"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-bold text-gray-900 mb-3">
                Description du produit (vue côté utilisateur) <span className="text-[#D73738]">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-900 focus:border-[#D73738] focus:ring-4 focus:ring-red-200 transition"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-bold text-gray-900 mb-3">
                Catégorie (type de produits) <span className="text-[#D73738]">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-900 focus:border-[#D73738] focus:ring-4 focus:ring-red-200 transition cursor-pointer"
              >
                <option value="">Sélectionner une catégorie</option>
                {productCategories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">
                Entreprise <span className="text-[#D73738]">*</span>
              </label>

              <div className="mb-4 flex gap-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="companyMode"
                    value="existing"
                    checked={companySelectionMode === 'existing'}
                    onChange={() => setCompanySelectionMode('existing')}
                    className="w-5 h-5 accent-[#D73738]"
                  />
                  <span className="text-gray-900">Choisir une entreprise existante</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="companyMode"
                    value="new"
                    checked={companySelectionMode === 'new'}
                    onChange={() => setCompanySelectionMode('new')}
                    className="w-5 h-5 accent-[#D73738]"
                  />
                  <span className="text-gray-900">Créer une nouvelle entreprise</span>
                </label>
              </div>

              {companySelectionMode === 'existing' && (
                <select
                  id="companyId"
                  name="companyId"
                  value={formData.companyId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-900 focus:border-[#D73738] focus:ring-4 focus:ring-red-200 transition"
                >
                  <option value="">Sélectionner une entreprise</option>
                  {companies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.data.name} (ID: {company.id})
                    </option>
                  ))}
                </select>
              )}

              {companySelectionMode === 'new' && (
                <div className="mt-4 bg-gray-50 p-4 rounded-xl border-2 border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Nouvelle entreprise</h3>

                  <div>
                    <label htmlFor="newCompanyName" className="block text-sm font-medium text-gray-900 mb-2">
                      Nom de l'entreprise <span className="text-[#D73738]">*</span>
                    </label>
                    <input
                      type="text"
                      id="newCompanyName"
                      name="name"
                      value={newCompanyData.name}
                      onChange={handleCompanyChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-900 focus:border-[#D73738] focus:ring-4 focus:ring-red-200 transition"
                    />
                  </div>

                  <div className="mt-4">
                    <label htmlFor="newCompanyDescription" className="block text-sm font-medium text-gray-900 mb-2">
                      Description <span className="text-[#D73738]">*</span>
                    </label>
                    <textarea
                      id="newCompanyDescription"
                      name="description"
                      value={newCompanyData.description}
                      onChange={handleCompanyChange}
                      required
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-900 focus:border-[#D73738] focus:ring-4 focus:ring-red-200 transition"
                    />
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="newCompanyCategory" className="block text-sm font-medium text-gray-900 mb-2">Catégorie <span className="text-[#D73738]">*</span></label>
                      <input
                        type="text"
                        id="newCompanyCategory"
                        name="category"
                        value={newCompanyData.category}
                        onChange={handleCompanyChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-900 focus:border-[#D73738] focus:ring-4 focus:ring-red-200 transition"
                      />
                    </div>

                    <div>
                      <label htmlFor="newCompanyPlace" className="block text-sm font-medium text-gray-900 mb-2">Lieu <span className="text-[#D73738]">*</span></label>
                      <input
                        type="text"
                        id="newCompanyPlace"
                        name="place"
                        value={newCompanyData.place}
                        onChange={handleCompanyChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-900 focus:border-[#D73738] focus:ring-4 focus:ring-red-200 transition"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label htmlFor="newCompanyUrlImage" className="block text-sm font-medium text-gray-900 mb-2">URL Image</label>
                    <input
                      type="text"
                      id="newCompanyUrlImage"
                      name="urlImage"
                      value={newCompanyData.urlImage}
                      onChange={handleCompanyChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-900 focus:border-[#D73738] focus:ring-4 focus:ring-red-200 transition"
                    />
                  </div>

                  {formData.companyId && companySelectionMode === 'new' ? (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded text-sm mt-4">
                      ✓ Entreprise créée ! Vous pouvez maintenant créer le produit.
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleCreateCompany}
                      disabled={creatingCompany || !newCompanyData.name || !newCompanyData.description || !newCompanyData.category || !newCompanyData.place}
                      className="w-full bg-[#D73738] text-white py-3 px-4 font-bold rounded-xl mt-4 hover:bg-[#b82829] shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {creatingCompany ? 'Création en cours...' : 'Créer l\'entreprise'}
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="priceInit" className="block text-sm font-medium text-gray-900 mb-3">Prix initial</label>
                <input
                  type="text"
                  id="priceInit"
                  name="priceInit"
                  value={formData.priceInit}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-900 focus:border-[#D73738] focus:ring-4 focus:ring-red-200 transition"
                />
              </div>

              <div>
                <label htmlFor="priceFinal" className="block text-sm font-medium text-gray-900 mb-3">Prix final</label>
                <input
                  type="text"
                  id="priceFinal"
                  name="priceFinal"
                  value={formData.priceFinal}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-900 focus:border-[#D73738] focus:ring-4 focus:ring-red-200 transition"
                />
              </div>
            </div>

            <div>
              <label htmlFor="promotion" className="block text-sm font-medium text-gray-900 mb-3">Promotion (%)</label>
              <input
                type="text"
                id="promotion"
                name="promotion"
                value={formData.promotion}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-900 focus:border-[#D73738] focus:ring-4 focus:ring-red-200 transition"
              />
            </div>

            <div>
              <label htmlFor="urlImageCompanyPage" className="block text-sm font-medium text-gray-900 mb-3">URL Image (Page entreprise)</label>
              <input
                type="text"
                id="urlImageCompanyPage"
                name="urlImageCompanyPage"
                value={formData.urlImageCompanyPage}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-900 focus:border-[#D73738] focus:ring-4 focus:ring-red-200 transition"
              />
            </div>

            <h3 className="text-xl font-bold text-gray-900 mt-6 mb-4 pb-3 border-b border-gray-100">Paramètres de la promo</h3>

            <div className="space-y-6 bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="isIndefinite"
                  name="isIndefinite"
                  checked={promoData.isIndefinite}
                  onChange={handlePromoChange}
                  className="w-5 h-5 accent-[#D73738] mr-3"
                />
                <label htmlFor="isIndefinite" className="text-sm text-gray-900">Indéfini (jusqu'à fin manuelle)</label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="activationTime" className="block text-sm font-medium text-gray-900 mb-2">Heure d'activation * (HH:MM)</label>
                  <input
                    type="time"
                    id="activationTime"
                    name="activationTime"
                    value={promoData.activationTime}
                    onChange={handlePromoChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-900 focus:border-[#D73738] focus:ring-4 focus:ring-red-200 transition"
                  />
                </div>

                <div>
                  <label htmlFor="desactivationTime" className="block text-sm font-medium text-gray-900 mb-2">Heure de désactivation * (HH:MM)</label>
                  <input
                    type="time"
                    id="desactivationTime"
                    name="desactivationTime"
                    value={promoData.isIndefinite ? '' : promoData.desactivationTime}
                    onChange={handlePromoChange}
                    required={!promoData.isIndefinite}
                    disabled={promoData.isIndefinite}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-900 focus:border-[#D73738] focus:ring-4 focus:ring-red-200 disabled:bg-gray-100 disabled:cursor-not-allowed transition"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="dayOfWeek" className="block text-sm font-medium text-gray-900 mb-2">Jour de la semaine <span className="text-[#D73738]">*</span></label>
                <select
                  id="dayOfWeek"
                  name="dayOfWeek"
                  value={promoData.dayOfWeek}
                  onChange={handlePromoChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-900 focus:border-[#D73738] focus:ring-4 focus:ring-red-200 transition cursor-pointer"
                >
                  <option value="">Sélectionner un jour</option>
                  {daysOfWeek.map((day) => (
                    <option key={day.value} value={day.value}>
                      {day.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nbUtilisation" className="block text-sm font-medium text-gray-900 mb-2">Nombre d'utilisations <span className="text-[#D73738]">*</span></label>
                  <input
                    type="number"
                    id="nbUtilisation"
                    name="nbUtilisation"
                    value={promoData.nbUtilisation}
                    onChange={handlePromoChange}
                    required
                    min="1"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-900 focus:border-[#D73738] focus:ring-4 focus:ring-red-200 transition"
                  />
                </div>

                <div>
                  <label htmlFor="nbVouchers" className="block text-sm font-medium text-gray-900 mb-2">Nombre de vouchers à générer (max 3)</label>
                  <input
                    type="number"
                    id="nbVouchers"
                    name="nbVouchers"
                    value={promoData.nbVouchers}
                    onChange={handlePromoChange}
                    min="1"
                    max="3"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-900 focus:border-[#D73738] focus:ring-4 focus:ring-red-200 transition"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col md:flex-row gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#D73738] text-white py-4 px-6 font-bold rounded-xl hover:bg-[#b82829] shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Création en cours...' : 'Créer la Promo'}
              </button>

              <button
                type="button"
                onClick={() => navigate('/products')}
                className="px-6 py-4 border-2 border-gray-200 text-gray-700 font-bold rounded-xl bg-white hover:border-[#D73738] hover:text-[#D73738] hover:bg-red-50 transition"
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

export default CreateProduct;
