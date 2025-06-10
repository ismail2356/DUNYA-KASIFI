# Dünya Kaşifi - Kurulum Talimatları

## Geliştirme Ortamı Gereksinimleri

### Yazılım Gereksinimleri
- **Node.js**: v16.x veya üzeri
- **npm**: v8.x veya üzeri
- **Git**: Son sürüm
- **Visual Studio Code**: Önerilen IDE
- **Android Studio**: Android geliştirme için
- **Xcode**: iOS geliştirme için (sadece macOS)

### Donanım Gereksinimleri
- **İşlemci**: Intel Core i5 / AMD Ryzen 5 veya üzeri
- **RAM**: En az 8 GB (16 GB önerilir)
- **Depolama**: En az 20 GB boş alan
- **Grafik Kartı**: Entegre grafik kartı yeterli, ancak 3D modelleme için ayrı grafik kartı önerilir

## Kurulum Adımları

### 1. Gerekli Yazılımların Kurulumu

#### Node.js ve npm Kurulumu
```powershell
# Winget ile kurulum
winget install OpenJS.NodeJS.LTS

# veya Chocolatey ile kurulum
choco install nodejs-lts -y
```

#### Git Kurulumu
```powershell
# Winget ile kurulum
winget install Git.Git

# veya Chocolatey ile kurulum
choco install git -y
```

#### Visual Studio Code Kurulumu
```powershell
# Winget ile kurulum
winget install Microsoft.VisualStudioCode

# veya Chocolatey ile kurulum
choco install vscode -y
```

#### Android Studio Kurulumu
```powershell
# Winget ile kurulum
winget install Google.AndroidStudio

# veya Chocolatey ile kurulum
choco install androidstudio -y
```

### 2. React Native Geliştirme Ortamının Kurulumu

#### React Native CLI Kurulumu
```powershell
npm install -g react-native-cli
```

#### Android SDK Kurulumu
Android Studio içinden SDK Manager'ı açarak:
1. Android SDK Platform 31 (veya daha yeni)
2. Android SDK Build-Tools
3. Android Emulator
4. Android SDK Platform-Tools

#### Ortam Değişkenlerinin Ayarlanması
```powershell
# ANDROID_HOME değişkenini ayarlama
[System.Environment]::SetEnvironmentVariable("ANDROID_HOME", "$env:LOCALAPPDATA\Android\Sdk", "User")

# Path değişkenine platform-tools ekleme
[System.Environment]::SetEnvironmentVariable("Path", "$env:Path;$env:LOCALAPPDATA\Android\Sdk\platform-tools", "User")
```

### 3. Proje Kurulumu

#### Projeyi Klonlama
```powershell
git clone https://github.com/kullanici/dunya-kasifi.git
cd dunya-kasifi
```

#### Bağımlılıkları Yükleme
```powershell
# Sanal ortam oluşturma ve aktifleştirme
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# Node.js bağımlılıklarını yükleme
npm install
```

#### Geliştirme Sunucusunu Başlatma
```powershell
# Metro sunucusunu başlatma
npm start

# Yeni bir terminal penceresinde Android uygulamasını başlatma
npm run android
```

## Proje Yapılandırması

### Firebase Yapılandırması
1. [Firebase Console](https://console.firebase.google.com/)'a gidin
2. Yeni bir proje oluşturun
3. Android ve iOS uygulamalarını ekleyin
4. `google-services.json` ve `GoogleService-Info.plist` dosyalarını indirin
5. İlgili dosyaları proje klasörüne yerleştirin:
   - Android: `android/app/google-services.json`
   - iOS: `ios/DunyaKasifi/GoogleService-Info.plist`

### Ortam Değişkenleri
1. `.env.example` dosyasını `.env` olarak kopyalayın
2. Gerekli API anahtarlarını ve yapılandırma değerlerini doldurun

## Geliştirme Araçları ve Eklentiler

### Önerilen VS Code Eklentileri
- ESLint
- Prettier
- React Native Tools
- GitLens
- Firebase Explorer
- Error Lens

### Kod Kalitesi Araçları
```powershell
# ESLint ve Prettier kurulumu
npm install --save-dev eslint prettier eslint-config-prettier eslint-plugin-prettier

# Husky ve lint-staged kurulumu
npm install --save-dev husky lint-staged
```

## Sorun Giderme

### Yaygın Sorunlar ve Çözümleri

#### Metro Sunucusu Bağlantı Sorunu
```powershell
# Metro önbelleğini temizleme
npm start -- --reset-cache
```

#### Android Emülatör Sorunları
```powershell
# ADB sunucusunu yeniden başlatma
adb kill-server
adb start-server
```

#### Bağımlılık Sorunları
```powershell
# Node modüllerini temizleme ve yeniden yükleme
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

### Yardım ve Destek
- GitHub Issues: [https://github.com/kullanici/dunya-kasifi/issues](https://github.com/kullanici/dunya-kasifi/issues)
- Geliştirici Forumu: [https://forum.dunyakasifi.com](https://forum.dunyakasifi.com)
- E-posta Desteği: [destek@dunyakasifi.com](mailto:destek@dunyakasifi.com) 