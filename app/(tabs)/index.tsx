import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { createSwipeAsync, SwipeType } from "../../store/slices/swipeSlice";
import { getUsersForHomeAsync, User } from "../../store/slices/userSlice";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH - 40;
const CARD_HEIGHT = SCREEN_HEIGHT * 0.7;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

export default function HomeScreen() {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const { homeCandidates, loading, error } = useAppSelector((state) => state.user);
  const currentUser = useAppSelector((state) => state.user.currentUser || state.auth.user);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipedUsers, setSwipedUsers] = useState<string[]>([]);
  const [swipingCardId, setSwipingCardId] = useState<string | null>(null);
  const filteredUsersLengthRef = useRef(0);

  useEffect(() => {
    dispatch(getUsersForHomeAsync({ limit: 50 }));
  }, [dispatch]);

  // Filter users with matching interests or show all if no interests
  const filteredUsers = homeCandidates.filter((user) => {
    if (!currentUser?.interests || currentUser.interests.length === 0) {
      return true;
    }
    if (!user.interests || user.interests.length === 0) {
      return false;
    }
    return user.interests.some((interest) =>
      currentUser.interests?.includes(interest)
    );
  });

  // Cập nhật ref mỗi khi filteredUsers thay đổi
  useEffect(() => {
    filteredUsersLengthRef.current = filteredUsers.length;
  }, [filteredUsers.length]);

  const currentCard = filteredUsers[currentIndex];
  const nextCard = filteredUsers[currentIndex + 1];

  const handleSwipe = (direction: "left" | "right") => {
    if (!currentCard) return;
    
    const userId = currentCard._id || "";
    if (!userId) return;
    
    // Đánh dấu card đang được swipe
    setSwipingCardId(userId);
    
    // Gọi API để lưu trạng thái swipe
    const swipeType = direction === "right" ? SwipeType.LIKE : SwipeType.DISLIKE;
    dispatch(createSwipeAsync({ toUserId: userId, type: swipeType }));
    
    const currentSwipedUsers = [...swipedUsers, userId];
    setSwipedUsers(currentSwipedUsers);
    
    // Delay việc tăng index để đợi animation hoàn thành
    setTimeout(() => {
      setCurrentIndex((prev) => {
        const nextIndex = prev + 1;
        // Sử dụng ref để lấy giá trị mới nhất của filteredUsers.length
        if (nextIndex < filteredUsersLengthRef.current) {
          return nextIndex;
        } else {
          // Load more users when running out
          dispatch(getUsersForHomeAsync({ limit: 50, swipedIds: currentSwipedUsers }));
          setSwipedUsers([]);
          return 0;
        }
      });
      setSwipingCardId(null);
    }, 300); // Đợi animation hoàn thành (200ms animation + 100ms buffer)
  };

  if (loading && filteredUsers.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
            Đang tải...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            {error}
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => dispatch(getUsersForHomeAsync({ limit: 50 }))}
          >
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (filteredUsers.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
            {currentUser?.interests && currentUser.interests.length > 0
              ? "Chưa có người dùng nào có cùng sở thích"
              : "Chưa có người dùng nào để hiển thị"}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>    
      <View style={styles.cardContainer}>
        {nextCard && (
          <Card
            key={nextCard._id}
            user={nextCard}
            index={1}
            theme={theme}
            isTop={false}
          />
        )}
        {currentCard && (
          <Card
            key={currentCard._id}
            user={currentCard}
            index={0}
            theme={theme}
            isTop={true}
            onSwipe={handleSwipe}
          />
        )}
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.passButton]}
          onPress={() => handleSwipe("left")}
          disabled={!currentCard}
        >
          <Ionicons name="close" size={32} color="#FF3B30" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.likeButton]}
          onPress={() => handleSwipe("right")}
          disabled={!currentCard}
        >
          <Ionicons name="heart" size={32} color="#32D74B" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

interface CardProps {
  user: User;
  index: number;
  theme: any;
  isTop: boolean;
  isSwiping?: boolean;
  onSwipe?: (direction: "left" | "right") => void;
}

function Card({ user, index, theme, isTop, isSwiping = false, onSwipe }: CardProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(isTop ? 1 : 0.95);
  const opacity = useSharedValue(isTop ? 1 : 0.8);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const prevIsTopRef = useRef(isTop);
  
  const photos = user.photos && user.photos.length > 0 ? user.photos : [];

  // Reset về ảnh đầu tiên khi user thay đổi
  useEffect(() => {
    setCurrentPhotoIndex(0);
    if (flatListRef.current && photos.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
      }, 100);
    }
  }, [user._id, photos.length]);

  // Reset animation values khi card trở thành top card
  useEffect(() => {
    if (isTop) {
      // Card là top card, đảm bảo animation values đúng
      if (!prevIsTopRef.current) {
        // Card vừa trở thành top card, reset tất cả animation values và animate mượt mà
        translateX.value = 0;
        translateY.value = 0;
        scale.value = withSpring(1, { damping: 15, stiffness: 150 });
        opacity.value = withSpring(1, { damping: 15, stiffness: 150 });
      } else {
        // Card đã là top card, đảm bảo values đúng (trường hợp mount mới)
        translateX.value = 0;
        translateY.value = 0;
        scale.value = 1;
        opacity.value = 1;
      }
    } else if (!isTop && prevIsTopRef.current) {
      // Card không còn là top card
      scale.value = withSpring(0.95, { damping: 15, stiffness: 150 });
      opacity.value = withSpring(0.8, { damping: 15, stiffness: 150 });
    }
    prevIsTopRef.current = isTop;
  }, [isTop]);

  const panGesture = Gesture.Pan()
    .enabled(isTop && !isSwiping)
    .activeOffsetX([-20, 20]) // Chỉ kích hoạt khi swipe đủ xa để tránh xung đột với FlatList
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
      
      // Add rotation based on swipe
      const rotation = interpolate(
        translateX.value,
        [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
        [-15, 0, 15],
        Extrapolate.CLAMP
      );
    })
    .onEnd((event) => {
      const swipeDistance = Math.abs(event.translationX);
      
      if (swipeDistance > SWIPE_THRESHOLD) {
        const direction = event.translationX > 0 ? "right" : "left";
        const targetX = direction === "right" ? SCREEN_WIDTH + 100 : -SCREEN_WIDTH - 100;
        
        translateX.value = withSpring(targetX, {
          damping: 20,
          stiffness: 90,
        });
        translateY.value = withSpring(0);
        opacity.value = withTiming(0, { duration: 200 });
        
        if (onSwipe) {
          runOnJS(onSwipe)(direction);
        }
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const cardStyle = useAnimatedStyle(() => {
    const rotation = interpolate(
      translateX.value,
      [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
      [-15, 0, 15],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotation}deg` },
        { scale: scale.value },
      ],
      opacity: opacity.value,
    };
  });

  const likeOverlayStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD],
      [0, 1],
      Extrapolate.CLAMP
    );
    return { opacity };
  });

  const passOverlayStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [-SWIPE_THRESHOLD, 0],
      [1, 0],
      Extrapolate.CLAMP
    );
    return { opacity };
  });

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentPhotoIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const renderPhoto = ({ item, index: photoIndex }: { item: string; index: number }) => (
    <View style={styles.photoContainer}>
      <Image
        source={{ uri: item }}
        style={styles.cardImage}
        contentFit="cover"
        transition={200}
      />
    </View>
  );

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={[
          styles.card,
          cardStyle,
          { backgroundColor: theme.colors.surface },
          !isTop && styles.nextCard,
          isSwiping && styles.swipingCard,
        ]}
      >
        {photos.length > 0 ? (
          <>
            <FlatList
              ref={flatListRef}
              data={photos}
              renderItem={renderPhoto}
              keyExtractor={(item, idx) => `${user._id}-photo-${idx}`}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onViewableItemsChanged={onViewableItemsChanged}
              viewabilityConfig={viewabilityConfig}
              scrollEnabled={isTop}
              decelerationRate="fast"
              snapToInterval={CARD_WIDTH}
              snapToAlignment="center"
              style={styles.photoFlatList}
              getItemLayout={(_, index) => ({
                length: CARD_WIDTH,
                offset: CARD_WIDTH * index,
                index,
              })}
            />
            {photos.length > 1 && (
              <View style={styles.photoIndicatorContainer}>
                {photos.map((_, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.photoIndicator,
                      {
                        backgroundColor:
                          idx === currentPhotoIndex
                            ? "#FFFFFF"
                            : "rgba(255, 255, 255, 0.4)",
                        width: idx === currentPhotoIndex ? 24 : 8,
                      },
                    ]}
                  />
                ))}
              </View>
            )}
          </>
        ) : (
          <View style={[styles.cardImage, styles.placeholderImage, { backgroundColor: theme.colors.surface }]}>
            <Ionicons name="person" size={80} color={theme.colors.textSecondary} />
          </View>
        )}
        
        <Animated.View style={[styles.overlay, likeOverlayStyle]}>
          <View style={styles.likeBadge}>
            <Text style={styles.likeBadgeText}>LIKE</Text>
          </View>
        </Animated.View>
        
        <Animated.View style={[styles.overlay, passOverlayStyle]}>
          <View style={styles.passBadge}>
            <Text style={styles.passBadgeText}>PASS</Text>
          </View>
        </Animated.View>

        <View style={styles.cardGradient}>
          <View style={styles.gradientOverlay} />
          <View style={styles.cardInfo}>
            <Text style={[styles.cardName, { color: theme.colors.text }]}>
              {user.name || "Không tên"}
              {user.age && `, ${user.age}`}
            </Text>
            {user.bio && (
              <Text
                style={[styles.cardBio, { color: theme.colors.textSecondary }]}
                numberOfLines={2}
              >
                {user.bio}
              </Text>
            )}
            {user.interests && user.interests.length > 0 && (
              <View style={styles.interestsContainer}>
                {user.interests.slice(0, 3).map((interest, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.interestTag,
                      { backgroundColor: theme.colors.primary + "20", marginRight: 8, marginBottom: 4 },
                    ]}
                  >
                    <Text
                      style={[styles.interestText, { color: theme.colors.primary }]}
                    >
                      {interest}
                    </Text>
                  </View>
                ))}
                {user.interests.length > 3 && (
                  <Text style={[styles.moreInterests, { color: theme.colors.textSecondary }]}>
                    +{user.interests.length - 3}
                  </Text>
                )}
              </View>
            )}
          </View>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
  },
  cardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
  },
  card: {
    position: "absolute",
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  nextCard: {
    zIndex: 0,
  },
  swipingCard: {
    zIndex: -1,
  },
  photoFlatList: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
  photoContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  placeholderImage: {
    justifyContent: "center",
    alignItems: "center",
  },
  photoIndicatorContainer: {
    position: "absolute",
    top: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 5,
    gap: 6,
  },
  photoIndicator: {
    height: 8,
    borderRadius: 4,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  likeBadge: {
    borderWidth: 4,
    borderColor: "#32D74B",
    borderRadius: 12,
    paddingHorizontal: 30,
    paddingVertical: 10,
    transform: [{ rotate: "-15deg" }],
  },
  likeBadgeText: {
    color: "#32D74B",
    fontSize: 32,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  passBadge: {
    borderWidth: 4,
    borderColor: "#FF3B30",
    borderRadius: 12,
    paddingHorizontal: 30,
    paddingVertical: 10,
    transform: [{ rotate: "15deg" }],
  },
  passBadgeText: {
    color: "#FF3B30",
    fontSize: 32,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  cardGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingTop: 40,
    zIndex: 1,
  },
  gradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 180,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    zIndex: 0,
  },
  cardInfo: {
    marginTop: "auto",
    zIndex: 1,
  },
  cardName: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  cardBio: {
    fontSize: 16,
    marginBottom: 12,
    lineHeight: 22,
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  interestTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  interestText: {
    fontSize: 12,
    fontWeight: "600",
  },
  moreInterests: {
    fontSize: 14,
    fontWeight: "500",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    marginHorizontal: 20,
  },
  passButton: {
    backgroundColor: "#FFFFFF",
  },
  likeButton: {
    backgroundColor: "#FFFFFF",
  },
});
