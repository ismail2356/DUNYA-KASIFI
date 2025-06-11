import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import { useSelector } from 'react-redux';
import { selectProfile, selectProgress, selectPassport } from '../store/slices/userSlice';

/**
 * Profil ekranı.
 * Kullanıcının profil bilgilerini, başarılarını ve kaşif pasaportunu gösterir.
 */
const ProfileScreen = ({ navigation }) => {
  const profile = useSelector(selectProfile);
  const progress = useSelector(selectProgress);
  const passport = useSelector(selectPassport);
  
  const [activeTab, setActiveTab] = useState('passport');
  
  // XP ilerleme çubuğu yüzdesi
  const xpPercentage = Math.min(100, (progress.xp / progress.xpToNextLevel) * 100);
  
  // Seviye renkleri
  const getLevelColor = () => {
    if (progress.level < 5) return '#1E88E5'; // Mavi
    if (progress.level < 10) return '#43A047'; // Yeşil
    if (progress.level < 15) return '#FF9800'; // Turuncu
    return '#7B1FA2'; // Mor
  };
  
  // Seviye unvanı
  const getLevelTitle = () => {
    if (progress.level < 5) return 'Çırak Kaşif';
    if (progress.level < 10) return 'Gezgin Kaşif';
    if (progress.level < 15) return 'Usta Kaşif';
    return 'Süper Kaşif';
  };
  
  // Pasaport içeriği
  const renderPassportContent = () => {
    return (
      <View style={styles.tabContent}>
        <View style={styles.passportContainer}>
          <View style={styles.passportHeader}>
            <Text style={styles.passportTitle}>DÜNYA KAŞİFİ PASAPORTU</Text>
            <Text style={styles.passportId}>ID: {profile.certificate.id}</Text>
          </View>
          
          <View style={styles.passportInfo}>
            <Text style={styles.passportLabel}>İsim:</Text>
            <Text style={styles.passportValue}>{profile.username}</Text>
          </View>
          
          <View style={styles.passportInfo}>
            <Text style={styles.passportLabel}>Unvan:</Text>
            <Text style={styles.passportValue}>{getLevelTitle()}</Text>
          </View>
          
          <View style={styles.passportInfo}>
            <Text style={styles.passportLabel}>Verildiği Tarih:</Text>
            <Text style={styles.passportValue}>
              {profile.certificate.date ? new Date(profile.certificate.date).toLocaleDateString() : 'Bilinmiyor'}
            </Text>
          </View>
          
          <Text style={styles.sectionTitle}>Ziyaret Edilen Ülkeler</Text>
          
          {progress.visitedCountries.length > 0 ? (
            <View style={styles.stampsContainer}>
              {progress.visitedCountries.map((country, index) => (
                <View key={index} style={styles.stamp}>
                  <Text style={styles.stampText}>{country.name || country}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>Henüz ziyaret edilen ülke yok.</Text>
          )}
          
          <Text style={styles.sectionTitle}>Dil Çıkartmaları</Text>
          
          {passport.languageStickers.length > 0 ? (
            <View style={styles.stickersContainer}>
              {passport.languageStickers.map((sticker, index) => (
                <View key={index} style={styles.sticker}>
                  <Text style={styles.stickerEmoji}>{sticker.emoji || '🗣️'}</Text>
                  <Text style={styles.stickerText}>{sticker.language}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>Henüz dil çıkartması kazanılmadı.</Text>
          )}
        </View>
      </View>
    );
  };
  
  // Başarılar içeriği
  const renderAchievementsContent = () => {
    return (
      <View style={styles.tabContent}>
        <Text style={styles.sectionTitle}>Rozetler</Text>
        
        {progress.badges.length > 0 ? (
          <View style={styles.badgesContainer}>
            {progress.badges.map((badge, index) => (
              <View key={index} style={styles.badge}>
                <View style={styles.badgeIcon}>
                  <Text style={styles.badgeEmoji}>{badge.emoji || '🏆'}</Text>
                </View>
                <Text style={styles.badgeName}>{badge.name || `Rozet ${index + 1}`}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyText}>Henüz rozet kazanılmadı.</Text>
        )}
        
        <Text style={styles.sectionTitle}>Toplanan Eşyalar</Text>
        
        {progress.collectedItems.length > 0 ? (
          <View style={styles.itemsContainer}>
            {progress.collectedItems.map((item, index) => (
              <View key={index} style={styles.item}>
                <Text style={styles.itemEmoji}>{item.emoji || '🎁'}</Text>
                <Text style={styles.itemName}>{item.name || `Eşya ${index + 1}`}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyText}>Henüz eşya toplanmadı.</Text>
        )}
        
        <Text style={styles.sectionTitle}>İstatistikler</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{progress.completedQuests}</Text>
            <Text style={styles.statLabel}>Tamamlanan Görev</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{progress.visitedCountries.length}</Text>
            <Text style={styles.statLabel}>Ziyaret Edilen Ülke</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{progress.badges.length}</Text>
            <Text style={styles.statLabel}>Kazanılan Rozet</Text>
          </View>
        </View>
      </View>
    );
  };
  
  // Ayarlar içeriği
  const renderSettingsContent = () => {
    return (
      <View style={styles.tabContent}>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Profil Düzenle</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Ses ve Müzik Ayarları</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Ebeveyn Kontrolleri</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Göz Sağlığı Ayarları</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Bildirim Ayarları</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Dil Seçenekleri</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Yardım ve Destek</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Hakkında</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#1E88E5" barStyle="light-content" />
      
      {/* Profil başlık */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{profile.username.charAt(0).toUpperCase()}</Text>
        </View>
        
        <View style={styles.profileInfo}>
          <Text style={styles.username}>{profile.username}</Text>
          <Text style={styles.levelTitle}>{getLevelTitle()}</Text>
        </View>
      </View>
      
      {/* Seviye bilgisi */}
      <View style={styles.levelContainer}>
        <View style={styles.levelInfo}>
          <Text style={styles.levelText}>Seviye {progress.level}</Text>
          <Text style={styles.xpText}>
            {progress.xp} / {progress.xpToNextLevel} XP
          </Text>
        </View>
        
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${xpPercentage}%`, backgroundColor: getLevelColor() },
            ]}
          />
        </View>
      </View>
      
      {/* Sekme çubuğu */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === 'passport' && styles.activeTabItem,
          ]}
          onPress={() => setActiveTab('passport')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'passport' && styles.activeTabText,
            ]}
          >
            Pasaport
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === 'achievements' && styles.activeTabItem,
          ]}
          onPress={() => setActiveTab('achievements')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'achievements' && styles.activeTabText,
            ]}
          >
            Başarılar
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === 'settings' && styles.activeTabItem,
          ]}
          onPress={() => setActiveTab('settings')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'settings' && styles.activeTabText,
            ]}
          >
            Ayarlar
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Sekme içeriği */}
      <ScrollView style={styles.content}>
        {activeTab === 'passport' && renderPassportContent()}
        {activeTab === 'achievements' && renderAchievementsContent()}
        {activeTab === 'settings' && renderSettingsContent()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#1E88E5',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  avatarText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1E88E5',
  },
  profileInfo: {
    flex: 1,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  levelTitle: {
    fontSize: 16,
    color: '#E3F2FD',
  },
  levelContainer: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    elevation: 2,
  },
  levelInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  levelText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  xpText: {
    fontSize: 14,
    color: '#666666',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTabItem: {
    borderBottomWidth: 2,
    borderBottomColor: '#1E88E5',
  },
  tabText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666666',
  },
  activeTabText: {
    color: '#1E88E5',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 15,
  },
  passportContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    elevation: 2,
  },
  passportHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingBottom: 15,
    marginBottom: 15,
  },
  passportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
  },
  passportId: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    marginTop: 5,
  },
  passportInfo: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  passportLabel: {
    width: 120,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
  },
  passportValue: {
    flex: 1,
    fontSize: 14,
    color: '#666666',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 20,
    marginBottom: 10,
  },
  stampsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  stamp: {
    backgroundColor: '#E3F2FD',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 12,
    margin: 5,
  },
  stampText: {
    fontSize: 12,
    color: '#1E88E5',
    fontWeight: 'bold',
  },
  stickersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sticker: {
    alignItems: 'center',
    margin: 10,
  },
  stickerEmoji: {
    fontSize: 30,
    marginBottom: 5,
  },
  stickerText: {
    fontSize: 12,
    color: '#666666',
  },
  emptyText: {
    fontSize: 14,
    color: '#666666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 10,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  badge: {
    alignItems: 'center',
    width: '30%',
    marginBottom: 20,
  },
  badgeIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  badgeEmoji: {
    fontSize: 30,
  },
  badgeName: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  itemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  item: {
    alignItems: 'center',
    width: '25%',
    marginBottom: 15,
  },
  itemEmoji: {
    fontSize: 24,
    marginBottom: 5,
  },
  itemName: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E88E5',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  settingItem: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  settingText: {
    fontSize: 16,
    color: '#333333',
  },
});

export default ProfileScreen; 