using UnityEngine;
using UnityEngine.XR.ARFoundation;
using UnityEngine.XR.ARSubsystems;

namespace DunyaKasifi.AR
{
    /// <summary>
    /// AR sisteminin ana yönetici sınıfı. AR kamera, yüzey algılama, görüntü tanıma ve diğer
    /// AR özelliklerini yönetir.
    /// </summary>
    public class ARManager : MonoBehaviour
    {
        [Header("AR Components")]
        [SerializeField] private ARSession arSession;
        [SerializeField] private ARSessionOrigin arSessionOrigin;
        [SerializeField] private ARCameraManager arCameraManager;
        [SerializeField] private ARRaycastManager arRaycastManager;
        [SerializeField] private ARPlaneManager arPlaneManager;
        [SerializeField] private ARTrackedImageManager arTrackedImageManager;

        [Header("AR Settings")]
        [SerializeField] private bool enablePlaneDetection = true;
        [SerializeField] private bool enableImageTracking = true;
        [SerializeField] private float minimumPlaneArea = 0.25f;

        // Singleton instance
        public static ARManager Instance { get; private set; }

        private void Awake()
        {
            // Singleton pattern
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            
            Instance = this;
            DontDestroyOnLoad(gameObject);
            
            // Kontrolleri yap
            ValidateComponents();
        }

        private void Start()
        {
            // AR alt sistemleri başlat
            InitializeARSubsystems();
        }

        private void ValidateComponents()
        {
            // AR bileşenlerini kontrol et ve gerekirse oluştur
            if (arSession == null)
                arSession = FindObjectOfType<ARSession>();

            if (arSessionOrigin == null)
                arSessionOrigin = FindObjectOfType<ARSessionOrigin>();

            if (arCameraManager == null && arSessionOrigin != null)
                arCameraManager = arSessionOrigin.camera.GetComponent<ARCameraManager>();

            if (arRaycastManager == null)
                arRaycastManager = FindObjectOfType<ARRaycastManager>();

            if (arPlaneManager == null)
                arPlaneManager = FindObjectOfType<ARPlaneManager>();

            if (arTrackedImageManager == null)
                arTrackedImageManager = FindObjectOfType<ARTrackedImageManager>();

            Debug.Log("AR Manager: Components validated");
        }

        private void InitializeARSubsystems()
        {
            // Düzlem tespiti ayarları
            if (arPlaneManager != null)
            {
                arPlaneManager.enabled = enablePlaneDetection;
                arPlaneManager.requestedDetectionMode = PlaneDetectionMode.Horizontal | PlaneDetectionMode.Vertical;
                Debug.Log("AR Manager: Plane detection initialized");
            }

            // Görüntü izleme ayarları
            if (arTrackedImageManager != null)
            {
                arTrackedImageManager.enabled = enableImageTracking;
                arTrackedImageManager.requestedMaxNumberOfMovingImages = 4;
                Debug.Log("AR Manager: Image tracking initialized");
            }
        }

        /// <summary>
        /// Belirtilen noktada bir AR yüzey var mı diye kontrol eder
        /// </summary>
        public bool TryGetPlaneHit(Vector2 screenPosition, out ARRaycastHit hit)
        {
            if (arRaycastManager == null)
            {
                hit = default;
                return false;
            }

            var hits = new List<ARRaycastHit>();
            if (arRaycastManager.Raycast(screenPosition, hits, TrackableType.PlaneWithinPolygon))
            {
                hit = hits[0];
                return true;
            }

            hit = default;
            return false;
        }

        /// <summary>
        /// AR düzlemlerinin görünürlüğünü değiştirir
        /// </summary>
        public void TogglePlaneVisualization(bool visible)
        {
            if (arPlaneManager != null)
            {
                foreach (var plane in arPlaneManager.trackables)
                {
                    plane.gameObject.SetActive(visible);
                }
            }
        }

        /// <summary>
        /// Düzlem algılama sistemini etkinleştirir veya devre dışı bırakır
        /// </summary>
        public void EnablePlaneDetection(bool enable)
        {
            if (arPlaneManager != null)
            {
                enablePlaneDetection = enable;
                arPlaneManager.enabled = enable;
            }
        }
        
        /// <summary>
        /// Görüntü izleme sistemini etkinleştirir veya devre dışı bırakır
        /// </summary>
        public void EnableImageTracking(bool enable)
        {
            if (arTrackedImageManager != null)
            {
                enableImageTracking = enable;
                arTrackedImageManager.enabled = enable;
            }
        }
    }
} 