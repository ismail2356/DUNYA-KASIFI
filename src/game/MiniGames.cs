using System;
using System.Collections.Generic;
using UnityEngine;

namespace DunyaKasifi.Game
{
    /// <summary>
    /// Uygulamadaki mini oyunları yöneten ana sınıf.
    /// Çeşitli mini oyunları başlatma, durdurma ve takip etme işlevlerini sağlar.
    /// </summary>
    public class MiniGames : MonoBehaviour
    {
        [Serializable]
        public class MiniGameInfo
        {
            public string gameId;
            public string gameName;
            public string description;
            public GameObject gamePrefab;
            public Sprite gameIcon;
            public int minAge;
            public int maxAge;
            public float estimatedDuration; // Dakika cinsinden
            public int pointValue = 10;
            public bool isCompleted = false;
            public GameCategory category;
        }

        public enum GameCategory
        {
            Geography,
            Culture,
            Language,
            Science,
            Math,
            Fun
        }

        [Header("Mini Game Settings")]
        [SerializeField] private List<MiniGameInfo> availableGames = new List<MiniGameInfo>();
        [SerializeField] private Transform gameContainer;
        [SerializeField] private int playerAge = 8;
        
        [Header("Events")]
        public Action<MiniGameInfo> OnGameStarted;
        public Action<MiniGameInfo, int> OnGameCompleted;
        public Action<MiniGameInfo> OnGameCancelled;
        
        private MiniGameInfo _currentGame;
        private GameObject _currentGameInstance;
        
        /// <summary>
        /// Belirtilen kategoride ve yaş aralığında kullanılabilir oyunları getirir.
        /// </summary>
        public List<MiniGameInfo> GetAvailableGames(GameCategory category = GameCategory.Fun, bool includeCompleted = false)
        {
            List<MiniGameInfo> filteredGames = new List<MiniGameInfo>();
            
            foreach (var game in availableGames)
            {
                bool ageAppropriate = playerAge >= game.minAge && (game.maxAge == 0 || playerAge <= game.maxAge);
                bool categoryMatch = category == game.category || category == GameCategory.Fun;
                bool completionStatus = includeCompleted || !game.isCompleted;
                
                if (ageAppropriate && categoryMatch && completionStatus)
                    filteredGames.Add(game);
            }
            
            return filteredGames;
        }
        
        /// <summary>
        /// Belirtilen mini oyunu başlatır.
        /// </summary>
        public bool StartGame(string gameId)
        {
            // Mevcut oyunu durdur
            if (_currentGameInstance != null)
            {
                StopCurrentGame();
            }
            
            // Oyunu bul
            MiniGameInfo gameInfo = availableGames.Find(g => g.gameId == gameId);
            if (gameInfo == null || gameInfo.gamePrefab == null)
            {
                Debug.LogWarning($"Mini game not found or missing prefab: {gameId}");
                return false;
            }
            
            // Yaşa uygun mu kontrol et
            if (playerAge < gameInfo.minAge || (gameInfo.maxAge > 0 && playerAge > gameInfo.maxAge))
            {
                Debug.LogWarning($"Mini game not appropriate for player age: {gameId}");
                return false;
            }
            
            // Oyun instance'ını oluştur
            _currentGame = gameInfo;
            _currentGameInstance = Instantiate(gameInfo.gamePrefab, gameContainer);
            
            // Oyun başlatma olayını tetikle
            OnGameStarted?.Invoke(gameInfo);
            
            Debug.Log($"Mini game started: {gameInfo.gameName}");
            return true;
        }
        
        /// <summary>
        /// Rastgele bir mini oyun başlatır.
        /// </summary>
        public bool StartRandomGame(GameCategory category = GameCategory.Fun)
        {
            List<MiniGameInfo> games = GetAvailableGames(category);
            if (games.Count == 0)
            {
                Debug.LogWarning($"No available games found for category: {category}");
                return false;
            }
            
            int randomIndex = UnityEngine.Random.Range(0, games.Count);
            return StartGame(games[randomIndex].gameId);
        }
        
        /// <summary>
        /// Mevcut oyunu durdurur ve temizler.
        /// </summary>
        public void StopCurrentGame()
        {
            if (_currentGameInstance != null)
            {
                Destroy(_currentGameInstance);
                _currentGameInstance = null;
                
                OnGameCancelled?.Invoke(_currentGame);
                Debug.Log($"Mini game stopped: {_currentGame.gameName}");
                
                _currentGame = null;
            }
        }
        
        /// <summary>
        /// Mevcut oyunu tamamlandı olarak işaretler.
        /// </summary>
        public void CompleteCurrentGame(int score = 0)
        {
            if (_currentGame != null)
            {
                _currentGame.isCompleted = true;
                
                OnGameCompleted?.Invoke(_currentGame, score);
                Debug.Log($"Mini game completed: {_currentGame.gameName} with score: {score}");
                
                StopCurrentGame();
            }
        }
        
        /// <summary>
        /// Oyuncunun yaşını ayarlar.
        /// </summary>
        public void SetPlayerAge(int age)
        {
            playerAge = Mathf.Max(1, age);
            Debug.Log($"Player age set to: {playerAge}");
        }
    }
    
    /// <summary>
    /// Tüm mini oyunların uygulaması gereken temel arayüz.
    /// </summary>
    public interface IMiniGame
    {
        void Initialize(Dictionary<string, object> parameters);
        void StartGame();
        void PauseGame();
        void ResumeGame();
        void EndGame();
        int GetScore();
        float GetProgress(); // 0-1 arası bir değer
        event Action<int> OnScoreChanged;
        event Action<float> OnProgressChanged;
        event Action OnGameCompleted;
    }
    
    /// <summary>
    /// Mini oyunlar için temel sınıf. Tüm mini oyunlar bu sınıftan türetilmelidir.
    /// </summary>
    public abstract class MiniGameBase : MonoBehaviour, IMiniGame
    {
        [SerializeField] protected string gameId;
        [SerializeField] protected string gameName;
        [SerializeField] protected int maxScore = 100;
        
        protected int currentScore = 0;
        protected float currentProgress = 0f;
        protected bool isGameActive = false;
        protected bool isPaused = false;
        protected Dictionary<string, object> gameParameters;
        
        public event Action<int> OnScoreChanged;
        public event Action<float> OnProgressChanged;
        public event Action OnGameCompleted;
        
        public virtual void Initialize(Dictionary<string, object> parameters)
        {
            gameParameters = parameters ?? new Dictionary<string, object>();
            ResetGame();
        }
        
        public virtual void StartGame()
        {
            if (!isGameActive)
            {
                isGameActive = true;
                isPaused = false;
                
                Debug.Log($"Mini game {gameName} started");
            }
        }
        
        public virtual void PauseGame()
        {
            if (isGameActive && !isPaused)
            {
                isPaused = true;
                
                Debug.Log($"Mini game {gameName} paused");
            }
        }
        
        public virtual void ResumeGame()
        {
            if (isGameActive && isPaused)
            {
                isPaused = false;
                
                Debug.Log($"Mini game {gameName} resumed");
            }
        }
        
        public virtual void EndGame()
        {
            if (isGameActive)
            {
                isGameActive = false;
                isPaused = false;
                
                OnGameCompleted?.Invoke();
                Debug.Log($"Mini game {gameName} ended with score: {currentScore}");
            }
        }
        
        public virtual int GetScore()
        {
            return currentScore;
        }
        
        public virtual float GetProgress()
        {
            return currentProgress;
        }
        
        protected virtual void ResetGame()
        {
            currentScore = 0;
            currentProgress = 0f;
            isGameActive = false;
            isPaused = false;
            
            OnScoreChanged?.Invoke(currentScore);
            OnProgressChanged?.Invoke(currentProgress);
            
            Debug.Log($"Mini game {gameName} reset");
        }
        
        protected virtual void UpdateScore(int newScore)
        {
            currentScore = Mathf.Clamp(newScore, 0, maxScore);
            OnScoreChanged?.Invoke(currentScore);
        }
        
        protected virtual void UpdateProgress(float newProgress)
        {
            currentProgress = Mathf.Clamp01(newProgress);
            OnProgressChanged?.Invoke(currentProgress);
            
            // İlerleme 1'e ulaştığında oyunu bitir
            if (Mathf.Approximately(currentProgress, 1f) && isGameActive)
            {
                EndGame();
            }
        }
    }
    
    /// <summary>
    /// Örnek bir mini oyun: Harita Dedektifi
    /// Çocuğun harita üzerinde gizli yerleri bulması gereken bir oyun.
    /// </summary>
    public class MapDetectiveGame : MiniGameBase
    {
        [Serializable]
        public class HiddenLocation
        {
            public string name;
            public Vector2 position;
            public float radius = 50f;
            public int pointValue = 10;
            public bool isFound = false;
            public string hint;
        }
        
        [Header("Game Settings")]
        [SerializeField] private List<HiddenLocation> hiddenLocations = new List<HiddenLocation>();
        [SerializeField] private float timeLimit = 120f; // Saniye cinsinden
        [SerializeField] private int hintsAvailable = 3;
        
        private float _gameTime = 0f;
        private int _hintsUsed = 0;
        private int _locationsFound = 0;
        
        public override void StartGame()
        {
            base.StartGame();
            
            // Oyun parametrelerini kontrol et
            if (gameParameters != null)
            {
                if (gameParameters.TryGetValue("timeLimit", out object timeLimitObj))
                    timeLimit = (float)timeLimitObj;
                
                if (gameParameters.TryGetValue("hintsAvailable", out object hintsObj))
                    hintsAvailable = (int)hintsObj;
            }
            
            _gameTime = 0f;
            _hintsUsed = 0;
            _locationsFound = 0;
            
            foreach (var location in hiddenLocations)
                location.isFound = false;
            
            UpdateProgress(0f);
            UpdateScore(0);
        }
        
        private void Update()
        {
            if (isGameActive && !isPaused)
            {
                // Zamanı güncelle
                _gameTime += Time.deltaTime;
                
                // İlerlemeyi güncelle (zaman bazlı)
                UpdateProgress(_gameTime / timeLimit);
                
                // Zaman doldu mu kontrol et
                if (_gameTime >= timeLimit)
                {
                    EndGame();
                }
            }
        }
        
        /// <summary>
        /// Belirli bir noktayı kontrol eder ve eğer gizli bir konum bulunuyorsa puanı günceller.
        /// </summary>
        public bool CheckLocation(Vector2 position)
        {
            if (!isGameActive || isPaused)
                return false;
            
            foreach (var location in hiddenLocations)
            {
                if (!location.isFound && Vector2.Distance(position, location.position) <= location.radius)
                {
                    // Konumu bulduk
                    location.isFound = true;
                    _locationsFound++;
                    
                    // Puanı güncelle
                    UpdateScore(currentScore + location.pointValue);
                    
                    // Tüm konumlar bulundu mu kontrol et
                    if (_locationsFound >= hiddenLocations.Count)
                    {
                        EndGame();
                    }
                    
                    return true;
                }
            }
            
            return false;
        }
        
        /// <summary>
        /// Bir ipucu kullanır ve bulunmamış konumlardan birinin ipucunu gösterir.
        /// </summary>
        public string UseHint()
        {
            if (!isGameActive || isPaused || _hintsUsed >= hintsAvailable)
                return null;
            
            // Bulunmamış bir konum al
            var unfoundLocations = hiddenLocations.FindAll(loc => !loc.isFound);
            if (unfoundLocations.Count == 0)
                return null;
            
            // Rastgele bir ipucu seç
            int randomIndex = UnityEngine.Random.Range(0, unfoundLocations.Count);
            HiddenLocation location = unfoundLocations[randomIndex];
            
            _hintsUsed++;
            
            return location.hint;
        }
        
        public override void EndGame()
        {
            if (!isGameActive)
                return;
            
            // Bulunmamış konumlar için ceza puanı uygula
            int unfoundCount = hiddenLocations.Count - _locationsFound;
            int penalty = unfoundCount * 5;
            UpdateScore(Mathf.Max(0, currentScore - penalty));
            
            base.EndGame();
        }
        
        public int GetRemainingHints()
        {
            return hintsAvailable - _hintsUsed;
        }
        
        public int GetLocationsFound()
        {
            return _locationsFound;
        }
        
        public int GetTotalLocations()
        {
            return hiddenLocations.Count;
        }
    }
} 