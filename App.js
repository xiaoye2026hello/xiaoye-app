import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import {
  Linking,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar as RNStatusBar,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';

const FONT = Platform.select({
  ios: 'PingFang SC',
  android: 'sans-serif',
  default: 'sans-serif',
});

// 安卓状态栏高度因机型而异（24~36dp），写死会多留白或被压住，
// 这里按系统上报的真实高度加一点呼吸空间。
const ANDROID_TOP = (RNStatusBar.currentHeight || 24) + 14;

const BLUE = '#2F9CF7';
const BLUE_SOFT = '#E8F3FF';
const GRAY = '#9AA5B1';
const INK = '#1A1A1A';
const SUB = '#6B7684';
const PH = '#EDF1F6';
const PH_LINE = '#DCE3EC';

const TABS = [
  { id: 'home', name: '首页', icon: 'home', sub: '欢迎来到小叶软件库！' },
  { id: 'apps', name: '软件', icon: 'box', sub: '↓↓【不显示软件请下拉进行刷新】↓↓' },
  { id: 'find', name: '发现', icon: 'compass', sub: '' },
  { id: 'more', name: '更多', icon: 'more', sub: '' },
];

const DATA_URLS = [
  'https://raw.githubusercontent.com/xiaoye2026hello/xiaoye-app/main/data/software.json',
  'https://cdn.jsdelivr.net/gh/xiaoye2026hello/xiaoye-app@main/data/software.json',
];

async function loadRemoteData() {
  for (const url of DATA_URLS) {
    try {
      const r = await fetch(url, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
      });
      if (!r.ok) continue;
      const d = await r.json();
      if (Array.isArray(d.items)) return d;
    } catch (e) {}
  }
  return null;
}

const DEFAULT_CATS = [{ id: 'all', name: '全部' }];
const DEFAULT_APPS = [];

const CAT_COLOR = {
  efficiency: '#2F9CF7',
  dev: '#7C5CFF',
  design: '#E8608C',
  system: '#2FBFA8',
  media: '#F5A524',
};

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

function AppRow({ item, width, onGet }) {
  const color = CAT_COLOR[item.cat] || BLUE;
  const rowH = Math.round(Math.min(width * 0.21, 88));
  const iconSize = Math.round(rowH * 0.6);

  return (
    <View style={[styles.appRow, { height: rowH }]}>
      <View
        style={[
          styles.appIcon,
          {
            width: iconSize,
            height: iconSize,
            borderRadius: iconSize * 0.26,
            backgroundColor: color + '1F',
          },
        ]}
      >
        <Text style={[styles.appIconText, { color, fontSize: iconSize * 0.42 }]}>
          {item.name.charAt(0)}
        </Text>
      </View>

      <View style={styles.appInfo}>
        <Text style={styles.appName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.appDesc} numberOfLines={1}>
          {item.desc}
        </Text>
      </View>

      <Pressable
        onPress={() => onGet(item)}
        style={({ pressed }) => [styles.getBtn, pressed && styles.getBtnPressed]}
      >
        <Text style={styles.getBtnText}>获取</Text>
      </Pressable>
    </View>
  );
}

function AppsScreen({ width, keyword, cat, cats, apps, loading, syncError, onCatChange, onRefresh, refreshing, onGet }) {
  const list = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    return apps.filter((a) => {
      const okCat = cat === 'all' || a.cat === cat;
      const okKw = !kw || a.name.toLowerCase().includes(kw) || a.desc.toLowerCase().includes(kw);
      return okCat && okKw;
    });
  }, [keyword, cat, apps]);

  return (
    <View style={styles.flex}>
      <View style={styles.catBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {cats.map((c) => {
            const on = c.id === cat;
            return (
              <Pressable
                key={c.id}
                onPress={() => onCatChange(c.id)}
                style={[styles.catChip, on && styles.catChipOn]}
              >
                <Text style={[styles.catText, on && styles.catTextOn]}>{c.name}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={BLUE}
            colors={[BLUE]}
          />
        }
      >
        {loading && list.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>正在同步软件列表…</Text>
          </View>
        )}
        {!loading && syncError && list.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>同步失败，下拉重试</Text>
          </View>
        )}
        {list.map((item) => (
          <AppRow key={item.name} item={item} width={width} onGet={onGet} />
        ))}
      </ScrollView>
    </View>
  );
}

function HistoryScreen({ list, onBack, width }) {
  return (
    <View style={styles.flex}>
      <View style={styles.historyBar}>
        <Pressable onPress={onBack} hitSlop={12} style={styles.backBtn}>
          <Text style={styles.backText}>‹ 返回</Text>
        </Pressable>
        <Text style={styles.historyCount}>{list.length} 条</Text>
      </View>

      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {list.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>还没有下载记录</Text>
            <Text style={styles.emptyHint}>点软件右侧的「获取」会记录在这里</Text>
          </View>
        ) : (
          list.map((item) => {
            const color = CAT_COLOR[item.cat] || BLUE;
            const rowH = Math.round(Math.min(width * 0.21, 88));
            const iconSize = Math.round(rowH * 0.6);
            return (
              <View key={item.name} style={[styles.appRow, { height: rowH }]}>
                <View
                  style={[
                    styles.appIcon,
                    {
                      width: iconSize,
                      height: iconSize,
                      borderRadius: iconSize * 0.26,
                      backgroundColor: color + '1F',
                    },
                  ]}
                >
                  <Text style={[styles.appIconText, { color, fontSize: iconSize * 0.42 }]}>
                    {item.name.charAt(0)}
                  </Text>
                </View>
                <View style={styles.appInfo}>
                  <Text style={styles.appName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.appDesc} numberOfLines={1}>
                    {item.desc}
                  </Text>
                </View>
                <View style={styles.doneTag}>
                  <Text style={styles.doneTagText}>已获取</Text>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

function BlankScreen() {
  return <View style={styles.blank} />;
}

export default function App() {
  const [tab, setTab] = useState(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location.hash) {
      const h = window.location.hash.replace('#', '');
      if (TABS.some((t) => t.id === h)) return h;
    }
    return 'home';
  });
  const [searching, setSearching] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [cat, setCat] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);
  const { width } = useWindowDimensions();
  const current = TABS.find((t) => t.id === tab);

  const [cats, setCats] = useState(DEFAULT_CATS);
  const [apps, setApps] = useState(DEFAULT_APPS);
  const [loading, setLoading] = useState(true);
  const [syncError, setSyncError] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    loadRemoteData()
      .then((d) => {
        if (!alive) return;
        if (!d) {
          setSyncError(true);
          return;
        }
        if (Array.isArray(d.categories) && d.categories.length > 0) setCats(d.categories);
        if (Array.isArray(d.items)) setApps(d.items);
        setSyncError(false);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    const start = Date.now();
    loadRemoteData()
      .then((d) => {
        if (!d) {
          setSyncError(true);
          return;
        }
        if (Array.isArray(d.categories) && d.categories.length > 0) setCats(d.categories);
        if (Array.isArray(d.items)) setApps(d.items);
        setSyncError(false);
      })
      .finally(() => {
        const wait = Math.max(0, 700 - (Date.now() - start));
        setTimeout(() => setRefreshing(false), wait);
      });
  };

  const closeSearch = () => {
    setSearching(false);
    setKeyword('');
  };

  const handleGet = (item) => {
    setHistory((prev) => {
      const rest = prev.filter((x) => x.name !== item.name);
      return [{ ...item, at: Date.now() }, ...rest];
    });
    Linking.openURL(item.url).catch(() => {});
  };

  const headerTitle = tab === 'apps' && showHistory ? '下载记录' : current.name;
  const headerSub = tab === 'apps' && showHistory ? '点过「获取」的软件会记在这里' : current.sub;

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

        {searching ? (
          <View style={styles.searchRow}>
            <View style={styles.searchField}>
              <TextInput
                style={styles.searchInput}
                value={keyword}
                onChangeText={setKeyword}
                placeholder="搜索软件名称"
                placeholderTextColor="rgba(255,255,255,0.65)"
                returnKeyType="search"
                autoFocus
              />
            </View>
            <Pressable onPress={closeSearch} hitSlop={10} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>取消</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <Text style={styles.headerTitle}>{headerTitle}</Text>
            {!!headerSub && <Text style={styles.headerSub}>{headerSub}</Text>}
            {tab === 'apps' && !showHistory && (
              <View style={styles.headerIcons}>
                <Pressable
                  hitSlop={10}
                  style={styles.headerIconBtn}
                  onPress={() => setSearching(true)}
                >
                  <SearchIcon />
                </Pressable>
                <Pressable
                  hitSlop={10}
                  style={styles.headerIconBtn}
                  onPress={() => setShowHistory(true)}
                >
                  <DownloadIcon />
                </Pressable>
              </View>
            )}
          </>
        )}
      </View>

      <View style={styles.sheet}>
        {tab === 'home' && <HomeScreen width={width} />}
        {tab === 'apps' && !showHistory && (
          <AppsScreen
            width={width}
            keyword={keyword}
            cat={cat}
            cats={cats}
            apps={apps}
            loading={loading}
            syncError={syncError}
            onCatChange={setCat}
            onRefresh={onRefresh}
            refreshing={refreshing}
            onGet={handleGet}
          />
        )}
        {tab === 'apps' && showHistory && (
          <HistoryScreen
            list={history}
            width={width}
            onBack={() => setShowHistory(false)}
          />
        )}
        {(tab === 'find' || tab === 'more') && <BlankScreen />}
      </View>

      <View style={styles.tabbar}>
        {TABS.map((t) => {
          const on = t.id === tab;
          const color = on ? BLUE : GRAY;
          return (
            <Pressable
              key={t.id}
              style={styles.tabItem}
              onPress={() => {
                setTab(t.id);
                setShowHistory(false);
                if (t.id !== 'apps') closeSearch();
              }}
            >
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
    paddingTop: Platform.select({ ios: 62, android: ANDROID_TOP, default: 42 }),
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
    top: Platform.select({ ios: 52, android: ANDROID_TOP - 10, default: 32 }),
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchField: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  searchInput: {
    fontFamily: FONT,
    fontStyle: 'normal',
    fontSize: 15,
    color: '#FFFFFF',
    padding: 0,
    outlineStyle: 'none',
  },
  cancelBtn: {
    paddingLeft: 14,
    paddingVertical: 10,
  },
  cancelText: {
    fontFamily: FONT,
    fontStyle: 'normal',
    fontSize: 14.5,
    color: '#FFFFFF',
  },
  searchBox: { width: 26, height: 26 },
  searchRing: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 19,
    height: 19,
    borderRadius: 9.5,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  searchHandle: {
    position: 'absolute',
    left: 15,
    top: 18,
    width: 9,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '45deg' }],
  },
  dlBox: { width: 26, height: 26 },
  dlStem: {
    position: 'absolute',
    top: 1,
    left: 12,
    width: 2,
    height: 10,
    borderRadius: 1,
    backgroundColor: '#FFFFFF',
  },
  dlArrow: {
    position: 'absolute',
    top: 9,
    left: 7,
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 7,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FFFFFF',
  },
  dlBase: {
    position: 'absolute',
    bottom: 1,
    left: 5,
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
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(47,156,247,0.10)',
    borderRadius: 12,
    shadowColor: '#2F9CF7',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
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
    paddingTop: 16,
    paddingBottom: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
  },
  catChip: {
    height: 30,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: '#F1F4F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  catChipOn: {
    backgroundColor: BLUE,
  },
  catText: {
    fontFamily: FONT,
    fontStyle: 'normal',
    fontSize: 12.5,
    color: SUB,
  },
  catTextOn: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 6,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  appIconText: {
    fontFamily: FONT,
    fontStyle: 'normal',
    fontWeight: '500',
  },
  appInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  appName: {
    fontFamily: FONT,
    fontStyle: 'normal',
    fontSize: 15,
    fontWeight: '500',
    color: INK,
  },
  appDesc: {
    fontFamily: FONT,
    fontStyle: 'normal',
    marginTop: 4,
    fontSize: 12,
    color: SUB,
  },
  getBtn: {
    backgroundColor: BLUE,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  getBtnPressed: {
    backgroundColor: '#1E86E0',
  },
  getBtnText: {
    fontFamily: FONT,
    fontStyle: 'normal',
    fontSize: 12.5,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  empty: {
    paddingTop: 80,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: FONT,
    fontStyle: 'normal',
    fontSize: 13,
    color: '#A9B4C2',
  },
  emptyHint: {
    fontFamily: FONT,
    fontStyle: 'normal',
    marginTop: 8,
    fontSize: 12,
    color: '#C3CBD6',
  },
  historyBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 6,
  },
  backBtn: {
    paddingVertical: 4,
    paddingRight: 8,
  },
  backText: {
    fontFamily: FONT,
    fontStyle: 'normal',
    fontSize: 14,
    color: BLUE,
  },
  historyCount: {
    fontFamily: FONT,
    fontStyle: 'normal',
    fontSize: 12,
    color: GRAY,
  },
  doneTag: {
    backgroundColor: '#EAF7F1',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  doneTagText: {
    fontFamily: FONT,
    fontStyle: 'normal',
    fontSize: 12,
    color: '#22A06B',
    fontWeight: '500',
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
