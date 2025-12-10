class ApiConfig {
  // URL temporaire pour le développement local
  // Changez cette valeur pour basculer entre local et production
  static const String baseUrl = 'http://localhost:3500';
  
  // URL de production (commentée pour le moment)
  // static const String baseUrl = 'https://newstudback.onrender.com';
  
  static String get apiUrl => '$baseUrl/api';
  static String get authUrl => baseUrl;
}

