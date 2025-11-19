import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { voucherService, productService, companyService } from '../services/api';
import { Voucher } from '../types';
import { Product, Company } from '../types';

const VouchersList: React.FC = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vouchersRes, productsRes, companiesRes] = await Promise.all([
          voucherService.getAll(),
          productService.getAll(),
          companyService.getAll(),
        ]);
        setVouchers(vouchersRes.data);
        setProducts(productsRes.data);
        setCompanies(companiesRes.data);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement des promos');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette promo ?')) {
      return;
    }

    setDeleteLoading(id);
    try {
      await voucherService.delete(id);
      setVouchers(vouchers.filter((v) => v.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.error || 'Erreur lors de la suppression');
    } finally {
      setDeleteLoading(null);
    }
  };

  const getProductName = (productId: string): string => {
    const product = products.find((p) => p.id === productId);
    return product ? product.data.name : productId;
  };

  const getCompanyName = (companyId: string): string => {
    const company = companies.find((c) => c.id === companyId);
    return company ? company.data.name : companyId;
  };

  const getVoucherCount = (voucher: Voucher): number => {
    let count = 0;
    if (voucher.voucher1) count++;
    if (voucher.voucher2) count++;
    if (voucher.voucher3) count++;
    return count;
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-600">Chargement des promos...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Liste des Promos (Vouchers)</h2>
        <button
          onClick={() => navigate('/create-voucher')}
          className="bg-gray-900 text-white px-6 py-2 border font-medium hover:bg-gray-800"
        >
          + Créer une Promo
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {vouchers.length === 0 ? (
        <div className="border p-12 text-center text-gray-500">
          <p className="mb-4">Aucune promo trouvée</p>
          <button
            onClick={() => navigate('/create-voucher')}
            className="text-gray-900 hover:underline font-semibold"
          >
            Créer votre première promo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {vouchers.map((voucher) => (
            <div
              key={voucher.id}
              className="border p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Promo #{voucher.id.slice(0, 8)}
                  </h3>
                  <div className="flex gap-2 mb-2">
                    <span className="border px-3 py-1 text-sm">
                      {getVoucherCount(voucher)} voucher(s)
                    </span>
                    <span className="border px-3 py-1 text-sm">
                      {voucher.dayOfWeek}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/edit-voucher/${voucher.id}`)}
                    className="border px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(voucher.id)}
                    disabled={deleteLoading === voucher.id}
                    className="border border-red-500 text-red-500 px-4 py-2 text-sm hover:bg-red-50 disabled:opacity-50"
                  >
                    {deleteLoading === voucher.id ? '...' : 'Supprimer'}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-500">Produit :</span>
                  <p className="font-medium text-gray-800">{getProductName(voucher.productId)}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Entreprise :</span>
                  <p className="font-medium text-gray-800">{getCompanyName(voucher.companyId)}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Activation :</span>
                    <p className="font-medium text-gray-800">{voucher.activationTime}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Désactivation :</span>
                    <p className="font-medium text-gray-800">{voucher.desactivationTime}</p>
                  </div>
                </div>
                {voucher.voucher1 && (
                  <div className="pt-3 border-t">
                    <span className="text-sm text-gray-500">Codes vouchers :</span>
                    <div className="mt-2 space-y-1">
                      {voucher.voucher1 && (
                        <p className="text-xs font-mono bg-gray-100 p-2 rounded">
                          {voucher.voucher1}
                        </p>
                      )}
                      {voucher.voucher2 && (
                        <p className="text-xs font-mono bg-gray-100 p-2 rounded">
                          {voucher.voucher2}
                        </p>
                      )}
                      {voucher.voucher3 && (
                        <p className="text-xs font-mono bg-gray-100 p-2 rounded">
                          {voucher.voucher3}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VouchersList;
