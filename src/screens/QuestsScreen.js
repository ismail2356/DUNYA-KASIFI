import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
  Image,
  StatusBar,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectAllQuests,
  selectActiveQuests,
  selectCompletedQuests,
  selectQuestCategories,
  startQuest,
  abandonQuest,
} from '../store/slices/questsSlice';
import { MiniGame, CustomCard, Badge, ProgressBar } from '../components';
import { COLORS, FONT_SIZES, SPACING } from '../utils/constants';
import CountryFinder from '../games/CountryFinder';
import MathChallenge from '../games/MathChallenge';

/**
 * Görevler ekranı.
 * Kullanıcının mevcut, tamamlanan ve kullanılabilir görevleri görüntülemesini sağlar.
 */
const QuestsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const allQuests = useSelector(selectAllQuests);
  const activeQuests = useSelector(selectActiveQuests);
  const completedQuests = useSelector(selectCompletedQuests);
  const categories = useSelector(selectQuestCategories);
  
  const [selectedTab, setSelectedTab] = useState('active');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showGameModal, setShowGameModal] = useState(false);
  const [currentGame, setCurrentGame] = useState(null);
  
  // Seçilen sekmeye göre görevleri filtreleme
  const getFilteredQuests = () => {
    let quests = [];
    
    switch (selectedTab) {
      case 'active':
        quests = activeQuests;
        break;
      case 'available':
        quests = allQuests.filter(
          quest => 
            !activeQuests.some(q => q.id === quest.id) && 
            !completedQuests.some(q => q.id === quest.id)
        );
        break;
      case 'completed':
        quests = completedQuests;
        break;
      default:
        quests = activeQuests;
    }
    
    // Kategori filtresi uygula
    if (selectedCategory !== 'all') {
      quests = quests.filter(quest => quest.category === selectedCategory);
    }
    
    return quests;
  };
  
  // Görev başlatma
  const handleStartQuest = (questId) => {
    dispatch(startQuest(questId));
    setSelectedTab('active');
  };
  
  // Görevi iptal etme
  const handleAbandonQuest = (questId) => {
    dispatch(abandonQuest(questId));
  };
  
  // Görev detayına gitme
  const handleQuestPress = (quest) => {
    setCurrentGame(quest.gameType);
    setShowGameModal(true);
  };
  
  // Oyun tamamlandığında
  const handleGameComplete = (result) => {
    // Redux action'ı çağrılabilir
    // dispatch(completeQuest({ questId: currentGame.id, score: result.score }));
    
    setTimeout(() => {
      setShowGameModal(false);
      setCurrentGame(null);
    }, 1000);
  };
  
  // Oyunu kapat
  const handleCloseGame = () => {
    setShowGameModal(false);
    setCurrentGame(null);
  };
  
  // Zorluk seviyesine göre rozet rengi
  const getDifficultyBadgeType = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'success';
      case 'medium':
        return 'primary';
      case 'hard':
        return 'danger';
      default:
        return 'default';
    }
  };
  
  // Zorluk seviyesi metni
  const getDifficultyText = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'Kolay';
      case 'medium':
        return 'Orta';
      case 'hard':
        return 'Zor';
      default:
        return 'Bilinmiyor';
    }
  };
  
  // Oyun başlığını getir
  const getGameTitle = (gameType) => {
    switch (gameType) {
      case 'countryFinder':
        return 'Ülke Bulma Oyunu';
      case 'mathChallenge':
        return 'Matematik Mücadelesi';
      default:
        return 'Mini Oyun';
    }
  };
  
  // Oyun açıklamasını getir
  const getGameDescription = (gameType) => {
    switch (gameType) {
      case 'countryFinder':
        return 'Bayraktan ülkeleri tahmin et ve puan kazan!';
      case 'mathChallenge':
        return 'Matematik sorularını hızlıca çöz ve yüksek puan topla!';
      default:
        return 'Bu mini oyunu oynayarak puanlar kazanabilirsin.';
    }
  };
  
  // Kategori ikonunu getir
  const getCategoryIcon = (categoryId) => {
    switch (categoryId) {
      case 'geography':
        return '🌍';
      case 'math':
        return '🔢';
      case 'language':
        return '🔤';
      case 'science':
        return '🔬';
      case 'culture':
        return '🎭';
      case 'history':
        return '📜';
      default:
        return '📋';
    }
  };
  
  // Hangi oyunu göstereceğini belirle
  const renderGameContent = () => {
    switch (currentGame) {
      case 'countryFinder':
        return <CountryFinder />;
      case 'mathChallenge':
        return <MathChallenge />;
      default:
        return <Text style={styles.gameComingSoon}>Bu oyun yapım aşamasında!</Text>;
    }
  };
  
  // Görev öğesi render fonksiyonu
  const renderQuestItem = ({ item }) => {
    const isActive = activeQuests.some(quest => quest.id === item.id);
    const isCompleted = completedQuests.some(quest => quest.id === item.id);
    
    return (
      <TouchableOpacity
        style={[
          styles.questItem,
          isActive && styles.activeQuestItem,
          isCompleted && styles.completedQuestItem,
        ]}
        onPress={() => handleQuestPress(item)}
      >
        <View style={styles.questIconContainer}>
          <Text style={styles.questIcon}>{getCategoryIcon(item.categoryId)}</Text>
        </View>
        
        <View style={styles.questContent}>
          <Text style={styles.questTitle}>{item.title}</Text>
          <Text style={styles.questDescription}>{item.description}</Text>
          
          <View style={styles.questDetails}>
            <Text style={styles.questReward}>+{item.xpReward} XP</Text>
            
            {isActive && item.progress > 0 && (
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${item.progress}%` },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>{item.progress}%</Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.questActions}>
          {!isActive && !isCompleted && (
            <TouchableOpacity
              style={styles.startButton}
              onPress={() => handleStartQuest(item.id)}
            >
              <Text style={styles.startButtonText}>Başla</Text>
            </TouchableOpacity>
          )}
          
          {isActive && (
            <TouchableOpacity
              style={styles.abandonButton}
              onPress={() => handleAbandonQuest(item.id)}
            >
              <Text style={styles.abandonButtonText}>İptal</Text>
            </TouchableOpacity>
          )}
          
          {isCompleted && (
            <View style={styles.completedBadge}>
              <Text style={styles.completedBadgeText}>✓</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };
  
  // Kategori öğesi render fonksiyonu
  const renderCategoryItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={[
          styles.categoryItem,
          selectedCategory === item.id && styles.selectedCategoryItem,
        ]}
        onPress={() => setSelectedCategory(selectedCategory === item.id ? 'all' : item.id)}
      >
        <Text style={styles.categoryIcon}>{getCategoryIcon(item.id)}</Text>
        <Text style={styles.categoryName}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#1E88E5" barStyle="light-content" />
      
      {/* Başlık */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Görevler</Text>
      </View>
      
      {/* Sekme çubuğu */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[
            styles.tabItem,
            selectedTab === 'active' && styles.selectedTabItem,
          ]}
          onPress={() => setSelectedTab('active')}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === 'active' && styles.selectedTabText,
            ]}
          >
            Aktif
          </Text>
          <View style={styles.tabBadge}>
            <Text style={styles.tabBadgeText}>{activeQuests.length}</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tabItem,
            selectedTab === 'available' && styles.selectedTabItem,
          ]}
          onPress={() => setSelectedTab('available')}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === 'available' && styles.selectedTabText,
            ]}
          >
            Kullanılabilir
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tabItem,
            selectedTab === 'completed' && styles.selectedTabItem,
          ]}
          onPress={() => setSelectedTab('completed')}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === 'completed' && styles.selectedTabText,
            ]}
          >
            Tamamlanan
          </Text>
          <View style={styles.tabBadge}>
            <Text style={styles.tabBadgeText}>{completedQuests.length}</Text>
          </View>
        </TouchableOpacity>
      </View>
      
      {/* Kategori filtreleri */}
      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>
      
      {/* Görev listesi */}
      <FlatList
        data={getFilteredQuests()}
        renderItem={renderQuestItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.questsList}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {selectedTab === 'active'
                ? 'Henüz aktif görevin yok.'
                : selectedTab === 'available'
                ? 'Kullanılabilir görev yok.'
                : 'Henüz görev tamamlamadın.'}
            </Text>
            {selectedTab === 'active' && (
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => setSelectedTab('available')}
              >
                <Text style={styles.emptyButtonText}>Görev Bul</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
      
      {/* Oyun modalı */}
      <Modal
        visible={showGameModal}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseGame}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <MiniGame
              title={getGameTitle(currentGame)}
              description={getGameDescription(currentGame)}
              onComplete={handleGameComplete}
              onClose={handleCloseGame}
              showTimer={currentGame === 'mathChallenge'}
              timeLimit={currentGame === 'mathChallenge' ? 60 : 120}
              difficulty="medium"
              points={50}
            >
              {renderGameContent()}
            </MiniGame>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
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
    flexDirection: 'row',
    justifyContent: 'center',
  },
  selectedTabItem: {
    borderBottomWidth: 2,
    borderBottomColor: '#1E88E5',
  },
  tabText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666666',
  },
  selectedTabText: {
    color: '#1E88E5',
  },
  tabBadge: {
    backgroundColor: '#FF9800',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 5,
  },
  tabBadgeText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  categoriesContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    elevation: 1,
  },
  categoriesList: {
    paddingHorizontal: 15,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 15,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  selectedCategoryItem: {
    backgroundColor: '#E3F2FD',
  },
  categoryIcon: {
    fontSize: 20,
    marginBottom: 5,
  },
  categoryName: {
    fontSize: 12,
    color: '#333333',
  },
  questsList: {
    padding: 15,
  },
  questItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    elevation: 1,
  },
  activeQuestItem: {
    borderLeftWidth: 4,
    borderLeftColor: '#1E88E5',
  },
  completedQuestItem: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
    opacity: 0.8,
  },
  questIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  questIcon: {
    fontSize: 20,
  },
  questContent: {
    flex: 1,
  },
  questTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  questDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 10,
  },
  questDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  questReward: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF9800',
  },
  progressContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1E88E5',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 5,
    width: 30,
  },
  questActions: {
    justifyContent: 'center',
    marginLeft: 10,
  },
  startButton: {
    backgroundColor: '#1E88E5',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  startButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  abandonButton: {
    borderWidth: 1,
    borderColor: '#FF5722',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  abandonButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FF5722',
  },
  completedBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedBadgeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyButton: {
    backgroundColor: '#1E88E5',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  emptyButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '95%',
    height: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
  },
  gameComingSoon: {
    fontSize: 18,
    color: '#666666',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default QuestsScreen; 