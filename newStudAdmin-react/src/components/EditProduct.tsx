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
      <div>
        <div className="container mx-auto px-4 py-8">
            <div className="text-center py-12">
            <div className="text-gray-600">Chargement de la promo...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate('/products')}
              className="text-gray-900 hover:underline font-semibold"
            >
              ← Retour
            </button>
            <h2 className="text-3xl font-bold">Modifier une Promo</h2>
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
              <label htmlFor="companyId" className="block text-sm font-medium text-gray-700 mb-2">
                Entreprise *
              </label>
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

            {/* Section modification de promo */}
            <div className="border-t pt-6 mt-6">
              <h3 className="font-semibold text-gray-700 mb-4">Paramètres de la promo</h3>

              <div className="space-y-6 bg-gray-50 p-4">
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="isIndefinite"
                    name="isIndefinite"
                    checked={promoData.isIndefinite}
                    onChange={handlePromoChange}
                    className="mr-2"
                  />
                  <label htmlFor="isIndefinite" className="text-sm text-gray-700">
                    Indéfini (jusqu'à fin manuelle)
                  </label>
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
                      value={promoData.activationTime}
                      onChange={handlePromoChange}
                      required
                      className="w-full px-4 py-2 border focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
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
                      value={promoData.isIndefinite ? '' : promoData.desactivationTime}
                      onChange={handlePromoChange}
                      required={!promoData.isIndefinite}
                      disabled={promoData.isIndefinite}
                      className="w-full px-4 py-2 border focus:ring-2 focus:ring-gray-500 focus:border-gray-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                    value={promoData.dayOfWeek}
                    onChange={handlePromoChange}
                    required
                    className="w-full px-4 py-2 border focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
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
                    className="w-full px-4 py-2 border focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="nbVouchers"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Nombre d'utilisation par jours * (max 3)
                  </label>
                  <input
                    type="number"
                    id="nbVouchers"
                    name="nbVouchers"
                    value={promoData.nbVouchers}
                    onChange={handlePromoChange}
                    min="1"
                    max="3"
                    className="w-full px-4 py-2 border focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                  />
                </div>
              </div>
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
                onClick={() => navigate('/products')}
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

export default EditProduct;

