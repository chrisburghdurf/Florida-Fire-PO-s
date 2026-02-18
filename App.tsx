import React, { useMemo, useRef, useState } from "react";
import {
  Linking,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  View,
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

function extractStartPage(pageValue: string): number {
  const match = pageValue.match(/\d+/);
  if (!match) {
    return 1;
  }
  const parsed = Number.parseInt(match[0], 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function buildPdfUrl(startPage: number): string {
  return `${PDF_PATH}#page=${startPage}&zoom=page-width`;
}

export default function App() {
  const sectionListRef = useRef<SectionList<PerformanceObjective>>(null);
  const [query, setQuery] = useState("");
  const [sectionFilter, setSectionFilter] = useState<SectionFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [readerSelection, setReaderSelection] = useState<ReaderSelection | null>(null);

  const sections = useMemo<ObjectiveSection[]>(() => {
    const normalized = query.trim().toLowerCase();

    return PERFORMANCE_SECTIONS.filter((section) => {
      if (sectionFilter !== "all" && section.id !== sectionFilter) {
        return false;
      }
      if (!normalized) {
        return true;
      }
      return (
        section.title.toLowerCase().includes(normalized) ||
        section.objectives.some((objective) => objective.title.toLowerCase().includes(normalized) || objective.page.includes(normalized))
      );
    })
      .map((section) => ({
        id: section.id,
        title: section.title,
        data: section.objectives.filter((objective) => {
          if (!normalized) {
            return true;
          }
          return objective.title.toLowerCase().includes(normalized) || objective.page.includes(normalized);
        }),
      }))
      .filter((section) => section.data.length > 0);
  }, [query, sectionFilter]);

  const totalObjectives = useMemo(() => sections.reduce((sum, section) => sum + section.data.length, 0), [sections]);

  const jumpToSection = (sectionId: string) => {
    setSectionFilter(sectionId);
    setSelectedId(null);

    if (query.trim().length > 0) {
      return;
    }

    const index = PERFORMANCE_SECTIONS.findIndex((section) => section.id === sectionId);
    if (index < 0) {
      return;
    }

    requestAnimationFrame(() => {
      sectionListRef.current?.scrollToLocation({
        sectionIndex: index,
        itemIndex: 0,
        animated: true,
        viewPosition: 0,
      });
    });
  };

  const openObjective = (objective: PerformanceObjective, sectionTitle: string) => {
    setSelectedId(objective.id);
    setReaderSelection({
      title: objective.title,
      sectionTitle,
      pageLabel: objective.page,
      startPage: extractStartPage(objective.page),
    });
  };

  if (readerSelection) {
    const pdfUrl = buildPdfUrl(readerSelection.startPage);

    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />
        <View style={styles.container}>
          <View style={styles.readerHeader}>
            <Text style={styles.readerKicker}>PO Viewer</Text>
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
                style: {
                  border: "0",
                  width: "100%",
                  height: "100%",
                  borderRadius: "12px",
                  backgroundColor: "#0f1720",
                },
              })
            ) : (
              <View style={styles.nativeFallback}>
                <Text style={styles.nativeFallbackText}>Open the selected page in your device browser.</Text>
                <Pressable style={styles.openButton} onPress={() => Linking.openURL(pdfUrl)}>
                  <Text style={styles.openButtonText}>Open PDF at Page {readerSelection.startPage}</Text>
                </Pressable>
              </View>
            )}
          </View>

          <View style={styles.bottomBar}>
            <Pressable style={styles.backButton} onPress={() => setReaderSelection(null)}>
              <Text style={styles.backButtonText}>Back to Table of Contents</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.kicker}>Florida Firefighter I & II</Text>
          <Text style={styles.title}>Performance Objectives Navigator</Text>
          <Text style={styles.subtitle}>Tap any page badge to jump into the PO PDF.</Text>
        </View>

        <TextInput
          style={styles.search}
          placeholder="Search objective, keyword, or page"
          placeholderTextColor="#8ca2b4"
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
          <Pressable
            style={[styles.chip, sectionFilter === "all" && styles.chipActive]}
            onPress={() => {
              setSectionFilter("all");
              setSelectedId(null);
            }}
          >
            <Text style={[styles.chipText, sectionFilter === "all" && styles.chipTextActive]}>All Sections</Text>
          </Pressable>

          {PERFORMANCE_SECTIONS.map((section) => (
            <Pressable
              key={section.id}
              style={[styles.chip, sectionFilter === section.id && styles.chipActive]}
              onPress={() => jumpToSection(section.id)}
            >
              <Text style={[styles.chipText, sectionFilter === section.id && styles.chipTextActive]}>{section.title}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.resultsRow}>
          <Text style={styles.resultsText}>{sections.length} sections</Text>
          <Text style={styles.resultsText}>{totalObjectives} objectives</Text>
        </View>

        <SectionList
          ref={sectionListRef}
          sections={sections}
          keyExtractor={(item) => item.id}
          stickySectionHeadersEnabled
          contentContainerStyle={styles.listContent}
          renderSectionHeader={({ section }) => <Text style={styles.sectionHeader}>{section.title}</Text>}
          renderItem={({ item, section }) => {
            const selected = item.id === selectedId;
            return (
              <View style={[styles.card, selected && styles.cardSelected]}>
                <View style={styles.cardTopRow}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Pressable style={styles.pagePill} onPress={() => openObjective(item, section.title)}>
                    <Text style={styles.pagePillText}>p. {item.page}</Text>
                  </Pressable>
                </View>
                <Text style={styles.cardMeta}>Section: {section.title}</Text>
              </View>
            );
          }}
          ListEmptyComponent={<Text style={styles.empty}>No objectives match this filter.</Text>}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0f1720",
  },
  container: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 10,
    backgroundColor: "#0f1720",
  },
  header: {
    gap: 4,
    marginBottom: 12,
  },
  kicker: {
    color: "#8fc5ff",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  title: {
    color: "#f8fbff",
    fontSize: 24,
    fontWeight: "800",
    lineHeight: 28,
  },
  subtitle: {
    color: "#bfd0df",
    fontSize: 13,
  },
  search: {
    backgroundColor: "#1a2733",
    color: "#f8fbff",
    borderColor: "#2a3c4d",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    marginBottom: 10,
  },
  chipsRow: {
    gap: 8,
    paddingBottom: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: "#324a5f",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#12202b",
  },
  chipActive: {
    backgroundColor: "#2e7ed1",
    borderColor: "#2e7ed1",
  },
  chipText: {
    color: "#c8d9e8",
    fontSize: 13,
    fontWeight: "600",
  },
  chipTextActive: {
    color: "#ffffff",
  },
  resultsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
    marginBottom: 8,
  },
  resultsText: {
    color: "#a7bdcf",
    fontSize: 12,
    fontWeight: "600",
  },
  listContent: {
    paddingBottom: 24,
  },
  sectionHeader: {
    color: "#e9f2fb",
    fontSize: 17,
    fontWeight: "800",
    backgroundColor: "#0f1720",
    paddingTop: 12,
    paddingBottom: 8,
  },
  card: {
    backgroundColor: "#162431",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#263948",
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
  },
  cardSelected: {
    borderColor: "#5ea8ff",
    backgroundColor: "#1c3041",
  },
  cardTopRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
  },
  cardTitle: {
    flex: 1,
    color: "#f1f7ff",
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 20,
  },
  pagePill: {
    backgroundColor: "#295d8d",
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  pagePillText: {
    color: "#dbefff",
    fontSize: 12,
    fontWeight: "800",
  },
  cardMeta: {
    color: "#b5cadd",
    marginTop: 8,
    fontSize: 12,
  },
  empty: {
    color: "#b8cad9",
    textAlign: "center",
    marginTop: 28,
    fontSize: 15,
  },
  readerHeader: {
    marginBottom: 10,
    gap: 4,
  },
  readerKicker: {
    color: "#8fc5ff",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  readerTitle: {
    color: "#f8fbff",
    fontSize: 18,
    fontWeight: "800",
  },
  readerSubtitle: {
    color: "#bfd0df",
    fontSize: 13,
  },
  readerFrameWrap: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
    borderColor: "#263948",
    borderWidth: 1,
    backgroundColor: "#0b1118",
  },
  nativeFallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 18,
  },
  nativeFallbackText: {
    color: "#d7e6f4",
    textAlign: "center",
    fontSize: 14,
  },
  openButton: {
    backgroundColor: "#2e7ed1",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  openButtonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 14,
  },
  bottomBar: {
    paddingVertical: 12,
  },
  backButton: {
    backgroundColor: "#1f3d59",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    borderColor: "#3b658a",
    borderWidth: 1,
  },
  backButtonText: {
    color: "#f8fbff",
    fontWeight: "800",
    fontSize: 14,
  },
});
