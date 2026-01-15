import React, { useState, useEffect } from 'react';
import { userService } from '../services/api';
import { User } from '../types';

const ClientsList: React.FC = () => {
  const [clients, setClients] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await userService.getAll();
        setClients(response.data);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement des clients');
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  // Filtrage des clients
  const filteredClients = clients.filter((client) => {
    const name = client.data.name || '';
    const firstName = client.data.firstName || '';
    const username = client.data.username || '';
    const uid = client.data.uid || client.id || '';
    
    const searchLower = searchTerm.toLowerCase();
    return (
      name.toLowerCase().includes(searchLower) ||
      firstName.toLowerCase().includes(searchLower) ||
      username.toLowerCase().includes(searchLower) ||
      uid.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#D73738] border-t-transparent mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Chargement des clients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'Roboto, sans-serif' }}>
      <div className="container mx-auto px-4 py-10">
        {/* En-tête avec titre */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-[#0C0C0C] mb-2">Gestion des Clients</h1>
              <p className="text-gray-600 text-base">Consultez tous vos clients et leurs informations</p>
            </div>
          </div>

          {/* Barre de recherche */}
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
                    placeholder="Rechercher un client (nom, prénom, username, ID)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#D73738] focus:outline-none transition-colors text-base"
                  />
                </div>
              </div>
            </div>

            {/* Compteur de résultats */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                {filteredClients.length} {filteredClients.length > 1 ? 'clients trouvés' : 'client trouvé'}
              </span>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-[#D73738] hover:underline font-medium"
                >
                  Réinitialiser la recherche
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

        {/* Liste des clients */}
        {filteredClients.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-16 text-center">
            <svg className="w-20 h-20 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-gray-500 text-lg font-medium mb-2">Aucun client trouvé</p>
            {searchTerm ? (
              <p className="text-gray-400 text-sm">Essayez de modifier vos critères de recherche</p>
            ) : (
              <p className="text-gray-400 text-sm">Aucun client enregistré pour le moment</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map((client) => (
              <div
                key={client.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
                style={{
                  boxShadow: '0 0.5px 0 rgba(217, 217, 217, 0.5)',
                }}
              >
                {/* En-tête de la carte avec icône utilisateur */}
                <div className="relative w-full h-32 bg-gradient-to-br from-[#D73738] to-[#c02f30] flex items-center justify-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-12 h-12 text-[#D73738]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>

                {/* Contenu de la carte */}
                <div className="p-5 flex-1 flex flex-col">
                  {/* Nom du client */}
                  <h3 className="text-xl font-bold text-[#0C0C0C] mb-3">
                    {client.data.firstName && client.data.name
                      ? `${client.data.firstName} ${client.data.name}`
                      : client.data.name || client.data.firstName || client.data.username || 'Client sans nom'}
                  </h3>

                  {/* Informations du client */}
                  <div className="space-y-3 mb-4 flex-1">
                    {client.data.username && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg className="w-4 h-4 text-[#D73738] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="truncate">Username: {client.data.username}</span>
                      </div>
                    )}
                    {client.data.uid && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg className="w-4 h-4 text-[#D73738] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                        </svg>
                        <span className="truncate">UID: {client.data.uid}</span>
                      </div>
                    )}
                    {client.data.favorites && Array.isArray(client.data.favorites) && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg className="w-4 h-4 text-[#D73738] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span>{client.data.favorites.length} favori{client.data.favorites.length > 1 ? 's' : ''}</span>
                      </div>
                    )}
                    {client.data.vouchersUsed && Array.isArray(client.data.vouchersUsed) && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg className="w-4 h-4 text-[#D73738] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>{client.data.vouchersUsed.length} voucher{client.data.vouchersUsed.length > 1 ? 's' : ''} utilisé{client.data.vouchersUsed.length > 1 ? 's' : ''}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-xs text-gray-400 pt-2 border-t border-gray-200">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <span className="truncate">ID: {client.id}</span>
                    </div>
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

export default ClientsList;
