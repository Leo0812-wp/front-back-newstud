import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services/api';
import { Product } from '../types';

const ProductsList: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productService.getAll();
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement des promo');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id: string, productName: string) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer le produit "${productName}" ?\n\nCette action est irréversible.`)) {
      return;
    }

    setDeleteLoading(id);
    setError(null);
    try {
      await productService.delete(id);
      setProducts(products.filter((p) => p.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de la suppression du produit');
    } finally {
      setDeleteLoading(null);
    }
  };

  // Filtrage des produits
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.data.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.data.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.data.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Extraction des catégories uniques
  const categories = ['all', ...Array.from(new Set(products.map(p => p.data.category).filter(Boolean)))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#D73738] border-t-transparent mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Chargement des promos...</p>
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
              <h1 className="text-4xl font-bold text-[#0C0C0C] mb-2">Gestion des Promotions</h1>
              <p className="text-gray-600 text-base">Gérez tous vos promo et promotions en un seul endroit</p>
            </div>
            <button
              onClick={() => navigate('/create-product')}
              className="bg-[#D73738] text-white px-8 py-3.5 rounded-xl font-bold text-lg hover:bg-[#c02f30] transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2 justify-center md:justify-start whitespace-nowrap"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Créer une Promotion
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
                    placeholder="Rechercher un produit..."
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
                {filteredProducts.length} {filteredProducts.length > 1 ? 'promos trouvées' : 'promo trouvée'}
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

        {/* Liste des produits */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-16 text-center">
            <svg className="w-20 h-20 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p className="text-gray-500 text-lg font-medium mb-2">Aucun produit trouvé</p>
            {(searchTerm || selectedCategory !== 'all') ? (
              <p className="text-gray-400 text-sm">Essayez de modifier vos critères de recherche</p>
            ) : (
              <p className="text-gray-400 text-sm">Créez votre premier produit pour commencer</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
                style={{
                  boxShadow: '0 0.5px 0 rgba(217, 217, 217, 0.5)',
                }}
              >
                {/* Image du produit */}
                <div className="relative w-full h-52 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  {product.data.urlImageCompanyPage ? (
                    <img
                      src={product.data.urlImageCompanyPage}
                      alt={product.data.name}
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
                  {/* Badge promotion */}
                  {product.data.promotion && (
                    <div className="absolute top-3 right-3">
                      <span className="bg-[#D73738] text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-md">
                        -{product.data.promotion}%
                      </span>
                    </div>
                  )}
                  {/* Badge catégorie */}
                  {product.data.category && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-white text-[#D73738] px-3 py-1.5 rounded-lg text-xs font-bold shadow-md">
                        {product.data.category}
                      </span>
                    </div>
                  )}
                </div>

                {/* Contenu de la carte */}
                <div className="p-5 flex-1 flex flex-col">
                  {/* Nom du produit */}
                  <h3 className="text-xl font-bold text-[#0C0C0C] mb-3 line-clamp-2">
                    {product.data.name}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
                    {product.data.description}
                  </p>

                  {/* Prix */}
                  <div className="flex items-center gap-3 mb-4">
                    {product.data.priceInit && (
                      <span className="text-gray-400 line-through text-sm">
                        {product.data.priceInit}€
                      </span>
                    )}
                    {product.data.priceFinal && (
                      <span className="font-bold text-2xl text-[#D73738]">
                        {product.data.priceFinal}€
                      </span>
                    )}
                  </div>

                  {/* Informations supplémentaires */}
                  <div className="space-y-2 mb-4">
                    {product.data.usable !== undefined && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <svg className="w-4 h-4 text-[#D73738] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Utilisable: {product.data.usable}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <span className="truncate">ID: {product.id}</span>
                    </div>
                  </div>

                  {/* Boutons d'action */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/edit-product/${product.id}`)}
                      className="flex-1 bg-white border-2 border-[#D73738] text-[#D73738] px-4 py-3 rounded-xl font-bold text-base hover:bg-[#D73738] hover:text-white transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(product.id, product.data.name)}
                      disabled={deleteLoading === product.id}
                      className="px-4 py-3 bg-white border-2 border-red-500 text-red-500 rounded-xl font-bold text-base hover:bg-red-500 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {deleteLoading === product.id ? (
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

export default ProductsList;
