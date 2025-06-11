using System;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

namespace DunyaKasifi.UI
{
    /// <summary>
    /// Avatar oluşturma ve özelleştirme ekranının yönetimi için sınıf.
    /// Saç stili, göz rengi, kıyafet ve aksesuar gibi özelliklerin seçimini sağlar.
    /// </summary>
    public class AvatarCreator : MonoBehaviour
    {
        [Serializable]
        public class CustomizationOption
        {
            public string categoryName;
            public List<GameObject> optionPrefabs = new List<GameObject>();
            public List<Sprite> optionIcons = new List<Sprite>();
            [HideInInspector] public int currentOptionIndex = 0;
        }

        [Serializable]
        public class ColorOption
        {
            public string categoryName;
            public List<Color> availableColors = new List<Color>();
            [HideInInspector] public int currentColorIndex = 0;
        }

        [Header("Avatar Components")]
        [SerializeField] private GameObject avatarRoot;
        [SerializeField] private Transform avatarPreviewTransform;

        [Header("Customization Categories")]
        [SerializeField] private List<CustomizationOption> customizationOptions = new List<CustomizationOption>();
        [SerializeField] private List<ColorOption> colorOptions = new List<ColorOption>();

        [Header("UI Components")]
        [SerializeField] private Button nextButton;
        [SerializeField] private Button backButton;
        [SerializeField] private Button finishButton;
        [SerializeField] private Transform categoryButtonsParent;
        [SerializeField] private GameObject categoryButtonPrefab;
        [SerializeField] private Transform optionButtonsParent;
        [SerializeField] private GameObject optionButtonPrefab;
        [SerializeField] private Transform colorOptionsParent;
        [SerializeField] private GameObject colorButtonPrefab;

        [Header("Events")]
        public Action<Dictionary<string, int>> OnAvatarCreated;

        private Dictionary<string, GameObject> _activeParts = new Dictionary<string, GameObject>();
        private Dictionary<string, Material> _activeMaterials = new Dictionary<string, Material>();
        private int _currentCategoryIndex = 0;
        private bool _isColorMode = false;

        private void Start()
        {
            // UI butonlarını ayarla
            if (nextButton != null)
                nextButton.onClick.AddListener(GoToNextCategory);
            
            if (backButton != null)
                backButton.onClick.AddListener(GoToPreviousCategory);
            
            if (finishButton != null)
                finishButton.onClick.AddListener(FinishCustomization);
            
            // Kategori butonlarını oluştur
            CreateCategoryButtons();
            
            // Avatar parçalarını oluştur
            InitializeAvatar();
            
            // İlk kategoriyi göster
            ShowCategory(0);
        }

        private void CreateCategoryButtons()
        {
            if (categoryButtonsParent == null || categoryButtonPrefab == null)
                return;

            // Tüm kategoriler için butonlar oluştur
            for (int i = 0; i < customizationOptions.Count; i++)
            {
                int index = i; // Closure için
                GameObject buttonObj = Instantiate(categoryButtonPrefab, categoryButtonsParent);
                Button button = buttonObj.GetComponent<Button>();
                Text buttonText = buttonObj.GetComponentInChildren<Text>();
                
                if (buttonText != null)
                    buttonText.text = customizationOptions[i].categoryName;
                
                if (button != null)
                    button.onClick.AddListener(() => ShowCategory(index));
            }

            // Renk kategorileri için butonlar oluştur
            for (int i = 0; i < colorOptions.Count; i++)
            {
                int index = i; // Closure için
                GameObject buttonObj = Instantiate(categoryButtonPrefab, categoryButtonsParent);
                Button button = buttonObj.GetComponent<Button>();
                Text buttonText = buttonObj.GetComponentInChildren<Text>();
                
                if (buttonText != null)
                    buttonText.text = colorOptions[i].categoryName;
                
                if (button != null)
                    button.onClick.AddListener(() => ShowColorCategory(index));
            }
        }

        private void InitializeAvatar()
        {
            if (avatarRoot == null)
                return;

            // Her kategori için ilk seçeneği etkinleştir
            foreach (var option in customizationOptions)
            {
                if (option.optionPrefabs.Count > 0)
                {
                    GameObject partObj = Instantiate(option.optionPrefabs[0], avatarPreviewTransform);
                    _activeParts[option.categoryName] = partObj;
                }
            }

            // İlk renkleri ayarla
            foreach (var colorOpt in colorOptions)
            {
                if (colorOpt.availableColors.Count > 0 && _activeParts.TryGetValue(colorOpt.categoryName, out GameObject part))
                {
                    Renderer renderer = part.GetComponent<Renderer>();
                    if (renderer != null)
                    {
                        Material material = new Material(renderer.material);
                        material.color = colorOpt.availableColors[0];
                        renderer.material = material;
                        _activeMaterials[colorOpt.categoryName] = material;
                    }
                }
            }
        }

        private void ShowCategory(int categoryIndex)
        {
            if (categoryIndex < 0 || categoryIndex >= customizationOptions.Count)
                return;

            _currentCategoryIndex = categoryIndex;
            _isColorMode = false;
            
            // Seçenek butonlarını temizle
            ClearOptionButtons();
            
            // Renk butonlarını gizle
            if (colorOptionsParent != null)
                colorOptionsParent.gameObject.SetActive(false);
            
            // Seçenek butonlarını göster
            if (optionButtonsParent != null)
                optionButtonsParent.gameObject.SetActive(true);
            
            // Kategori için seçenek butonları oluştur
            CreateOptionButtons(categoryIndex);
        }

        private void ShowColorCategory(int colorCategoryIndex)
        {
            if (colorCategoryIndex < 0 || colorCategoryIndex >= colorOptions.Count)
                return;

            _currentCategoryIndex = colorCategoryIndex;
            _isColorMode = true;
            
            // Seçenek butonlarını temizle
            ClearOptionButtons();
            
            // Seçenek butonlarını gizle
            if (optionButtonsParent != null)
                optionButtonsParent.gameObject.SetActive(false);
            
            // Renk butonlarını göster
            if (colorOptionsParent != null)
            {
                colorOptionsParent.gameObject.SetActive(true);
                CreateColorButtons(colorCategoryIndex);
            }
        }

        private void CreateOptionButtons(int categoryIndex)
        {
            if (optionButtonsParent == null || optionButtonPrefab == null)
                return;
            
            CustomizationOption category = customizationOptions[categoryIndex];
            
            // Kategorideki her seçenek için buton oluştur
            for (int i = 0; i < category.optionPrefabs.Count; i++)
            {
                int optionIndex = i; // Closure için
                GameObject buttonObj = Instantiate(optionButtonPrefab, optionButtonsParent);
                Button button = buttonObj.GetComponent<Button>();
                Image buttonImage = buttonObj.GetComponent<Image>();
                
                // Eğer ikon varsa göster
                if (buttonImage != null && i < category.optionIcons.Count && category.optionIcons[i] != null)
                    buttonImage.sprite = category.optionIcons[i];
                
                // Butona tıklama olayı ekle
                if (button != null)
                    button.onClick.AddListener(() => ChangeOption(categoryIndex, optionIndex));
                
                // Mevcut seçili seçeneği işaretle
                if (i == category.currentOptionIndex)
                    buttonObj.transform.localScale = new Vector3(1.2f, 1.2f, 1.2f);
            }
        }

        private void CreateColorButtons(int colorCategoryIndex)
        {
            if (colorOptionsParent == null || colorButtonPrefab == null)
                return;
            
            ColorOption category = colorOptions[colorCategoryIndex];
            
            // Kategorideki her renk için buton oluştur
            for (int i = 0; i < category.availableColors.Count; i++)
            {
                int colorIndex = i; // Closure için
                GameObject buttonObj = Instantiate(colorButtonPrefab, colorOptionsParent);
                Button button = buttonObj.GetComponent<Button>();
                Image buttonImage = buttonObj.GetComponent<Image>();
                
                // Rengi göster
                if (buttonImage != null)
                    buttonImage.color = category.availableColors[i];
                
                // Butona tıklama olayı ekle
                if (button != null)
                    button.onClick.AddListener(() => ChangeColor(colorCategoryIndex, colorIndex));
                
                // Mevcut seçili rengi işaretle
                if (i == category.currentColorIndex)
                    buttonObj.transform.localScale = new Vector3(1.2f, 1.2f, 1.2f);
            }
        }

        private void ClearOptionButtons()
        {
            // Seçenek butonlarını temizle
            if (optionButtonsParent != null)
            {
                foreach (Transform child in optionButtonsParent)
                    Destroy(child.gameObject);
            }
            
            // Renk butonlarını temizle
            if (colorOptionsParent != null)
            {
                foreach (Transform child in colorOptionsParent)
                    Destroy(child.gameObject);
            }
        }

        private void ChangeOption(int categoryIndex, int optionIndex)
        {
            if (categoryIndex < 0 || categoryIndex >= customizationOptions.Count)
                return;
            
            CustomizationOption category = customizationOptions[categoryIndex];
            
            if (optionIndex < 0 || optionIndex >= category.optionPrefabs.Count)
                return;
            
            // Mevcut parçayı yok et
            if (_activeParts.TryGetValue(category.categoryName, out GameObject currentPart))
                Destroy(currentPart);
            
            // Yeni parçayı oluştur
            GameObject newPart = Instantiate(category.optionPrefabs[optionIndex], avatarPreviewTransform);
            _activeParts[category.categoryName] = newPart;
            
            // İndeksi güncelle
            category.currentOptionIndex = optionIndex;
            
            // Eğer bu kategori için renk varsa, rengi uygula
            foreach (var colorOpt in colorOptions)
            {
                if (colorOpt.categoryName == category.categoryName && _activeMaterials.TryGetValue(colorOpt.categoryName, out Material mat))
                {
                    Renderer renderer = newPart.GetComponent<Renderer>();
                    if (renderer != null)
                    {
                        Material newMaterial = new Material(renderer.material);
                        newMaterial.color = mat.color;
                        renderer.material = newMaterial;
                        _activeMaterials[colorOpt.categoryName] = newMaterial;
                    }
                }
            }
            
            // Seçenek butonlarını güncelle
            ClearOptionButtons();
            CreateOptionButtons(categoryIndex);
        }

        private void ChangeColor(int colorCategoryIndex, int colorIndex)
        {
            if (colorCategoryIndex < 0 || colorCategoryIndex >= colorOptions.Count)
                return;
            
            ColorOption colorOpt = colorOptions[colorCategoryIndex];
            
            if (colorIndex < 0 || colorIndex >= colorOpt.availableColors.Count)
                return;
            
            // Rengi değiştir
            if (_activeParts.TryGetValue(colorOpt.categoryName, out GameObject part))
            {
                Renderer renderer = part.GetComponent<Renderer>();
                if (renderer != null)
                {
                    if (!_activeMaterials.TryGetValue(colorOpt.categoryName, out Material mat))
                    {
                        mat = new Material(renderer.material);
                        renderer.material = mat;
                        _activeMaterials[colorOpt.categoryName] = mat;
                    }
                    
                    mat.color = colorOpt.availableColors[colorIndex];
                }
            }
            
            // İndeksi güncelle
            colorOpt.currentColorIndex = colorIndex;
            
            // Renk butonlarını güncelle
            ClearOptionButtons();
            CreateColorButtons(colorCategoryIndex);
        }

        private void GoToNextCategory()
        {
            if (_isColorMode)
            {
                int nextIndex = _currentCategoryIndex + 1;
                if (nextIndex < colorOptions.Count)
                    ShowColorCategory(nextIndex);
                else if (customizationOptions.Count > 0)
                    ShowCategory(0);
            }
            else
            {
                int nextIndex = _currentCategoryIndex + 1;
                if (nextIndex < customizationOptions.Count)
                    ShowCategory(nextIndex);
                else if (colorOptions.Count > 0)
                    ShowColorCategory(0);
            }
        }

        private void GoToPreviousCategory()
        {
            if (_isColorMode)
            {
                int prevIndex = _currentCategoryIndex - 1;
                if (prevIndex >= 0)
                    ShowColorCategory(prevIndex);
                else if (customizationOptions.Count > 0)
                    ShowCategory(customizationOptions.Count - 1);
            }
            else
            {
                int prevIndex = _currentCategoryIndex - 1;
                if (prevIndex >= 0)
                    ShowCategory(prevIndex);
                else if (colorOptions.Count > 0)
                    ShowColorCategory(colorOptions.Count - 1);
            }
        }

        private void FinishCustomization()
        {
            // Avatar tercihlerini kaydetmek için bir sözlük oluştur
            Dictionary<string, int> preferences = new Dictionary<string, int>();
            
            // Özelleştirme seçeneklerini ekle
            foreach (var option in customizationOptions)
                preferences[$"option_{option.categoryName}"] = option.currentOptionIndex;
            
            // Renk seçeneklerini ekle
            foreach (var colorOpt in colorOptions)
                preferences[$"color_{colorOpt.categoryName}"] = colorOpt.currentColorIndex;
            
            // Avatar oluşturuldu olayını tetikle
            OnAvatarCreated?.Invoke(preferences);
            
            Debug.Log("Avatar customization finished.");
        }
    }
} 