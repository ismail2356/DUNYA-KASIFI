using System;
using System.Collections.Generic;
using UnityEngine;

namespace DunyaKasifi.AR
{
    /// <summary>
    /// Coğrafi konum tabanlı artırılmış gerçeklik özellikleri.
    /// Uçuş rotası üzerindeki önemli konumları izler ve bu konumlara
    /// yaklaşıldığında ilgili AR deneyimlerini tetikler.
    /// </summary>
    public class GeoAR : MonoBehaviour
    {
        [Serializable]
        public class GeoLocation
        {
            public string name;
            public double latitude;
            public double longitude;
            public GameObject contentPrefab;
            public float activationDistance = 100f; // Kilometre cinsinden
            public string description;
            public int pointValue = 10;
            [HideInInspector] public bool visited = false;
        }

        [Header("Location Data")]
        [SerializeField] private List<GeoLocation> locations = new List<GeoLocation>();
        
        [Header("Settings")]
        [SerializeField] private float updateInterval = 5f;
        [SerializeField] private bool useSimulatedLocation = false;
        [SerializeField] private Vector2 simulatedGeoLocation = new Vector2(41.0082f, 28.9784f); // İstanbul
        
        [Header("Events")]
        public EventHandler<GeoLocation> OnLocationReached;
        public EventHandler<GeoLocation> OnLocationLeft;
        
        private float _timeSinceLastUpdate = 0f;
        private readonly Dictionary<string, GameObject> _spawnedContent = new Dictionary<string, GameObject>();
        private Vector2 _currentLocation;
        private bool _locationServiceStarted = false;

        private void Start()
        {
            if (!useSimulatedLocation)
            {
                StartLocationService();
            }
            else
            {
                _currentLocation = simulatedGeoLocation;
                Debug.Log($"GeoAR: Using simulated location: {_currentLocation}");
            }
        }

        private async void StartLocationService()
        {
            // Konum servislerinin kullanılabilir olup olmadığını kontrol et
            if (!Input.location.isEnabledByUser)
            {
                Debug.LogWarning("GeoAR: User has not enabled location services");
                return;
            }

            // Konum servisini başlat
            Input.location.Start(1f, 1f);

            // İzin ve başlatma için bekle
            int maxWait = 20;
            while (Input.location.status == LocationServiceStatus.Initializing && maxWait > 0)
            {
                await System.Threading.Tasks.Task.Delay(1000);
                maxWait--;
            }

            // Zaman aşımı kontrolü
            if (maxWait <= 0)
            {
                Debug.LogWarning("GeoAR: Location service initialization timed out");
                return;
            }

            // Bağlantı hatası kontrolü
            if (Input.location.status == LocationServiceStatus.Failed)
            {
                Debug.LogWarning("GeoAR: Unable to determine device location");
                return;
            }

            // Başarıyla başlatıldı, ilk konumu al
            _currentLocation = new Vector2(Input.location.lastData.latitude, Input.location.lastData.longitude);
            _locationServiceStarted = true;
            
            Debug.Log($"GeoAR: Location service started. Current location: {_currentLocation}");
        }

        private void Update()
        {
            _timeSinceLastUpdate += Time.deltaTime;

            // Belirli aralıklarla konum güncellemesi yap
            if (_timeSinceLastUpdate >= updateInterval)
            {
                _timeSinceLastUpdate = 0f;
                UpdateLocation();
                CheckLocations();
            }
        }

        private void UpdateLocation()
        {
            if (useSimulatedLocation)
            {
                // Simülasyon modunda konumu değiştirmek için burada kod eklenebilir
                return;
            }

            if (_locationServiceStarted && Input.location.status == LocationServiceStatus.Running)
            {
                _currentLocation = new Vector2(Input.location.lastData.latitude, Input.location.lastData.longitude);
            }
        }

        private void CheckLocations()
        {
            foreach (var location in locations)
            {
                Vector2 locationCoord = new Vector2((float)location.latitude, (float)location.longitude);
                float distance = CalculateDistance(_currentLocation, locationCoord);
                
                bool isWithinRange = distance <= location.activationDistance;
                bool hasContent = _spawnedContent.ContainsKey(location.name);
                
                // Konuma yaklaştıysak ve henüz içerik oluşturulmadıysa
                if (isWithinRange && !hasContent)
                {
                    SpawnLocationContent(location);
                    OnLocationReached?.Invoke(this, location);
                    
                    if (!location.visited)
                    {
                        location.visited = true;
                        Debug.Log($"GeoAR: First time visiting {location.name}, points awarded: {location.pointValue}");
                        // Burada puan verme işlemi yapılabilir
                    }
                }
                // Konumdan uzaklaştıysak ve içerik oluşturulmuşsa
                else if (!isWithinRange && hasContent)
                {
                    RemoveLocationContent(location);
                    OnLocationLeft?.Invoke(this, location);
                }
            }
        }

        private void SpawnLocationContent(GeoLocation location)
        {
            if (location.contentPrefab != null)
            {
                GameObject content = Instantiate(location.contentPrefab);
                content.name = $"{location.name}_Content";
                _spawnedContent[location.name] = content;
                
                Debug.Log($"GeoAR: Spawned content for location: {location.name}");
            }
        }

        private void RemoveLocationContent(GeoLocation location)
        {
            if (_spawnedContent.TryGetValue(location.name, out GameObject content))
            {
                Destroy(content);
                _spawnedContent.Remove(location.name);
                
                Debug.Log($"GeoAR: Removed content for location: {location.name}");
            }
        }

        // İki coğrafi konum arasındaki mesafeyi kilometre cinsinden hesaplar (Haversine formülü)
        private float CalculateDistance(Vector2 coord1, Vector2 coord2)
        {
            const float earthRadius = 6371f; // Dünya yarıçapı (km)
            
            float lat1 = coord1.x * Mathf.Deg2Rad;
            float lon1 = coord1.y * Mathf.Deg2Rad;
            float lat2 = coord2.x * Mathf.Deg2Rad;
            float lon2 = coord2.y * Mathf.Deg2Rad;
            
            float dLat = lat2 - lat1;
            float dLon = lon2 - lon1;
            
            float a = Mathf.Sin(dLat / 2) * Mathf.Sin(dLat / 2) +
                      Mathf.Cos(lat1) * Mathf.Cos(lat2) *
                      Mathf.Sin(dLon / 2) * Mathf.Sin(dLon / 2);
            
            float c = 2 * Mathf.Atan2(Mathf.Sqrt(a), Mathf.Sqrt(1 - a));
            float distance = earthRadius * c;
            
            return distance;
        }

        // Konumların listesini döndürür
        public List<GeoLocation> GetLocations()
        {
            return new List<GeoLocation>(locations);
        }

        // Yeni bir konum ekler
        public void AddLocation(GeoLocation location)
        {
            if (location != null && !string.IsNullOrEmpty(location.name))
            {
                int index = locations.FindIndex(loc => loc.name == location.name);
                
                if (index >= 0)
                    locations[index] = location;
                else
                    locations.Add(location);
                
                Debug.Log($"GeoAR: Added location: {location.name}");
            }
        }

        private void OnDestroy()
        {
            if (_locationServiceStarted)
            {
                Input.location.Stop();
                Debug.Log("GeoAR: Location service stopped");
            }
        }
    }
} 