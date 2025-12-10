import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productService, companyService, voucherService } from '../services/api';
import { CreateProductData, Company, Voucher } from '../types';

const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
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
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Champs pour la promo
  const [promoData, setPromoData] = useState<{
    activationTime: string;
    desactivationTime: string;
    dayOfWeek: string;
    nbUtilisation: number;
    nbVouchers: number;
    isIndefinite: boolean;
  }>({
    activationTime: '',
    desactivationTime: '',
    dayOfWeek: '',
    nbUtilisation: 1,
    nbVouchers: 1,
    isIndefinite: false,
  });
  const [existingVoucherId, setExistingVoucherId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, companiesRes, vouchersRes] = await Promise.all([
          productService.getById(id!),
          companyService.getAll(),
          voucherService.getAll(),
        ]);
        
        const product = productRes.data;
        setFormData({
          name: product.data.name || '',
          description: product.data.description || '',
          category: product.data.category || '',
          companyId: product.data.companyId || '',
          priceInit: product.data.priceInit || '',
          priceFinal: product.data.priceFinal || '',
          promotion: product.data.promotion || '',
          urlImageCompanyPage: product.data.urlImageCompanyPage || '',
          urlImageProductPage: product.data.urlImageProductPage || [],
        });
        
        setCompanies(companiesRes.data);
        
        // Chercher la promo associée au produit
        const associatedVoucher = vouchersRes.data.find((v: Voucher) => v.productId === id);
        if (associatedVoucher) {
          const voucherCount = (associatedVoucher.voucher1 ? 1 : 0) + 
                              (associatedVoucher.voucher2 ? 1 : 0) + 
                              (associatedVoucher.voucher3 ? 1 : 0);
          const isIndefinite = associatedVoucher.desactivationTime === 'indefini' || 
                               associatedVoucher.desactivationTime === 'manual' ||
                               !associatedVoucher.desactivationTime;
          setPromoData({
            activationTime: associatedVoucher.activationTime || '',
            desactivationTime: isIndefinite ? '' : (associatedVoucher.desactivationTime || ''),
            dayOfWeek: associatedVoucher.dayOfWeek || '',
            nbUtilisation: 1,
            nbVouchers: voucherCount || 1,
            isIndefinite: isIndefinite,
          });
          setExistingVoucherId(associatedVoucher.id);
        }
        
        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Erreur lors du chargement du produit');
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // Mettre à jour le produit
      await productService.update(id!, formData);
      
      // Gérer la promo
      if (promoData.activationTime && (promoData.desactivationTime || promoData.isIndefinite) && promoData.dayOfWeek) {
        if (existingVoucherId) {
          // Mettre à jour la promo existante
          try {
            await voucherService.update(existingVoucherId, {
              productId: id!,
              companyId: formData.companyId,
              activationTime: promoData.activationTime,
              desactivationTime: promoData.isIndefinite ? 'indefini' : promoData.desactivationTime,
              dayOfWeek: promoData.dayOfWeek,
            });
            setSuccess('Promo modifiée avec succès !');
          } catch (voucherErr: any) {
            setSuccess('Promo modifiée avec succès, mais erreur lors de la modification de la promo');
            console.error('Erreur modification voucher:', voucherErr);
          }
        } else {
          // Créer une nouvelle promo
          try {
            await voucherService.create({
              productId: id!,
              companyId: formData.companyId,
              activationTime: promoData.activationTime,
              desactivationTime: promoData.isIndefinite ? 'indefini' : promoData.desactivationTime,
              dayOfWeek: promoData.dayOfWeek,
              nbUtilisation: promoData.nbVouchers,
            });
            setSuccess('Promo modifiée et nouvelle promo créée avec succès !');
          } catch (voucherErr: any) {
            setSuccess('Promo modifiée avec succès, mais erreur lors de la création de la promo');
            console.error('Erreur création voucher:', voucherErr);
          }
        }
      } else {
        setSuccess('Promo modifiée avec succès !');
      }
      
      setTimeout(() => {
        navigate('/products');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de la modification du produit');
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#D73738] border-t-transparent mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Chargement du produit...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'Roboto, sans-serif' }}>
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          {/* En-tête */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/products')}
              className="flex items-center gap-2 text-gray-600 hover:text-[#D73738] transition-colors mb-4 font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour à la liste
            </button>
            <h1 className="text-4xl font-bold text-[#0C0C0C] mb-2">Modifier un Produit</h1>
            <p className="text-gray-600 text-base">Modifiez les informations du produit et de sa promotion</p>
          </div>

          {/* Messages d'alerte */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6 flex items-center gap-3">
              <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-2 border-green-200 text-green-700 px-6 py-4 rounded-xl mb-6 flex items-center gap-3">
              <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-8 space-y-8">
            {/* Section Informations principales */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#0C0C0C] pb-3 border-b-2 border-gray-200">Informations principales</h2>
              
              <div>
                <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">
                  Nom du produit *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#D73738] focus:outline-none transition-colors text-base"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#D73738] focus:outline-none transition-colors text-base resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="category" className="block text-sm font-bold text-gray-700 mb-2">
                    Catégorie *
                  </label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#D73738] focus:outline-none transition-colors text-base"
                  />
                </div>

                <div>
                  <label htmlFor="companyId" className="block text-sm font-bold text-gray-700 mb-2">
                    Entreprise *
                  </label>
                  <select
                    id="companyId"
                    name="companyId"
                    value={formData.companyId}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#D73738] focus:outline-none transition-colors text-base bg-white cursor-pointer"
                  >
                    <option value="">Sélectionner une entreprise</option>
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.data.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Section Prix et promotion */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#0C0C0C] pb-3 border-b-2 border-gray-200">Prix et promotion</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="priceInit" className="block text-sm font-bold text-gray-700 mb-2">
                    Prix initial
                  </label>
                  <input
                    type="text"
                    id="priceInit"
                    name="priceInit"
                    value={formData.priceInit}
                    onChange={handleChange}
                    placeholder="0.00 €"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#D73738] focus:outline-none transition-colors text-base"
                  />
                </div>

                <div>
                  <label htmlFor="priceFinal" className="block text-sm font-bold text-gray-700 mb-2">
                    Prix final
                  </label>
                  <input
                    type="text"
                    id="priceFinal"
                    name="priceFinal"
                    value={formData.priceFinal}
                    onChange={handleChange}
                    placeholder="0.00 €"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#D73738] focus:outline-none transition-colors text-base"
                  />
                </div>

                <div>
                  <label htmlFor="promotion" className="block text-sm font-bold text-gray-700 mb-2">
                    Promotion (%)
                  </label>
                  <input
                    type="text"
                    id="promotion"
                    name="promotion"
                    value={formData.promotion}
                    onChange={handleChange}
                    placeholder="0 %"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#D73738] focus:outline-none transition-colors text-base"
                  />
                </div>
              </div>
            </div>

            {/* Section Image */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#0C0C0C] pb-3 border-b-2 border-gray-200">Image</h2>
              
              <div>
                <label htmlFor="urlImageCompanyPage" className="block text-sm font-bold text-gray-700 mb-2">
                  URL Image (Page entreprise)
                </label>
                <input
                  type="text"
                  id="urlImageCompanyPage"
                  name="urlImageCompanyPage"
                  value={formData.urlImageCompanyPage}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#D73738] focus:outline-none transition-colors text-base"
                />
                {formData.urlImageCompanyPage && (
                  <div className="mt-3">
                    <img
                      src={formData.urlImageCompanyPage}
                      alt="Aperçu"
                      className="max-w-full h-48 object-cover rounded-xl border-2 border-gray-200"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Section Promo */}
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b-2 border-gray-200">
                <h2 className="text-2xl font-bold text-[#0C0C0C]">Paramètres de la promotion</h2>
                <div className="flex items-center gap-2 bg-[#D73738] bg-opacity-10 px-4 py-2 rounded-xl">
                  <svg className="w-5 h-5 text-[#D73738]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-bold text-[#D73738]">Promotion active</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 space-y-6">
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl border-2 border-gray-200">
                  <input
                    type="checkbox"
                    id="isIndefinite"
                    name="isIndefinite"
                    checked={promoData.isIndefinite}
                    onChange={handlePromoChange}
                    className="w-5 h-5 text-[#D73738] border-gray-300 rounded focus:ring-[#D73738] cursor-pointer"
                  />
                  <label htmlFor="isIndefinite" className="text-sm font-bold text-gray-700 cursor-pointer flex-1">
                    Promotion indéfinie (jusqu'à désactivation manuelle)
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="activationTime"
                      className="block text-sm font-bold text-gray-700 mb-2"
                    >
                      Heure d'activation * (HH:MM)
                    </label>
                    <input
                      type="time"
                      id="activationTime"
                      name="activationTime"
                      value={promoData.activationTime}
                      onChange={handlePromoChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#D73738] focus:outline-none transition-colors text-base"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="desactivationTime"
                      className="block text-sm font-bold text-gray-700 mb-2"
                    >
                      Heure de désactivation * (HH:MM)
                    </label>
                    <input
                      type="time"
                      id="desactivationTime"
                      name="desactivationTime"
                      value={promoData.isIndefinite ? '' : promoData.desactivationTime}
                      onChange={handlePromoChange}
                      required={!promoData.isIndefinite}
                      disabled={promoData.isIndefinite}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#D73738] focus:outline-none transition-colors text-base disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="dayOfWeek" className="block text-sm font-bold text-gray-700 mb-2">
                    Jour de la semaine *
                  </label>
                  <select
                    id="dayOfWeek"
                    name="dayOfWeek"
                    value={promoData.dayOfWeek}
                    onChange={handlePromoChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#D73738] focus:outline-none transition-colors text-base bg-white cursor-pointer"
                  >
                    <option value="">Sélectionner un jour</option>
                    {daysOfWeek.map((day) => (
                      <option key={day.value} value={day.value}>
                        {day.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="nbUtilisation"
                      className="block text-sm font-bold text-gray-700 mb-2"
                    >
                      Nombre d'utilisations sur l'offre *
                    </label>
                    <input
                      type="number"
                      id="nbUtilisation"
                      name="nbUtilisation"
                      value={promoData.nbUtilisation}
                      onChange={handlePromoChange}
                      required
                      min="1"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#D73738] focus:outline-none transition-colors text-base"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="nbVouchers"
                      className="block text-sm font-bold text-gray-700 mb-2"
                    >
                      Nombre d'utilisations par jour * (max 3)
                    </label>
                    <input
                      type="number"
                      id="nbVouchers"
                      name="nbVouchers"
                      value={promoData.nbVouchers}
                      onChange={handlePromoChange}
                      min="1"
                      max="3"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#D73738] focus:outline-none transition-colors text-base"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t-2 border-gray-200">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-[#D73738] text-white py-3.5 px-8 rounded-xl font-bold text-lg hover:bg-[#c02f30] transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Enregistrement...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Enregistrer les modifications</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/products')}
                className="px-8 py-3.5 border-2 border-gray-300 text-gray-700 rounded-xl font-bold text-base hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
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

export default EditProduct;

