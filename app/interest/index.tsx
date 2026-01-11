import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setCredentials } from "../../store/slices/authSlice";
import { updateInterestsAsync } from "../../store/slices/userSlice";

interface InterestCategory {
  id: string;
  title: string;
  emoji: string;
  items: string[];
}

const INTEREST_CATEGORIES: InterestCategory[] = [
  {
    id: "lifestyle",
    title: "Lifestyle & Thói quen sống",
    emoji: "🧘",
    items: [
      "Gym / Fitness",
      "Yoga",
      "Chạy bộ",
      "Thiền",
      "Healthy lifestyle",
      "Night owl 🌙",
      "Early bird ☀️",
      "Work-life balance",
      "Minimalism",
    ],
  },
  {
    id: "music",
    title: "Âm nhạc",
    emoji: "🎵",
    items: [
      "Pop",
      "EDM",
      "Indie",
      "Hip-hop",
      "R&B",
      "Rock",
      "K-Pop",
      "US-UK",
      "Lo-fi",
    ],
  },
  {
    id: "entertainment",
    title: "Giải trí",
    emoji: "🎬",
    items: [
      "Xem phim",
      "Netflix & chill 😌",
      "Phim hành động",
      "Phim lãng mạn",
      "Anime",
      "K-Drama",
      "TV Shows",
      "Podcast",
    ],
  },
  {
    id: "travel",
    title: "Du lịch & Trải nghiệm",
    emoji: "✈️",
    items: [
      "Du lịch bụi",
      "Road trip",
      "Camping",
      "Biển 🌊",
      "Núi ⛰️",
      "Khám phá quán cà phê",
      "City walk",
      "Staycation",
    ],
  },
  {
    id: "food",
    title: "Ăn uống",
    emoji: "🍔",
    items: [
      "Street food",
      "Fine dining",
      "Trà sữa 🧋",
      "Cà phê",
      "Vegan",
      "BBQ",
      "Hải sản",
      "Cooking together 👩‍🍳👨‍🍳",
    ],
  },
  {
    id: "gaming",
    title: "Game & Công nghệ",
    emoji: "🎮",
    items: [
      "Gaming",
      "Mobile games",
      "Console games",
      "PC games",
      "Esports",
      "Tech lover",
      "Startup",
      "Crypto / Web3",
      "AI 🤖",
    ],
  },
  {
    id: "learning",
    title: "Học tập & Phát triển bản thân",
    emoji: "📚",
    items: [
      "Đọc sách",
      "Self-help",
      "Psychology",
      "Business",
      "Coding 💻",
      "Design",
      "Marketing",
      "Learning new skills",
    ],
  },
  {
    id: "nature",
    title: "Động vật & thiên nhiên",
    emoji: "🐶",
    items: [
      "Yêu chó 🐕",
      "Yêu mèo 🐈",
      "Thú cưng",
      "Bảo vệ môi trường",
      "Thiên nhiên",
      "Cây cảnh 🌱",
    ],
  },
  {
    id: "art",
    title: "Nghệ thuật & Sáng tạo",
    emoji: "🎨",
    items: [
      "Photography 📷",
      "Vẽ",
      "Âm nhạc",
      "Viết lách",
      "Thời trang",
      "Makeup",
      "Content creator",
    ],
  },
  {
    id: "personality",
    title: "Tính cách & Vibe",
    emoji: "💖",
    items: [
      "Hướng nội",
      "Hướng ngoại",
      "Lãng mạn",
      "Hài hước",
      "Thích deep talk",
      "Chill",
      "Nghiêm túc",
      "Fun & playful",
    ],
  },
];

export default function InterestScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((state) => state.auth);
  const { loading } = useAppSelector((state) => state.user);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);

  const currentCategory = INTEREST_CATEGORIES[currentCategoryIndex];
  const isFirstCategory = currentCategoryIndex === 0;
  const isLastCategory = currentCategoryIndex === INTEREST_CATEGORIES.length - 1;

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) => {
      if (prev.includes(interest)) {
        return prev.filter((item) => item !== interest);
      } else {
        return [...prev, interest];
      }
    });
  };

  const handleNext = () => {
    if (isLastCategory) {
      handleContinue();
    } else {
      // Allow moving to next category even without selecting anything
      setCurrentCategoryIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (!isFirstCategory) {
      setCurrentCategoryIndex((prev) => prev - 1);
    }
  };

  const handleContinue = async () => {
    if (selectedInterests.length === 0) {
      Alert.alert("Thông báo", "Vui lòng chọn ít nhất một sở thích");
      return;
    }

    if (!user?._id) {
      Alert.alert("Lỗi", "Không tìm thấy thông tin người dùng");
      return;
    }

    try {
      const result = await dispatch(
        updateInterestsAsync({
          userId: user._id,
          interests: selectedInterests,
        })
      );

      if (updateInterestsAsync.fulfilled.match(result)) {
        // Update auth state with updated user
        if (token && result.payload) {
          dispatch(setCredentials({ token, user: result.payload }));
        }
        router.replace("/(tabs)");
      } else if (updateInterestsAsync.rejected.match(result)) {
        // Show error message from API
        const errorMessage = result.payload as string || "Không thể lưu sở thích. Vui lòng thử lại.";
        Alert.alert("Lỗi", errorMessage);
      } else {
        Alert.alert("Lỗi", "Không thể lưu sở thích. Vui lòng thử lại.");
      }
    } catch (error: any) {
      Alert.alert("Lỗi", error?.message || "Đã xảy ra lỗi. Vui lòng thử lại.");
    }
  };

  const dynamicStyles = {
    container: { backgroundColor: theme.colors.background },
    title: { color: theme.colors.text },
    subtitle: { color: theme.colors.textSecondary },
    categoryTitle: { color: theme.colors.text },
    interestButton: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
    },
    interestButtonSelected: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    interestText: { color: theme.colors.text },
    interestTextSelected: { color: "#fff" },
    continueButton: { backgroundColor: theme.colors.primary },
    continueButtonDisabled: { backgroundColor: theme.colors.textSecondary },
    backButton: { borderColor: theme.colors.border },
    backButtonText: { color: theme.colors.text },
    progressBar: { backgroundColor: theme.colors.border },
    progressFill: { backgroundColor: theme.colors.primary },
  };

  return (
    <SafeAreaView style={[styles.container, dynamicStyles.container]}>
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBarContainer}>
          {INTEREST_CATEGORIES.map((_, index) => {
            const isCompleted = index < currentCategoryIndex;
            const isCurrent = index === currentCategoryIndex;
            return (
              <View
                key={index}
                style={[
                  styles.progressSegment,
                  dynamicStyles.progressBar,
                  (isCompleted || isCurrent) && dynamicStyles.progressFill,
                  index < INTEREST_CATEGORIES.length - 1 && styles.progressSegmentMargin,
                ]}
              />
            );
          })}
        </View>
        <Text style={[styles.progressText, dynamicStyles.subtitle]}>
          {currentCategoryIndex + 1} / {INTEREST_CATEGORIES.length}
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, dynamicStyles.title]}>
            {currentCategory.emoji} {currentCategory.title}
          </Text>
          <Text style={[styles.subtitle, dynamicStyles.subtitle]}>
            Chọn những điều bạn thích trong chủ đề này
          </Text>
          <Text style={[styles.selectedCount, dynamicStyles.subtitle]}>
            Đã chọn: {selectedInterests.length} sở thích
          </Text>
        </View>

        {/* Current Category */}
        <View style={styles.category}>
          <View style={styles.interestsGrid}>
            {currentCategory.items.map((item) => {
              const isSelected = selectedInterests.includes(item);
              return (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.interestButton,
                    dynamicStyles.interestButton,
                    isSelected && dynamicStyles.interestButtonSelected,
                  ]}
                  onPress={() => toggleInterest(item)}
                >
                  <Text
                    style={[
                      styles.interestText,
                      dynamicStyles.interestText,
                      isSelected && dynamicStyles.interestTextSelected,
                    ]}
                    numberOfLines={2}
                    adjustsFontSizeToFit
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Footer with Back and Next buttons */}
      <View style={styles.footer}>
        <View style={styles.footerButtons}>
          {!isFirstCategory && (
            <TouchableOpacity
              style={[styles.backButton, dynamicStyles.backButton]}
              onPress={handleBack}
            >
              <Text style={[styles.backButtonText, dynamicStyles.backButtonText]}>
                Quay lại
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[
              styles.continueButton,
              dynamicStyles.continueButton,
              loading && dynamicStyles.continueButtonDisabled,
              !isFirstCategory && styles.continueButtonWithBack,
            ]}
            onPress={handleNext}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.continueButtonText}>
                {isLastCategory ? "Hoàn thành" : "Tiếp theo"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  progressBarContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    flex: 1,
  },
  progressSegment: {
    height: 4,
    borderRadius: 2,
    flex: 1,
  },
  progressSegmentMargin: {
    marginRight: 4,
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    textAlign: "right",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  selectedCount: {
    fontSize: 14,
    fontWeight: "600",
  },
  category: {
    marginBottom: 32,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  interestsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  interestButton: {
    width: (Dimensions.get("window").width - 40 - 24) / 3, // screen width - padding - gaps
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    marginBottom: 12,
    minHeight: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  interestText: {
    fontSize: 15,
    fontWeight: "500",
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 34,
    backgroundColor: "rgba(11, 13, 23, 0.95)",
    borderTopWidth: 1,
    borderTopColor: "rgba(26, 28, 42, 0.5)",
  },
  footerButtons: {
    flexDirection: "row",
    gap: 12,
  },
  backButton: {
    flex: 1,
    borderRadius: 12,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  continueButton: {
    flex: 1,
    borderRadius: 12,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  continueButtonWithBack: {
    flex: 2,
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
