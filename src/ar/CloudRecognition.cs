using System;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.XR.ARFoundation;
using UnityEngine.XR.ARSubsystems;

namespace DunyaKasifi.AR
{
    /// <summary>
    /// Artırılmış gerçeklik için bulut tabanlı görüntü tanıma sistemi.
    /// Haritalar, ülke bayrakları, kültürel nesneler gibi hedef görüntüleri
    /// tanıyarak 3D modelleri göstermekten sorumludur.
    /// </summary>
    public class CloudRecognition : MonoBehaviour
    {
        [Serializable]
        public class TrackedImageInfo
        {
            public string imageName;
            public GameObject prefabToSpawn;
            public Vector3 scale = Vector3.one;
            public Vector3 positionOffset = Vector3.zero;
            public Vector3 rotationOffset = Vector3.zero;
        }

        [Header("References")]
        [SerializeField] private ARTrackedImageManager trackedImageManager;
        
        [Header("Image References")]
        [SerializeField] private List<TrackedImageInfo> trackedImages = new List<TrackedImageInfo>();
        
        private readonly Dictionary<string, GameObject> _spawnedObjects = new Dictionary<string, GameObject>();
        
        private void Awake()
        {
            if (trackedImageManager == null)
                trackedImageManager = FindObjectOfType<ARTrackedImageManager>();
        }
        
        private void OnEnable()
        {
            if (trackedImageManager != null)
            {
                trackedImageManager.trackedImagesChanged += OnTrackedImagesChanged;
                Debug.Log("Cloud Recognition: Tracking enabled");
            }
        }

        private void OnDisable()
        {
            if (trackedImageManager != null)
            {
                trackedImageManager.trackedImagesChanged -= OnTrackedImagesChanged;
                Debug.Log("Cloud Recognition: Tracking disabled");
            }
        }

        private void OnTrackedImagesChanged(ARTrackedImagesChangedEventArgs eventArgs)
        {
            // Yeni görüntüler için nesneler oluştur
            foreach (var trackedImage in eventArgs.added)
            {
                CreateObjectForTrackedImage(trackedImage);
            }

            // Güncellenmiş görüntüler için nesneleri güncelle
            foreach (var trackedImage in eventArgs.updated)
            {
                UpdateObjectForTrackedImage(trackedImage);
            }

            // Çıkarılan görüntüler için nesneleri kaldır
            foreach (var trackedImage in eventArgs.removed)
            {
                RemoveObjectForTrackedImage(trackedImage);
            }
        }

        private void CreateObjectForTrackedImage(ARTrackedImage trackedImage)
        {
            string imageName = trackedImage.referenceImage.name;
            
            // Görüntüye ait bir prefab var mı kontrol et
            TrackedImageInfo imageInfo = trackedImages.Find(info => info.imageName == imageName);
            
            if (imageInfo != null && imageInfo.prefabToSpawn != null)
            {
                // Prefabı oluştur
                GameObject newObject = Instantiate(imageInfo.prefabToSpawn);
                newObject.name = $"{imageName}_Object";
                
                // Pozisyon ve dönüşü ayarla
                newObject.transform.position = trackedImage.transform.position + imageInfo.positionOffset;
                newObject.transform.rotation = trackedImage.transform.rotation * Quaternion.Euler(imageInfo.rotationOffset);
                newObject.transform.localScale = imageInfo.scale;
                
                // Sözlüğe ekle
                _spawnedObjects[imageName] = newObject;
                
                Debug.Log($"Cloud Recognition: Created object for tracked image: {imageName}");
            }
        }

        private void UpdateObjectForTrackedImage(ARTrackedImage trackedImage)
        {
            string imageName = trackedImage.referenceImage.name;
            
            // Eğer bu görüntü için bir nesne oluşturulduysa
            if (_spawnedObjects.TryGetValue(imageName, out GameObject trackedObject))
            {
                // Nesnenin görünürlüğünü izleme durumuna göre güncelle
                bool isActive = trackedImage.trackingState == TrackingState.Tracking;
                trackedObject.SetActive(isActive);
                
                if (isActive)
                {
                    // Görüntünün pozisyonunu ve rotasyonunu güncelle
                    TrackedImageInfo imageInfo = trackedImages.Find(info => info.imageName == imageName);
                    
                    if (imageInfo != null)
                    {
                        trackedObject.transform.position = trackedImage.transform.position + imageInfo.positionOffset;
                        trackedObject.transform.rotation = trackedImage.transform.rotation * Quaternion.Euler(imageInfo.rotationOffset);
                    }
                }
            }
        }

        private void RemoveObjectForTrackedImage(ARTrackedImage trackedImage)
        {
            string imageName = trackedImage.referenceImage.name;
            
            // Eğer bu görüntü için bir nesne oluşturulduysa
            if (_spawnedObjects.TryGetValue(imageName, out GameObject trackedObject))
            {
                // Nesneyi kaldır
                Destroy(trackedObject);
                _spawnedObjects.Remove(imageName);
                
                Debug.Log($"Cloud Recognition: Removed object for tracked image: {imageName}");
            }
        }

        /// <summary>
        /// Çalışma zamanında yeni bir izlenecek görüntü ekler.
        /// </summary>
        public void AddTrackedImage(TrackedImageInfo imageInfo)
        {
            if (imageInfo != null && !string.IsNullOrEmpty(imageInfo.imageName))
            {
                // Eğer aynı isimde bir görüntü varsa güncelle, yoksa ekle
                int existingIndex = trackedImages.FindIndex(info => info.imageName == imageInfo.imageName);
                
                if (existingIndex >= 0)
                    trackedImages[existingIndex] = imageInfo;
                else
                    trackedImages.Add(imageInfo);
                
                Debug.Log($"Cloud Recognition: Added tracked image: {imageInfo.imageName}");
            }
        }
    }
} 