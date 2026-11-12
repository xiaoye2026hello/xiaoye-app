import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

const FONT = Platform.select({
  ios: 'PingFang SC',
  android: 'sans-serif',
  default: 'sans-serif',
});

const BLUE = '#2F9CF7';
const BLUE_SOFT = '#E8F3FF';
const GRAY = '#9AA5B1';
const INK = '#1A1A1A';
const SUB = '#6B7684';
const PH = '#EDF1F6';
const PH_LINE = '#DCE3EC';

const TABS = [
  { id: 'home', name: '首页', icon: 'home', sub: '欢迎使用小叶软件库，发现好用的工具！' },
  { id: 'apps', name: '软件', icon: 'box', sub: '↓↓【不显示软件请下拉进行刷新】↓↓' },
  { id: 'find', name: '发现', icon: 'compass', sub: '' },
  { id: 'more', name: '更多', icon: 'more', sub: '' },
];

function TabIcon({ type, color }) {
  if (type === 'home') {
    return (
      <View style={styles.iconHome}>
        <View style={[styles.homeRoof, { borderBottomColor: color }]} />
        <View style={[styles.homeBody, { borderColor: color }]} />
      </View>
    );
  }
  if (type === 'box') {
    return (
      <View style={[styles.iconSquare, { borderColor: color }]}>
        <View style={[styles.boxInner, { backgroundColor: color }]} />
      </View>
    );
  }
  if (type === 'compass') {
    return (
      <View style={[styles.iconCircle, { borderColor: color }]}>
        <View style={[styles.compassDot, { backgroundColor: color }]} />
      </View>
    );
  }
  return (
    <View style={styles.iconMore}>
      {[0, 1, 2].map((i) => (
        <View key={i} style={[styles.moreDot, { backgroundColor: color }]} />
      ))}
    </View>
  );
}

function SearchIcon() {
  return (
    <View style={styles.searchBox}>
      <View style={styles.searchRing} />
      <View style={styles.searchHandle} />
    </View>
  );
}

function DownloadIcon() {
  return (
    <View style={styles.dlBox}>
      <View style={styles.dlArrow} />
      <View style={styles.dlStem} />
      <View style={styles.dlBase} />
    </View>
  );
}

function HomeScreen({ width }) {
  const pad = 16;
  const gap = 12;
  const colW = (width - pad * 2 - gap) / 2;
  const bannerH = Math.round(Math.min(width * 0.44, 210));
  const tileH = Math.round(colW * 0.62);

  return (
    <ScrollView
      contentContainerStyle={[styles.sheetContent, { paddingHorizontal: pad }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.ph, { height: bannerH }]} />

      <View style={styles.notice}>
        <View style={styles.noticeTag}>
          <Text style={styles.noticeTagText}>公告</Text>
        </View>
        <Text style={styles.noticeText} numberOfLines={1} />
        <Text style={styles.chevron}>›</Text>
      </View>

      <Text style={styles.sectionTitle}>公告专区</Text>

      <View style={[styles.grid, { gap }]}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <View key={i} style={[styles.ph, { width: colW, height: tileH }]} />
        ))}
      </View>
    </ScrollView>
  );
}

function AppsScreen({ width }) {
  const pad = 16;
  const rowH = Math.round(Math.min(width * 0.22, 92));
  const iconSize = Math.round(rowH * 0.62);

  return (
    <View style={styles.flex}>
      <View style={[styles.catBar, { paddingHorizontal: pad }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={[styles.catChip, styles.catChipOn]}>
            <Text style={styles.catTextOn}>实用软件</Text>
          </View>
          <View style={styles.catChip} />
          <View style={styles.catChip} />
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={[styles.listContent, { paddingHorizontal: pad }]}
        showsVerticalScrollIndicator={false}
      >
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <View key={i} style={[styles.appRow, { height: rowH }]}>
            <View
              style={[
                styles.appIcon,
                { width: iconSize, height: iconSize, borderRadius: iconSize * 0.24 },
              ]}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function BlankScreen() {
  return <View style={styles.blank} />;
}

export default function App() {
  const [tab, setTab] = useState('home');
  const { width } = useWindowDimensions();
  const current = TABS.find((t) => t.id === tab);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <View style={styles.header}>
        {tab === 'home' && (
          <>
            <View style={styles.deco1} />
            <View style={styles.deco2} />
          </>
        )}
        <Text style={styles.headerTitle}>{current.name}</Text>
        {!!current.sub && <Text style={styles.headerSub}>{current.sub}</Text>}
        {tab === 'apps' && (
          <View style={styles.headerIcons}>
            <Pressable hitSlop={10} style={styles.headerIconBtn}>
              <SearchIcon />
            </Pressable>
            <Pressable hitSlop={10} style={styles.headerIconBtn}>
              <DownloadIcon />
            </Pressable>
          </View>
        )}
      </View>

      <View style={styles.sheet}>
        {tab === 'home' && <HomeScreen width={width} />}
        {tab === 'apps' && <AppsScreen width={width} />}
        {(tab === 'find' || tab === 'more') && <BlankScreen />}
      </View>

      <View style={styles.tabbar}>
        {TABS.map((t) => {
          const on = t.id === tab;
          const color = on ? BLUE : GRAY;
          return (
            <Pressable key={t.id} style={styles.tabItem} onPress={() => setTab(t.id)}>
              <TabIcon type={t.icon} color={color} />
              <Text style={[styles.tabLabel, { color }]}>{t.name}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BLUE },
  flex: { flex: 1 },
  header: {
    backgroundColor: BLUE,
    paddingTop: Platform.select({ ios: 62, android: 42, default: 42 }),
    paddingHorizontal: 20,
    paddingBottom: 56,
  },
  deco1: {
    position: 'absolute',
    top: 46,
    right: 34,
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  deco2: {
    position: 'absolute',
    top: 84,
    right: 72,
    width: 16,
    height: 16,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  headerTitle: {
    fontFamily: FONT,
    fontStyle: 'normal',
    fontSize: 28,
    fontWeight: '500',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  headerSub: {
    fontFamily: FONT,
    fontStyle: 'normal',
    marginTop: 8,
    fontSize: 13,
    color: 'rgba(255,255,255,0.92)',
    lineHeight: 19,
    paddingRight: 84,
  },
  headerIcons: {
    position: 'absolute',
    right: 14,
    top: Platform.select({ ios: 52, android: 32, default: 32 }),
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBox: { width: 22, height: 22 },
  searchRing: {
    position: 'absolute',
    top: 1,
    left: 1,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  searchHandle: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    width: 2,
    height: 8,
    borderRadius: 1,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '-45deg' }],
  },
  dlBox: { width: 22, height: 22 },
  dlArrow: {
    position: 'absolute',
    top: 8,
    left: 4,
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FFFFFF',
  },
  dlStem: {
    position: 'absolute',
    top: 2,
    left: 10,
    width: 2,
    height: 8,
    backgroundColor: '#FFFFFF',
  },
  dlBase: {
    position: 'absolute',
    bottom: 1,
    left: 3,
    width: 16,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#FFFFFF',
  },
  sheet: {
    flex: 1,
    marginTop: -32,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    overflow: 'hidden',
  },
  sheetContent: {
    paddingTop: 16,
    paddingBottom: 24,
  },
  ph: {
    backgroundColor: PH,
    borderWidth: 1,
    borderColor: PH_LINE,
    borderRadius: 10,
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEF1F5',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  noticeTag: {
    backgroundColor: BLUE_SOFT,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginRight: 10,
  },
  noticeTagText: {
    fontFamily: FONT,
    fontStyle: 'normal',
    fontSize: 12,
    color: BLUE,
    fontWeight: '500',
  },
  noticeText: {
    flex: 1,
    fontFamily: FONT,
    fontStyle: 'normal',
    fontSize: 13,
    color: SUB,
  },
  chevron: {
    fontFamily: FONT,
    fontStyle: 'normal',
    fontSize: 18,
    color: '#C3CBD6',
    marginLeft: 6,
  },
  sectionTitle: {
    fontFamily: FONT,
    fontStyle: 'normal',
    marginTop: 22,
    marginBottom: 12,
    fontSize: 17,
    fontWeight: '500',
    color: INK,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  catBar: {
    paddingTop: 14,
    paddingBottom: 10,
  },
  catChip: {
    height: 30,
    minWidth: 58,
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: '#F1F4F8',
  },
  catChipOn: {
    backgroundColor: BLUE,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catTextOn: {
    fontFamily: FONT,
    fontStyle: 'normal',
    fontSize: 12.5,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: 20,
  },
  appRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F9FB',
    borderRadius: 14,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  appIcon: {
    backgroundColor: PH,
    borderWidth: 1,
    borderColor: PH_LINE,
  },
  blank: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  tabbar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F2F5',
    paddingTop: 8,
    paddingBottom: Platform.select({ ios: 24, android: 10, default: 10 }),
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  tabLabel: {
    fontFamily: FONT,
    fontStyle: 'normal',
    marginTop: 4,
    fontSize: 10.5,
  },
  iconHome: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  homeRoof: {
    width: 0,
    height: 0,
    borderLeftWidth: 9,
    borderRightWidth: 9,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  homeBody: {
    width: 13,
    height: 9,
    borderWidth: 1.8,
    borderTopWidth: 0,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    marginTop: -1,
  },
  iconSquare: {
    width: 18,
    height: 18,
    borderWidth: 1.8,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxInner: { width: 6, height: 6, borderRadius: 1.5 },
  iconCircle: {
    width: 18,
    height: 18,
    borderWidth: 1.8,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compassDot: { width: 5, height: 5, borderRadius: 2.5 },
  iconMore: { flexDirection: 'row', height: 20, alignItems: 'center' },
  moreDot: {
    width: 3.5,
    height: 3.5,
    borderRadius: 2,
    marginHorizontal: 1.4,
  },
});
