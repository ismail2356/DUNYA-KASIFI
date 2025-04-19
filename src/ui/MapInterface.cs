using System;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

namespace DunyaKasifi.UI
{
    /// <summary>
    /// 3D dünya haritası ve uçuş rotası görselleştirme sistemi.
    /// Ülkeler, şehirler ve ilgi çekici noktaları harita üzerinde işaretler.
    /// </summary>
    public class MapInterface : MonoBehaviour
    {
        [Serializable]
        public class MapLocation
        {
            public string name;
            public string countryCode;
            public Vector3 position;
            public string description;
            public Sprite icon;
            public GameObject prefab;
            public bool isVisited = false;
            public List<string> facts = new List<string>();
            [Range(0, 100)] public int pointValue = 10;
        }

        [Serializable]
        public class FlightPath
        {
            public string flightCode;
            public MapLocation departure;
            public MapLocation destination;
            public List<MapLocation> waypoints = new List<MapLocation>();
            public Color pathColor = Color.blue;
            public float flightDuration; // Dakika cinsinden
        }

        [Header("Map References")]
        [SerializeField] private Transform mapTransform;
        [SerializeField] private GameObject worldMapPrefab;
        [SerializeField] private GameObject locationMarkerPrefab;
        [SerializeField] private GameObject pathLinePrefab;
        [SerializeField] private GameObject playerMarkerPrefab;
        
        [Header("Locations")]
        [SerializeField] private List<MapLocation> locations = new List<MapLocation>();
        
        [Header("Flight Data")]
        [SerializeField] private FlightPath currentFlight;
        [SerializeField] private float flightProgress = 0f; // 0-1 arası değer
        [SerializeField] private bool simulateFlight = false;
        [SerializeField] private float simulationSpeed = 1f; // Gerçek zamanın kaç katı hızda simülasyon yapılacak
        
        [Header("UI References")]
        [SerializeField] private Text flightInfoText;
        [SerializeField] private Text locationInfoText;
        [SerializeField] private Image progressBar;
        [SerializeField] private RectTransform waypointsPanel;
        [SerializeField] private GameObject waypointButtonPrefab;
        
        [Header("Events")]
        public Action<MapLocation> OnLocationSelected;
        public Action<MapLocation> OnLocationReached;
        public Action<float> OnFlightProgressChanged;
        public Action<FlightPath> OnFlightCompleted;
        
        private GameObject _worldMap;
        private GameObject _playerMarker;
        private readonly List<GameObject> _locationMarkers = new List<GameObject>();
        private readonly List<GameObject> _pathLines = new List<GameObject>();
        private readonly Dictionary<string, GameObject> _waypointButtons = new Dictionary<string, GameObject>();
        
        private float _flightStartTime;
        private float _lastProgress = 0f;
        
        private void Start()
        {
            InitializeMap();
            CreateFlightPath();
            CreateLocationMarkers();
            CreateWaypointButtons();
            UpdateUI();
            
            if (simulateFlight)
                StartFlightSimulation();
        }
        
        private void Update()
        {
            if (simulateFlight)
                UpdateFlightSimulation();
            
            UpdatePlayerMarker();
            
            // Progress değişimini kontrol et
            if (Math.Abs(flightProgress - _lastProgress) > 0.01f)
            {
                _lastProgress = flightProgress;
                OnFlightProgressChanged?.Invoke(flightProgress);
                UpdateUI();
                
                // Konuma ulaşıldığını kontrol et
                CheckWaypointReached();
            }
        }
        
        private void InitializeMap()
        {
            if (mapTransform == null || worldMapPrefab == null)
                return;
            
            // Harita oluştur
            _worldMap = Instantiate(worldMapPrefab, mapTransform);
            _worldMap.transform.localPosition = Vector3.zero;
            
            Debug.Log("Map initialized");
        }
        
        private void CreateFlightPath()
        {
            if (currentFlight == null || pathLinePrefab == null)
                return;
            
            // Önceki çizgileri temizle
            foreach (var line in _pathLines)
                Destroy(line);
            
            _pathLines.Clear();
            
            // Başlangıç noktası
            Vector3 lastPosition = currentFlight.departure.position;
            
            // Her bir ara nokta için çizgi oluştur
            foreach (var waypoint in currentFlight.waypoints)
            {
                GameObject pathLine = Instantiate(pathLinePrefab, mapTransform);
                LineRenderer lineRenderer = pathLine.GetComponent<LineRenderer>();
                
                if (lineRenderer != null)
                {
                    lineRenderer.positionCount = 2;
                    lineRenderer.SetPosition(0, lastPosition);
                    lineRenderer.SetPosition(1, waypoint.position);
                    
                    lineRenderer.startColor = currentFlight.pathColor;
                    lineRenderer.endColor = currentFlight.pathColor;
                }
                
                _pathLines.Add(pathLine);
                lastPosition = waypoint.position;
            }
            
            // Varış noktasına çizgi çiz
            GameObject finalLine = Instantiate(pathLinePrefab, mapTransform);
            LineRenderer finalRenderer = finalLine.GetComponent<LineRenderer>();
            
            if (finalRenderer != null)
            {
                finalRenderer.positionCount = 2;
                finalRenderer.SetPosition(0, lastPosition);
                finalRenderer.SetPosition(1, currentFlight.destination.position);
                
                finalRenderer.startColor = currentFlight.pathColor;
                finalRenderer.endColor = currentFlight.pathColor;
            }
            
            _pathLines.Add(finalLine);
            
            // Oyuncu işaretçisini oluştur
            if (playerMarkerPrefab != null)
            {
                _playerMarker = Instantiate(playerMarkerPrefab, mapTransform);
                _playerMarker.transform.position = currentFlight.departure.position;
            }
            
            Debug.Log("Flight path created");
        }
        
        private void CreateLocationMarkers()
        {
            if (locationMarkerPrefab == null)
                return;
            
            // Önceki işaretçileri temizle
            foreach (var marker in _locationMarkers)
                Destroy(marker);
            
            _locationMarkers.Clear();
            
            // Her bir konum için işaretçi oluştur
            foreach (var location in locations)
            {
                GameObject marker = Instantiate(locationMarkerPrefab, mapTransform);
                marker.transform.position = location.position;
                marker.name = $"Marker_{location.name}";
                
                // İkonu ayarla
                if (location.icon != null)
                {
                    SpriteRenderer spriteRenderer = marker.GetComponentInChildren<SpriteRenderer>();
                    if (spriteRenderer != null)
                        spriteRenderer.sprite = location.icon;
                }
                
                // Tıklama olayı ekle
                LocationMarker markerScript = marker.GetComponent<LocationMarker>();
                if (markerScript != null)
                {
                    markerScript.SetLocationData(location);
                    markerScript.OnMarkerClicked += (loc) => { SelectLocation(loc); };
                }
                
                _locationMarkers.Add(marker);
            }
            
            Debug.Log("Location markers created");
        }
        
        private void CreateWaypointButtons()
        {
            if (waypointsPanel == null || waypointButtonPrefab == null || currentFlight == null)
                return;
            
            // Önceki butonları temizle
            foreach (Transform child in waypointsPanel)
                Destroy(child.gameObject);
            
            _waypointButtons.Clear();
            
            // Başlangıç noktası butonu
            CreateWaypointButton(currentFlight.departure, 0);
            
            // Ara noktalar için butonlar
            for (int i = 0; i < currentFlight.waypoints.Count; i++)
                CreateWaypointButton(currentFlight.waypoints[i], i + 1);
            
            // Varış noktası butonu
            CreateWaypointButton(currentFlight.destination, currentFlight.waypoints.Count + 1);
            
            Debug.Log("Waypoint buttons created");
        }
        
        private void CreateWaypointButton(MapLocation location, int index)
        {
            GameObject buttonObj = Instantiate(waypointButtonPrefab, waypointsPanel);
            buttonObj.name = $"Button_{location.name}";
            
            Button button = buttonObj.GetComponent<Button>();
            Text buttonText = buttonObj.GetComponentInChildren<Text>();
            Image buttonImage = buttonObj.GetComponent<Image>();
            
            if (buttonText != null)
                buttonText.text = location.name;
            
            if (button != null)
                button.onClick.AddListener(() => SelectLocation(location));
            
            // Ziyaret edilmiş konumları işaretle
            if (buttonImage != null && location.isVisited)
                buttonImage.color = Color.green;
            
            _waypointButtons[location.name] = buttonObj;
        }
        
        private void SelectLocation(MapLocation location)
        {
            if (location == null)
                return;
            
            // Konum hakkında bilgi göster
            if (locationInfoText != null)
                locationInfoText.text = $"{location.name}\n{location.description}";
            
            // Konum seçildi olayını tetikle
            OnLocationSelected?.Invoke(location);
            
            Debug.Log($"Location selected: {location.name}");
        }
        
        private void StartFlightSimulation()
        {
            _flightStartTime = Time.time;
            flightProgress = 0f;
            
            Debug.Log("Flight simulation started");
        }
        
        private void UpdateFlightSimulation()
        {
            if (currentFlight == null || currentFlight.flightDuration <= 0)
                return;
            
            // İlerlemeyi güncelle
            float elapsedTime = (Time.time - _flightStartTime) * simulationSpeed;
            flightProgress = Mathf.Clamp01(elapsedTime / (currentFlight.flightDuration * 60)); // Saniyeye çevir
            
            // Tamamlandıysa olayı tetikle
            if (flightProgress >= 1.0f && !currentFlight.destination.isVisited)
            {
                currentFlight.destination.isVisited = true;
                OnFlightCompleted?.Invoke(currentFlight);
                
                Debug.Log("Flight completed");
            }
        }
        
        private void UpdatePlayerMarker()
        {
            if (_playerMarker == null || currentFlight == null)
                return;
            
            // İlerlemeye göre oyuncu konumunu hesapla
            Vector3 position = CalculatePositionAtProgress(flightProgress);
            _playerMarker.transform.position = position;
        }
        
        private Vector3 CalculatePositionAtProgress(float progress)
        {
            if (currentFlight == null)
                return Vector3.zero;
            
            List<Vector3> points = new List<Vector3>();
            points.Add(currentFlight.departure.position);
            
            foreach (var waypoint in currentFlight.waypoints)
                points.Add(waypoint.position);
            
            points.Add(currentFlight.destination.position);
            
            // Toplam mesafeyi hesapla
            float totalDistance = 0f;
            List<float> distances = new List<float>();
            
            for (int i = 1; i < points.Count; i++)
            {
                float distance = Vector3.Distance(points[i - 1], points[i]);
                distances.Add(distance);
                totalDistance += distance;
            }
            
            // Hedef mesafeyi hesapla
            float targetDistance = totalDistance * progress;
            float currentDistance = 0f;
            
            // Hangi nokta aralığında olduğunu bul
            for (int i = 0; i < distances.Count; i++)
            {
                if (currentDistance + distances[i] >= targetDistance)
                {
                    // Bu segment içindeki ilerlemeyi hesapla
                    float segmentProgress = (targetDistance - currentDistance) / distances[i];
                    return Vector3.Lerp(points[i], points[i + 1], segmentProgress);
                }
                
                currentDistance += distances[i];
            }
            
            return currentFlight.destination.position;
        }
        
        private void CheckWaypointReached()
        {
            if (currentFlight == null)
                return;
            
            // Tüm ara noktaları kontrol et
            foreach (var waypoint in currentFlight.waypoints)
            {
                // Bu noktanın geçilip geçilmediğini kontrol et
                int waypointIndex = currentFlight.waypoints.IndexOf(waypoint);
                float progressAtWaypoint = CalculateProgressAtWaypoint(waypointIndex);
                
                if (flightProgress >= progressAtWaypoint && !waypoint.isVisited)
                {
                    // Noktayı işaretle
                    waypoint.isVisited = true;
                    
                    // UI güncelle
                    if (_waypointButtons.TryGetValue(waypoint.name, out GameObject buttonObj))
                    {
                        Image buttonImage = buttonObj.GetComponent<Image>();
                        if (buttonImage != null)
                            buttonImage.color = Color.green;
                    }
                    
                    // Noktaya ulaşıldı olayını tetikle
                    OnLocationReached?.Invoke(waypoint);
                    
                    Debug.Log($"Waypoint reached: {waypoint.name}");
                }
            }
            
            // Varış noktasını kontrol et
            if (flightProgress >= 1.0f && !currentFlight.destination.isVisited)
            {
                currentFlight.destination.isVisited = true;
                
                // UI güncelle
                if (_waypointButtons.TryGetValue(currentFlight.destination.name, out GameObject buttonObj))
                {
                    Image buttonImage = buttonObj.GetComponent<Image>();
                    if (buttonImage != null)
                        buttonImage.color = Color.green;
                }
                
                // Noktaya ulaşıldı olayını tetikle
                OnLocationReached?.Invoke(currentFlight.destination);
                
                Debug.Log($"Destination reached: {currentFlight.destination.name}");
            }
        }
        
        private float CalculateProgressAtWaypoint(int waypointIndex)
        {
            if (currentFlight == null || waypointIndex < 0 || waypointIndex >= currentFlight.waypoints.Count)
                return 0f;
            
            List<Vector3> points = new List<Vector3>();
            points.Add(currentFlight.departure.position);
            
            foreach (var waypoint in currentFlight.waypoints)
                points.Add(waypoint.position);
            
            points.Add(currentFlight.destination.position);
            
            // Toplam mesafeyi hesapla
            float totalDistance = 0f;
            List<float> distances = new List<float>();
            
            for (int i = 1; i < points.Count; i++)
            {
                float distance = Vector3.Distance(points[i - 1], points[i]);
                distances.Add(distance);
                totalDistance += distance;
            }
            
            // Ara noktaya kadar olan mesafeyi hesapla
            float distanceToWaypoint = 0f;
            for (int i = 0; i <= waypointIndex; i++)
                distanceToWaypoint += distances[i];
            
            // İlerleme yüzdesini hesapla
            return distanceToWaypoint / totalDistance;
        }
        
        private void UpdateUI()
        {
            // İlerleme çubuğunu güncelle
            if (progressBar != null)
                progressBar.fillAmount = flightProgress;
            
            // Uçuş bilgilerini güncelle
            if (flightInfoText != null && currentFlight != null)
            {
                float remainingTime = (1 - flightProgress) * currentFlight.flightDuration;
                int remainingHours = Mathf.FloorToInt(remainingTime / 60);
                int remainingMinutes = Mathf.FloorToInt(remainingTime % 60);
                
                flightInfoText.text = $"Uçuş: {currentFlight.flightCode}\n" +
                                      $"Kalkış: {currentFlight.departure.name}\n" +
                                      $"Varış: {currentFlight.destination.name}\n" +
                                      $"Kalan Süre: {remainingHours}s {remainingMinutes}d";
            }
        }
        
        public void SetFlightProgress(float progress)
        {
            flightProgress = Mathf.Clamp01(progress);
        }
        
        public void SetCurrentFlight(FlightPath flight)
        {
            currentFlight = flight;
            flightProgress = 0f;
            
            CreateFlightPath();
            CreateWaypointButtons();
            UpdateUI();
            
            Debug.Log($"Current flight set: {flight.flightCode}");
        }
        
        public FlightPath GetCurrentFlight()
        {
            return currentFlight;
        }
    }
    
    /// <summary>
    /// Harita üzerindeki konum işaretçilerini yönetmek için yardımcı sınıf
    /// </summary>
    public class LocationMarker : MonoBehaviour
    {
        public MapInterface.MapLocation LocationData { get; private set; }
        public Action<MapInterface.MapLocation> OnMarkerClicked;
        
        public void SetLocationData(MapInterface.MapLocation locationData)
        {
            LocationData = locationData;
        }
        
        private void OnMouseDown()
        {
            OnMarkerClicked?.Invoke(LocationData);
        }
    }
} 