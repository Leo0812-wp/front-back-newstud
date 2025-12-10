import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services/api';
import { Product } from '../types';

const ProductsList: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productService.getAll();
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement des produits');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-600">Chargement des produits...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Liste des Produits</h2>
        <button
          onClick={() => navigate('/create-product')}
          className="bg-gray-900 text-white px-6 py-2 border font-medium hover:bg-gray-800"
        >
          + Créer un Produit
        </button>
      </div>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}
      {products.length === 0 ? (
        <div className="border p-12 text-center text-gray-500">
          Aucun produit trouvé
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="border overflow-hidden"
            >
              <div className="border-b p-4 flex justify-between items-center">
                <h3 className="text-xl font-semibold">{product.data.name}</h3>
                {product.data.promotion && (
                  <span className="border px-3 py-1 text-sm font-bold">
                    -{product.data.promotion}%
                  </span>
                )}
              </div>
              <div className="w-full h-48 bg-gray-100 overflow-hidden">
                {product.data.urlImageCompanyPage ? (
                  <img
                    src={product.data.urlImageCompanyPage}
                    alt={product.data.name}
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
                <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                  {product.data.description}
                </p>
                <div className="flex gap-3 items-center mb-4">
                  {product.data.priceInit && (
                    <span className="text-gray-400 line-through text-sm">
                      {product.data.priceInit}€
                    </span>
                  )}
                  {product.data.priceFinal && (
                    <span className="font-bold text-xl">
                      {product.data.priceFinal}€
                    </span>
                  )}
                </div>
                <div className="border-t pt-4 space-y-3">
                  <div className="text-xs text-gray-500 space-y-1">
                    <div>ID: {product.id}</div>
                    <div>Company ID: {product.data.companyId}</div>
                    {product.data.category && (
                      <div>Catégorie (type de produits): {product.data.category}</div>
                    )}
                  </div>
                  <button
                    onClick={() => navigate(`/edit-product/${product.id}`)}
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

export default ProductsList;

