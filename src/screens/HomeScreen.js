import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { selectProfile, selectProgress } from '../store/slices/userSlice';
import { selectActiveQuests } from '../store/slices/questsSlice';
import { selectCurrentRoute, selectCurrentLocation } from '../store/slices/mapSlice';
import { useDeviceDetection } from '../services/DeviceDetectionContext';

// Placeholder görsel URL'leri
const PARIS_IMAGE = 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=300&auto=format';
const ROME_IMAGE = 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=300&auto=format';
const ISTANBUL_IMAGE = 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=300&auto=format';

/**
 * Uygulamanın ana ekranı.
 * Kullanıcı bilgilerini, aktif görevleri ve keşif seçeneklerini gösterir.
 */
const HomeScreen = ({ navigation }) => {
  const profile = useSelector(selectProfile);
  const progress = useSelector(selectProgress);
  const activeQuests = useSelector(selectActiveQuests);
  const currentRoute = useSelector(selectCurrentRoute);
  const currentLocation = useSelector(selectCurrentLocation);
  const { usePseudoAR } = useDeviceDetection();
  const dispatch = useDispatch();

  // Örnek veri - gerçek uygulamada API'dan gelecek
  const featuredLocations = [
    { id: 'FR', name: 'Paris', country: 'Fransa', image: { uri: PARIS_IMAGE } },
    { id: 'IT', name: 'Roma', country: 'İtalya', image: { uri: ROME_IMAGE } },
    { id: 'TR', name: 'İstanbul', country: 'Türkiye', image: { uri: ISTANBUL_IMAGE } },
  ];

  // Pseudo-AR deneyimine geçiş
  const startARExperience = (modelId, modelName) => {
    if (usePseudoAR) {
      navigation.navigate('PseudoAR', { modelId, modelName });
    } else {
      navigation.navigate('ARExperience', { modelId, modelName });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#1E88E5" barStyle="light-content" />
      
      {/* Üst bilgi çubuğu */}
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{profile.username.charAt(0).toUpperCase()}</Text>
          </View>
          <View>
            <Text style={styles.username}>{profile.username || 'Kaşif'}</Text>
            <Text style={styles.levelText}>Seviye {progress.level}</Text>
          </View>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{progress.xp}</Text>
            <Text style={styles.statLabel}>XP</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{progress.completedQuests}</Text>
            <Text style={styles.statLabel}>Görev</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{progress.badges.length}</Text>
            <Text style={styles.statLabel}>Rozet</Text>
          </View>
        </View>
      </View>
      
      <ScrollView style={styles.content}>
        {/* Mevcut rota bilgisi */}
        {currentRoute && (
          <View style={styles.routeCard}>
            <Text style={styles.sectionTitle}>Mevcut Rota</Text>
            <View style={styles.routeInfo}>
              <Text style={styles.routeName}>{currentRoute.name}</Text>
              <Text style={styles.routeDetails}>
                {currentRoute.startPoint} → {currentRoute.endPoint}
              </Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${currentRoute.progress}%` }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>
                %{currentRoute.progress} tamamlandı
              </Text>
            </View>
          </View>
        )}
        
        {/* Aktif görevler */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aktif Görevler</Text>
          {activeQuests.length > 0 ? (
            activeQuests.map(quest => (
              <TouchableOpacity 
                key={quest.id} 
                style={styles.questItem}
                onPress={() => navigation.navigate('Quests', { screen: 'QuestDetail', params: { questId: quest.id } })}
              >
                <View style={styles.questInfo}>
                  <Text style={styles.questTitle}>{quest.title}</Text>
                  <Text style={styles.questDescription}>{quest.description}</Text>
                  <View style={styles.questProgressBar}>
                    <View 
                      style={[
                        styles.questProgressFill, 
                        { width: `${quest.progress}%` }
                      ]} 
                    />
                  </View>
                </View>
                <View style={styles.questReward}>
                  <Text style={styles.rewardValue}>+{quest.xpReward}</Text>
                  <Text style={styles.rewardLabel}>XP</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyText}>Henüz aktif görev yok.</Text>
          )}
          
          <TouchableOpacity 
            style={styles.moreButton}
            onPress={() => navigation.navigate('Quests')}
          >
            <Text style={styles.moreButtonText}>Tüm Görevleri Gör</Text>
          </TouchableOpacity>
        </View>
        
        {/* Keşfedilecek yerler */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Keşfedilecek Yerler</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {featuredLocations.map(location => (
              <TouchableOpacity 
                key={location.id} 
                style={styles.locationCard}
                onPress={() => startARExperience(location.id, location.name)}
              >
                <Image source={location.image} style={styles.locationImage} />
                <View style={styles.locationInfo}>
                  <Text style={styles.locationName}>{location.name}</Text>
                  <Text style={styles.locationCountry}>{location.country}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        {/* Hızlı erişim butonları */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.actionBlue]}
            onPress={() => navigation.navigate('Map')}
          >
            <Text style={styles.actionText}>Dünya Haritası</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.actionGreen]}
            onPress={() => startARExperience('world', 'Dünya Modeli')}
          >
            <Text style={styles.actionText}>Keşif Modu</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.actionOrange]}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.actionText}>Kaşif Pasaportu</Text>
          </TouchableOpacity>
        </View>
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
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E88E5',
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  levelText: {
    fontSize: 14,
    color: '#E1F5FE',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    padding: 10,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#E1F5FE',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  routeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  routeInfo: {
    marginTop: 10,
  },
  routeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  routeDetails: {
    fontSize: 14,
    color: '#666666',
    marginVertical: 5,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginVertical: 5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'right',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  questItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    elevation: 2,
  },
  questInfo: {
    flex: 1,
  },
  questTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  questDescription: {
    fontSize: 14,
    color: '#666666',
    marginVertical: 5,
  },
  questProgressBar: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginTop: 5,
  },
  questProgressFill: {
    height: '100%',
    backgroundColor: '#FF9800',
    borderRadius: 2,
  },
  questReward: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  rewardValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF9800',
  },
  rewardLabel: {
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
  moreButton: {
    alignItems: 'center',
    padding: 10,
  },
  moreButtonText: {
    fontSize: 14,
    color: '#1E88E5',
    fontWeight: 'bold',
  },
  horizontalScroll: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  locationCard: {
    width: 160,
    marginRight: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
  },
  locationImage: {
    width: '100%',
    height: 100,
  },
  locationInfo: {
    padding: 10,
  },
  locationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  locationCountry: {
    fontSize: 14,
    color: '#666666',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  actionBlue: {
    backgroundColor: '#1E88E5',
  },
  actionGreen: {
    backgroundColor: '#43A047',
  },
  actionOrange: {
    backgroundColor: '#FF9800',
  },
  actionText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default HomeScreen; 