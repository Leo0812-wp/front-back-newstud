import React, { useState, useEffect } from 'react';
import { db4Service } from '../services/api';

interface CollectionData {
  count: number;
  documents: Array<{
    id: string;
    data: any;
  }>;
}

interface DB4Response {
  success: boolean;
  collections: Record<string, CollectionData>;
  totalCollections: number;
}

const VueDB4: React.FC = () => {
  const [data, setData] = useState<DB4Response | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCollections, setExpandedCollections] = useState<Set<string>>(new Set());
  const [expandedDocuments, setExpandedDocuments] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await db4Service.getAllCollections();
        setData(response.data);
        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Erreur lors du chargement des données Firebase');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleCollection = (collectionName: string) => {
    const newExpanded = new Set(expandedCollections);
    if (newExpanded.has(collectionName)) {
      newExpanded.delete(collectionName);
    } else {
      newExpanded.add(collectionName);
    }
    setExpandedCollections(newExpanded);
  };

  const toggleDocument = (docKey: string) => {
    const newExpanded = new Set(expandedDocuments);
    if (newExpanded.has(docKey)) {
      newExpanded.delete(docKey);
    } else {
      newExpanded.add(docKey);
    }
    setExpandedDocuments(newExpanded);
  };

  const formatValue = (value: any): string => {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  if (loading) {
    return (
      <div>
        
        <div className="container mx-auto px-4 py-12">
          <div className="text-center text-gray-600">Chargement des données Firebase...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        
        <div className="container mx-auto px-4 py-12">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div>
        
        <div className="container mx-auto px-4 py-12">
          <div className="text-center text-gray-500">Aucune donnée disponible</div>
        </div>
      </div>
    );
  }

  const collections = Object.entries(data.collections);

  return (
    <div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Vue DB4 - Base de données Firebase</h2>
          <p className="text-gray-600">
            {data.totalCollections} collection{data.totalCollections > 1 ? 's' : ''} trouvée{data.totalCollections > 1 ? 's' : ''}
          </p>
        </div>

        {collections.length === 0 ? (
          <div className="border p-12 text-center text-gray-500">
            Aucune collection trouvée dans la base de données
          </div>
        ) : (
          <div className="space-y-4">
            {collections.map(([collectionName, collectionData]) => {
              const isCollectionExpanded = expandedCollections.has(collectionName);
              const docKey = `${collectionName}-`;
              
              return (
                <div key={collectionName} className="border">
                  <div
                    className="p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 flex justify-between items-center"
                    onClick={() => toggleCollection(collectionName)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-semibold text-gray-800">
                        {collectionName}
                      </span>
                      <span className="text-sm text-gray-500">
                        ({collectionData.count} document{collectionData.count > 1 ? 's' : ''})
                      </span>
                    </div>
                    <svg
                      className={`w-5 h-5 text-gray-600 transition-transform ${
                        isCollectionExpanded ? 'transform rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>

                  {isCollectionExpanded && (
                    <div className="p-4 space-y-3">
                      {collectionData.documents.length === 0 ? (
                        <div className="text-gray-500 text-sm">Aucun document dans cette collection</div>
                      ) : (
                        collectionData.documents.map((doc) => {
                          const docKeyFull = `${collectionName}-${doc.id}`;
                          const isDocExpanded = expandedDocuments.has(docKeyFull);
                          
                          return (
                            <div key={doc.id} className="border-l-2 border-gray-200 pl-4">
                              <div
                                className="flex justify-between items-center cursor-pointer hover:bg-gray-50 p-2 -ml-4 pl-4"
                                onClick={() => toggleDocument(docKeyFull)}
                              >
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-sm font-semibold text-gray-700">
                                    ID: {doc.id}
                                  </span>
                                </div>
                                <svg
                                  className={`w-4 h-4 text-gray-500 transition-transform ${
                                    isDocExpanded ? 'transform rotate-90' : ''
                                  }`}
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                              </div>

                              {isDocExpanded && (
                                <div className="mt-2 bg-gray-50 p-4 rounded">
                                  <pre className="text-xs overflow-x-auto">
                                    {JSON.stringify(doc.data, null, 2)}
                                  </pre>
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default VueDB4;

