import React, { useMemo, useState } from "react";
import {
  Image,
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
type AppPage = "home" | "resources" | "po";

type ObjectiveSection = {
  id: string;
  title: string;
  data: PerformanceObjective[];
};

type ResourceLink = {
  id: string;
  label: string;
  url: string;
  note: string;
};

const PDF_PATH = "/fire-academy-pos.pdf";
const BACKGROUND_IMAGE = require("./assets/hero-bg.jpg");
// Printed page numbers in the PO manual start after front matter.
// This offset maps printed footer numbers to actual PDF page indices.
const PRINTED_TO_PDF_OFFSET = 8;

const RESOURCE_LINKS: ResourceLink[] = [
  {
    id: "resource-fire-college",
    label: "Florida State Fire College",
    url: "https://myfloridacfo.com/division/sfm/bfst",
    note: "Official state fire standards and training",
  },
  {
    id: "rope-1",
    label: "Overhand Knot",
    url: "https://www.animatedknots.com/overhand-knot",
    note: "Ropes & Knots",
  },
  {
    id: "rope-2",
    label: "Figure 8 Knot",
    url: "https://www.animatedknots.com/figure-8-knot",
    note: "Ropes & Knots",
  },
  {
    id: "rope-3",
    label: "Half Hitch Knot",
    url: "https://www.animatedknots.com/half-hitch-knot",
    note: "Ropes & Knots",
  },
  {
    id: "rope-4",
    label: "Sheet Bend Knot",
    url: "https://www.animatedknots.com/sheet-bend-knot",
    note: "Ropes & Knots",
  },
  {
    id: "rope-5",
    label: "Figure 8 Bend Knot",
    url: "https://www.animatedknots.com/figure-8-bend-knot",
    note: "Ropes & Knots",
  },
  {
    id: "rope-6",
    label: "Water Knot",
    url: "https://www.animatedknots.com/water-knot",
    note: "Ropes & Knots",
  },
  {
    id: "rope-7",
    label: "Clove Hitch (Rope End)",
    url: "https://www.animatedknots.com/clove-hitch-knot-rope-end",
    note: "Ropes & Knots",
  },
  {
    id: "rope-8",
    label: "Clove Hitch (Half Hitches)",
    url: "https://www.animatedknots.com/clove-hitch-knot-half-hitches",
    note: "Ropes & Knots",
  },
  {
    id: "rope-9",
    label: "Bowline on a Bight",
    url: "https://www.animatedknots.com/bowline-on-a-bight-knot",
    note: "Ropes & Knots",
  },
  {
    id: "rope-10",
    label: "Bowline Knot",
    url: "https://www.animatedknots.com/bowline-knot",
    note: "Ropes & Knots",
  },
];

function extractStartPage(pageValue: string): number {
  const match = pageValue.match(/\d+/);
  if (!match) return 1;
  const parsed = Number.parseInt(match[0], 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function buildPdfUrl(startPage: number): string {
  const mappedPage = Math.max(1, startPage + PRINTED_TO_PDF_OFFSET);
  return `${PDF_PATH}#page=${mappedPage}&zoom=page-width`;
}

function PageBackground(props: { children: React.ReactNode }) {
  return (
    <View style={styles.pageRoot}>
      <Image source={BACKGROUND_IMAGE} style={styles.pageBgImage} resizeMode="contain" />
      <View style={styles.pageOverlay} />
      {props.children}
    </View>
  );
}

export default function App() {
  const { width } = useWindowDimensions();
  const isMobile = width < 860;
  const isDesktop = width >= 1200;

  const [currentPage, setCurrentPage] = useState<AppPage>("home");
  const [query, setQuery] = useState("");
  const [sectionFilter, setSectionFilter] = useState<SectionFilter>("all");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [poViewer, setPoViewer] = useState<{ url: string; title: string; page: string } | null>(null);
  const [resourceViewer, setResourceViewer] = useState<{ url: string; title: string; note: string } | null>(null);

  const goHome = () => {
    setCurrentPage("home");
    setPoViewer(null);
    setResourceViewer(null);
  };

  const openPoPage = () => {
    setCurrentPage("po");
    setSectionFilter("all");
    setPoViewer(null);
    setResourceViewer(null);
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

  const openObjective = (objective: PerformanceObjective) => {
    const pdfUrl = buildPdfUrl(extractStartPage(objective.page));
    if (Platform.OS === "web") {
      setPoViewer({
        url: pdfUrl,
        title: objective.title,
        page: objective.page,
      });
      return;
    }
    Linking.openURL(pdfUrl);
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const openResource = (item: ResourceLink) => {
    if (Platform.OS === "web") {
      setResourceViewer({
        url: item.url,
        title: item.label,
        note: item.note,
      });
      return;
    }
    Linking.openURL(item.url);
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
          <Pressable onPress={openPoPage}>
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

  if (currentPage === "resources") {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />
        <PageBackground>
          <View style={styles.appShell}>
            {renderTopBanner()}
            <ScrollView contentContainerStyle={styles.resourcesContent}>
              <Text style={styles.resourcesTitle}>Student Resources</Text>
              <Text style={styles.resourcesSubtitle}>
                Tap a resource to open it. Share your final links and I will replace these placeholders.
              </Text>

              {RESOURCE_LINKS.map((item) => (
                <Pressable key={item.id} style={styles.resourceCard} onPress={() => openResource(item)}>
                  <View style={styles.resourceTextWrap}>
                    <Text style={styles.resourceLabel}>{item.label}</Text>
                    <Text style={styles.resourceNote}>{item.note}</Text>
                  </View>
                  <Text style={styles.resourceArrow}>↗</Text>
                </Pressable>
              ))}
            </ScrollView>
            {resourceViewer ? (
              <View style={styles.viewerOverlay}>
                <View style={styles.viewerCard}>
                  <View style={styles.viewerHeader}>
                    <View style={styles.viewerHeaderTextWrap}>
                      <Text style={styles.viewerTitle}>{resourceViewer.title}</Text>
                      <Text style={styles.viewerSubtitle}>{resourceViewer.note}</Text>
                    </View>
                    <Pressable style={styles.viewerCloseButton} onPress={() => setResourceViewer(null)}>
                      <Text style={styles.viewerCloseText}>Back to Resources</Text>
                    </Pressable>
                  </View>
                  {Platform.OS === "web" ? (
                    React.createElement("iframe", {
                      src: resourceViewer.url,
                      title: "Student Resource Viewer",
                      style: { border: "0", width: "100%", height: "100%", backgroundColor: "#0a1119" },
                    })
                  ) : (
                    <View style={styles.viewerNativeFallback}>
                      <Text style={styles.viewerNativeText}>Open this resource in your device browser.</Text>
                      <Pressable style={styles.viewerOpenExternal} onPress={() => Linking.openURL(resourceViewer.url)}>
                        <Text style={styles.viewerOpenExternalText}>Open External</Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              </View>
            ) : null}
          </View>
        </PageBackground>
      </SafeAreaView>
    );
  }

  if (currentPage === "po") {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />
        <PageBackground>
          <View style={styles.appShell}>
            {renderTopBanner()}
            <ScrollView contentContainerStyle={[styles.scrollContent, isMobile && styles.scrollContentMobile]}>
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

                  {sections.map((section) => {
                    const open = !!expandedSections[section.id];
                    return (
                      <View key={section.id} style={styles.sectionCard}>
                        <Pressable style={styles.sectionToggle} onPress={() => toggleSection(section.id)}>
                          <Text style={styles.sectionTitle}>{section.title}</Text>
                          <Text style={styles.sectionChevron}>{open ? "▾" : "▸"}</Text>
                        </Pressable>
                        {open
                          ? section.data.map((objective) => (
                              <Pressable key={objective.id} style={styles.objectiveRow} onPress={() => openObjective(objective)}>
                                <Text style={styles.objectiveText}>{objective.title}</Text>
                                <Text style={styles.pageLinkText}>p. {objective.page}</Text>
                              </Pressable>
                            ))
                          : null}
                      </View>
                    );
                  })}
                </View>
              </View>
            </ScrollView>
            {poViewer ? (
              <View style={styles.viewerOverlay}>
                <View style={styles.viewerCard}>
                  <View style={styles.viewerHeader}>
                    <View style={styles.viewerHeaderTextWrap}>
                      <Text style={styles.viewerTitle}>{poViewer.title}</Text>
                      <Text style={styles.viewerSubtitle}>Printed Page {poViewer.page}</Text>
                    </View>
                    <Pressable style={styles.viewerCloseButton} onPress={() => setPoViewer(null)}>
                      <Text style={styles.viewerCloseText}>Close</Text>
                    </Pressable>
                  </View>
                  {Platform.OS === "web" ? (
                    React.createElement("iframe", {
                      src: poViewer.url,
                      title: "PO Viewer",
                      style: { border: "0", width: "100%", height: "100%", backgroundColor: "#0a1119" },
                    })
                  ) : (
                    <View style={styles.viewerNativeFallback}>
                      <Text style={styles.viewerNativeText}>Open this PO in your device browser.</Text>
                      <Pressable style={styles.viewerOpenExternal} onPress={() => Linking.openURL(poViewer.url)}>
                        <Text style={styles.viewerOpenExternalText}>Open External</Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              </View>
            ) : null}
          </View>
        </PageBackground>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <PageBackground>
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
                <Pressable style={styles.getStartedButton} onPress={openPoPage}>
                  <Text style={styles.getStartedText}>Performance Objectives (POs)</Text>
                </Pressable>
              </View>
            </View>

            <View style={[styles.quickActions, isMobile && styles.quickActionsMobile]}>
              <Pressable style={[styles.quickCard, styles.quickCardYellow]} onPress={openPoPage}>
                <Text style={styles.quickCardTitle}>Performance Objectives (POs)</Text>
              </Pressable>
              <Pressable style={[styles.quickCard, styles.quickCardBlue]} onPress={() => setCurrentPage("resources")}>
                <Text style={styles.quickCardTitle}>Student Resources</Text>
              </Pressable>
            </View>
          </ScrollView>

          {isMobile ? (
            <View style={styles.mobileTabBar}>
              <Pressable onPress={goHome}>
                <Text style={styles.mobileTab}>Home</Text>
              </Pressable>
              <Pressable onPress={openPoPage}>
                <Text style={styles.mobileTab}>POs</Text>
              </Pressable>
              <Pressable onPress={() => setCurrentPage("resources")}>
                <Text style={styles.mobileTab}>Student Resources</Text>
              </Pressable>
            </View>
          ) : null}
        </View>
      </PageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#0d1320" },
  pageRoot: { flex: 1, backgroundColor: "#0d1320" },
  pageBgImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  pageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10, 16, 30, 0.14)",
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

  hero: { minHeight: 320, justifyContent: "center", backgroundColor: "rgba(12, 22, 44, 0.2)" },
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
    backgroundColor: "rgba(236, 238, 242, 0.58)",
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
  quickCardBlue: { backgroundColor: "#253f66" },
  quickCardTitle: { color: "#fff", fontSize: 18, fontWeight: "800" },

  mainArea: {
    paddingHorizontal: 16,
    paddingTop: 10,
    gap: 12,
    backgroundColor: "rgba(236, 238, 242, 0.62)",
  },
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
  },
  sectionTitle: { color: "#1f2e44", fontSize: 19, fontWeight: "800", marginBottom: 8 },
  sectionToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  sectionChevron: { color: "#1d3f78", fontSize: 20, fontWeight: "800" },
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
  pageLinkText: { color: "#1c1e22", fontWeight: "800", fontSize: 12 },

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

  viewerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
  },
  viewerCard: {
    width: "100%",
    maxWidth: 1100,
    height: "86%",
    backgroundColor: "#0f1725",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#334865",
  },
  viewerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#111f47",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#2f4573",
  },
  viewerHeaderTextWrap: { flex: 1, paddingRight: 10 },
  viewerTitle: { color: "#f2f6ff", fontWeight: "800", fontSize: 14 },
  viewerSubtitle: { color: "#b6c5dc", fontSize: 12, marginTop: 2 },
  viewerCloseButton: {
    backgroundColor: "#d3363b",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  viewerCloseText: { color: "#fff", fontWeight: "800", fontSize: 12 },
  viewerNativeFallback: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, padding: 24 },
  viewerNativeText: { color: "#e5edf8", fontSize: 15 },
  viewerOpenExternal: { backgroundColor: "#f3ca34", borderRadius: 8, paddingHorizontal: 14, paddingVertical: 10 },
  viewerOpenExternalText: { color: "#1c1e22", fontWeight: "800" },

});
