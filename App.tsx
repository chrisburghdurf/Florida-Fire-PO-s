import React, { useMemo, useState } from "react";
import {
  Image,
  ImageBackground,
  Linking,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { PERFORMANCE_SECTIONS, type PerformanceObjective } from "./src/data/performanceObjectives";

type SectionFilter = "all" | string;

type ObjectiveSection = {
  id: string;
  title: string;
  data: PerformanceObjective[];
};

type ReaderSelection = {
  title: string;
  sectionTitle: string;
  pageLabel: string;
  startPage: number;
};

const PDF_PATH = "/fire-academy-pos.pdf";
const BACKGROUND_IMAGE = require("./assets/hero-bg.jpg");
type AppPage = "home" | "resources";

type ResourceLink = {
  id: string;
  label: string;
  url: string;
  note: string;
};

const RESOURCE_LINKS: ResourceLink[] = [
  {
    id: "resource-1",
    label: "Florida Fire College",
    url: "https://www.myfloridacfo.com/division/sfm/bfst",
    note: "State training and certification resources",
  },
  {
    id: "resource-2",
    label: "Practice Exam Portal",
    url: "https://example.com/practice-exams",
    note: "Replace with your official exam prep link",
  },
  {
    id: "resource-3",
    label: "Student Forms & Downloads",
    url: "https://example.com/student-forms",
    note: "Replace with your document/forms link",
  },
];

function extractStartPage(pageValue: string): number {
  const match = pageValue.match(/\d+/);
  if (!match) return 1;
  const parsed = Number.parseInt(match[0], 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function buildPdfUrl(startPage: number): string {
  return `${PDF_PATH}#page=${startPage}&zoom=page-width`;
}

export default function App() {
  const { width } = useWindowDimensions();
  const isMobile = width < 860;
  const isDesktop = width >= 1200;

  const [currentPage, setCurrentPage] = useState<AppPage>("home");
  const [showObjectives, setShowObjectives] = useState(false);
  const [query, setQuery] = useState("");
  const [sectionFilter, setSectionFilter] = useState<SectionFilter>("all");
  const [readerSelection, setReaderSelection] = useState<ReaderSelection | null>(null);
  const goHome = () => {
    setCurrentPage("home");
    setReaderSelection(null);
    setShowObjectives(false);
  };

  const sections = useMemo<ObjectiveSection[]>(() => {
    const normalized = query.trim().toLowerCase();

    return PERFORMANCE_SECTIONS.filter((section) => {
      if (sectionFilter !== "all" && section.id !== sectionFilter) return false;
      if (!normalized) return true;
      return (
        section.title.toLowerCase().includes(normalized) ||
        section.objectives.some((objective) => objective.title.toLowerCase().includes(normalized) || objective.page.includes(normalized))
      );
    })
      .map((section) => ({
        id: section.id,
        title: section.title,
        data: section.objectives.filter((objective) => {
          if (!normalized) return true;
          return objective.title.toLowerCase().includes(normalized) || objective.page.includes(normalized);
        }),
      }))
      .filter((section) => section.data.length > 0);
  }, [query, sectionFilter]);

  const totalObjectives = useMemo(() => sections.reduce((sum, section) => sum + section.data.length, 0), [sections]);

  const openObjective = (objective: PerformanceObjective, sectionTitle: string) => {
    setReaderSelection({
      title: objective.title,
      sectionTitle,
      pageLabel: objective.page,
      startPage: extractStartPage(objective.page),
    });
  };

  const renderTopBanner = () => (
    <View style={styles.navbar}>
      <Pressable style={styles.brandRow} onPress={goHome}>
        <Image source={require("./assets/logo.jpg")} style={styles.logo} />
        <Text style={styles.brand}>MTC FIRE ACADEMY</Text>
      </Pressable>

      {isMobile ? (
        <Text style={styles.menuIcon}>☰</Text>
      ) : (
        <View style={styles.navLinksRow}>
          <Pressable onPress={goHome}>
            <Text style={styles.navLink}>Home</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setCurrentPage("home");
              setShowObjectives(true);
              setSectionFilter("all");
            }}
          >
            <Text style={styles.navLink}>POs</Text>
          </Pressable>
          <Pressable onPress={() => setCurrentPage("resources")}>
            <Text style={styles.navLink}>Student Resources</Text>
          </Pressable>
          <Text style={styles.navLink}>Contact</Text>
          <Pressable style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Student Login</Text>
          </Pressable>
        </View>
      )}
    </View>
  );

  if (readerSelection) {
    const pdfUrl = buildPdfUrl(readerSelection.startPage);

    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />
        <ImageBackground source={BACKGROUND_IMAGE} style={styles.pageBackground} imageStyle={styles.pageBackgroundImage}>
          <View style={styles.pageOverlay} />
          <View style={styles.appShell}>
            {renderTopBanner()}
            <View style={styles.readerContainer}>
              <View style={styles.readerInfo}>
                <Text style={styles.readerTitle}>{readerSelection.title}</Text>
                <Text style={styles.readerSubtitle}>
                  {readerSelection.sectionTitle} • p. {readerSelection.pageLabel}
                </Text>
              </View>

              <View style={styles.readerFrameWrap}>
                {Platform.OS === "web" ? (
                  React.createElement("iframe", {
                    src: pdfUrl,
                    title: "Fire Academy Performance Objectives PDF",
                    style: { border: "0", width: "100%", height: "100%", backgroundColor: "#0a1119" },
                  })
                ) : (
                  <View style={styles.nativeFallback}>
                    <Text style={styles.nativeFallbackText}>Tap below to open the PO PDF at the selected page.</Text>
                    <Pressable style={styles.viewerOpenButton} onPress={() => Linking.openURL(pdfUrl)}>
                      <Text style={styles.viewerOpenButtonText}>Open PDF at Page {readerSelection.startPage}</Text>
                    </Pressable>
                  </View>
                )}
              </View>

              <Pressable style={styles.backButton} onPress={() => setReaderSelection(null)}>
                <Text style={styles.backButtonText}>Back to Table of Contents</Text>
              </Pressable>
            </View>
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }

  if (currentPage === "resources") {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />
        <ImageBackground source={BACKGROUND_IMAGE} style={styles.pageBackground} imageStyle={styles.pageBackgroundImage}>
          <View style={styles.pageOverlay} />
          <View style={styles.appShell}>
            {renderTopBanner()}

            <ScrollView contentContainerStyle={styles.resourcesContent}>
              <Text style={styles.resourcesTitle}>Student Resources</Text>
              <Text style={styles.resourcesSubtitle}>
                Tap a resource to open it. Share your final links and I will replace these placeholders.
              </Text>

              {RESOURCE_LINKS.map((item) => (
                <Pressable key={item.id} style={styles.resourceCard} onPress={() => Linking.openURL(item.url)}>
                  <View style={styles.resourceTextWrap}>
                    <Text style={styles.resourceLabel}>{item.label}</Text>
                    <Text style={styles.resourceNote}>{item.note}</Text>
                  </View>
                  <Text style={styles.resourceArrow}>↗</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ImageBackground source={BACKGROUND_IMAGE} style={styles.pageBackground} imageStyle={styles.pageBackgroundImage}>
        <View style={styles.pageOverlay} />
        <View style={styles.appShell}>
          <ScrollView contentContainerStyle={[styles.scrollContent, isMobile && styles.scrollContentMobile]}>
            {renderTopBanner()}

          <View style={styles.hero}>
            <View style={styles.heroContent}>
              <Text style={styles.heroKicker}>WELCOME TO</Text>
              <Text style={styles.heroTitle}>MTC FIRE ACADEMY</Text>
              <Text style={styles.heroSubtitle}>
                Prepare for your Florida State Fire Exam and navigate your Performance Objectives quickly.
              </Text>
              <Pressable style={styles.getStartedButton} onPress={() => setSectionFilter("all")}>
                <Text style={styles.getStartedText}>Performance Objectives (POs)</Text>
              </Pressable>
            </View>
          </View>

          <View style={[styles.quickActions, isMobile && styles.quickActionsMobile]}>
            <Pressable
              style={[styles.quickCard, styles.quickCardYellow]}
              onPress={() => {
                setShowObjectives(true);
                setSectionFilter("all");
              }}
            >
              <Text style={styles.quickCardTitle}>Performance Objectives (POs)</Text>
            </Pressable>
            <Pressable style={[styles.quickCard, styles.quickCardBlue]} onPress={() => setCurrentPage("resources")}>
              <Text style={styles.quickCardTitle}>Student Resources</Text>
            </Pressable>
          </View>

          {showObjectives ? (
            <View style={[styles.mainArea, isDesktop && styles.mainAreaDesktop]}>
              <View style={styles.mainColumn}>
                <Text style={styles.mainHeading}>Florida Fire Performance Objectives (POs)</Text>

                <TextInput
                  style={styles.search}
                  placeholder="Search objectives or page"
                  placeholderTextColor="#8797ad"
                  value={query}
                  onChangeText={setQuery}
                />

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
                  <Pressable
                    style={[styles.chip, sectionFilter === "all" && styles.chipActive]}
                    onPress={() => setSectionFilter("all")}
                  >
                    <Text style={[styles.chipText, sectionFilter === "all" && styles.chipTextActive]}>All</Text>
                  </Pressable>
                  {PERFORMANCE_SECTIONS.map((section) => (
                    <Pressable
                      key={section.id}
                      style={[styles.chip, sectionFilter === section.id && styles.chipActive]}
                      onPress={() => setSectionFilter(section.id)}
                    >
                      <Text style={[styles.chipText, sectionFilter === section.id && styles.chipTextActive]}>{section.title}</Text>
                    </Pressable>
                  ))}
                </ScrollView>

                <Text style={styles.resultMeta}>
                  {sections.length} sections • {totalObjectives} objectives
                </Text>

                {sections.map((section) => (
                  <View key={section.id} style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>{section.title}</Text>
                    {section.data.map((objective) => (
                      <View key={objective.id} style={styles.objectiveRow}>
                        <Text style={styles.objectiveText}>{objective.title}</Text>
                        <Pressable style={styles.pageLink} onPress={() => openObjective(objective, section.title)}>
                          <Text style={styles.pageLinkText}>p. {objective.page}</Text>
                        </Pressable>
                      </View>
                    ))}
                  </View>
                ))}
              </View>

              {isDesktop ? (
                <View style={styles.sidebar}>
                  <Text style={styles.sidebarTitle}>Recent Updates & Announcements</Text>
                  <Text style={styles.sidebarItem}>New Practice Exam Packet</Text>
                  <Text style={styles.sidebarDate}>April 15, 2024</Text>
                  <Pressable
                    style={styles.sidebarButton}
                    onPress={() => {
                      setShowObjectives(true);
                      setSectionFilter("all");
                    }}
                  >
                    <Text style={styles.sidebarButtonText}>View POs</Text>
                  </Pressable>
                </View>
              ) : null}
            </View>
          ) : null}
          </ScrollView>

          {isMobile ? (
            <View style={styles.mobileTabBar}>
              <Pressable onPress={() => setCurrentPage("home")}>
                <Text style={styles.mobileTab}>Home</Text>
              </Pressable>
              <Pressable onPress={() => setCurrentPage("resources")}>
                <Text style={styles.mobileTab}>Student Resources</Text>
              </Pressable>
              <Text style={styles.mobileTab}>Contact</Text>
            </View>
          ) : null}
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#0d1320" },
  pageBackground: { flex: 1 },
  pageBackgroundImage: { resizeMode: "cover" },
  pageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10, 16, 30, 0.18)",
  },
  appShell: { flex: 1, backgroundColor: "transparent" },
  scrollContent: { paddingBottom: 26 },
  scrollContentMobile: { paddingBottom: 84 },
  navbar: {
    backgroundColor: "#111f47",
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  logo: { width: 52, height: 52, borderRadius: 26, backgroundColor: "#0f1720" },
  brand: { color: "#f6f8ff", fontSize: 17, fontWeight: "800" },
  navLinksRow: { flexDirection: "row", alignItems: "center", gap: 16 },
  navLink: { color: "#f0f5ff", fontSize: 15, fontWeight: "600" },
  loginButton: {
    backgroundColor: "#d3363b",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  loginButtonText: { color: "#fff", fontWeight: "800", fontSize: 14 },
  menuIcon: { color: "#fff", fontSize: 26, fontWeight: "700" },
  hero: { minHeight: 290, justifyContent: "center", backgroundColor: "rgba(12, 22, 44, 0.22)" },
  heroContent: { paddingHorizontal: 24, paddingVertical: 26, maxWidth: 620, gap: 8 },
  heroKicker: { color: "#eaf1ff", fontSize: 20, fontWeight: "700" },
  heroTitle: { color: "#ffffff", fontSize: 48, lineHeight: 52, fontWeight: "900" },
  heroSubtitle: { color: "#e9eef9", fontSize: 23, lineHeight: 34, fontWeight: "500", maxWidth: 600 },
  getStartedButton: {
    backgroundColor: "#f4cc34",
    alignSelf: "flex-start",
    borderRadius: 8,
    paddingHorizontal: 26,
    paddingVertical: 12,
    marginTop: 8,
  },
  getStartedText: { color: "#1a1a12", fontSize: 30, fontWeight: "800" },
  quickActions: {
    flexDirection: "row",
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "rgba(236, 238, 242, 0.6)",
  },
  quickActionsMobile: { flexDirection: "column" },
  quickCard: {
    flex: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  quickCardYellow: { backgroundColor: "#f3ca34" },
  quickCardRed: { backgroundColor: "#cb3540" },
  quickCardBlue: { backgroundColor: "#253f66" },
  quickCardTitle: { color: "#fff", fontSize: 18, fontWeight: "800" },
  mainArea: { paddingHorizontal: 16, paddingTop: 10, gap: 12, backgroundColor: "rgba(236, 238, 242, 0.62)" },
  mainAreaDesktop: { flexDirection: "row", alignItems: "flex-start", gap: 14 },
  mainColumn: { flex: 1 },
  mainHeading: { fontSize: 30, fontWeight: "800", color: "#1c2430", marginBottom: 6 },
  search: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#d3d9e5",
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  chipsRow: { gap: 8, paddingVertical: 12 },
  chip: {
    borderWidth: 1,
    borderColor: "#ccd7ea",
    borderRadius: 999,
    backgroundColor: "#f7f9fd",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  chipActive: { borderColor: "#1d3f78", backgroundColor: "#1d3f78" },
  chipText: { color: "#294264", fontSize: 13, fontWeight: "700" },
  chipTextActive: { color: "#fff" },
  resultMeta: { color: "#34475f", fontWeight: "600", marginBottom: 8 },
  sectionCard: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#dde3ef",
    padding: 12,
    marginBottom: 10,
    shadowColor: "#243247",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  sectionTitle: { color: "#1f2e44", fontSize: 19, fontWeight: "800", marginBottom: 8 },
  objectiveRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#eef2f8",
    paddingVertical: 8,
  },
  objectiveText: { flex: 1, color: "#31465e", fontSize: 14, fontWeight: "500" },
  pageLink: {
    backgroundColor: "#f4cc34",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  pageLinkText: { color: "#1c1e22", fontWeight: "800", fontSize: 12 },
  sidebar: {
    width: 280,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#dde3ef",
    padding: 14,
    gap: 10,
  },
  sidebarTitle: { color: "#1f2e44", fontSize: 20, fontWeight: "800" },
  sidebarItem: { color: "#253852", fontSize: 16, fontWeight: "600" },
  sidebarDate: { color: "#6f8098", fontSize: 14 },
  sidebarButton: {
    marginTop: 8,
    backgroundColor: "#f4cc34",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  sidebarButtonText: { color: "#1c1e22", fontWeight: "900" },
  mobileTabBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#111f47",
    borderTopWidth: 1,
    borderTopColor: "#294064",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
  },
  mobileTab: { color: "#eff4ff", fontSize: 13, fontWeight: "700" },
  resourcesContent: { paddingHorizontal: 16, paddingVertical: 18, gap: 10, backgroundColor: "rgba(236, 238, 242, 0.62)" },
  resourcesTitle: { color: "#1c2430", fontSize: 32, fontWeight: "900" },
  resourcesSubtitle: { color: "#3d4f67", fontSize: 16, lineHeight: 22, marginBottom: 8 },
  resourceCard: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d8e0ef",
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  resourceTextWrap: { flex: 1, gap: 4, paddingRight: 10 },
  resourceLabel: { color: "#1b2a3f", fontSize: 18, fontWeight: "800" },
  resourceNote: { color: "#586b86", fontSize: 14 },
  resourceArrow: { color: "#1d3f78", fontSize: 22, fontWeight: "800" },
  readerContainer: { flex: 1, padding: 12, backgroundColor: "rgba(9, 18, 28, 0.5)" },
  readerInfo: { marginBottom: 10, gap: 4 },
  readerHeader: { marginBottom: 10, gap: 4 },
  readerLogoRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  readerLogo: { width: 38, height: 38, borderRadius: 19 },
  readerBrand: { color: "#f2f6ff", fontWeight: "800", fontSize: 16 },
  readerTitle: { color: "#fff", fontWeight: "800", fontSize: 18 },
  readerSubtitle: { color: "#b7c6db", fontSize: 13 },
  readerFrameWrap: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#2b3f57",
    backgroundColor: "#0a1119",
  },
  nativeFallback: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, padding: 20 },
  nativeFallbackText: { color: "#e7eef8", textAlign: "center", fontSize: 15 },
  viewerOpenButton: { backgroundColor: "#f4cc34", borderRadius: 10, paddingHorizontal: 16, paddingVertical: 10 },
  viewerOpenButtonText: { color: "#1a1e26", fontWeight: "800" },
  backButton: {
    marginTop: 10,
    backgroundColor: "#1d3f78",
    borderWidth: 1,
    borderColor: "#3f639f",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  backButtonText: { color: "#fff", fontWeight: "800", fontSize: 15 },
});
